const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const filename = 'tests/samples/index.js'

const sourceFile = SourceFile.new({ filepath: filename })

const functionDefinition = sourceFile.getFunctionDefinitions()[0]

describe('When using a FunctionDefinition', () => {
    it('gets the function name', () => {
        expect( functionDefinition.getFunctionName() ) .to .equal('getName')
    })

    it('gets the source code as it is writen in the source file', () => {
        const expectedSourceCode = 
`getName() {
        return this.name
    }`
        expect( functionDefinition.getSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })

    it('gets the formatted source code', () => {
        const expectedSourceCode = 
`getName() {
    return this.name
}`
        expect( functionDefinition.getFormattedSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })
})