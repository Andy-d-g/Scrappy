import fs from 'fs'

const create_component = (html, css) => {
    const script = fs.readFileSync('./script_template.txt', 'utf8')

    fs.writeFile('../out/styles.css', `${css}`, () => {})
    fs.writeFile('../out/index.html', `${html}`, () => {})
    
    html = `<template>\n${html}\n</template>\n`
    css = `\n<style scoped>\n${css}\n</style>`    

    fs.writeFile('../out/index.vue', `${html}${script}${css}`, () => {console.log('Fichier créer avec succès !')})
}

export default create_component