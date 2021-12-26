import { expect } from "chai"
import parse_js_file from "../../src/js/parse_js.js"

describe("JS rules", () => {
    describe("Variable", () => {
        describe("Profondeur = 0", () => {
            it("let", () => {
                // Given
                const prog = `let a = 3`
    
                // When
                const parsed = parse_js_file(prog)
    
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
                const prog = `const a = 3`
    
                // When
                const parsed = parse_js_file(prog)
    
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
        describe("Profondeur > 0", () => {
            it("let", () => {
                // Given
                const prog = `const a = () => {let b = 3}`
    
                // When
                const parsed = parse_js_file(prog, 1)
                console.log(parsed)
    
                // Then
                expect(parsed.code).to.deep.equal([])
                expect(parsed.created).to.deep.equal([])
                expect(parsed.methods).to.deep.equal([
                    {
                        name: "a",
                        params: [],
                        code: [
                            "let b = 3"
                        ]
                    }
                ])
                expect(parsed.data).to.deep.equal([])
                expect(parsed.depth).to.equal(1)
            })
            it("const", () => {
                // Given
                const prog = `const a = () => {const b = 3}`
    
                // When
                const parsed = parse_js_file(prog,1)
    
                // Then
                expect(parsed.code).to.deep.equal([])
                expect(parsed.created).to.deep.equal([])
                expect(parsed.methods).to.deep.equal([
                    {
                        name: "a",
                        params: [],
                        code: [
                            "const b = 3"
                        ]
                    }
                ])
                expect(parsed.data).to.deep.equal([])
                expect(parsed.depth).to.equal(1)
            })
        })
    })
    describe("Function", () => {
        describe("Simple function", () => {
            describe("Without parameters", () => {
                it("simple function variable", () => {
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
                it("simple function declaration", () => {
                    // Given
                    const prog = `function a() {}`
        
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
            describe("With parameters", () => {
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
        })
        describe("Imbricate function", () => {
            it("const a = () => {}", () => {
                // Given
                const prog = `
                const a = () => { 
                    const b = () => {}
                }`

                // When
                const parsed = parse_js_file(prog)
                
                // Then
                expect(parsed.code).to.deep.equal([])
                expect(parsed.created).to.deep.equal([])
                expect(parsed.methods).to.deep.equal([
                    {
                        name: "b",
                        params: [],
                        code: []
                    },
                    {
                        name: "a",
                        params: [],
                        code: []
                    }
                ])
                expect(parsed.data).to.deep.equal([])
                expect(parsed.depth).to.equal(0)
            })
            it("function a() {}", () => {
                // Given
                const prog = `
                function a() { 
                    function b() {}
                }`

                // When
                const parsed = parse_js_file(prog)
                
                // Then
                expect(parsed.code).to.deep.equal([])
                expect(parsed.created).to.deep.equal([])
                expect(parsed.methods).to.deep.equal([
                    {
                        name: "b",
                        params: [],
                        code: []
                    },
                    {
                        name: "a",
                        params: [],
                        code: []
                    }
                ])
                expect(parsed.data).to.deep.equal([])
                expect(parsed.depth).to.equal(0)
            })
        })
        describe("Fonction with code", () => {
            it("with declaration inside", () => {
                // Given
                const prog = `
                const a = () => { 
                    let a = 3
                }`

                // When
                const parsed = parse_js_file(prog)
                
                // Then
                expect(parsed.code).to.deep.equal([])
                expect(parsed.created).to.deep.equal([])
                expect(parsed.methods).to.deep.equal([
                    {
                        name: "a",
                        params: [],
                        code: [
                            "let a = 3"
                        ]
                    }
                ])
                expect(parsed.data).to.deep.equal([])
                expect(parsed.depth).to.equal(0)
            })
        })
    })
    describe("Assigniation", () => {
        describe("Profondeur = 0", () => {
            it("let a; a = 3;", () => {
                // Given
                const prog = `let a; a = 3;`
    
                // When
                const parsed = parse_js_file(prog)
    
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
})