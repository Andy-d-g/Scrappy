import puppeteer from 'puppeteer';
import cleanCSS from './css/cleanCSS.js'
import { createComponent } from './utils.js'
import objToCss from './css/objToCss.js'
import axios from 'axios'
import vanillaToVue from './js/vanillaToVue.js'
import _ from 'lodash'

const HEADLESS = true

const mergeStylesSheets = (styles_sheets) => {
    let css = ''
    styles_sheets.map(sheet => sheet.data.map(data => css += data))
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
    let html
    try {
        const browser = await puppeteer.launch({
            headless: HEADLESS,
            defaultViewport: {
                width: resolution.width, 
                height: resolution.height,
                isMobile: resolution.isMobile,
                isLandscape: false,
                hasTouch: resolution.isMobile
            },
            dumpio: false, // output on vscode console
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0');
        await page.goto(url);
        
        html = await page.$eval(selector, doc => doc.outerHTML)

        await page.exposeFunction("getEvent", async (expression) => {
            const client = await page.target().createCDPSession();
            const body = await client.send("Runtime.evaluate", { expression : `document.querySelector("${expression}")` });
            return await client.send("DOMDebugger.getEventListeners", { objectId : body["result"]["objectId"] });
        })
        await page.waitForSelector(selector)
        let events = await listEvents(page, selector)
        Object.keys(events).forEach(k => {
            console.log(events[k])
        })

        await browser.close();

        return cleanCSS(html, styles_sheets)
    } catch (err) {
        throw new Error(err);
    }
}

const listEvents = async (page, selector) => page.$eval(selector, async (document) => {
        const generateQuerySelector = (el) => {
            if (el.tagName.toLowerCase() == "html")
                return "HTML";
            let str = el.tagName;
            str += (el.id != "") ? "#" + el.id : "";
            if (el.className) {
                let classes = el.className.split(/\s/);
                for (let i = 0; i < classes.length; i++) {
                    str += "." + classes[i]
                }
            }
            return generateQuerySelector(el.parentNode) + " > " + str;
        }

        let list = [document]
        let events = {}
        let eventsEl = {}
        let selectorEl = ''
        
        do {
            let currentEl = list[0]
            selectorEl = generateQuerySelector(currentEl)
            eventsEl = await window.getEvent(selectorEl)
            if (eventsEl.listeners.length) {
                events[selectorEl] = eventsEl
            }
            list.shift()
            let childrens = [...currentEl.children]
            list = [...list, ...childrens]
        } while (list.length)

        return events
    })


const scrappy = async (url, selector) => {
    const resolutions = [
        {width: 400, height: 800, isMobile: true}, // Smartphone
        //{width: 800, height: 1100, isMobile: false}, // Tablette
        //{width: 1920, height: 1080, isMobile: false}  // Computer
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
            obj = _.merge(obj, sub_css)
        }

        js = await axios.get(js)
        js = vanillaToVue(js.data)
        
        css = objToCss(obj)
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