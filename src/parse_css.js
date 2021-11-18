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

const isSelector = (content) => {
    for (let i = content.length-1; i > 0; i--) {
        let part = content.slice(0, i)
        if (SELECTOR_CSS.includes(part)) return part.length
    }
    return 0
}

const sanitazeSelector = (selector) => {
    let parts = selector.split(',')
    for (let i = 0; i < parts.length; i++) parts[i] = parts[i].trim()
    return parts.join(', ')
}

const _parse_css_file = (css, i) => {
    let buffer = ''
    let obj = {}
    let selector = ''
    let parenthese = 0

    for (; i < css.length; i++) {

        if (css[i] === '(') parenthese++
        else if  (css[i] === ')') parenthese--
        else if (css[i] === '{') {
            selector = sanitazeSelector(buffer.trim())
            buffer = ''
            let res = _parse_css_file(css, i+1)
            obj[selector] = res.data
            i = res.index
        }
        else if (css[i] === '}') {
            if (buffer.trim()) obj[selector] = buffer.trim()
            return {index: i+1, data: obj}
        }
        else if (css[i] === ':') {
            
            let lengthSelector = isSelector(css.slice(i, i+MAX_LENGHT_CSS_SELECTOR+1))


            if (lengthSelector || parenthese) {
                buffer += css.slice(i, i+lengthSelector)
                i+=lengthSelector
            }

            else {
                selector = sanitazeSelector(buffer.trim())
                buffer = ''
                i++
            }
            
        }
        else if (css[i] === ';') {

            if (!parenthese) {
                obj[selector] = buffer.trim()
                buffer = ''
            }
            i++
        }
        if (css[i] !== '\n') buffer += css[i]
    }
    return obj
}

const parse_css_file = (f) => _parse_css_file(f, 0)

export default parse_css_file