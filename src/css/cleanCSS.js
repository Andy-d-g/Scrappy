import { JSDOM } from "jsdom";
import cssToObj from './cssToObj.js'
import _ from 'lodash'

const removeComments = (string) => string.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').trim();
const propertyExist = (document, property) => Boolean(document.querySelector(property))
const getIds = (property) => _.words(property, /#[a-zA-Z0-9]+/g)
const atLestOnePropertyExist = (document, properties) => {
    for (let i = 0; i < properties.length; i++) if (propertyExist(document, properties[i])) return true
    return false
}

const cleanCSS = (html, css) => {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const inCSS = cssToObj(removeComments(css))
    let outCSS = {}
    Object.keys(inCSS).forEach(k => {
        try {
            // Si la proriété est un @media
            if (k.includes("@media")) {
                let media = {}
                for (let p in inCSS[k]) {
                    if (propertyExist(document, p)) {
                        media[p] = inCSS[k][p]
                    }
                }
                if (Object.keys(media).length) {
                    outCSS[k] = media
                }
            } 
            // Si un ID est present dans une propriété, on regarde si l'on peux l'appeller dans le DOM
            else if (getIds(k).filter(id => propertyExist(document, id)).length) {
                outCSS[k] = inCSS[k]
            }
            // Si une des propriété de la liste contient un call vers le DOM : recupere (supprime les selector)
            else if (atLestOnePropertyExist(document, k.split(',').map(_k => _.replace(_k, /:{1,2}[\w-]+/g, '')))) {
                outCSS[k] = inCSS[k]
            }
        } catch (err) {}
    })
    return outCSS
}

export default cleanCSS