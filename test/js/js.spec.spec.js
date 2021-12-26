import { expect } from "chai"
import parse_js_file from "../../src/js/parse_js.js"

describe("JS rules", () => {
    describe("Variable", () => {
        it("let", () => {
            // Given
            const js = `let a = 3`

            // When
            const parsed = parse_js_file(js)

            // Then
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
        describe("Simple function", () => {
            describe("Without parameters", () => {
                it("simple function variable", () => {
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
                it("simple function declaration", () => {
                    // Given
                    const js = `function a() {}`
        
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
            })
            describe("With parameters", () => {
                it("simple function variable", () => {
                    // Given
                    const js = "const a = (x,y) => {}"
        
                    // When
                    const parsed = parse_js_file(js)
        
                    // Then
                    expect(parsed).to.deep.equal({ 
                        code: [],
                        created: [],
                        methods: [
                            'a(x, y){}'
                        ],
                        data: [],
                        depth: 0
                    })
                })
                it("simple function declaration", () => {
                    // Given
                    const js = `function a(x, y) {}`
        
                    // When
                    const parsed = parse_js_file(js)
        
                    // Then
                    expect(parsed).to.deep.equal({ 
                        code: [],
                        created: [],
                        methods: [
                            'a(x, y){}'
                        ],
                        data: [],
                        depth: 0
                    })
                })
            })
        })
        describe("Imbricate function", () => {
            it("const a = () => {}", () => {
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
            it("function a() {}", () => {
                // Given
                const js = `
                function a() { 
                    function b() {}
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
})