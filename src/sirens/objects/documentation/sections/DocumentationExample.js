const Classification = require('../../../../O').Classification

class DocumentationExample {
    /// Definition

    static definition() {
        this.instanceVariables = ['description', 'code']
    }

    /// Initializing

    initialize({ description: description, code: code } = {}) {
        if( description === undefined ) { description = '' }
        if( code === undefined ) { code = '' }

        this.description = description
        this.code = code
    }

    /// Accessors

    getDescription() {
        return this.description
    }

    setDescription(description) {
        this.description = description
    }

    getCode() {
        return this.code
    }

    setCode(code) {
        this.code = code
    }
}

module.exports = Classification.define(DocumentationExample)
