const Classification = require('../../../../O').Classification

class DocumentationParam {
    /// Definition

    static definition() {
        this.instanceVariables = ['name', 'description']
    }

    /// Initializing

    initialize({ name: name, description: description } = {}) {
        if( name === undefined ) { name = '' }
        if( description === undefined ) { description = '' }

        this.name = name
        this.description = description
    }

    /// Accessors

    getName() {
        return this.name
    }

    setName(name) {
        this.name = name
    }

    getDescription() {
        return this.description
    }

    setDescription(description) {
        this.description = description
    }
}

module.exports = Classification.define(DocumentationParam)
