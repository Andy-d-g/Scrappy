const isDeclarationFunction = (block) => block.type === "FunctionDeclaration";

const isArrowFunction = (block) => {
    if (block.type === "VariableDeclaration") {
        if (block.declarations[0].init) {
            let type = block.declarations[0].init.type
            return type === "FunctionExpression" || type === "ArrowFunctionExpression"
        }
    }
    return false
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

const isConditionStatement = (block) => block.type === "IfStatement"

const getTypeOfBlock = (block) => {
	if (isDeclarationFunction(block)) return "declarationFunction"
    if (isArrowFunction(block)) return "arrowFunction"
    else if (isCallFunction(block)) return "callFunction"
    else if (isDeclarationVariable(block)) return "declarationVariable"
    else if (isAssignementVariable(block)) return "assignementVariable"
    else if (isConditionStatement(block)) return "conditionStatement"
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

const adaptContent = (prog, tokens, methods, identifier, depth) => {
    let i, range, name, sanitaze, last;

    methods.forEach(method => { identifier.push(method.name) })

    i = 0
    sanitaze = ""

    for (i; i < tokens.length && !depth; i++) {
        if (tokens[i].type === "Identifier") {
            last = tokens[i].range[1]
            name = tokens[i].value
            sanitaze += `this.${name}`
            break
        }
    }
    i+=1

    for (i; i < tokens.length; i++) {
        if (identifier.includes(tokens[i].value)) {
            range = tokens[i].range
            name = tokens[i].value
            sanitaze += `${getContentOfRange([last, range[0]], prog)}this.${name}`
            last = tokens[i].range[1]
        }
    }
    sanitaze += getContentOfRange([last, prog.length], prog)
    
    return sanitaze;
}

export {
    getTypeOfBlock,
    getFunctionParameters,
    getName,
    modifyContent,
    getContentOfRange,
    adaptContent
}
