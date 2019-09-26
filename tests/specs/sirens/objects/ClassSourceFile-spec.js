const expect = require('chai').expect
const ClassSourceFile = require('../../../../src/sirens/objects/ClassSourceFile')
const ClassDefinition = require('../../../../src/sirens/objects/js-statements/ClassDefinition')

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

const sourceFile = ClassSourceFile.new({ filepath: filename })

describe('When using a ClassSourceFile', () => {
    it('gets the class footer', () => {
        const header = sourceFile.getFooterDefinition()

        const sourceCode = header.getSourceCode({ cr: "\n" })

        const expectedSourceCode =

`module.exports = Sample`

        expect( sourceCode ) .to .equal( expectedSourceCode )
    })
})