const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')
const FunctionDefinitionsCollector = require('../parsers/FunctionDefinitionsCollector')
const ClassDefinitionHeader = require('./ClassDefinitionHeader')

/*
 * The definition of a javascript class.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class ClassDefinition {
    /// Definition

    static definition() {
        this.instanceVariables = ['parseNode']
        this.assumes = [JsStatement]
    }

    /// Initializing

    initialize({ parseNode: parseNode, sourceFile: sourceFile }) {
        this.previousClassificationDo( () => {
            this.initialize({ sourceFile: sourceFile })
        })

        this.parseNode = parseNode
    }

    /// Accessing

    getParseNode() {
        return this.parseNode
    }

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
            
        let statementsBeforePreviousClass = 0

        for( const eachStatement of statements.slice().reverse() ) {

            if( eachStatement.type === 'ClassDeclaration' ) {
                break
            }

            statementsBeforePreviousClass += 1
        }

        const statementsFromPreviousClassDefinition = statements.slice( -statementsBeforePreviousClass )

        return ClassDefinitionHeader.new({
            statements: statementsFromPreviousClassDefinition,
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
}

module.exports = Classification.define(ClassDefinition)
