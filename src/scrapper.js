import puppeteer from 'puppeteer';
import cleanCSS from './css/cleanCSS.js'
import { createComponent, objToCSS, merge } from './utils.js'
import axios from 'axios'
import vanillaToVue from './js/vanillaToVue.js'

const HEADLESS = true

const mergeStylesSheets = (styles_sheets) => {
    let css = ""
    styles_sheets.forEach(sheet => {
        sheet.data.forEach(_css => {
            css += _css
        })
    })
    return css
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

        return cleanCSS(html, styles_sheets)
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
        js = html_js_css.js // url
        styles_sheets = html_js_css.css
        obj = {}

        styles_sheets = mergeStylesSheets(styles_sheets)
        
        for (let resolution of resolutions) {
            console.log(`Resolution : [${resolution.width}/${resolution.height}]`)
            sub_css = await filtreCSS(url, selector, resolution, styles_sheets)
            obj = merge(obj, sub_css)
        }
        

        js = await axios.get(js)
        js = vanillaToVue(js.data)
        
        css = objToCSS(obj)
        createComponent(html, css, js)

    } catch (err) {
        throw new Error(err);
    }
}

const init = () => {
    if (process.argv.length < 4) console.log("Le nombre d'argument n'est pas correct")
    else scrappy(process.argv[2], process.argv.slice(3).join(" "))
}

init()