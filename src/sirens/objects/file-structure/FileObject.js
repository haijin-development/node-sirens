const Classification = require('../../../O').Classification
const Protocol = require('../../../O').Protocol
const ObjectWithNamespace = require('../../../O').ObjectWithNamespace
const StringStream = require('../../../O').StringStream
const SourceCodeText = require('..//SourceCodeText')
const FileObjectLocation = require('./FileObjectLocation')
const Resource = require('../Resource')

class FileObject {
    /// Definition

    static definition() {
        this.instanceVariables = ['childObjects', 'fileLocation']
        this.assumes = [ObjectWithNamespace]
    }

    afterInstantiation() {
        this.childObjects = []
    }

    getSourceFile() {
        return this.fileLocation.getSourceFile()
    }

    getFileLocation() {
        return this.fileLocation
    }

    setFileLocation({ sourceFile: sourceFile, startPos: startPos, endPos: endPos }) {
        this.fileLocation = FileObjectLocation.new({
            sourceFile: sourceFile,
            startPos: startPos,
            endPos: endPos,
        })
    }

    addChildObject(fileObject) {
        this.addChildrenObjects([ fileObject ])
    }

    addChildrenObjects(fileObjects) {
        for( const child of fileObjects ) {
            this.childObjects.push( child )
        }
    }

    getChildObjects() {
        return this.childObjects.slice()
    }

    getChildObjectAt({ index: index }) {
        return this.childObjects[index]
    }

    getContents() {
        return this.getSourceFile().getPartialContents({
            fromStartPos: this.fileLocation.getStartPos(),
            toEndPos: this.fileLocation.getEndPos(),
        }) 
    }

    // Querying

    getFileObjectType() {
        return 'fileObject'
    }

    getFileObjectDescription() {
        return 'file'
    }

    hasText() {
        return this.getContents().trim() !== ''
    }

    /*
        Method(`
            Writes the given contents to the FileObject location without modifying
            the contents in any way. 
        `)
    */
    writePlainContents({ contents: contents }) {
        const sourceFile = this.getSourceFile()

        const fileContentsBefore = sourceFile.getPartialContents({
            fromStartPos: 0,
            toEndPos: this.fileLocation.getStartPos() - 1,
        })

        const fileContentsAfter = sourceFile.getPartialContents({
            fromStartPos: this.fileLocation.getEndPos() + 1,
            toEndPos: 'eof',
        })

        const newFileContents = StringStream.new()

        newFileContents.append({ string: fileContentsBefore, if: fileContentsBefore !== '' })

        newFileContents.append({ string: contents, if: contents !== '' })

        newFileContents.append({ string: fileContentsAfter, if: fileContentsAfter !== '' })

        sourceFile.writeFileContents( newFileContents.getString() )
    }

    getContentsIndentation() {
        const originalContents = this.getContents()

        const contentsText = SourceCodeText.new({ text: originalContents })

        const indentationLevel = contentsText.getIndentationLevel()
        const indentationChar = contentsText.getIndentationChar()

        return {
            level: indentationLevel,
            char: indentationChar,
        }
    }

    // Displaying

    getIcon() {
        return Resource.image.haiku
    }
}

module.exports = Classification.define(FileObject)
