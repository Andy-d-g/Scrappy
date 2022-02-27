import fs from 'fs'

const create_component = (html, css, js) => {
    const script = fs.readFileSync('./src/script_template.txt', 'utf8')
    
    html = `<template>\n${html}\n</template>\n`
    js = ``
    css = `\n<style scoped>\n${css}\n</style>`

    fs.writeFile('./out/index.vue', `${html}${script}${css}`, () => {console.log('Fichier créer avec succès !')})
}

export {
    create_component
}