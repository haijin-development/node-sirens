const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')

/*
    The statements after the last ClassDefinition in a ClassSourceFile.

    This section tipically includes the initialization code and the module exports.

    It is implemented as a wrapper on a parse tree node.
 */
class SourceFileFooter {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsStatement]
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, parseNodes: parseNodes }) {
        this.previousClassificationDo( () => {
            this.initialize({
                sourceFile: sourceFile,
                parseNodes: parseNodes
            })
        })
    }
}

module.exports = Classification.define(SourceFileFooter)
