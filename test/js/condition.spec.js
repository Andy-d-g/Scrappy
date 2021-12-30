import { expect } from "chai"
import parse_js_file from "../../src/js/parse_js.js"

describe("JS condition rules", () => {
    describe("Profondeur = 0", () => {
        it("if (a) {let b}", () => {
            // Given
            const prog = `if (a) {let b}`

            // When
            const parsed = parse_js_file(prog)

            // Then
            expect(parsed.code).to.deep.equal([])
            expect(parsed.created).to.deep.equal([
                "if (a) {}"
            ])
            expect(parsed.methods).to.deep.equal([])
            expect(parsed.data).to.deep.equal([
                'b'
            ])
            expect(parsed.depth).to.equal(0)
        })
    })
    describe("Profondeur > 0", () => {
        it("if (a) {let b}", () => {
            // Given
            const prog = `if (a) {let b}`

            // When
            const parsed = parse_js_file(prog, 1)

            // Then
            expect(parsed.code).to.deep.equal([
                'if (a) {let b}'
            ])

            expect(parsed.code).to.deep.equal([
                {
                    type: "if", 
                    params: "a",
                    body: [
                    "let b;"
                ]}
            ])
            expect(parsed.created).to.deep.equal([])
            expect(parsed.methods).to.deep.equal([])
            expect(parsed.data).to.deep.equal([])
            expect(parsed.depth).to.equal(1)
        })
    })
})