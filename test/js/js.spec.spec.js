import { expect } from "chai"
import esprima from "esprima"
import parse_js_file from "../../src/js/parse_js.js"
import utils from "../../src/js/utils.js"

describe("JS rules", () => {
    describe("Variable", () => {
        it("let", () => {
            // Given
            const js = `let a = 3`

            // When
            const parsed = parse_js_file(js)

            // Then
            console.log(parsed)
            expect(parsed.code).to.deep.equal([])
            expect(parsed.created).to.deep.equal([
                'this.a = 3'
            ])
            expect(parsed.methods).to.deep.equal([])
            expect(parsed.data).to.deep.equal([
                'a'
            ])
            expect(parsed.depth).to.equal(0)
        })
        it("const", () => {
            // Given
            const js = `const a = 3`

            // When
            const parsed = parse_js_file(js)

            // Then
            console.log(parsed)
            expect(parsed.code).to.deep.equal([])
            expect(parsed.created).to.deep.equal([
                'this.a = 3'
            ])
            expect(parsed.methods).to.deep.equal([])
            expect(parsed.data).to.deep.equal([
                'a'
            ])
            expect(parsed.depth).to.equal(0)
        })
    })
    describe("Function", () => {
        it("simple function", () => {
            // Given
            const js = "const a = () => {}"

            // When
            const parsed = parse_js_file(js)

            // Then
            expect(parsed).to.deep.equal({ 
                code: [],
                created: [],
                methods: [
                    'a(){}'
                ],
                data: [],
                depth: 0
            })
        })
        it("imbricate function ", () => {
            // Given
            const js = `
            const a = () => { 
                const b = () => {}
            }`

            // When
            const parsed = parse_js_file(js)
            
            // Then
            expect(parsed.code).to.deep.equal([])
            expect(parsed.created).to.deep.equal([])
            expect(parsed.methods).to.deep.equal([
                'b(){}',
                'a(){}'
            ])
            expect(parsed.data).to.deep.equal([])
            expect(parsed.depth).to.equal(0)
        })
    })
})