import esprima from "esprima"
import { 
	getTypeOfBlock, 
	getFunctionParameters, 
	getName, 
	adaptContent, 
	getContentOfRange
} from "./utils.js"

const handleDeclarationVariable = (block, prog, depth, created, methods, data, code, local_var) => {
	let name, tokens, code_line, identifier;

	name = getName(block)
	code_line = getContentOfRange(block.range, prog)

	if (block.declarations[0].init) {
		identifier = !depth ? [...data, name] : data
		tokens = esprima.tokenize(code_line, {range: true})
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

const handleConditionStatement = (block, prog, depth, created, methods, data, code, local_var, cond_depth = 0) => {
	let sub_prog, sub_tree;
	let res, cond, range;
	// if 
	sub_tree = block.consequent.body
	res = _parse_js_file(prog, sub_tree, depth, created, methods, data, code, local_var)
	methods = res.methods
	data = res.data
	created = res.created
	// check condition
	/*
	code = !cond_depth
	? `if (){${res.code}}`
	: `else if () {${res.code}}`
	*/
	/*
	if (block.alternate) {
		if (block.alternate.type === "IfStatement") {
			// else if 
			cond = handleConditionStatement(block.alternate, prog, depth, created, methods, data, code, local_var, 1)
		} else {
			// else
			sub_prog = getContentOfRange(block.alternate.range, prog)
			sub_tree = block.alternate.body
			res = _parse_js_file(sub_prog, sub_tree, depth, created, methods, data, code, local_var)
		}
	}
	*/

	return {
		code,
		created,
		methods,
		data,
		depth
	}
}

const _parse_js_file = (prog, tree, depth = 0, created = [], methods = [], data = [], code = [], params = []) => {
	let type, res;
	let name, local_var;
	let sub_tree, sub_prog;
	local_var = [...params];
	tree.forEach((block) => {
		type = getTypeOfBlock(block)
		if (type === "declarationFunction" || type === "arrowFunction") {
			sub_prog = getContentOfRange(block.range, prog)
			sub_tree = esprima.parse(sub_prog, {range: true})
			sub_tree = type === "arrowFunction" 
			? sub_tree = sub_tree.body[0].declarations[0].init.body.body
			: sub_tree = sub_tree.body[0].body.body
			params = getFunctionParameters(block)
			name = getName(block)
			res = _parse_js_file(sub_prog, sub_tree, 1, created, methods, data, [], params)
			data = res.data
			created = res.created
			methods.push({
				name,
				params,
				code: res.code
			})
		}
		else if (type === "declarationVariable") {
			res = handleDeclarationVariable(block, prog, depth, created, methods, data, code, local_var)
			//console.log(res)
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
		/*
		else if (type == "conditionStatement") {
			console.log(code)
			res = handleConditionStatement(block, prog, depth, created, methods, data, code, local_var)
			code = res.code
			methods = res.methods
			data = res.data
			created = res.created
		}
		*/
	})
	return {
		code,
		created,
		methods,
		data,
		depth
	}
}

const parse_js_file = (prog, depth) => _parse_js_file(prog, esprima.parse(prog, {range: true}).body, depth)

const p0 = `
	const a = () => {

	}
`

//let r = parse_js_file(p0, 1)
//console.log(JSON.stringify(r,  undefined, 4))

export default parse_js_file
