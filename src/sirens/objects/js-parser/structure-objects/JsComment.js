const Classification = require('../../../../../src/O').Classification
const FileObject = require('../../../../../src/sirens/objects/file-structure/FileObject')
const SourceCodeText = require('../../../../../src/sirens/objects/SourceCodeText')
const Resource = require('../../../../../src/sirens/objects/Resource')

class JsComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FileObject]
    }

    getFileObjectType() {
        return 'jsComment'
    }

    getIcon() {
        return Resource.image.blockComment
    }

    getBodyContents() {
        let originalSourceCode = this.getUnformattedBodyContents()

        const sourceCodeText = SourceCodeText.new({ text: originalSourceCode })

        return sourceCodeText.getFormattedText()        
    }

    getFileObjectDescription() {
        return `Comment`
    }

    getUnformattedBodyContents() {
        let originalSourceCode = this.getContents().trim()

        return originalSourceCode.slice(2, -2)
    }

    writeContents({ commentContents: commentContents, outerIndentation: outerIndentation }) {
        const innerIndentation = this.getInnerIndentation()

        const sourceCodeText = SourceCodeText.new({ text: this.getContents() })

        sourceCodeText.setIndentationChar( innerIndentation.char )
        sourceCodeText.setIndentationLevel( innerIndentation.level )

        const unformattedCommentContents = sourceCodeText.unformatBackText( commentContents )

        let comment =
            '/*' +
            `\n` +
            unformattedCommentContents +
            `\n` + outerIndentation.char.repeat( outerIndentation.level ) + '*/'

        // If the comment did have text append a cr to make the method or class
        // definition to begin in the next line. Otherwise the method or class
        // is in a new line already.
        if( ! this.hasText() ) {
            comment += `\n`
        }

        this.writePlainContents({ contents: comment })
    }

    getInnerIndentation() {
        const originalContents = this.getUnformattedBodyContents()

        const commentText = SourceCodeText.new({ text: originalContents })

        const indentationLevel = commentText.getIndentationLevel()
        const indentationChar = commentText.getIndentationChar()

        return {
            level: indentationLevel,
            char: indentationChar,
        }
    }
}

module.exports = Classification.define(JsComment)
