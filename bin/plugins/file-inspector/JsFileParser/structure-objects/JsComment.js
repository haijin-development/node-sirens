const Classification = require('../../../../../src/O').Classification
const FileObject = require('../../../../../src/sirens/objects/file-structure/FileObject')
const SourceCodeText = require('../../../../../src/sirens/objects/SourceCodeText')

class JsComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FileObject]
    }

    getFileObjectType() {
        return 'jsComment'
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

    /*
        Method(`
            Writes the given contents to the FileObject location without modifying
            the contents in any way.
        `)
    */
    writePlainContents({ contents: comment }) {
        this.previousClassificationDo( () => {
            this.writePlainContents({ contents: comment })
        })
    }

    writeContents({ commentContents: commentContents, outerIndentation: outerIndentation }) {
        const innerIndentation = this.getInnerIndentation()

        const sourceCodeText = SourceCodeText.new({ text: this.getContents() })

        sourceCodeText.setIndentationChar( innerIndentation.char )
        sourceCodeText.setIndentationLevel( innerIndentation.level )

        const unformattedCommentContents = sourceCodeText.unformatBackText( commentContents )

        const comment =
            '/*' + 
            unformattedCommentContents +
            `\n` + outerIndentation.char.repeat( outerIndentation.level ) + '*/' +
            `\n`

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
