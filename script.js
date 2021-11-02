import puppeteer from 'puppeteer';
import beautify_code from './analyzer.js'

const URL = 'https://bootstrapmade.com/'
const SELECTOR = '#header'

const start = async (url, selector) => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(selector)
    /*
    const class_id_useful = await page.$eval(selector, (element) => {
        let ids = []
        let classes = []
        let childrens = [element]
        
        while (childrens.length) {
            const child = childrens[0]
            childrens.shift()
            if (child.attributes['id']) ids.push(child.attributes['id'].value)
            if (child.classList) classes = [...classes, ...child.classList]
            if (child.children) childrens = [...childrens, ...child.children]
        }

        return {
            ids: ids,
            classes: [...new Set(classes)]
        }
    });
    const styles = await page.$eval('html', (element) => {
        let styles = []
        const head = element.children[0]
        styles = [...head.children].filter((e) => e.localName === 'style')
        for (let i = 0; i < styles.length; i++) {
            styles[i] = styles[i].outerText
        }
        return styles
    });
    */
    //console.log(beautify_code(styles[0], 'css'))
    //await browser.close();
}

//init(process.argv[2])
start(URL, SELECTOR)

