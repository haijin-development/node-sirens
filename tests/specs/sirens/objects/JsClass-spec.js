const expect = require('chai').expect
const Sirens = require('../../../../src/Sirens')

const namespace = Sirens.namespace()

const filename = 'tests/samples/class-definition.js'

const sourceFile = namespace.SourceFile.new({ filepath: filename })
const sourceFileParser = namespace.SourceFileStructureParser.new()
const jsFile = sourceFileParser.parseSourceFile({ sourceFile: sourceFile })
const jsClass = jsFile.getChildObjectAt({ index: 1 })

describe('When using a JsClass', () => {
    it('gets the class name', () => {
        expect( jsClass.getClassName() ) .to .equal('Sample')
    })

    it('gets the class comment', () => {
        const comment = jsClass.getClassComment()

        const expectedComment =
`
Method(\`
    A class comment
    for Sample.
\`)
`

        expect( comment.getBodyContents() ) .to .equal( expectedComment )
    })

    it('gets the methods', () => {
        const methods = jsClass.getMethods()

        expect( methods ) .count .to .equal(1)
        expect( methods[0].getMethodName() ) .to .equal('getName')
    })
})