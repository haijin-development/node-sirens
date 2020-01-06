const Classification = require('../../../../../src/O').Classification
const JsFileObject = require('./JsFileObject')

class JsFileStructure {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsFileObject]
    }

    isJsFileStructure() {
        return true
    }

    getFileObjectType() {
        return 'jsFile'
    }

    getFileObjectDescription() {
        return `File ${ this.getFileName() }`
    }

    getFileName() {
        return this.getSourceFile().getFileName()
    }
}

module.exports = Classification.define(JsFileStructure)
