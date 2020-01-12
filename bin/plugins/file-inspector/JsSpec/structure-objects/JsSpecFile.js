const Classification = require('../../../../../src/O').Classification
const JsFileObject = require('../../../../../src/sirens/objects/js-parser/structure-objects/JsFileObject')

class JsSpecFile {
    /// Definition

    static definition() {
        this.instanceVariables = ['testDescription']
        this.assumes = [JsFileObject]
    }

    isJsSpecFile() {
        return true
    }

    getFileObjectType() {
        return 'jsSpecFile'
    }

    // Source code

    getFileObjectDescription() {
        return `specs file`
    }
}

module.exports = Classification.define(JsSpecFile)
