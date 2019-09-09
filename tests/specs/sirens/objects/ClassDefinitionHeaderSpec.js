const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const filename = 'tests/samples/index.js'

const sourceFile = SourceFile.new({ filepath: filename })

const classDefinition = sourceFile.getClassDefinitions()[0]

const headerDefinition = classDefinition.getHeaderDefinition()

describe('When using an ClassDefinitionHeader', () => {
    it('gets the source code as it is writen in the source file', () => {
        const expectedSourceCode = 
`const path = require('path')`

        expect( headerDefinition.getSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })

    it('gets the formatted source code', () => {
        const expectedSourceCode = 
`const path = require('path')`

        expect( headerDefinition.getFormattedSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })
})