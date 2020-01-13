const Classification = require('../../../O').Classification

class FileObjectLocation {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile', 'startPos', 'endPos']
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, startPos: startPos, endPos: endPos }) {
        this.sourceFile = sourceFile
        this.startPos = startPos
        this.endPos = endPos
    }

    setSourceFile(sourceFile) {
        this.sourceFile = sourceFile
    }

    getSourceFile() {
        return this.sourceFile
    }

    getStartPos() {
        return this.startPos
    }

    getEndPos() {
        return this.endPos
    }
}

module.exports = Classification.define(FileObjectLocation)
