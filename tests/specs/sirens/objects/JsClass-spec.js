const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const filename = 'tests/samples/class-definition.js'

const sourceFile = SourceFile.new({ filepath: filename })

const jsClass = sourceFile.getFileObjects()[1]

describe('When using a JsClass', () => {
    it('gets the class name', () => {
        expect( jsClass.getClassName() ) .to .equal('Sample')
    })

    it('gets the class comment', () => {
        const comment = jsClass.getClassComment()

        const expectedComment =
`
* A class comment
* for Sample.
`

        expect( comment.getBodyContents() ) .to .equal( expectedComment )
    })

    it('gets the methods', () => {
        const methods = jsClass.getMethods()

        expect( methods.length ) .to .equal(1)
        expect( methods[0].getMethodName() ) .to .equal('getName')
    })
})