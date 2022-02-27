import esprima from "esprima"
import {dig_function, dig_variable, get_call, get_self_exec} from "./dig.js"
import test from "./example.js"
import beautify from 'js-beautify'
import fs from 'fs'

const THIS = "self."

const removecomments = (string) => string.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').trim();

const replacebyspace = (string, range) => string.slice(0, range[0]) + Array(range[1] - range[0]).fill(" ").join("") + string.slice(range[1])

const addcode = (string, range, code) => string.slice(0, range[0]) + code + string.slice(range[0])

const getcontentofrange = (string, range) => string.slice(range[0], range[1])

const objtoarray = (obj, property) => obj.map(o => o[property])

const getparameters = (obj, property) => objtoarray(obj.map(o => o['name'] ? o : o['left']), property)

const cleanfunction = (func) => getcontentofrange(func, [func.indexOf('{')+1, func.length-1])

const eqArray = (a,b) => {
	if (a.length !== b.length) return false
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false
	}
	return true
}

const parse_js_file = (prog) => {
    let i, j;
    let list_variable, list_function, list_call, list_calls, list_self_exec;
    let tree, original, duplicate;
    let data = [], methods = [], created;

    original = prog = removecomments(prog)

    tree = esprima.parse(prog, {range: true})
    list_function = dig_function(tree, tree)
    list_function.forEach(f => {
        f.code = getcontentofrange(original, f.range_full)
        prog = replacebyspace(prog, f.range_full)
    })

    tree = esprima.parse(prog, {range: true})
    list_variable = dig_variable(tree, tree)

    list_calls = []
    list_function.forEach(f => {
        tree = esprima.parse(f.code, {range: true})
        list_call = get_call(tree, tree, objtoarray(list_variable, 'name'), objtoarray(list_function, 'name'), getparameters(f.params, 'name'))
        list_calls = [...list_calls, ...list_call]
        for (let call of list_call.reverse()) {
            f.code = addcode(f.code, call.range, THIS)
        }
        f.code = cleanfunction(f.code)
        f.code = `const ${THIS.slice(0,-1)} = this;${f.code}` 
        methods.push({ name: f.name, async: f.async, params: f.params.length ? getcontentofrange(original, f.range_params) : "", code: f.code })
    })
    

    list_variable.reverse().forEach((v, i) => {
        if (objtoarray(list_calls, 'name').includes(v.name)) {
            if (v.init_type === "None" || v.init_type === "Literal" ) {
                prog = replacebyspace(prog, v.range_full)
                data.push({ name: v.name, value: v.body })
            }
            else {
                prog = replacebyspace(prog, [v.range_full[0], v.range_name[0]])
                prog = addcode(prog, v.range_name, THIS)
                v.range_name[0] += THIS.length * (list_variable.length-i); 
                v.range_name[1] += THIS.length * (list_variable.length-i);
                data.push({ name: v.name, value: "" })
            }
        }
    })

    tree = esprima.parse(prog, {range: true})
    list_call = get_call(tree, tree, objtoarray(list_variable, 'name'), objtoarray(list_function, 'name'))

    for (i = 0; i < list_call.length; i++) {
        for (j = 0; j < list_variable.length; j++) {
            if (eqArray(list_variable[j]['range_name'], list_call[i]['range'])) {
                list_call.splice(i--, 1)
                break
            }
        }
    }
    
    list_call.reverse().forEach(c => {
        if (objtoarray(list_variable, 'name').includes(c['name']) || objtoarray(list_function, 'name').includes(c['name'])) {
            prog = addcode(prog, c['range'], THIS)
        }
    })

    tree = esprima.parse(prog, {range: true})
    list_self_exec = get_self_exec(tree, tree)

    duplicate = prog

    if (list_self_exec.length) {
        prog = getcontentofrange(prog, list_self_exec[0].range_body)
        list_self_exec[0].params.forEach(p => {
            prog = `let ${p.name} = ${getcontentofrange(duplicate, p.range_value)};\n` + prog
        })
    }

    created = `const ${THIS.slice(0,-1)} = this; ${prog}`
    
    return {
        data,
        methods,
        created
    }
}

const vanilla_to_vue = (info) => {
    let created = "", methods = "", data = ""
    info['data'].forEach(v => {
        data += `${v.name}: ${v.value ? v.value : "\"\""},\n`
    })
    data = `data() {\nreturn {\n${data}}\n}`
    info['methods'].forEach(f => {
        methods += `${f.name}(${f.params}){${f.code}},\n`
    })
    methods = `methods: {\n${methods}\n}`
    created = `created() {${info['created']}}`
    fs.writeFileSync('./out/out.vue', `<script>\n${beautify.js(`
    export default {
        name: 'xxx-name',
        props: {},
        ${created},
        ${data},
        ${methods}
    }`)}\n</script>`, () => {console.log('Fichier créer avec succès !')})
}


vanilla_to_vue(parse_js_file(test))
