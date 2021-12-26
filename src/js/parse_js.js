import esprima from "esprima"
import { 
	getTypeOfBlock, 
	getParams, 
	getName, 
	modifyContent, 
	getFunctionContent, 
	getContentOfRange 
} from "./utils.js"

const handleDeclarationFunction = (block, prog, methods, data) => {
	let res, content, name, params, parsed;
	parsed = ""
	content = getFunctionContent(block, prog)
	if (content !== '{}') {
		content = getContentOfRange([1, content.length-1], content)
		res = parse_js_file(content, 1, [], methods, data)
		methods = res.methods
		parsed = res.code
	}
	name = getName(block)
	params = getParams(block)
	methods.push(`${name}(${params}){${parsed}}`)
	return methods
}

const handleDeclarationVariable = (block, prog, depth, created, data, code, local_var) => {
	let name, content;
	name = getName(block)
	content = modifyContent(block, prog, depth)
	if (!depth) {	
		if (block.declarations[0].init) {
			let range = block.declarations[0].init.range
			// Si la valeur de droite ne contient pas de variable, mettre directement dans data
			created.push(`this.${name} = ${getContentOfRange(range, prog)}`)
		}
		data.push(name)
	} else {
		code.push(content)
		local_var.push(name)
	} 
	return {
		local_var,
		code,
		created,
		data
	}
}

const handleAssignementVariable = (block, prog, created, data, code, local_var) => {
	if (local_var.includes(block.expression.left.name)) {
		let range = block.range
		code.push(getContentOfRange(range, prog))
	} else if (data.includes(block.expression.left.name)) {
		let range = block.expression.right.range
		let name = `this.${block.expression.left.name}`
		created.push(`${name} = ${getContentOfRange(range, prog)}`)
	} else {
		throw new Error("Variable inconnu")
	}
	return {
		created,
		code, 
		local_var,
		data
	}
}

const parse_js_file = (prog, depth = 0, created = [], methods = [], data = [], code = []) => {
	let type;
	let res;
	let local_var = []; 
	const tree = esprima.parse(prog, {range: true})
	tree.body.forEach(block => {
		type = getTypeOfBlock(block)
		if (type === "declarationFunction") {
			methods = handleDeclarationFunction(block, prog, methods, data)
		}
		else if (type === "declarationVariable") {
			res = handleDeclarationVariable(block, prog, depth, created, data, code, local_var)
			code = res.code
			local_var = res.local_var
			data = res.data
			created = res.created
		}
		else if (type === "assignementVariable") {
			res = handleAssignementVariable(block, prog, created, data, code, local_var)
			code = res.code
			local_var = res.local_var
			data = res.data
			created = res.created
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

export default parse_js_file
