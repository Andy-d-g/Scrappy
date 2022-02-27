import fs from 'fs'
import beautify from 'js-beautify'

const createComponent = (html, css, js) => {
    html = beautify.html(`<template>\n${html}\n</template>\n`, { indent_size: 4, space_in_empty_paren: true })
    css = `\n<style scoped>\n${beautify.css(css, { indent_size: 4, space_in_empty_paren: true })}\n</style>\n`
    js = `\n\n<script>\n${beautify.js(js, { indent_size: 4, space_in_empty_paren: true })}\n</script>\n`
    fs.writeFile('./out/index.vue', `${html}${js}${css}`, () => {console.log('Fichier créer avec succès !')})
}

const _objToCSS = (obj) => {
    let cssfile = ''
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && obj[k] !== null) cssfile += `${k} {${_objToCSS(obj[k])}}`
        else cssfile += `${k}: ${obj[k]};`
    })
    return cssfile
}

const objToCSS = (obj) => beautify.css(_objToCSS(obj), { indent_size: 4, space_in_empty_paren: true })

const merge = (current, updates) => {
    for (let key of Object.keys(updates)) {
        if (!current.hasOwnProperty(key) || typeof updates[key] !== 'object') current[key] = updates[key];
        else merge(current[key], updates[key]);
    }
    return current;
}

export {
    createComponent,
    objToCSS,
    merge
}