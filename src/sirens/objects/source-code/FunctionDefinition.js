const Classification = require('../../../o-language/classifications/Classification')
const JsStatementProtocol = require('../../protocols/JsStatementProtocol')
const MethodDocumentation = require('../documentation/MethodDocumentation')

/*
 * The definition of a javascript function.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class FunctionDefinition {

    /// Definition

    static definition() {
        this.instanceVariables = ['comment', 'declaration']
        this.assumes = []
        this.implements = [JsStatementProtocol]
        this.classificationBehaviours = [FunctionDefinitionBuilder]
    }

    /// Initializing

    initialize({ comment: comment, declaration: declaration }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.comment = comment
        this.declaration = declaration
    }

    /// Accessing

    getSourceFile() {
        return this.declaration.getSourceFile()
    }

    getSourceCode() {
        return  this.comment.getSourceCode() +
                this.declaration.getSourceCode()
    }

    getFormattedSourceCode() {
        return  this.comment.getFormattedSourceCode() +
                this.declaration.getFormattedSourceCode()
    }

    getComment() {
        return this.comment
    }

    /// Querying

    getName() {
        return this.declaration.getName()
    }

    getParams() {
        return this.declaration.getParams()
    }

    getFunctionSourceCode() {
        return this.declaration.getSourceCode()
    }

    getFunctionFormattedSourceCode() {
        return this.declaration.getFormattedSourceCode()        
    }

    getFunctionSignatureString() {
        return this.declaration.getFunctionSignatureString()
    }

    getStartingLine() {
        return this.comment.getStartingLine()
    }

    getStartingColumn() {
        return this.comment.getStartingColumn()
    }

    getEndingLine() {
        return this.declaration.getEndingLine()
    }

    getEndingColumn() {
        return this.declaration.getEndingColumn()
    }

    getDocumentation() {
        const unformattedComment = this.getComment().getContents()

        return MethodDocumentation.isDocumentationString({
            string: unformattedComment,
            ifTrue: (documentation) => {
                return documentation
            },
            ifFalse: () => {
                const documentation = MethodDocumentation.new()
                documentation.setDescription( unformattedComment )
                return documentation
            },
        })
    }

    /// Writing

    writeFormattedSourceCode({ sourceCode: formattedSourceCode }) {
        throw new Error(`Not implemented`)
    }

    writeRawSourceCode({ rawSourceCode: rawSourceCode }) {
        throw new Error(`Not implemented`)
    }
}

class FunctionDefinitionBuilder {

    from({ file: file, line: line, column: column }) {
        const SourceFile = require('../SourceFile')

        const sourceFile = SourceFile.new({ filepath: file })

        return sourceFile.getFunctionAt({ line: line, column: column })
    }

}

FunctionDefinitionBuilder = Classification.define(FunctionDefinitionBuilder)

module.exports = Classification.define(FunctionDefinition)