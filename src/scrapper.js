import puppeteer from 'puppeteer';
import beautify from 'js-beautify'
import uncss from 'uncss'
import { create_component } from './utils.js'
import parse_css_file from './css/parse_css.js';

const HEADLESS = true

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
/*
const mergeStylesSheets = (styles_sheet) => {
    let obj = {}
    styles_sheet.forEach(sheet => {
        sheet.data.forEach(css => {
            obj = merge(obj, parse_css_file(css))
        })
    })
    return obj
}
*/

const mergeStylesSheets = (styles_sheets) => {
    let css = ""
    styles_sheets.forEach(sheet => {
        sheet.data.forEach(_css => {
            css += _css
        })
    })
    return css
}

const cleanStylesSheets = (styles_sheet, html) => {
    styles_sheet.forEach(sheet => {
        sheet.data.forEach(css => {
            uncss(html, {raw: css}, (_, output) => console.log(output))
        })
    })
    return styles_sheet
}

const getStylesSheets = async (page) => page.$eval('html', (doc) => {
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

const getScript = async (page) => page.$eval('html', (doc) => {
    const scripts = [...doc.parentNode.scripts]
    for (let s of scripts) {
        if (s.src.split('/').reverse()[0] === "main.js") return s.src
    }
    throw new Error("Script not found")
})

const getHTMLJSCSS = async (url, selector) => {
    let html, js, css;
    try {
        const browser = await puppeteer.launch({
            headless: HEADLESS,
            defaultViewport: null
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0');
        await page.goto(url);
        await page.waitForSelector(selector)
        html = await page.$eval(selector, doc => doc.outerHTML)
        html = beautify.html(html, { indent_size: 4, space_in_empty_paren: true })

        js = await getScript(page)
        css = await getStylesSheets(page)

        await browser.close();

        return {html, js, css}
    } catch (err) {
        throw new Error(err)
    }
}

const filtreCSS = async (url, selector, resolution, styles_sheets) => {
    let html, css
    try {
        const browser = await puppeteer.launch({
            headless: HEADLESS,
            defaultViewport: null
        });
        const page = await browser.newPage();
        await page.setViewport({ width: resolution.width, height: resolution.height});
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0');
        await page.goto(url);
        
        html = await page.$eval(selector, doc => doc.outerHTML)

        await browser.close();

        css = await uncss(html, {raw: styles_sheets, ignoreSheets : [/fonts.googleapis/]}, () => {})

        return parse_css_file(css)
    } catch (err) {
        throw new Error(err);
    }
}

const scrappy = async (url, selector) => {
    const resolutions = [
        {width: 400, height: 800}, // Smartphone
        {width: 800, height: 1100}, // Tablette
        {width: 1920, height: 1080}  // Computer
    ]
    let html, css, js, html_js_css, sub_css, styles_sheets, obj;
    try {
        html_js_css = await getHTMLJSCSS(url, selector)
        
        html = html_js_css.html
        js = html_js_css.js
        styles_sheets = html_js_css.css
        obj = {}

        styles_sheets = mergeStylesSheets(styles_sheets)
        
        for (let resolution of resolutions) {
            //sub_css = await getCSS(url, selector, resolution)
            sub_css = await filtreCSS(url, selector, resolution, styles_sheets)
            obj = merge(obj, sub_css)
        }
        
        //obj = cleanCSS(obj)
        css = objToCSS(obj)
        create_component(html, css, js)

    } catch (err) {
        throw new Error(err);
    }
}

const init = () => {
    if (process.argv.length < 4) console.log("Le nombre d'argument n'est pas correct")
    else scrappy(process.argv[2], process.argv.slice(3).join(" "))
}

init()