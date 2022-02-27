import { JSDOM } from "jsdom";
import {css, html} from './data.js'
import parse_css from './parse_css.js'
import fs from 'fs'
import _ from 'lodash'

const removeComments = (string) => string.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').trim();
const propertyExist = (document, property) => Boolean(document.querySelector(property))
const getIds = (property) => _.words(property, /#[a-zA-Z0-9]+/g)
const atLestOnePropertyExist = (document, properties) => {
    for (let i = 0; i < properties.length; i++) if (propertyExist(document, properties[i])) return true
    return false
}

const dom = new JSDOM(html);
const document = dom.window.document;

const fullCSS = parse_css(removeComments(css))

const uncss = (document, full, clean) => {
    Object.keys(full).forEach(k => {
        try {
            // Si la proriété est un @media
            if (property.includes("@media")) {
                for (let p in full[k]) {
                    if (propertyExist(document, p)) {
                        clean[k][p] = full[k][p]
                    }
                }
            } 
            // Si un ID est present dans une propriété, on regarde si l'on peux l'appeller dans le DOM
            else if (getIds(k).filter(id => propertyExist(document, id)).length) {
                clean[k] = full[k]
            }
            // Si une des propriété de la liste contient un call vers le DOM : recupere (supprime les selector)
            else if (atLestOnePropertyExist(document, k.split(',').map(_k => _.replace(_k, /:{1,2}[\w-]+/g, '')))) {
                clean[k] = full[k]
            }
        } catch (err) {}

    })
    return clean
}

fs.writeFileSync('./out/test.css', JSON.stringify(uncss(document, fullCSS, {}), null, 4))