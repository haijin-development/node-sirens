const Classification = require('../../../O').Classification

class UknownFileStructure {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile']
    }

    getFileObjectDescription() {
        return 'Uknown file object'
    }

    getChildObjects() {
        return []
    }

    getFileObjectType() {
        return 'uknown'
    }

    getContents() {
        return ''
    }
}

module.exports = Classification.define(UknownFileStructure)
