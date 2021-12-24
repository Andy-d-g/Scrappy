import beautify from 'js-beautify'
import fs from 'fs'
import uncss from 'uncss'
import create_component from './component.js'

const sanitaze = () => {
    const html = beautify.html(fs.readFileSync('./out/index.html', 'utf8'), { indent_size: 4, space_in_empty_paren: true })
    const css = fs.readFileSync('./out/styles.css', 'utf8')
    uncss(html, {raw: css}, (error, output) => {
        create_component(html, output)
    })
}

sanitaze()