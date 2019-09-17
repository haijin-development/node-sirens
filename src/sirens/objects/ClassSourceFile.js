const Classification = require('../../o-language/classifications/Classification')
const SourceFile = require('./SourceFile')
const ClassSourceFileFooter = require('./js-statements/ClassSourceFileFooter')

/*
 * A source file with a class definition.
 */
class ClassSourceFile {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [SourceFile]
    }

    /// Accessing

    /*
     * Returns the statements below the class declaration.
     * This section tipically includes the exports, additional functions, etc, etc.
     */
    getFooterDefinition() {
        const classDefinitions = this.getClassDefinitions()

        if( classDefinitions.length === 0 ) {
            return ClassSourceFileFooter.new({
                statements: this.getAllTopMostStatements(),
                sourceFile: this,
            })
        }

        const lastClassDefinition = classDefinitions[ classDefinitions.length - 1 ]

        const lastClassParseNode = lastClassDefinition.getParseNode()

        const footerStatements = this.getAllStatementsAfter({ parseNode: lastClassParseNode })

        return ClassSourceFileFooter.new({
            statements: footerStatements,
            sourceFile: this,
        })
    }
}

module.exports = Classification.define(ClassSourceFile)
