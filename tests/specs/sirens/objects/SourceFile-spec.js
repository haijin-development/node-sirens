const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const fileContents = '' +
`const path = require('path')

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

const sourceFile = SourceFile.new({ filepath: filename })

const absentSourceFile = SourceFile.new({ filepath: absentFilename })

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

    it('gets the top level sections defined in the module', () => {
        const sections = sourceFile.getFileSections()

        expect(sections.length) .to .equal(3)

        expect(sections[0].getSectionDescription()) .to .equal('Class Sample')
        expect(sections[1].getSectionDescription()) .to .equal('function modFunction(...)')
        expect(sections[2].getSectionDescription()) .to .equal('Class AnotherSample')
    })

    it('answers if the file exists', () => {
        expect(sourceFile.existsFile()) .to .be .true
        expect(absentSourceFile.existsFile()) .to .be .false
    })
})

describe('When using a Function', () => {
    it('gets the starting line number of the function definition', () => {

        const functions = sourceFile.getFunctionDefinitions()

        expect(functions[0].getStartPos().getLine()) .to .equal(9)
    })

    it('gets the starting column number of the function definition', () => {

        const functions = sourceFile.getFunctionDefinitions()

        expect(functions[0].getStartPos().getColumn()) .to .equal(0)
    })

    it('gets the ending line number of the function definition', () => {

        const functions = sourceFile.getFunctionDefinitions()

        expect(functions[0].getEndPos().getLine()) .to .equal(11)
    })

    it('gets the ending column number of the function definition', () => {

        const functions = sourceFile.getFunctionDefinitions()

        expect(functions[0].getEndPos().getColumn()) .to .equal(1)
    })

    it('gets the original source code', () => {

        const functions = sourceFile.getFunctionDefinitions()

        let sourceCode = functions[0].getContents()

        const exepctedSourceCode =
`function modFunction() {
    return 'A standalone function'
}`

        expect(sourceCode) .to .equal(exepctedSourceCode)
    })
})