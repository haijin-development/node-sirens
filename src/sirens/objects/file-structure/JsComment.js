const Classification = require('../../../O').Classification
const FileObject = require('./FileObject')
const SourceCodeText = require('../SourceCodeText')

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

    writeFormattedContents({ commentContents: commentContents, outerIndentation: outerIndentation }) {
        const innerIndentation = this.getInnerIndentation()

        const sourceCodeText = SourceCodeText.new({ text: this.getContents() })

        sourceCodeText.setIndentationChar( innerIndentation.char )
        sourceCodeText.setIndentationLevel( innerIndentation.level )

        const unformattedCommentContents = sourceCodeText.unformatBackText( commentContents )

        const comment =
            '/*' + 
            unformattedCommentContents +
            `\n` + outerIndentation.char.repeat( outerIndentation.level ) + '*/'

        this.writeContents({ contents: comment })
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
