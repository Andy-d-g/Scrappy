import puppeteer from 'puppeteer';
import beautify from 'js-beautify'
import fs from 'fs'
import uncss from 'uncss'
import parse_css_file from './parse_css.js';

const LOG = true

const create_component = (html, css) => {
    const script = fs.readFileSync('./script_template.txt', 'utf8')
    html = `<template>\n${html}\n</template>\n`
    css = `\n<style scoped>\n${css}\n</style>`    

    fs.writeFile('./index.vue', `${html}${script}${css}`, err => {})
}

const _json_to_css = (obj) => {
    let cssfile = ''
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && obj[k] !== null) cssfile += `${k} {${_json_to_css(obj[k])}}`
        else cssfile += `${k}: ${obj[k]};`
    })
    return cssfile
}

const json_to_css = (obj) => beautify.css(_json_to_css(obj), { indent_size: 4, space_in_empty_paren: true })

const extend = function () {
    /*  https://gomakethings.com/merging-objects-with-vanilla-javascript/  */

    // Variables
    var extended = {};
    var deep = false;
    var i = 0;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
        deep = arguments[0];
        i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                // If property is an object, merge properties
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = extend(extended[prop], obj[prop]);
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    // Loop through each object and conduct a merge
    for (; i < arguments.length; i++) {
        merge(arguments[i]);
    }

    return extended;
};

const scrappy = async (url, selector) => {
    try {
        let html, css, styles_sheet, styles_balise;
        const browser = await puppeteer.launch({
            headless: true
        });
        if (LOG) console.log(`Browser : ok`)
        const agent = await browser.userAgent()
        const page = await browser.newPage();
        page.setUserAgent(agent.slice(0, agent.indexOf('Headless')))
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        });
        await page.goto(url);
        await page.waitForSelector(selector)
        if (LOG) console.log(`Page : ok`)
    
        if (LOG) console.log(`Extraction HTML : ...`)
        html = await page.$eval(selector, doc => doc.outerHTML)
        html = beautify.html(html, { indent_size: 4, space_in_empty_paren: true })
        if (LOG) console.log(`Extraction HTML : ok`)

        if (LOG) console.log(`Extraction stylesheets : ...`)
        styles_sheet = await page.$eval('html', (doc) => {
            const stylesSheets = [...doc.parentNode.styleSheets]
            let sheet = []
    
            for (let i = 0; i < stylesSheets.length; i++) {
                try {
                    [stylesSheets[i].cssRules].forEach((rules_list) => {
                        let arr = {
                            data: [], 
                            href: stylesSheets[i].href
                        }
                        for (let a = 0; a < rules_list.length; a++) arr.data.push(rules_list[a].cssText)
                        sheet.push(arr)
                    })
                } catch (err) {}
            }
            return sheet;
        })
        if (LOG) console.log(`Extraction stylesheets : ok`)
    
        let obj = {}

        if (LOG) console.log(`Traitement stylesheets : ...`)
        styles_sheet.forEach(s => {
            if (LOG) if (s.href) console.log(`Stylesheet : ${s.href}`)
            s.data.forEach(css => {
                obj = extend(true, obj, parse_css_file(css))
            })
        })
        if (LOG) console.log(`Traitement stylesheets : ok`)
    
        if (LOG) console.log(`OBJ -> CSS : ...`)
        css = json_to_css(obj)
        if (LOG) console.log(`OBJ -> CSS : ok`)
        if (LOG) console.log(`Creation du component : ...`)
        uncss(html, {raw: css}, (error, output) => {
            create_component(html, output)
            if (LOG) console.log(`Creation du component : ok`)
        })
        

        await browser.close();

    } catch (err) {
        console.log(err)
    }
}

const init = () => {
    if (process.argv.length !== 4) console.log("Le nombre d'argument n'est pas correct")
    else scrappy(process.argv[2], process.argv[3])
}

init()