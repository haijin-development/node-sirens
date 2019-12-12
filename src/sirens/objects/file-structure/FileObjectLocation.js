const Classification = require('../../../O').Classification
const PositionInFile = require('./PositionInFile')

class FileObjectLocation {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile', 'startPos', 'endPos']
    }

    /// Initializing

    initialize({ sourceFile: sourceFile,
        startLine: startLine, startColumn: startColumn,
        endLine: endLine, endColumn: endColumn,
    }) {
        this.sourceFile = sourceFile
        this.startPos = PositionInFile.new({ line: startLine, column: startColumn })
        this.endPos = PositionInFile.new({ line: endLine, column: endColumn })
    }

    setSourceFile(sourceFile) {
        this.sourceFile = sourceFile
    }

    getSourceFile() {
        return this.sourceFile
    }

    setStartPos({ line: line, column: column }) {
        this.startPos = PositionInFile.new({ line: line, column: column })
    }

    getStartPos() {
        return this.startPos
    }

    setEndPos({ line: line, column: column }) {
        this.endPos = PositionInFile.new({ line: line, column: column })
    }

    getEndPos() {
        return this.endPos
    }
}

module.exports = Classification.define(FileObjectLocation)
