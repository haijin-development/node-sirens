const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const filename = 'tests/samples/index.js'

const sourceFile = SourceFile.new({ filepath: filename })

const classDefinition = sourceFile.getClassDefinitions()[0]

describe('When using a ClassDefinition', () => {
    it('gets the class name', () => {
        expect( classDefinition.getClassName() ) .to .equal('Sample')
    })

    it('gets the class header', () => {
        const header = classDefinition.getHeaderDefinition()

        const sourceCode = header.getSourceCode({ cr: "\n" })

        const expectedSourceCode = `const path = require('path')`

        expect( sourceCode ) .to .equal( expectedSourceCode )
    })

    it('gets the functions definitions', () => {
        const functionDefinitions = classDefinition.getFunctionDefinitions()

        expect( functionDefinitions.length ) .to .equal(1)
        expect( functionDefinitions[0].getFunctionName() ) .to .equal('getName')
    })

    it('gets the class footer', () => {
        const header = classDefinition.getFooterDefinition()

        const sourceCode = header.getSourceCode({ cr: "\n" })

        const expectedSourceCode =

`function modFunction() {
    return 'A standalone function'
}

class AnotherSample {
    constructor() {
        this.name = ''
    }
}

module.exports = Sample`

        expect( sourceCode ) .to .equal( expectedSourceCode )
    })
})