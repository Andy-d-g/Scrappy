const DEBUG = false
const MAX_LENGHT_CSS_SELECTOR = 18
const SELECTOR_CSS = [
    ":active",
    "::after",
    "::before",
    ":before",
    ":after",
    ":checked",
    ":default",
    ":disabled",
    ":empty",
    ":enabled",
    ":first-child",
    "::first-letter",
    "::first-line",
    ":first-of-type",
    ":focus",
    ":fullscreen",
    ":hover",
    ":in-range",
    ":indeterminate",
    ":invalid",
    ":lang(",
    ":last-child",
    ":last-of-type",
    ":link",
    "::marker",
    ":not(",
    ":nth-child(",
    ":nth-last-child(",
    ":nth-last-of-type(",
    ":nth-of-type(",
    ":only-of-type",
    ":only-child",
    ":optional",
    ":out-of-range",
    "::placeholder",
    ":read-only",
    ":read-write",
    ":required",
    ":root",
    "::selection",
    ":target",
    ":valid",
    ":visited"
]

const delete_unnecessary_space = (text) => {
    while (text[0] === ' ') text = text.slice(1, text.length)
    while (text[text.length-1] === ' ') text = text.slice(0, text.length-1)
    return text
}

const isSelector = (content) => {
    for (let i = content.length-1; i > 0; i--) {
        let part = content.slice(0, i)
        if (SELECTOR_CSS.includes(part)) return part.length
    }
    return 0
}

const sanitazeSelector = (selector) => {
    let parts = selector.split(',')
    for (let i = 0; i < parts.length; i++) parts[i] = delete_unnecessary_space(parts[i])
    return parts.join(', ')
}

const _parse_css_file = (css, i, p) => {
    let buffer = ''
    let obj = {}
    let selector = ''
    let parenthese = 0

    for (; i < css.length; i++) {
        if (DEBUG) console.log(`buffer : ${buffer}`)

        if (css[i] === '(') parenthese++
        else if  (css[i] === ')') parenthese--
        else if (css[i] === '{') {
            if (DEBUG) console.log('----- {')
            selector = sanitazeSelector(delete_unnecessary_space(buffer))
            buffer = ''
            let res = _parse_css_file(css, i+1, p+1)
            obj[selector] = res.data
            i = res.index
        }
        else if (css[i] === '}') {
            if (DEBUG) console.log('----- }')
            if (delete_unnecessary_space(buffer)) obj[selector] = delete_unnecessary_space(buffer)
            return {index: i+1, data: obj}
        }
        else if (css[i] === ':') {
            if (DEBUG) console.log('----- :')
            
            let lengthSelector = isSelector(css.slice(i, i+MAX_LENGHT_CSS_SELECTOR+1))

            if (DEBUG) console.log('isSelector : ' + (lengthSelector!==0))

            if (lengthSelector || parenthese) {
                buffer += css.slice(i, i+lengthSelector)
                i+=lengthSelector
            }

            else {
                selector = sanitazeSelector(delete_unnecessary_space(buffer))
                buffer = ''
                i++
            }
            
        }
        else if (css[i] === ';') {
            if (DEBUG) console.log('----- ;')
            if (DEBUG) console.log(`${selector} : ${delete_unnecessary_space(buffer)}`)
            if (!parenthese) {
                obj[selector] = delete_unnecessary_space(buffer)
                buffer = ''
            }
            i++
        }
        if (css[i] !== '\n') buffer += css[i]
    }
    return obj
}

const parse_css_file = (f) => _parse_css_file(f, 0, 0)

export default parse_css_file