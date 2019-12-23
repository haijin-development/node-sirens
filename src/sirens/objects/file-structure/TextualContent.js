const Classification = require('../../../O').Classification
const FileObject = require('./FileObject')

class TextualContent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FileObject]
    }

    isTextualContent() {
        return true
    }

    getFileObjectType() {
        return 'textualContent'
    }

    getFileObjectDescription() {
        return 'plain text'
    }

}

module.exports = Classification.define(TextualContent)
