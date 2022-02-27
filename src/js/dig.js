const back = (root, road, behind) => {
    for (let i = 0; i < road.length-behind; i++) {
        root = isNaN(road[i]) ? root[road[i]] : root[parseInt(road[i], 10)]
    }
    return root
}

const findIdentifier = (iterator, road = []) => {
    let find = false;
    for (let property in iterator) {
        if (iterator[property] === "Identifier" && road[road.length-1] !== "key") return true
        else if (iterator[property] !== null && typeof(iterator[property]) === "object") {
            find = findIdentifier(iterator[property], [...road, property])
            if (find) return true
        }
    }
    return false
}

const hasIdentifier = (init) => {
    let iterator;
    if (init['type'] === "Literal") return false
    else if (init['type'] === "ArrayExpression" || init['type'] === "ObjectExpression") {
        iterator = init['type'] === "ArrayExpression" ? init['elements'] : init['properties']
        return findIdentifier(iterator)
    }
    return true
}

const digFunctions = (root, tree, road = [], list_function = []) => {
    let name, range_full, sub_tree, params, range_params, range_body, async;
    for (let branch in tree) {
        if (branch === "type" && tree[branch] === "VariableDeclarator" && tree['init']) {
            if (tree['init']['type'] === "ArrowFunctionExpression" || tree['init']['type'] === "FunctionExpression") {
                sub_tree = back(root, road, 2)
                async = tree['init']['async']
                name = tree['id']['name']
                params = tree['init']['params']
                if (params.length > 0) {
                    range_params = tree['init']['params'].length-1 === 0 
                    ? tree['init']['params'][0]['range']
                    : [tree['init']['params'][0]['range'][0], tree['init']['params'][tree['init']['params'].length-1]['range'][1]]
                } else range_params = null
                range_full = sub_tree['range']
                range_body = tree['init']['body']['range']
                range_body[0]++; range_body[1]--;
                list_function.push({ async, name, params, range_params, range_body, range_full })
            }
        }
		else if (branch === "type" && tree[branch] === "FunctionDeclaration") {
            async = tree['async']
			name = tree['id']['name']
            params = tree['params']
            range_full = tree['range']
            range_body = tree['body']['range']
            range_body[0]++; range_body[1]--;
            list_function.push({ async, name, params, range_params, range_body, range_full })
		}
        else if (tree[branch] !== null && typeof(tree[branch]) === "object") {
            digFunctions(root, tree[branch], [...road, branch], list_function)
		}
    }
    return list_function
}

const digVariables = (root, tree, road = [], list_variable = []) => {
    let name, range_full, sub_tree, range_body, init_type, range_name;
    for (let branch in tree) {
        if (branch === "type" && tree[branch] === "VariableDeclarator") {
            sub_tree = back(root, road, 2)
            name = tree['id']['name']
            range_name = tree['id']['range']
            range_full = sub_tree['range']
            range_body = tree['init'] ? tree['init']['range'] : null;
            if (tree['init']) init_type = hasIdentifier(tree['init']) ? "Identifier" : "Literal"
            else init_type = "None"
            list_variable.push({ name, range_body, range_full, range_name, init_type })
        }
        else if (tree[branch] !== null && typeof(tree[branch]) === "object") {
            sub_tree = back(root, road, 1)
            if (!(branch === "body" && tree['type'] === "FunctionExpression" && !sub_tree['callee'])) {
                digVariables(root, tree[branch], [...road, branch], list_variable)
            }
		}
    }
    return list_variable
}

const digCalls = (root, tree, list_variable, list_function, local_var = [], road = [], list_call = []) => {
    let sub_tree;
    for (let branch in tree) {
        if (branch === "type" && tree[branch] === "VariableDeclarator") {
            local_var.push(tree['id']['name'])
        }
        else if (branch === "type" && tree[branch] === "Identifier") {
			if (!local_var.includes(tree['name']) && (list_variable.includes(tree['name']) || list_function.includes(tree['name']))) {
                sub_tree = back(root, road, 2)
                if (!sub_tree['params']) list_call.push({ name: tree['name'], range: tree['range']})
            }
		}
        else if (tree[branch] !== null && typeof(tree[branch]) === "object") {
            digCalls(root, tree[branch], list_variable, list_function, local_var, [...road, branch], list_call)
		}
    }
    return list_call
}

const digSelfExec = (root, tree, road = [], list_self_exec = []) => {
    let sub_tree;
    let range_full, range_body, params;
    for (let branch in tree) {
        if (branch === "type" && tree[branch] === "FunctionExpression") {
            sub_tree = back(root, road, 1)
            if (sub_tree['type'] === "CallExpression") {
                range_full = sub_tree['range']
                range_body = tree['body']['range']
                range_body[0]++; range_body[1]--
                params = []
                tree['params'].forEach((p, i) => {
                    params.push({ name: p.name, range_value: sub_tree['arguments'][i].range })
                });
                list_self_exec.push({ range_full, range_body, params })
            }
        }
        else if (tree[branch] !== null && typeof(tree[branch]) === "object") {
            list_self_exec = digSelfExec(root, tree[branch], [...road, branch], list_self_exec)
		}
    }
    return list_self_exec
}

export {digFunctions, digVariables, digCalls, digSelfExec}