const Classification = require('../../../../../src/O').Classification
const FileObject = require('../../../../../src/sirens/objects/file-structure/FileObject')
const SourceCodeText = require('../../../../../src/sirens/objects/SourceCodeText')
const Resource = require('../../../../../src/sirens/objects/Resource')

class JsFileObject {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FileObject]
    }

    getFileObjectType() {
        return 'JsFileObject'
    }

    getClasses() {
        return this.getChildObjects().filter( (section) => {
            return section.respondsTo( 'isJsClass' )
        })
    }

    getMethods() {
        return this.getChildObjects().filter( (section) => {
            return section.respondsTo( 'isJsMethod' )
        })
    }

    getFormattedSourceCode() {
        let originalSourceCode = this.getContents()

        const sourceCodeText = SourceCodeText.new({ text: originalSourceCode })

        return sourceCodeText.getFormattedText()
    }

    getIcon() {
        return Resource.image.file
    }
}

module.exports = Classification.define(JsFileObject)
