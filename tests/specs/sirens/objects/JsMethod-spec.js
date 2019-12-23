const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')
const SourceFileStructureParser = require('../../../../src/sirens/objects/SourceFileStructureParser')

const filename = 'tests/samples/functions-sample.js'

const sourceFile = SourceFile.new({ filepath: filename })
const sourceFileParser = SourceFileStructureParser.new()
const jsFile = sourceFileParser.parseSourceFile({ sourceFile: sourceFile })
const methods = jsFile.getMethods()

describe('When using a Function', () => {
    it('gets the methods name', () => {
        expect( methods[0].getMethodName() ) .to .equal('getName')
    })

    describe('when gettings its parameters', () => {

        it('gets empty parameters', () => {
            expect( methods[0].getMethodParams() ) .to .eql( [] )
        })

        it('gets one positional parameter', () => {
            expect( methods[1].getMethodParams() ) .to .eql([
                'name'
            ])
        })

        it('gets one named parameter', () => {
            expect( methods[2].getMethodParams() ) .to .eql([
                '{ name: name, lastName: lastName }'
            ])
        })

        it('gets a mixed of positional and named parameter', () => {
            expect( methods[3].getMethodParams() ) .to .eql([
                '{ name: name, lastName: lastName }',
                'closure',
            ])
        })

        it('gets an elipsis params list', () => {
            expect( methods[4].getMethodParams() ) .to .eql([
                'name',
                '...params',
            ])
        })

    })

    it('gets the source code as it is writen in the source file', () => {
        const expectedSourceCode = 
`function getName() {
        return this.name
    }`
        expect( methods[0].getContents() ) .to .equal(expectedSourceCode)
    })

    it('gets the formatted source code', () => {
        const expectedSourceCode = 
`function getName() {
    return this.name
}`
        expect( methods[0].getFormattedSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })
})