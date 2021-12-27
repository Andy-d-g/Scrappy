import { expect } from "chai"
import parse_js_file from "../../src/js/parse_js.js"

describe("JS assignation rules", () => {
    describe("Profondeur = 0", () => {
        it("let a; a = 3;", () => {
            // Given
            const prog = `let a; a = 3;`

            // When
            const parsed = parse_js_file(prog)

            // Then
            expect(parsed.code).to.deep.equal([])
            expect(parsed.created).to.deep.equal([
                'this.a = 3;'
            ])
            expect(parsed.methods).to.deep.equal([])
            expect(parsed.data).to.deep.equal([
                'a'
            ])
            expect(parsed.depth).to.equal(0)
        })
    })
    describe("Profondeur > 0", () => {
        it("let a; a = 3;", () => {
            // Given
            const prog = `let a; a = 3;`

            // When
            const parsed = parse_js_file(prog, 1)

            // Then
            expect(parsed.code).to.deep.equal([
                'let a;',
                'a = 3;'
            ])
            expect(parsed.created).to.deep.equal([])
            expect(parsed.methods).to.deep.equal([])
            expect(parsed.data).to.deep.equal([])
            expect(parsed.depth).to.equal(1)
        })
    })
})