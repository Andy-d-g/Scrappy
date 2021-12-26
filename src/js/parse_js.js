import esprima from "esprima"
import utils from "./utils.js"

const parse_js_file = (prog, depth = 0, created = [], methods = [], data = [], code = []) => {
	let type;
	let name;
	let params;
	let res;
	let content;
	let local_var = []; 
	let parsed_code = [];
	const tree = esprima.parse(prog, {range: true})
	tree.body.forEach(block => {
		//console.log(block)
		type = utils.getTypeOfBlock(block)
		if (type === "declarationFunction") {
			content = utils.getFunctionContent(block, prog)
			//console.log(JSON.stringify(block) + "\n")
			if (content !== '{}') {
				content = content.slice(1,content.length-1)
				res = parse_js_file(content, 1, created, methods)
				methods = res.methods
				parsed_code = res.code
			}
			else {
				parsed_code = ""
			}
			name = utils.getName(block)
			params = utils.getParams(block)
			methods.push(`${name}(${params}){${parsed_code}}`)
			
		}
		else if (type === "declarationVariable") {
			name = utils.getName(block)
			content = utils.modifyContent(block, prog, depth)
			if (!depth) {
				created.push(content)
				data.push(name)
			} else {
				local_var.push(name)
				code.push(content)
			}
		}
	})
	return {
		code,
		created,
		methods,
		data,
		depth
	}
}

const prog0 = `function a() {}`

const prog1 = `
const a = (x,y) => {

}
`

console.log(parse_js_file(prog0))

export default parse_js_file
