const Classification = require('../../../O').Classification
const FileSection = require('./FileSection')

class TextualContents {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FileSection]
    }

    isTextualContent() {
        return true
    }

    getSectionDescription() {
        return 'Plain text'
    }

}

module.exports = Classification.define(TextualContents)
