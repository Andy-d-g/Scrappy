import esprima from "esprima"

const eqArray = (a,b) => {
	if (a.length !== b.length) return false
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false
	}
	return true
}

const findByName = (array, value, range) => {
	for (let i = 0; i < array.length; i++) {
		if (array[i]['name'] === value) {
			console.log(value)
			if (!eqArray(range, array[i]['range'])) return true
		}
	}
	return false
}

const _dig = (prog, root, tree, path, depth, save) => {
	let current, name, range;
	Object.keys(tree).forEach(branch => {
		if (branch === "type" && tree[branch] === "Identifier") {
			name = tree['name']
			range = tree['range']
			if (findByName(save['variable'], name, range)) {
				save['call'].push({
					name,
					range,
					depth
				})
			}
			else if (findByName(save['function'], name, range)) {
				save['call'].push({
					name,
					range,
					depth
				})
			}
		}
		else if (branch === "type" && tree[branch] === "VariableDeclarator") {
			name = tree['id']['name']
			range = tree['id']['range']
			if (tree['init']) {
				if (tree['init']['type'] === "ArrowFunctionExpression" || tree['init']['type'] === "FunctionExpression") {
					save['function'].push({
						name,
						range
					})
				}
			} 
			else {
				if (!depth) {
					save['variable'].push({
						name,
						range
					})
				}
			}
		}
		else if (branch === "type" && tree[branch] === "FunctionDeclaration") {
			name = tree['id']['name']
			range = tree['id']['range']
			save['function'].push({
				name,
				range
			})
		}
		else if (Array.isArray(tree[branch])) {
			tree[branch].forEach((_, index) => {
				current = path
				current.push(branch)
				current.push(index)
				save = _dig(prog, root, tree[branch][index], current, depth, save)
			})
		}
		else if (typeof tree[branch] === 'object' && tree[branch] !== null) {
			if (tree['type'] === "FunctionDeclaration" || tree['type'] === "ArrowFunctionExpression" || tree['type'] === "FunctionExpression") {
				save = _dig(prog, root, tree[branch], path, 1, save)
			} else {
				save = _dig(prog, root, tree[branch], path, depth, save)
			}
		}
	})
	return save;
}

const dig = (prog, tree, depth = 0) => _dig(prog, tree, tree, [], depth, {function: [], variable: [], call: []})


const p0 = `
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
`

export default dig

const tree = esprima.parse(p0, {range: true})

console.log(dig(p0, tree))

