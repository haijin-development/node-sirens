const Classification = require('../../../../O').Classification

class DocumentationTag {
    /// Definition

    static definition() {
        this.instanceVariables = ['label']
    }

    /// Initializing

    initialize({ label: label } = {}) {
        if( label === undefined ) { label = 'Untagged' }

        this.label = label
    }

    /// Accessors

    getLabel() {
        return this.label
    }

    setLabel(label) {
        this.label = label
    }
}

module.exports = Classification.define(DocumentationTag)
