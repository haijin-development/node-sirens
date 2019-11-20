const Classification = require('../../../O').Classification
const JsStatement = require('./JsStatement')
const JsCommentProtocol = require('../../protocols/JsCommentProtocol')
const SourceCodeText = require('../SourceCodeText')

/*
 * The definition of a javascript class.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class Comment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsStatement]
        this.implements = [JsCommentProtocol]
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, parseNode: parseNode }) {
        this.previousClassificationDo( () => {
            this.initialize({
                sourceFile: sourceFile,
                parseNodes: [parseNode]
            })
        })
    }

    /// Accessing

    getContents() {
        const commentNode = this.getFirstNode()

        return commentNode.value
    }

    getFormattedContents() {
        let originalSourceCode = this.getContents()

        const sourceCodeText = SourceCodeText.new({ text: originalSourceCode })

        return sourceCodeText.getFormattedText()
    }

    writeFormattedContents({ commentContents: commentContents }) {
        const commentText = SourceCodeText.new({ text: this.getSourceCode() })
        const indentationCount = commentText.getIndentationCount()
        const indentationChar = commentText.getIndentationChar()

        const sourceCodeText = SourceCodeText.new({ text: this.getContents() })
        commentContents = sourceCodeText.unformatBackText( commentContents )

        const comment =
            '/*' + 
            commentContents +
            `\n` + indentationChar.repeat( indentationCount ) + '*/'


        this.writeRawSourceCode({ rawSourceCode: comment })
    }

}

module.exports = Classification.define(Comment)
