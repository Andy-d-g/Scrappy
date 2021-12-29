import { expect } from "chai"
import parse_js_file from "../../src/js/parse_js.js"

describe("JS function rules", () => {
    describe("Empty function", () => {
        it("arrow function", () => {
            // Given
            const prog = "const a = () => {}"
    
            // When
            const parsed = parse_js_file(prog)
    
            // Then
            expect(parsed).to.deep.equal({ 
                code: [],
                created: [],
                methods: [
                    {
                        name: "a",
                        params: [],
                        code: []
                    }
                    ],
                data: [],
                depth: 0
            })
        })
        it("declaration function", () => {
            // Given
            const prog = "function a() {}"
    
                // When
            const parsed = parse_js_file(prog)
    
            // Then
            expect(parsed).to.deep.equal({ 
                code: [],
                created: [],
                methods: [
                    {
                        name: "a",
                        params: [],
                        code: []
                    }
                    ],
                data: [],
                depth: 0
            })
        })
    })
    describe("Empty function with parameter", () => {
        it("simple function variable", () => {
            // Given
            const prog = "const a = (x,y) => {}"

            // When
            const parsed = parse_js_file(prog)

            // Then
            expect(parsed).to.deep.equal({ 
                code: [],
                created: [],
                methods: [
                    {
                        name: "a",
                        params: ["x", "y"],
                        code: []
                    }
                ],
                data: [],
                depth: 0
            })
        })
        it("simple function declaration", () => {
            // Given
            const prog = `function a(x, y) {}`

            // When
            const parsed = parse_js_file(prog)

            // Then
            expect(parsed).to.deep.equal({ 
                code: [],
                created: [],
                methods: [
                    {
                        name: "a",
                        params: ["x", "y"],
                        code: []
                    }
                ],
                data: [],
                depth: 0
            })
        })
    })
    describe("Imbricate empty function (with parameters)", () => {
        it("arrow function", () => {
            // Given
            const prog = `
            const a = (x,y) => { 
                const b = (z) => {}
            }`

            // When
            const parsed = parse_js_file(prog)
            
            // Then
            expect(parsed).to.deep.equal({ 
                code: [],
                created: [],
                methods: [
                    {
                        name: "b",
                        params: ["z"],
                        code: []
                    },
                    {
                        name: "a",
                        params: ["x", "y"],
                        code: []
                    }
                ],
                data: [],
                depth: 0
            })
        })
        it("declaration function", () => {
            // Given
            const prog = `
            function a(x) { 
                function b(z,y) {}
            }`

            // When
            const parsed = parse_js_file(prog)
            
            // Then
            expect(parsed).to.deep.equal({ 
                code: [],
                created: [],
                methods: [
                    {
                        name: "b",
                        params: ["z", "y"],
                        code: []
                    },
                    {
                        name: "a",
                        params: ["x"],
                        code: []
                    }
                ],
                data: [],
                depth: 0
            })
        })
    })
})