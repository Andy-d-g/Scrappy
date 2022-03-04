import fs from 'fs'
import beautify from 'js-beautify'

const createComponent = (html, css, js) => {
    html = beautify.html(`<template>\n${html}\n</template>\n`, { indent_size: 4, space_in_empty_paren: true })
    css = `\n<style scoped>\n${beautify.css(css, { indent_size: 4, space_in_empty_paren: true })}\n</style>\n`
    js = `\n\n<script>\n${beautify.js(js, { indent_size: 4, space_in_empty_paren: true })}\n</script>\n`
    fs.writeFile('./out/index.vue', `${html}${js}${css}`, () => {console.log('Fichier créé avec succès !')})
}

export {
    createComponent
}