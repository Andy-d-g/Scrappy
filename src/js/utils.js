const isDeclarationFunction = (block) => {
	if (block.type === "FunctionDeclaration") return true
    else if (block.type === "VariableDeclaration") {
        if (block.declarations[0].init) {
            let type = block.declarations[0].init.type
            return type === "ArrowFunctionExpression" || type === "FunctionExpression"
        }
    }
    return false;
}

const isCallFunction = (block) => {
    if (block.type === "ExpressionStatement") return block.expression.type === "CallExpression"
    return false
}

const isDeclarationVariable = (block) => block.type === "VariableDeclaration"

const isAssignementVariable = (block) => {
    if (block.type === "ExpressionStatement") return block.expression.type === "AssignmentExpression"
    return false
}

const getTypeOfBlock = (block) => {
	if (isDeclarationFunction(block)) return "declarationFunction"
    else if (isCallFunction(block)) return "callFunction"
    else if (isDeclarationVariable(block)) return "declarationVariable"
    else if (isAssignementVariable(block)) return "assignementVariable"
    return "unknow"
}

const getFunctionParameters = (block) => {
	let params = []
    let array = block.type === "FunctionDeclaration" 
    ? block.params
    : block.declarations[0].init.params
    array.forEach((p) => {
        params.push(p.name)
    })
	return params;
}

const getName = (block) => {
    return block.type === "FunctionDeclaration"
    ? block.id.name
    : block.declarations[0].id.name
}

const modifyContent = (block, prog, depth) => {
	let rangeName = block.declarations[0].id.range
	if (depth) { return prog.slice(block.range[0], block.range[1]) }
	return `this.${prog.slice(rangeName[1]-1, block.range[1])}`
}

const getContentOfRange = (range, prog) => prog.slice(range[0], range[1])

const getFunctionContent = (block, prog) => {
    let range = block.type === "FunctionDeclaration"
    ? block.body.range
    : block.declarations[0].init.body.range
    return getContentOfRange(range, prog)
}

export {
    getTypeOfBlock,
    getFunctionParameters,
    getName,
    modifyContent,
    getFunctionContent,
    getContentOfRange
}
