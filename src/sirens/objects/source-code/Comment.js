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

    /*
     * Returns the name of the class.
     */
    getString() {
        const commentNode = this.getFirstNode()

        return commentNode.value
    }

    getFormattedString() {
        let originalSourceCode = this.getString()

        const sourceCodeText = SourceCodeText.new({ text: originalSourceCode })

        return sourceCodeText.getFormattedText()
    }
}

module.exports = Classification.define(Comment)
