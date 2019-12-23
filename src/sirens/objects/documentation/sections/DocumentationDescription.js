const Classification = require('../../../../O').Classification

class DocumentationDescription {
    /// Definition

    static definition() {
        this.instanceVariables = ['text']
    }

    /// Initializing

    initialize({ text: text } = {}) {
        if( text === undefined ) { text = '' }

        this.text = text
    }

    /// Asking

    isBlank() {
        return this.text.trim() === ''
    }

    isNotBlank() {
        return ! this.isBlank()
    }

    /// Accessors

    getText() {
        return this.text
    }

    setText(text) {
        this.text = text
    }
}

module.exports = Classification.define(DocumentationDescription)
