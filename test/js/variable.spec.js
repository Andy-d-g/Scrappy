import { expect } from "chai"
import parse_js_file from "../../src/js/parse_js.js"

describe("JS variable rules", () => {
    describe("Profondeur = 0", () => {
        it("let", () => {
            // Given
            const prog = `let a = 3`

            // When
            const parsed = parse_js_file(prog)

            // Then
            expect(parsed).to.deep.equal({
                code: [],
                created: [
                    "this.a = 3"
                ],
                methods: [],
                data: [
                    "a"
                ],
                depth: 0
            })
        })
        it("const", () => {
            // Given
            const prog = `const a = 3`

            // When
            const parsed = parse_js_file(prog)

            // Then
            expect(parsed).to.deep.equal({
                code: [],
                created: [
                    "this.a = 3"
                ],
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
            const prog = `let a = 3`

            // When
            const parsed = parse_js_file(prog, 1)

            // Then
            expect(parsed).to.deep.equal({
                code: [ "let a = 3" ],
                created: [
                    
                ],
                methods: [],
                data: [],
                depth: 1
            })
        })
        it("const", () => {
            // Given
            const prog = `const a = 3`

            // When
            const parsed = parse_js_file(prog, 1)

            // Then
            expect(parsed).to.deep.equal({
                code: [
                    "const a = 3"
                ],
                created: [],
                methods: [],
                data: [],
                depth: 1
            })
        })
    })
})