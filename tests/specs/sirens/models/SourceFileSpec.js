const fs = require('fs')
const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')
const esprima = require('esprima')
const Sirens = require('../../../../src/Sirens')

const fileContents = `
class Sample {
    getName() {
        return this.name
    }
}

function modFunction() {
    return 'A standalone function'
}

class AnotherSample {
    constructor() {
        this.name = ''
    }
}

module.exports = Sample`

const filename = 'tests/samples/index.js'

const absentFilename = 'tests/samples/absentFile.js'

const sourceFile = new SourceFile({ filepath: filename })

const absentSourceFile = new SourceFile({ filepath: absentFilename })

describe('When using a SourceFile', () => {
    it('gets the file path', () => {
        expect(sourceFile.getFilePath()) .to .match(/^.*tests[/]samples[/]index.js$/)
    })

    it('gets the file name', () => {
        expect(sourceFile.getFileName()) .to .equal('index.js')
    })

    it('gets the file contents', () => {
        expect(sourceFile.getFileContents()) .to .equal(fileContents)
    })

    it('gets the classes defined in the module', () => {
        const classes = sourceFile.getClassDefinitions()

        expect(classes.length) .to .equal(2)

        expect(classes[0].getClassName()) .to .equal('Sample')
        expect(classes[1].getClassName()) .to .equal('AnotherSample')
    })

    it('gets all the functions defined in the module', () => {
        const functions = sourceFile.getFunctionDefinitions()

        expect(functions.length) .to .equal(3)

        expect(functions[0].getFunctionName()) .to .equal('getName')
        expect(functions[1].getFunctionName()) .to .equal('modFunction')
        expect(functions[2].getFunctionName()) .to .equal('constructor')
    })

    it('answers if the file exists', () => {
        expect(sourceFile.existsFile()) .to .be .true
        expect(absentSourceFile.existsFile()) .to .be .false
    })

    describe('when searching for a function definition at a file position', () => {
        it('finds the function definition starting at a line and column number', () => {
            const functionDefinition = sourceFile.getFunctionAt({line: 13, column: 4})

            expect(functionDefinition.getFunctionName()) .to .equal('constructor')
        })

        it('finds the function definition starting at a line and beyond the column number', () => {
            const functionDefinition = sourceFile.getFunctionAt({line: 13, column: 5})

            expect(functionDefinition.getFunctionName()) .to .equal('constructor')
        })

        it('finds the function definition starting before the line', () => {
            const functionDefinition = sourceFile.getFunctionAt({line: 14, column: 3})

            expect(functionDefinition.getFunctionName()) .to .equal('constructor')
        })

        it('finds the function definition ending in the line and before the ending column', () => {
            const functionDefinition = sourceFile.getFunctionAt({line: 15, column: 4})

            expect(functionDefinition.getFunctionName()) .to .equal('constructor')
        })

        it('does not find the function definition in a line before the starting line', () => {
            const functionDefinition = sourceFile.getFunctionAt({line: 12, column: 1})

            expect(functionDefinition.getFunctionName()) .to .equal('Function not found')
        })

        it('does not find the function definition in the staring line but before the starting column', () => {
            const functionDefinition = sourceFile.getFunctionAt({line: 13, column: 3})

            expect(functionDefinition.getFunctionName()) .to .equal('Function not found')
        })

        it('does not find the function definition ending in the line but after the ending column', () => {
            const functionDefinition = sourceFile.getFunctionAt({line: 15, column: 5})

            expect(functionDefinition.getFunctionName()) .to .equal('Function not found')
        })

        it('does not find the function definition ending after the line', () => {
            const functionDefinition = sourceFile.getFunctionAt({line: 16, column: 1})

            expect(functionDefinition.getFunctionName()) .to .equal('Function not found')
        })
    })
})

describe('When using a FunctionDefinition', () => {
    it('gets the starting line number of the function definition', () => {

        const functions = sourceFile.getFunctionDefinitions()

        expect(functions[0].getStartingPosition().line) .to .equal(3)
        expect(functions[1].getStartingPosition().line) .to .equal(8)
        expect(functions[2].getStartingPosition().line) .to .equal(13)
    })

    it('gets the starting column number of the function definition', () => {

        const functions = sourceFile.getFunctionDefinitions()

        expect(functions[0].getStartingPosition().column) .to .equal(4)
        expect(functions[1].getStartingPosition().column) .to .equal(0)
        expect(functions[2].getStartingPosition().column) .to .equal(4)
    })

    it('gets the ending line number of the function definition', () => {

        const functions = sourceFile.getFunctionDefinitions()

        expect(functions[0].getEndingPosition().line) .to .equal(5)
        expect(functions[1].getEndingPosition().line) .to .equal(10)
        expect(functions[2].getEndingPosition().line) .to .equal(15)
    })

    it('gets the ending column number of the function definition', () => {

        const functions = sourceFile.getFunctionDefinitions()

        expect(functions[0].getEndingPosition().column) .to .equal(5)
        expect(functions[1].getEndingPosition().column) .to .equal(1)
        expect(functions[2].getEndingPosition().column) .to .equal(5)
    })

    it('gets the original source code', () => {

        const functions = sourceFile.getFunctionDefinitions()

        let sourceCode = functions[0].getOriginalSourceCode({cr: "\n"})

        const exepctedSourceCode = `getName() {
        return this.name
    }`

        expect(sourceCode) .to .equal(exepctedSourceCode)
    })
})

describe('When using an AbsentFunctionDefinition', () => {
    it('the starting and ending positions in the file are undefined', () => {

        const functionDefinition = sourceFile.getFunctionAt({line: 100, column: 0})

        expect(functionDefinition.getStartingPosition().line) .to .be .undefined
        expect(functionDefinition.getEndingPosition().line) .to .be .undefined
        expect(functionDefinition.getStartingPosition().column) .to .be .undefined
        expect(functionDefinition.getEndingPosition().column) .to .be .undefined
    })
})