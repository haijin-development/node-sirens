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
    it('gets the class definition', () => {
        const classDefinition = sourceFile.getClassDefinition()

        expect( classDefinition.isBehavingAs(ClassDefinition) ) .to .be .true
        expect( classDefinition.getClassName() ) .to .equal('Sample')
    })
})