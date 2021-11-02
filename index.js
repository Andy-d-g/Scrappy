import puppeteer from 'puppeteer';
import purify from 'purify-css'
import beautify from 'js-beautify'
import fs from 'fs'

const URL_test = 'https://bootstrapmade.com/'
const SELECTOR_test = '#header'

const beautify_code = (data, type) => {
    switch (type) {
        case 'css':
            return beautify.css(data, { indent_size: 4, space_in_empty_paren: true })
        case 'html':
            return beautify.html(data, { indent_size: 4, space_in_empty_paren: true })
    }
}

const create_component = (html, css) => {
    const script = fs.readFileSync('./script_template.txt', 'utf8')
    html = `<template>\n${html}\n</template>\n`
    css = `\n<style>\n${css}\n</style>`    

    fs.writeFile('./index.vue', `${html}${script}${css}`, err => {})
}

const start = async (url, selector) => {
    let html, css;
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(selector)

    html = await page.$eval(selector, doc => doc.outerHTML)

    const styles = await page.$eval('html', (doc) => {
        styles = ''
        let childrens = [doc]
        while (childrens.length) {
            const child = childrens[0]
            childrens.shift()
            if (child.localName === 'style') styles += child.innerHTML + ' '
            if (child.children) childrens = [...childrens, ...child.children]
        }
        return styles
    })

    html = beautify_code(html, 'html')
    css = beautify_code(purify(html, styles), 'css')
    create_component(html, css)

    await browser.close();
}

const init = () => {
    if (process.argv.length !== 4) console.log("Le nombre d'argument n'est pas correct")
    else start(process.argv[2], process.argv[3])
}

init()
