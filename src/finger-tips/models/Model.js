const Classification = require('../../O').Classification
const ObjectWithNamespace = require('../../O').ObjectWithNamespace

class Model {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithNamespace]
    }
}

module.exports = Classification.define(Model)