import beautify from 'js-beautify'
import fs from 'fs'
import uncss from 'uncss'
import { create_component } from './utils.js'

const getContentBetween = (text, from, to) => text.slice(text.indexOf(from), text.indexOf(to)+to.length)

const sanitaze = () => {
    const vue = fs.readFileSync('./out/index.vue', 'utf8')
    const html = beautify.html(getContentBetween(vue, '<template>', '</template>'), { 
        indent_size: 4, 
        space_in_empty_paren: true 
    })
    const js = beautify.js(getContentBetween(vue, '<script>', '</script>'), { 
        indent_size: 4, 
        space_in_empty_paren: true
    })
    const css = beautify.css(
        vue.includes('<style>')
            ? getContentBetween(vue, '<style>', '</style>')
            : getContentBetween(vue, '<style scoped>', '</style>'
        ), {
        indent_size: 4, 
        space_in_empty_paren: true
    })
    
    let _css = await uncss(html, {raw: css}, () => {})
    create_component(html, _css, js)
}

sanitaze()