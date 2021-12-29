import { expect } from "chai"
import esprima from "esprima"
import { getTypeOfBlock } from "../../src/js/utils.js"

describe("Detection of type of block", () => {
    describe("Function", () => {
        describe("Declaration function", () => {
            it("function a() {}", () => {
                const prog = `function a() {}`
                const block = esprima.parse(prog).body[0]
                expect(getTypeOfBlock(block)).to.be.equal("declarationFunction")
            })
            
            describe("const", () => {
                it("const a = () => {}", () => {
                    const prog = `const a = () => {}`
                    const block = esprima.parse(prog).body[0]
                    expect(getTypeOfBlock(block)).to.be.equal("arrowFunction")
                })
                it("const b = function() {}", () => {
                    const prog = `const b = function() {}`
                    const block = esprima.parse(prog).body[0]
                    expect(getTypeOfBlock(block)).to.be.equal("arrowFunction")
                })
            })
            describe("let", () => {
                it("let a = () => {}", () => {
                    const prog = `let a = () => {}`
                    const block = esprima.parse(prog).body[0]
                    expect(getTypeOfBlock(block)).to.be.equal("arrowFunction")
                })
                it("let b = function() {}", () => {
                    const prog = `let b = function() {}`
                    const block = esprima.parse(prog).body[0]
                    expect(getTypeOfBlock(block)).to.be.equal("arrowFunction")
                })
            })
            describe("var", () => {
                it("var a = () => {}", () => {
                    const prog = `var a = () => {}`
                    const block = esprima.parse(prog).body[0]
                    expect(getTypeOfBlock(block)).to.be.equal("arrowFunction")
                })
                it("var b = function() {}", () => {
                    const prog = `var b = function() {}`
                    const block = esprima.parse(prog).body[0]
                    expect(getTypeOfBlock(block)).to.be.equal("arrowFunction")
                })
            })
        })
        describe("Call function", () => {
            describe("Anonyme", () => {
                it("(function() {}) ()", () => {
                    const prog = `(function() {}) ()`
                    const block = esprima.parse(prog).body[0]
                    expect(getTypeOfBlock(block)).to.be.equal("callFunction")
                })
                it("a()", () => {
                    const prog = `a()`
                    const block = esprima.parse(prog).body[0]
                    expect(getTypeOfBlock(block)).to.be.equal("callFunction")
                })
            })
        })
    })

    describe("Variable", () => {
        describe("Declaration", () => {
            it("const a = 3", () => {
                const prog = "const a = 3"
                const block = esprima.parse(prog).body[0]
                expect(getTypeOfBlock(block)).to.be.equal("declarationVariable")
            })
            it("let a = 3", () => {
                const prog = "let a = 3"
                const block = esprima.parse(prog).body[0]
                expect(getTypeOfBlock(block)).to.be.equal("declarationVariable")
            })
            it("var a = 3", () => {
                const prog = "var a = 3"
                const block = esprima.parse(prog).body[0]
                expect(getTypeOfBlock(block)).to.be.equal("declarationVariable")
            })
        })
    })

    describe("Assignement", () => {
        it("a = 3", () => {
            const prog = "a = 3"
            const block = esprima.parse(prog).body[0]
            expect(getTypeOfBlock(block)).to.be.equal("assignementVariable")
        })
    })
})