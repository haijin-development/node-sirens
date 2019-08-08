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

describe('When using a SourceFile', () => {
    const filename = 'tests/samples/index.js'

    const sourceFile = new SourceFile({ filepath: filename })

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
})