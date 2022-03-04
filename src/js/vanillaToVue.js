import esprima from "esprima"
import { digFunctions, digVariables, digCalls, digSelfExec } from "./dig.js"
import _ from "lodash"

const THIS = "self."

const removeComments = (string) => string.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').trim();

const replaceBySpace = (string, range) => string.slice(0, range[0]) + Array(range[1] - range[0]).fill(" ").join("") + string.slice(range[1])

const insertKeyword = (string, range, code) => string.slice(0, range[0]) + code + string.slice(range[0])

const getContentOfRange = (string, range) => string.slice(range[0], range[1])

const objToArray = (obj, property) => obj.map(o => o[property])

const getParameters = (obj, property) => objToArray(obj.map(o => o['name'] ? o : o['left']), property)

const getBodyFunction = (func) => getContentOfRange(func, [func.indexOf('{')+1, func.length-1])

const insertThisKeyword = (program) => `const ${THIS.slice(0,-1)} = this;${program}` 

const eqArray = (a,b) => {
	if (a.length !== b.length) return false
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false
	}
	return true
}

const extractFunctions = (program) => {
    const tree = esprima.parse(program, { range: true })
    return digFunctions(tree, tree).map(f => {
        let code = getContentOfRange(program, f.range_full)
        return {...f, code}
    })
}

const extractVariables = (program) => {
    const tree = esprima.parse(program, { range: true })
    return digVariables(tree, tree)
}

const deleteFunctionsInProgram = (program, ranges) => {
    ranges.forEach(r => program = replaceBySpace(program, r))
    return program
}

const getFunctionCalls = (list_function, list_global_var) => {
    let list_calls = []
    list_function.forEach(f => {
        let tree = esprima.parse(f.code, {range: true})
        let listOf = {
            variables: objToArray(list_global_var, 'name'),
            functions: objToArray(list_function, 'name'),
            parameters: getParameters(f.params, 'name')
        }
        list_calls.push(digCalls(tree, tree, listOf.variables, listOf.functions, listOf.parameters))
    })
    return list_calls
}

const getProgramCalls = (program, list_variable, list_function) => {
    const tree = esprima.parse(program, {range: true})
    let list_call = digCalls(tree, tree, objToArray(list_variable, 'name'), objToArray(list_function, 'name'))
    for (let i = 0; i < list_call.length; i++) {
        for (let j = 0; j < list_variable.length; j++) {
            if (eqArray(list_variable[j]['range_name'], list_call[i]['range'])) {
                list_call.splice(i--, 1)
                break
            }
        }
    }
    return list_call
}

const getStructFunctions = (program, list_calls, list_function) => {
    let structFunctions = []
    list_function.forEach((f, index) => {
        for (let call of list_calls[index].reverse()) {
            f.code = insertKeyword(f.code, call.range, THIS)
        }
        f.code = getBodyFunction(f.code)
        f.code = insertThisKeyword(f.code)
        structFunctions.push({
            name: f.name,
            async: f.async,
            params: f.params.length 
                ? getContentOfRange(program, f.range_params) 
                : "",
            code: f.code
        })
    })
    return structFunctions
}

const getGlobalVariable = (program, list_variable, list_call) => {
    let global_var = []
    list_variable.reverse().forEach((variable, index) => {
        let listOfCallName = objToArray(list_call, 'name')
        if (listOfCallName.includes(variable.name)) {
            if (variable.init_type === "None" || variable.range_full === "Literal") {
                program = replaceBySpace(program, variable.range_full)
                global_var.push({ 
                    name: variable.name, 
                    value: variable.body 
                })
            } else {
                program = replaceBySpace(program, [
                    variable.range_full[0], variable.range_name[0]
                ])
                program = insertKeyword(program, variable.range_name, THIS)
                variable.range_name[0] += THIS.length * (list_variable.length - index)
                variable.range_name[1] += THIS.length * (list_variable.length - index)
                global_var.push({
                    name: variable.name,
                    value: ""
                })
            }
        }
    })
    return {
        global_var,
        program,
        list_variable
    }
}

const insertKeywordInProgram = (program, list_variable, list_function, list_call) => {
    list_call.reverse().forEach(call => {
        if (objToArray(list_variable, 'name').includes(call['name']) || objToArray(list_function, 'name').includes(call['name'])) {
            program = insertKeyword(program, call['range'], THIS)
        }
    })
    return program
}

const modifyProgramForSelfExecFunction = (program) => {
    const tree = esprima.parse(program, {range: true})
    const list_self_exec = digSelfExec(tree, tree)

    let duplicate = program

    if (list_self_exec.length) {
        program = getContentOfRange(program, list_self_exec[0].range_body)
        list_self_exec[0].params.forEach(param => {
            program = `let ${param.name} = ${getContentOfRange(duplicate, param.range_value)};\n` + program
        })
    }
    return program
}

const getProgramStructure = (program) => {
    let list_function, list_call, list_variable, list_global_var;
    let data, methods, created;
    let original;
    let changement;

    original = program = removeComments(program)

    list_function = extractFunctions(program)
    program = deleteFunctionsInProgram(program, list_function.map(f => f = f.range_full))

    list_variable = extractVariables(program)

    list_call = getFunctionCalls(list_function, list_variable)

    list_function = getStructFunctions(original, list_call, list_function) 

    list_call = _.flattenDeep(list_call)

    changement = getGlobalVariable(program, list_variable, list_call)
    list_global_var = changement.global_var 
    list_variable = changement.list_variable
    program = changement.program

    list_call = getProgramCalls(program, list_variable, list_function)
    program = insertKeywordInProgram(program, list_variable, list_function, list_call)
    program = modifyProgramForSelfExecFunction(program)

    program = `const ${THIS.slice(0,-1)} = this; ${program}`
    
    created = _.replace(program, /(\r?\n){2,}/g, '\n')
    data = list_global_var
    methods = list_function

    return {
        data,
        created,
        methods
    }
}

const vanillaToVue = (program) => {
    const info = getProgramStructure(program)
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
    return `export default {
        name: '',
        props: {},
        ${created},
        ${data},
        ${methods}
    }`
}

export default vanillaToVue
