const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const filename = 'tests/samples/index.js'

const sourceFile = SourceFile.new({ filepath: filename })

const classDefinition = sourceFile.getClassDefinitions()[0]

const footerDefinition = classDefinition.getFooterDefinition()

describe('When using an ClassDefinitionFooter', () => {
    it('gets the source code as it is writen in the source file', () => {
        const expectedSourceCode = 
`function modFunction() {
    return 'A standalone function'
}

class AnotherSample {
    constructor() {
        this.name = ''
    }
}

module.exports = Sample`

        expect( footerDefinition.getSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })

    it('gets the formatted source code', () => {
        const expectedSourceCode = 
`function modFunction() {
    return 'A standalone function'
}

class AnotherSample {
    constructor() {
        this.name = ''
    }
}

module.exports = Sample`

        expect( footerDefinition.getFormattedSourceCode({ cr: "\n" }) ) .to .equal(expectedSourceCode)
    })
})