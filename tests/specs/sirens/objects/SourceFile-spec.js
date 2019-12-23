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

    it('answers if the file exists', () => {
        expect(sourceFile.existsFile()) .to .be .true
        expect(absentSourceFile.existsFile()) .to .be .false
    })
})