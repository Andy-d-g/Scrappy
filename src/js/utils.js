const isDeclarationFunction = (block) => {
	if (block.type === "FunctionDeclaration") return true
    else if (block.type === "VariableDeclaration") {
        let type = block.declarations[0].init.type
        return type === "ArrowFunctionExpression" || type === "FunctionExpression"
    }
    return false;
}

const isCallFunction = (block) => {
    if (block.type === "ExpressionStatement") return block.expression.type === "CallExpression"
    return false
}

const isDeclarationVariable = (block) => block.type === "VariableDeclaration"

const getTypeOfBlock = (block) => {
	if (isDeclarationFunction(block)) return "declarationFunction"
    else if (isCallFunction(block)) return "callFunction"
    else if (isDeclarationVariable(block)) return "declarationVariable"
    return "unknow"
}

const getParams = (block) => {
	let params = ""
	block.declarations[0].init.params.forEach((p, index) => {
		params += file.slice(p.range[0], p.range[1])
		if (index < block.declarations[0].init.params.length-1) { params += ", " }
	})
	return params;
}

const getName = (block) => block.declarations[0].id.name

const modifyContent = (block, prog, depth) => {
	let rangeName = block.declarations[0].id.range
	if (depth) { return prog.slice(block.range[0], block.range[1]) }
	return `this.${prog.slice(rangeName[1]-1, block.range[1])}`
}

const getFunctionContent = (block, prog) => {
	let range = block.declarations[0].init.body.range
	return prog.slice(range[0], range[1])
}

export default {
    getTypeOfBlock,
    getParams,
    getName,
    modifyContent,
    getFunctionContent
}
