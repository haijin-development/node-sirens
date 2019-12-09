const Classification = require('../../../O').Classification
const FileObject = require('./FileObject')
const SourceCodeText = require('../SourceCodeText')

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
}

module.exports = Classification.define(JsFileObject)
