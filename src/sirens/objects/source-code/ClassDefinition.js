const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')
const JsStatementProtocol = require('../../protocols/JsStatementProtocol')

/*
 * The definition of a javascript class.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class ClassDefinition {
    /// Definition

    static definition() {
        this.instanceVariables = ['header', 'comment', 'declaration']
        this.assumes = []
        this.implements = [JsStatementProtocol]
    }

    /// Initializing

    initialize({ header: header, comment: comment, declaration: declaration }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.declaration = declaration
        this.comment = comment
        this.header = header
    }

    /// Accessing

    getSourceFile() {
        return this.declaration.getSourceFile()
    }

    getDeclaration() {
        return this.declaration
    }

    getHeader() {
        return this.header
    }

    getComment() {
        return this.comment
    }

    getLastNode() {
        return this.declaration.getLastNode()
    }

    /// Querying

    getClassName() {
        return this.declaration.getClassName()
    }

    getMethods() {
        return this.declaration.getMethods()
    }

    getClassSourceCode() {
        return this.declaration.getSourceCode()
    }

    getStartingLine() {
        return this.header.getStartingLine()
    }

    getStartingColumn() {
        return this.header.getStartingColumn()
    }

    getEndingLine() {
        return this.declaration.getEndingLine()
    }

    getEndingColumn() {
        return this.declaration.getStartingColumn()
    }

    /// Actions

    /*
     * Returns all the class definitions in the file.
     */
    reload() {
        const className = this.getClassName()

        const sourceFile = this.getSourceFile()

        sourceFile.reload()

        const classDefinitions = sourceFile.getClassDefinitions()

        const newClassDefinition = classDefinitions.find( (eachClassDefinition) => {
            return eachClassDefinition.getClassName() === className
        })

        this.declaration = newClassDefinition.getDeclaration()
        this.comment = newClassDefinition.getComment()
        this.header = newClassDefinition.getHeader()
    }

}

module.exports = Classification.define(ClassDefinition)
