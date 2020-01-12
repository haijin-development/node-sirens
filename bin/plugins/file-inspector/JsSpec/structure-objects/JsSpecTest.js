const Classification = require('../../../../../src/O').Classification
const JsFileObject = require('../../../../../src/sirens/objects/js-parser/structure-objects/JsFileObject')
const Resource = require('../../../../../src/sirens/objects/Resource')

class JsSpecTest {
    /// Definition

    static definition() {
        this.instanceVariables = ['testDescription']
        this.assumes = [JsFileObject]
    }

    isJsSpecObject() {
        return true
    }

    isJsSpecTest() {
        return true
    }

    getFileObjectType() {
        return 'jsSpecTest'
    }

    setTestDescription(text) {
        this.testDescription = text
    }

    getTestDescription() {
        return this.testDescription
    }

    // Source code

    getFileObjectDescription() {
        return `it(...)`
    }

    getIcon() {
        return Resource.image.test
    }

    /*
        Method(`
            Returns a human readable text describing this object.

            This method adds polimorphism with other JsSpecObjects.
        `)
    */
    getDisplayString() {
        return this.getTestDescription()
    }

    /*
        Method(`
            Writes the given specContents to the JsSpecTest Location
            preserving the original indentation.
        `)
    */
    writeContents({ specContents: specContents }) {
        const contentsIndentation = this.getContentsIndentation()

        const sourceCodeText = this.namespace().SourceCodeText.new({
            text: this.getContents()
        })

        sourceCodeText.setIndentationChar( contentsIndentation.char )
        sourceCodeText.setIndentationLevel( contentsIndentation.level )

        const plainContents =
            sourceCodeText.unformatBackText( specContents )

        this.writePlainContents({ contents: plainContents })
    }
}

module.exports = Classification.define(JsSpecTest)
