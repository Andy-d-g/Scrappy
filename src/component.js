import fs from 'fs'

const create_component = (html, css, js) => {
    let script = `
    export default {
        name: 'xxx-name',
        props: {
    
        },
        ${js['created']},
        ${js['data']},
        ${js['methods']}
    }`

    fs.writeFile('./out/styles.css', `${css}`, () => {})
    fs.writeFile('./out/index.html', `${html}`, () => {})
    fs.writeFile('./out/script.js', `${script}`, () => {})
    
    html = `<template>\n${html}\n</template>\n`
    css = `\n<style scoped>\n${css}\n</style>`
    script = `\n<script>${script}</script>\n`

    fs.writeFile('./out/index.vue', `${html}${script}${css}`, () => {console.log('Fichier créer avec succès !')})
}

export default create_component