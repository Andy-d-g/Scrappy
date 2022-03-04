import beautify from 'js-beautify'

const _objToCss = (obj) => {
    let cssfile = ''
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && obj[k] !== null) cssfile += `${k} {${_objToCss(obj[k])}}`
        else cssfile += `${k}: ${obj[k]};`
    })
    return cssfile
}

const objToCss = (obj) => beautify.css(_objToCss(obj), { indent_size: 4, space_in_empty_paren: true })

export default objToCss