import { JSDOM } from "jsdom";
import cssToObj from './cssToObj.js'
import _ from 'lodash'

const removeComments = (string) => string.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').trim();
const propertyExist = (document, property) => Boolean(document.querySelector(property))
const getIds = (property) => _.words(property, /#[a-zA-Z0-9]+/g)
const replaceRootValue = (obj, rootObj) => {
    for (let property in obj) {
        for (let _property in obj[property]) {
            let key = Object.keys(rootObj).filter(k => `var(${k})` === obj[property][_property])
            if (key.length) { obj[property][_property] = rootObj[key] }
        }
    }
    return obj
}

const getEachProperty = (property) => property.split(',')
const formatProperties = (property) => {
    let properties = getEachProperty(property).map(prop => prop.trim())
    for (let i = 0; i < properties.length; i++) {
        if (_.replace(properties[i], /:{1,2}[\w-]+/g, '').trim() == '') {
            properties[i-1] = _.replace(properties[i-1] += properties[i], ' ', '')
            properties.splice(i,1)
            i--;
        }
    }
    return properties
}

const cleanCSS = (html, css) => {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const inCSS = cssToObj(removeComments(css))
    const root = inCSS[':root']
    let outCSS = {}
    Object.keys(inCSS).forEach(k => {
        try {
            // Si la proriété est un @media
            if (k.includes("@media")) {
                let media = {}
                for (let p in inCSS[k]) {
                    if (propertyExist(document, p)) {
                        formatProperties(p).forEach(property => {
                            if (propertyExist(document, _.replace(property, /:{1,2}[\w-]+/g, ''))) {
                                media[property] = {...media[property], ...inCSS[k][p]}
                            }
                        })
                        
                    }
                }
                if (Object.keys(media).length) {
                    outCSS[k] = {...outCSS[k], ...media}
                }
            } 
            // Si un ID est present dans une propriété, on regarde si l'on peux l'appeller dans le DOM
            else if (getIds(k).filter(id => propertyExist(document, id)).length) {
                outCSS[k] = {...inCSS[k], ...outCSS[k]}
            }
            else {
                formatProperties(k).forEach(property => {
                    if (propertyExist(document, _.replace(property, /:{1,2}[\w-]+/g, ''))) {
                        outCSS[property] = {...outCSS[property], ...inCSS[k]}
                    }
                })
            }
        } catch (err) {}
    })

    return replaceRootValue(outCSS, root)
}

export default cleanCSS