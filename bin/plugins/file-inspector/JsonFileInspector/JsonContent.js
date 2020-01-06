const Classification = require('../../../../src/O').Classification
const FileObject = require('../../../../src/sirens/objects/file-structure/FileObject')

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

}

module.exports = Classification.define(JsonContent)
