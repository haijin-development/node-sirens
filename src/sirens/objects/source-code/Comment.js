const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')
const JsStatementProtocol = require('../../protocols/JsStatementProtocol')
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
        this.implements = [JsStatementProtocol]
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

    writeFormattedContents(formattedComment) {
        const commentText = SourceCodeText.new({ text: this.getSourceCode() })
        const indentationCount = commentText.getIndentationCount()
        const indentationChar = commentText.getIndentationChar()

        const sourceCodeText = SourceCodeText.new({ text: this.getContents() })
        formattedComment = sourceCodeText.unformatBackText( formattedComment )

        const comment =
            '/*' + 
            formattedComment +
            `\n` + indentationChar.repeat( indentationCount ) + '*/'


        this.writeRawSourceCode({ rawSourceCode: comment })
    }

}

module.exports = Classification.define(Comment)
