const Classification = require('../../../../src/O').Classification
const FileObject = require('../../../../src/sirens/objects/file-structure/FileObject')
const Resource = require('../../../../src/sirens/objects/Resource')

class JsonContent {
    /// Definition

    static definition() {
        this.instanceVariables = ['jsonObject']
        this.assumes = [FileObject]
    }

    setJsonObject({ jsonObject: jsonObject }) {
        this.jsonObject = jsonObject
    }

    getJsonObject() {
        return this.jsonObject
    }

    isJsonContent() {
        return true
    }

    getFileObjectType() {
        return 'jsonContent'
    }

    getFileObjectDescription() {
        return 'json object'
    }

    getIcon() {
        return Resource.image.object
    }
}

module.exports = Classification.define(JsonContent)
