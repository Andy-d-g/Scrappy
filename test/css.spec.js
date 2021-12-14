import { expect } from "chai"
import parse_css_file from "../src/parse_css.js"

describe("Css rules", () => {
    describe("Handle selector", () => {
        it("* / ::after / ::before", () => {
            let css = "*, ::after, ::before { box-sizing: border-box; }"
            expect(parse_css_file(css)).to.deep.equal({ 
                '*, ::after, ::before': { 'box-sizing': 'border-box' } 
            })
        })
        it("@media ()", () => {
            let css = `@media (prefers-reduced-motion: no-preference) { :root { scroll-behavior: smooth; color: blue; } text-align: center }`
            expect(parse_css_file(css)).to.deep.equal({
                '@media (prefers-reduced-motion: no-preference)': {
                    ':root': { 'scroll-behavior': 'smooth', color: 'blue' },
                    'text-align': 'center'
                }
            })
        })
        it(":root { --variable: }", () => {
            let css = `:root { --bs-blue: #0d6efd; --bs-ble: #0d6efd; }`
            expect(parse_css_file(css)).to.deep.equal({ 
                ':root': { '--bs-blue': '#0d6efd', '--bs-ble': '#0d6efd' } 
            })
        })
        it("@media () {a,b {}}", () => {
            let css = `@media (min-width:1200px) {.h1,h1 {font-size: 2.5rem} }`
            expect(parse_css_file(css)).to.deep.equal({
                '@media (min-width:1200px)': { '.h1, h1': { 'font-size': '2.5rem' } }
            })
        })

        it("a:not([href]):not([class]),a:not", () => {
            let css = `a:not([href]):not([class]),a:not([href]):not([class]):hover {color: inherit; text-decoration: none }`
            expect(parse_css_file(css)).to.deep.equal({
                'a:not([href]):not([class]), a:not([href]):not([class]):hover': { color: 'inherit', 'text-decoration': 'none' }
            })
        })

        it(".el > li::before", () => {
            let css = `.ql-editor ul[data-checked=true] > li::before { pointer-events: all; }`
            expect(parse_css_file(css)).to.deep.equal({
                '.ql-editor ul[data-checked=true] > li::before': { 'pointer-events': 'all' }
            })
        })
        it("@font-face", () => {
            let css = `@font-face { src: url(\"data:application/font-woff;charset=utf-8;base64, AO8EFTQAA\"); }`
            expect(parse_css_file(css)).to.deep.equal({
                '@font-face': {
                    src: 'url("data:application/font-woffcharset=utf-8base64, AO8EFTQAA")'
                }
            })
        })
        it("#id", () => {
            let css = "#hero{width: 100%;}"
            expect(parse_css_file(css)).to.deep.equal({
                '#hero': {
                    width: '100%'
                }
            })
        })
    })
})