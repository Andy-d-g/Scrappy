import esprima from "esprima"

const back = (root, road, behind) => {
    for (let i = 0; i < road.length-behind; i++) {
        root = isNaN(road[i]) ? root[road[i]] : root[parseInt(road[i], 10)]
    }
    return root
}

const exist = (array, name) => {
	for (let i = 0; i < array.length; i++) {
		if (array[i].name === name) return true
	}
	return false
}

const eqArray = (a,b) => {
	if (a.length !== b.length) return false
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false
	}
	return true
}

const findByName = (array, value, range) => {
	for (let i = 0; i < array.length; i++) {
		if (array[i]['name'] === value && !eqArray(range, array[i]['range_name'])) return true
	}
	return false
}

const _dig = (root, tree, depth, road, save, local_var) => {
    let name, range_name, range, range_full, sub_tree;
    for (let branch in tree) {
		if (branch === "type" && tree[branch] === "Identifier") {
			name = tree['name']
			range = tree['range']
			if (!exist(local_var, name)) {
				if (findByName(save['variable'], name, range) || findByName(save['function'], name, range)) { save['call'].push({ name, range, depth }) }
			}
		}
        else if (branch === "type" && tree[branch] === "VariableDeclarator") {
            sub_tree = back(root, road, 2)
            name = tree['id']['name']
            range_name = tree['id']['range']
            range_full = sub_tree['range']
            if (tree['init']) {
                if (tree['init']['type'] === "ArrowFunctionExpression" || tree['init']['type'] === "FunctionExpression") {
                    save['function'].push({ name, range_name, range_full })
                }
                else {
                    if (!depth) { save['variable'].push({ name, range_name, range_full }) }
                    else { local_var.push({ name, range_name, range_full }) }
                }
            } else {
                if (!depth) { save['variable'].push({ name, range_name, range_full }) }
				else { local_var.push({ name, range_name, range_full }) }
            }
        }
		else if (branch === "type" && tree[branch] === "FunctionDeclaration") {
			name = tree['id']['name']
			range_name = tree['id']['range']
			range_full = tree['range']
			save['function'].push({ name, range_name, range_full })
		}
        else if (tree[branch] !== null && typeof(tree[branch])=="object") {
            if ((tree['type'] === "FunctionDeclaration" || tree['type'] === "ArrowFunctionExpression" || tree['type'] === "FunctionExpression") && branch === "body") {
                save = _dig(root, tree[branch], depth+1, [...road, branch], save, []);
            }
            else { save = _dig(root, tree[branch], depth, [...road, branch], save, local_var); }
        }
    }
    return save
}


const program = `
let x;
const a = () => {}
const b = function() {
    let v;
}
function c() {
    let v = x;
    let y = a()
    b()
}
c()
x.addEventlistener("event", function(){
    let t = x
    a()
})
`

const tree = esprima.parse(program, {range: true})

const dig = (tree, depth = 0) => _dig(tree, tree, depth, [], {function: [], variable: [], call: []}, []) 

//console.log(dig(tree))

export default dig