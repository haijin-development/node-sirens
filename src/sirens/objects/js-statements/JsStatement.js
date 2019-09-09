const Classification = require('../../../o-language/classifications/Classification')

/*
 * The statements previous to a ClassDefinition.
 *
 * This section tipically includes the global requires, the global constants definintions, etc.
 */
class JsStatement {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile']
    }

    /// Initializing

    initialize({ sourceFile: sourceFile }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.sourceFile = sourceFile
    }

    /// Accessing

    getSourceFile() {
        return this.sourceFile
    }

    /*
     * Returns the source code of the class header.
     */
    getSourceCode({ cr: cr }) {
        return this.getSourceFile().getOriginalSourceCode({
            fromLine: this.getStartingLine(),
            fromColumn: this.getStartingColumn(),
            toLine: this.getEndingLine(),
            toColumn: this.getEndingColumn(),
            cr: cr,
        })
    }

    /// Formatting

    getFormattedSourceCode({ cr: cr }) {
        let sourceCode = this.getSourceCode({ cr: cr })

        return sourceCode
    }
}

module.exports = Classification.define(JsStatement)
