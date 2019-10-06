const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const filename = 'tests/samples/functions-sample.js'

const sourceFile = SourceFile.new({ filepath: filename })

const functionDefinitions = sourceFile.getFunctionDefinitions()

describe('When using a Function', () => {
    it('gets the function name', () => {
        expect( functionDefinitions[0].getName() ) .to .equal('getName')
    })

    describe('when gettings its parameters', () => {

        it('gets empty parameters', () => {
            expect( functionDefinitions[0].getParams() ) .to .eql( [] )
        })

        it('gets one positional parameter', () => {
            expect( functionDefinitions[1].getParams() ) .to .eql([
                'name'
            ])
        })

        it('gets one named parameter', () => {
            expect( functionDefinitions[2].getParams() ) .to .eql([
                [
                    {
                        'key': 'name',
                        'value': 'name',
                    },
                    {
                        'key': 'lastName',
                        'value': 'lastName',
                    },
                ],
            ])
        })

        it('gets a mixed of positional and named parameter', () => {
            expect( functionDefinitions[3].getParams() ) .to .eql([
                [
                    {
                        'key': 'name',
                        'value': 'name',
                    },
                    {
                        'key': 'lastName',
                        'value': 'lastName',
                    },
                ],
                'closure',
            ])
        })

        it('gets an elipsis params list', () => {
            expect( functionDefinitions[4].getParams() ) .to .eql([
                'name',
                '...params',
            ])
        })

    })

    it('gets the source code as it is writen in the source file', () => {
        const expectedSourceCode = 
`getName() {
        return this.name
    }`
        expect( functionDefinitions[0].getFunctionSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })

    it('gets the formatted source code', () => {
        const expectedSourceCode = 
`getName() {
    return this.name
}`
        expect( functionDefinitions[0].getFunctionFormattedSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })
})