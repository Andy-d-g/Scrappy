import puppeteer from 'puppeteer';
import beautify from 'js-beautify'
import uncss from 'uncss'
import create_component from './component.js'
import parse_css_file from './css/parse_css.js';

const _obj_to_css = (obj) => {
    let cssfile = ''
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && obj[k] !== null) cssfile += `${k} {${_obj_to_css(obj[k])}}`
        else cssfile += `${k}: ${obj[k]};`
    })
    return cssfile
}

const obj_to_css = (obj) => beautify.css(_obj_to_css(obj), { indent_size: 4, space_in_empty_paren: true })

const merge = (current, updates) => {
    for (let key of Object.keys(updates)) {
        if (!current.hasOwnProperty(key) || typeof updates[key] !== 'object') current[key] = updates[key];
        else merge(current[key], updates[key]);
    }
    return current;
}

const scrappy = async (url, selector) => {
    try {
        let html, css, styles_sheet;
        const browser = await puppeteer.launch({
            headless: true
        });
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
    
        html = await page.$eval(selector, doc => doc.outerHTML)
        html = beautify.html(html, { indent_size: 4, space_in_empty_paren: true })

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
    
        let obj = {}

        styles_sheet.forEach(s => {
            s.data.forEach(_css => {
                obj = merge(obj, parse_css_file(_css))
            })
        })

        css = obj_to_css(obj)

        uncss(html, {raw: css}, (error, output) => {
            create_component(html, output)
        })

        await browser.close();

    } catch (err) {
        console.log(err)
    }
}

const init = () => {
    if (process.argv.length < 4) console.log("Le nombre d'argument n'est pas correct")
    else scrappy(process.argv[2], process.argv.slice(3).join(" "))
}

init()