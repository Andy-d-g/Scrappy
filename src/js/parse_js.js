import esprima from "esprima"
import dig from "./digger.js"

const adapt = (prog, dig_info) => {
    let i, left, right;
    for (i = dig_info['call'].length-1; i >= 0; i--) {
        left = prog.slice(0, dig_info['call'][i].range[0])
        right = prog.slice(dig_info['call'][i].range[1])
        prog = `${left}self.${dig_info['call'][i].name}${right}`
    }
    return prog
}

const removecomments = (string) => string.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').trim();

const emplacement = (range_src, range_target) => {
    if (range_target[0] > range_src[0] && range_target[0] < range_src[1]) return 0
    else if (range_target[0] > range_src[0] && range_target[0] > range_src[1]) return 1
    return -1
}

const modifyrangecall = (dig_info) => {
    let i;
    for (i = 0; i < dig_info['call'].length; i++) {
        if (i === 0) {
            dig_info['call'][i].range[1] += 5
        } 
        else {
            dig_info['call'][i].range[0] += 5 * i
            dig_info['call'][i].range[1] += (5 * i) + 4
        }
    }
    return dig_info
}

const modifyrangefunction = (dig_info) => {
    let i, j, pos;
    for (j = 0; j < dig_info['function'].length; j++) {
        for (i = 0; i < dig_info['call'].length; i++) {
            pos = emplacement(dig_info['function'][j].range_full, dig_info['call'][i].range)
            if (pos === 0) {
                dig_info['function'][j].range_full[1] += 5
            }
            else if (pos === -1) {
                dig_info['function'][j].range_full[0] += 5
                dig_info['function'][j].range_full[1] += 5
            }
        }
    }
    return dig_info
}

const extract = (prog, dig_info) => {
    let i, range, functions, left, right;
    functions = []
    for (i = dig_info['function'].length-1; i >= 0; i--) {
        range = dig_info['function'][i].range_full
        functions.push(prog.slice(range[0], range[1]))
        left = prog.slice(0, dig_info['function'][i].range_full[0])
        right = prog.slice(dig_info['function'][i].range_full[1])
        prog = `${left}${right}`
    }
    return {
        prog,
        functions
    }
}

const parse_js_file = (prog) => {
    let dig_info, tree, res;
    tree = esprima.parse(prog, {range: true})
    dig_info = dig(prog, tree)
    console.log(dig_info)
    /*
    prog = adapt(prog, dig_info)
    dig_info = modifyrangecall(dig_info)
    dig_info = modifyrangefunction(dig_info)
    res = extract(prog, dig_info)
    
    console.log(dig_info)
    console.log(res.prog)
    console.log(res.functions)
    */
    
    return prog;
}

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
	x.addEventlistener("event", a)
`

const p1 = `
(function() {
    "use strict";
    let x;
  
    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
      x = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }
})()
`

const p3 = `
    (function() {
        const a = function() {}
    })()
`

const p4 = `
const select = (el, all = false) => {
    x = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }
`

/*
let x; function c() {let v = self.x;} self.c()
let x; function c() {let v = x;} c()
*/


parse_js_file(removecomments(p4))
