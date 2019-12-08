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

    getFileObjectDescription() {
        return 'Plain text'
    }

}

module.exports = Classification.define(TextualContent)
