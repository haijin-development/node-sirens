const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const filename = 'tests/samples/class-definition.js'

const sourceFile = SourceFile.new({ filepath: filename })

const classDefinition = sourceFile.getClassDefinitions()[0]

describe('When using a ClassDefinition', () => {
    it('gets the class name', () => {
        expect( classDefinition.getClassName() ) .to .equal('Sample')
    })

    it('gets the class header', () => {
        const header = classDefinition.getHeader()

        const sourceCode = header.getSourceCode({ cr: "\n" })

        const expectedSourceCode = `const path = require('path')`

        expect( sourceCode ) .to .equal( expectedSourceCode )
    })

    it('gets the class comment', () => {
        const comment = classDefinition.getComment()

        const expectedComment =
`
* A class comment
* for Sample.
`

        expect( comment.getFormattedContents() ) .to .equal( expectedComment )
    })

    it('gets the functions definitions', () => {
        const functionDefinitions = classDefinition.getMethods()

        expect( functionDefinitions.length ) .to .equal(1)
        expect( functionDefinitions[0].getName() ) .to .equal('getName')
    })
})