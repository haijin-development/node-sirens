const Classification = require('../../../O').Classification
const FileSection = require('./FileSection')
const SourceCodeText = require('../SourceCodeText')

class JsFileSection {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FileSection]
    }

    getClasses() {
        return this.getChildSections().filter( (section) => {
            return section.respondsTo( 'isJsClass' )
        })
    }

    getMethods() {
        return this.getChildSections().filter( (section) => {
            return section.respondsTo( 'isJsMethod' )
        })
    }

    getFormattedSourceCode() {
        let originalSourceCode = this.getContents()

        const sourceCodeText = SourceCodeText.new({ text: originalSourceCode })

        return sourceCodeText.getFormattedText()
    }
}

module.exports = Classification.define(JsFileSection)
