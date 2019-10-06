const expect = require('chai').expect
const ClassSourceFile = require('../../../../src/sirens/objects/ClassSourceFile')

const filename = 'tests/samples/index.js'

const sourceFile = ClassSourceFile.new({ filepath: filename })

const footerDefinition = sourceFile.getFooter()

describe('When using an ClassDefinitionFooter', () => {
    it('gets the source code as it is writen in the source file', () => {
        const expectedSourceCode = 
`module.exports = Sample`

        expect( footerDefinition.getSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })

    it('gets the formatted source code', () => {
        const expectedSourceCode = 
`module.exports = Sample`

        expect( footerDefinition.getFormattedSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })
})