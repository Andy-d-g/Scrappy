import fs from 'fs'
import beautify from 'js-beautify'

const createComponent = (html, css, js) => {
    html = `<template>\n${html}\n</template>\n`
    js = `\n
    <script>
    export default {
        name: '',
        props: {
    
        }
    }
    </script>\n
    `
    css = `\n<style scoped>\n${css}\n</style>`

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