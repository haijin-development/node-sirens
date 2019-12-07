const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const filename = 'tests/samples/class-definition.js'

const sourceFile = SourceFile.new({ filepath: filename })

const classDefinition = sourceFile.getFileSections()[0]

describe('When using a ClassDefinition', () => {
    it('gets the class name', () => {
        expect( classDefinition.getClassName() ) .to .equal('Sample')
    })

    it('gets the class comment', () => {
        const comment = classDefinition.getClassComment()

        const expectedComment =
`
* A class comment
* for Sample.
`

        expect( comment.getBodyContents() ) .to .equal( expectedComment )
    })

    it('gets the functions definitions', () => {
        const methods = classDefinition.getMethods()

        expect( methods.length ) .to .equal(1)
        expect( methods[0].getMethodName() ) .to .equal('getName')
    })
})