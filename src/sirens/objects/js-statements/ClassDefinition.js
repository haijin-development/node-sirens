const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')
const FunctionDefinitionsCollector = require('../parsers/FunctionDefinitionsCollector')
const ClassDefinitionHeader = require('./ClassDefinitionHeader')
const ClassDefinitionFooter = require('./ClassDefinitionFooter')
const StringStream = require('../../../o-language/classifications/StringStream')

/*
 * The definition of a javascript class.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class ClassDefinition {
    /// Definition

    static definition() {
        this.instanceVariables = ['parseNode']
        this.assumptions = [JsStatement]
    }

    /// Initializing

    initialize({ parseNode: parseNode, sourceFile: sourceFile }) {
        this.previousClassificationDo( () => {
            this.initialize({ sourceFile: sourceFile })
        })

        this.parseNode = parseNode
    }

    /// Accessing

    /*
     * Returns the name of the class.
     */
    getClassName() {
        return this.parseNode.id.name
    }

    /*
     * Returns the statements above the class declaration.
     * This section tipically includes the global requires, the global constants definintions, etc.
     */
    getHeaderDefinition() {
        const statements = this.getSourceFile().getAllStatementsBefore({ parseNode: this.parseNode })

        return ClassDefinitionHeader.new({
            statements: statements,
            sourceFile: this.getSourceFile()
        })
    }

    /*
     * Returns the statements below the class declaration.
     * This section tipically includes the exports, additional functions, etc, etc.
     */
    getFooterDefinition() {
        const statements = this.getSourceFile().getAllStatementsAfter({ parseNode: this.parseNode })

        return ClassDefinitionFooter.new({
            statements: statements,
            sourceFile: this.getSourceFile()
        })
    }

    /*
     * Returns all the functions defined in the file.
     * The functions may be defined in any scope, not just the top most module scope.
     */
    getFunctionDefinitions() {
        const collector = FunctionDefinitionsCollector.new()

        return collector.collectFunctionDefinitionsIn({
            treeNode: this.parseNode,
            sourceFile: this.getSourceFile(),
        })
    }

    /// Writing

    setHeaderSourceCode(headerSourceCode) {
        const classStartLine = this.parseNode.loc.start.line
        const classStartColumn = this.parseNode.loc.start.column

        const fileContentsExceptHeader = this.getSourceFile().getOriginalSourceCode({
            fromLine: classStartLine,
            fromColumn: classStartColumn,
            cr: "\n"
        })

        const hasNotEmptyHeader = headerSourceCode !== ''

        const newFileContents = StringStream.new()

        newFileContents.append({ string: headerSourceCode, if: hasNotEmptyHeader })

        newFileContents.cr({ if: hasNotEmptyHeader })

        newFileContents.cr()

        newFileContents.append({ string: fileContentsExceptHeader })

        this.getSourceFile().saveFileContents( newFileContents.getString() )
    }

    setFooterSourceCode(footerSourceCode) {
        const classEndLine = this.parseNode.loc.end.line
        const classEndColumn = this.parseNode.loc.end.column

        const fileContentsExceptFooter = this.getSourceFile().getOriginalSourceCode({
            fromLine: 1,
            fromColumn: 0,
            toLine: classEndLine,
            toColumn: classEndColumn,
            cr: "\n"
        })

        const hasNotEmptyFooter = footerSourceCode !== ''

        const newFileContents = StringStream.new()

        newFileContents.append({ string: fileContentsExceptFooter })

        newFileContents.cr()

        newFileContents.append({ string: footerSourceCode, if: hasNotEmptyFooter })

        newFileContents.cr({ if: hasNotEmptyFooter })

        this.getSourceFile().saveFileContents( newFileContents.getString() )
    }
}

module.exports = Classification.define(ClassDefinition)
