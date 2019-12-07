const Classification = require('../../../O').Classification
const JsFileSection = require('./JsFileSection')

class JsFile {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsFileSection]
    }

    isJsFile() {
        return true
    }

    getSectionDescription() {
        return `File ${ this.getFileName() }`
    }

    getFileName() {
        return this.getSourceFile().getFileName()
    }
}

module.exports = Classification.define(JsFile)
