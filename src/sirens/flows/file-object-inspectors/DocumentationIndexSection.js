const Classification = require('../../../O').Classification

class DocumentationIndexSection {
    static definition() {
        this.instanceVariables = ['label', 'items']
    }

    initialize({ label: label, items: items }) {
        this.label = label
        this.items = items
    }

    getLabel() {
        return this.label
    }

    getItems() {
        return this.items
    }
}

module.exports = Classification.define(DocumentationIndexSection)