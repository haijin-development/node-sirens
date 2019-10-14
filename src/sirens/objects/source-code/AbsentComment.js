const Classification = require('../../../o-language/classifications/Classification')
const JsCommentProtocol = require('../../protocols/JsCommentProtocol')
const EmptyJsStatement = require('./EmptyJsStatement')
const IndentedStringStream = require('../../../o-language/classifications/IndentedStringStream')

/*
 * An expected yet missing statement within a js valid file.
 */
class AbsentComment {
    /// Definition

    static definition() {
        this.instanceVariables = ['indentationCount', 'indentationChar']
        this.assumes = [EmptyJsStatement]
        this.implements = [JsCommentProtocol]
    }

    /// Initializing

    initialize({
        sourceFile: sourceFile, lineNumber: lineNumber, columnNumber: columnNumber,
        indentationCount: indentationCount, indentationChar: indentationChar }
    ) {
        this.previousClassificationDo( () => {
            this.initialize({
                sourceFile: sourceFile,
                lineNumber: lineNumber,
                columnNumber: columnNumber
            })
        })

        this.indentationCount = indentationCount
        this.indentationChar = indentationChar
    }

    /// Querying

    getContents() {
        return ''
    }

    getFormattedContents() {
        return ''
    }

    /// Writing

    writeFormattedContents({ commentContents: commentContents }) {
        const stream = IndentedStringStream.new()
        stream.setIndentationCount( this.indentationCount )
        stream.setIndentationChar( this.indentationChar )

        stream.append({ string: '/*' })

        stream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stream.appendLinesIn({ string: commentContents.trim() })

        })

        stream.appendLine({ string:  '*/' })

        stream.appendLine({ string: '' })

        this.writeRawSourceCode({ rawSourceCode: stream.getString() })
    }

}

module.exports = Classification.define(AbsentComment)
