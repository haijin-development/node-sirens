const Classification = require('../../O').Classification
const SourceFile = require('./SourceFile')
const SourceFileFooter = require('./source-code/SourceFileFooter')
const EmptyJsStatement = require('./source-code/EmptyJsStatement')

/*
 * A source file with a class definition.
 */
class ClassSourceFile {
    /// Definition

    static definition() {
        this.instanceVariables = ['classes', 'footer']
        this.assumes = [SourceFile]
    }

    /// Initializing

    initialize({ filepath: filepath }) {
        this.previousClassificationDo( () => {
            this.initialize({ filepath: filepath })

        })

        this.classes = []
        this.footer = undefined

        if( this.isJavascriptFile() ) {
            this.classes = this.getClassDefinitions()
            this.footer = this.buildFooter()
        }
    }

    /// Acccessing

    /*
     * Returns all the classes definitions in the file.
     */
    getClasses() {
        return this.classes
    }

    /*
     * Returns the statements below the class declaration.
     * This section tipically includes the exports, additional functions, etc, etc.
     */
    getFooter() {
        return this.footer
    }

    /// Building

    buildFooter() {
        const classDefinitions = this.getClassDefinitions()

        if( classDefinitions.length === 0 ) {
            return SourceFileFooter.new({
                sourceFile: this,
                parseNodes: this.getAllTopMostStatements(),
            })
        }

        const lastClassDefinition = classDefinitions[ classDefinitions.length - 1 ]

        const lastClassParseNode = lastClassDefinition.getLastNode()

        const footerStatements = this.getAllStatementsAfter({ parseNode: lastClassParseNode })

        if( footerStatements.length === 0 ) {
            return this.newEmptyFooter({
                endingLine: lastClassParseNode.loc.end.line,
                endingColumn: lastClassParseNode.loc.end.column,
            })
        } else {
            return SourceFileFooter.new({
                sourceFile: this,
                parseNodes: footerStatements,
            })
        }
    }

    newEmptyFooter({ endingLine: endingLine, endingColumn: endingColumn }) {
        return EmptyJsStatement.new({
            sourceFile: this,
            lineNumber: endingLine,
            columnNumber: endingColumn,
        })
    }
}

module.exports = Classification.define(ClassSourceFile)
