const expect = require('chai').expect
const Sirens = require('../../../../src/Sirens')

const namespace = Sirens.namespace()

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

const sourceFile = namespace.SourceFile.new({ path: filename })

const absentSourceFile = namespace.SourceFile.new({ path: absentFilename })

describe('When using a SourceFile', () => {
    it('gets the file path', () => {
        expect(sourceFile.getPath()) .to .match(/^.*tests[/]samples[/]index.js$/)
    })

    it('gets the file name', () => {
        expect(sourceFile.getFileName()) .to .equal('index.js')
    })

    it('gets the file contents', () => {
        expect(sourceFile.readFileContents()) .to .equal(fileContents)
    })

    it('answers if the file exists', () => {
        expect(sourceFile.exists()) .to .be .true
        expect(absentSourceFile.exists()) .to .be .false
    })
})