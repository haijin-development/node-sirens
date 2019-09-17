const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const filename = 'tests/samples/index.js'

const sourceFile = SourceFile.new({ filepath: filename })

const absentFunctionDefinition = sourceFile.getFunctionAt({line: 100, column: 0})

describe('When using an AbsentFunctionDefinition', () => {
    it('gets a default function name', () => {
        expect( absentFunctionDefinition.getFunctionName() ) .to .equal('Function not found')
    })

    it('gets a default function name', () => {
        expect( absentFunctionDefinition.getSourceCode({ cr: "\n" }) ) .to .equal('Source code not found')
    })

    it('the starting and ending positions in the file are undefined', () => {
        expect( absentFunctionDefinition.getStartingPosition().line ) .to .be .undefined
        expect( absentFunctionDefinition.getEndingPosition().line ) .to .be .undefined
        expect( absentFunctionDefinition.getStartingPosition().column ) .to .be .undefined
        expect( absentFunctionDefinition.getEndingPosition().column ) .to .be .undefined
    })
})