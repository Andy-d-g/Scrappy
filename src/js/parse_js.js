import esprima from "esprima"
import { 
	getTypeOfBlock, 
	getFunctionParameters, 
	getName, 
	modifyContent, 
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

const prog = `
	const a = () => {
		let b = 3;
		function c(d,e){
			d = 3;
			e = d;
		}
	}
`

//console.log(JSON.stringify(parse_js_file(prog), undefined, 4))

export default parse_js_file
