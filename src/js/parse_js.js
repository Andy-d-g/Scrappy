import esprima from "esprima"
import { 
	getTypeOfBlock, 
	getFunctionParameters, 
	getName, 
	adaptContent, 
	getFunctionContent, 
	getContentOfRange
} from "./utils.js"

const handleDeclarationFunction = (block, prog, methods, data) => {
	let res, content, name, params, parsed;
	parsed = []
	content = getFunctionContent(block, prog)
	name = getName(block)
	params = getFunctionParameters(block)
	if (content !== '{}') {
		content = getContentOfRange([1, content.length-1], content)
		res = parse_js_file(content, 1, [], methods, data, [], params)
		methods = res.methods
		parsed = res.code
	}
	methods.push({
		name,
		params,
		code: parsed
	})
	return methods
}

const handleDeclarationVariable = (block, prog, depth, created, methods, data, code, local_var) => {
	let name, tokens, code_line, identifier;

	name = getName(block)
	code_line = getContentOfRange(block.range, prog)
	tokens = esprima.tokenize(code_line, {range: true})
	if (block.declarations[0].init) {
		identifier = !depth ? [...data, name] : data
		code_line = adaptContent(code_line, tokens, methods, identifier, depth)
	} 

	if (!depth) {
		data.push(name)	
		if (block.declarations[0].init) created.push(code_line)
	}
	else {
		code.push(code_line)
		local_var.push(name)
	}

	return {
		local_var,
		code,
		created,
		data
	}
}

const handleAssignementVariable = (block, prog, depth, created, methods, data, code, local_var) => {
	let identifier, name, code_line, tokens;
	name = block.expression.left.name
	identifier = !depth ? [...data, name] : data
	code_line = getContentOfRange(block.range, prog)
	tokens = esprima.tokenize(code_line, {range: true})
	code_line = adaptContent(code_line, tokens, methods, identifier, depth)
	if (local_var.includes(block.expression.left.name)) {
		code.push(code_line)
	} else if (data.includes(block.expression.left.name)) {
		created.push(code_line)
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

const parse_js_file = (prog, depth = 0, created = [], methods = [], data = [], code = [], params = []) => {
	let type;
	let res;
	let local_var = [...params]; 
	const tree = esprima.parse(prog, {range: true})
	tree.body.forEach(block => {
		type = getTypeOfBlock(block)
		if (type === "declarationFunction") {
			methods = handleDeclarationFunction(block, prog, methods, data)
		}
		else if (type === "declarationVariable") {
			res = handleDeclarationVariable(block, prog, depth, created, methods, data, code, local_var)
			code = res.code
			local_var = res.local_var
			data = res.data
			created = res.created
		}
		else if (type === "assignementVariable") {
			res = handleAssignementVariable(block, prog, depth, created, methods, data, code, local_var)
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

//let r = parse_js_file(prog_, 0)
//console.log(JSON.stringify(r,  undefined, 4))

export default parse_js_file
