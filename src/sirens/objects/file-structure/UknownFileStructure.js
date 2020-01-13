const Classification = require('../../../O').Classification
const Resource = require('../Resource')

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

    getIcon() {
        return Resource.image.undefined
    }
}

module.exports = Classification.define(UknownFileStructure)
