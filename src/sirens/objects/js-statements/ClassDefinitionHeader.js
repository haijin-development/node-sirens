const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')

/*
 * The statements previous to a ClassDefinition.
 *
 * This section tipically includes the global requires, the global constants definintions, etc.
 */
class ClassDefinitionHeader {
    /// Definition

    static definition() {
        this.instanceVariables = ['statements']
        this.assumes = [JsStatement]
    }

    /// Initializing

    initialize({ statements: statements, sourceFile: sourceFile }) {
        this.previousClassificationDo( () => {
            this.initialize({ sourceFile: sourceFile })
        })

        this.statements = statements
    }

    /// Accessing

    getStartingLine() {
        return this.statements[0].loc.start.line
    }

    getStartingColumn() {
        return this.statements[0].loc.start.column
    }

    getEndingLine() {
        return this.statements[ this.statements.length - 1 ].loc.end.line
    }

    getEndingColumn() {
        return this.statements[ this.statements.length - 1 ].loc.end.column
    }
}

module.exports = Classification.define(ClassDefinitionHeader)
