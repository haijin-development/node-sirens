const Classification = require('../../../../O').Classification

class DocumentationReturnValue {
    /// Definition

    static definition() {
        this.instanceVariables = ['description']
    }

    /// Initializing

    initialize({ description: description } = {}) {
        if( description === undefined ) { description = '' }

        this.description = description
    }

    /// Accessors

    getDescription() {
        return this.description
    }

    setDescription(description) {
        this.description = description
    }
}

module.exports = Classification.define(DocumentationReturnValue)
