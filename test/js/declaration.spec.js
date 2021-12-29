import { expect } from "chai"
import parse_js_file from "../../src/js/parse_js.js"

describe("JS declaration rules", () => {
    describe("Profondeur = 0", () => {
        it("let", () => {
            // Given
            const prog = `let a;`

            // When
            const parsed = parse_js_file(prog)

            // Then
            expect(parsed).to.deep.equal({
                code: [],
                created: [],
                methods: [],
                data: [
                    "a"
                ],
                depth: 0
            })
        })
    })
    describe("Profondeur > 0", () => {
        it("let", () => {
            // Given
            const prog = `let a;`

            // When
            const parsed = parse_js_file(prog, 1)

            // Then
            expect(parsed).to.deep.equal({
                code: [ 
                    "let a;" 
                ],
                created: [],
                methods: [],
                data: [],
                depth: 1
            })
        })
    })
})