const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const filename = 'tests/samples/index.js'

const sourceFile = SourceFile.new({ filepath: filename })

const classDefinitions = sourceFile.getClassDefinitions()

describe('When using an ClassDefinitionHeader', () => {
    it('gets the source code of the first class as it is writen in the source file', () => {

        const headerDefinition = classDefinitions[0].getHeaderDefinition()

        const expectedSourceCode = 
`const path = require('path')`

        expect( headerDefinition.getSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })

    it('gets the formatted source code of the first class defined in the file', () => {
        const headerDefinition = classDefinitions[0].getHeaderDefinition()

        const expectedSourceCode = 
`const path = require('path')`

        expect( headerDefinition.getFormattedSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })

    it('gets the source code of the second class as it is writen in the source file', () => {

        const headerDefinition = classDefinitions[1].getHeaderDefinition()

        const expectedSourceCode = 
`function modFunction() {
    return 'A standalone function'
}`

        expect( headerDefinition.getSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })

    it('gets the formatted source code of the second class defined in the file', () => {
        const headerDefinition = classDefinitions[1].getHeaderDefinition()

        const expectedSourceCode = 
`function modFunction() {
    return 'A standalone function'
}`

        expect( headerDefinition.getFormattedSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })
})