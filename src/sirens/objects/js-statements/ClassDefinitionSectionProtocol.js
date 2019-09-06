const Classification = require('../../../o-language/classifications/Classification')

/*
 * Defines the protocol that all objects behaving as a ClassDefinitionSection must implement.
 */
class ClassDefinitionSectionProtocol {
    /// Accessing

    getStartingLine() {
    }

    getStartingColumn() {
    }

    getEndingLine() {
    }

    getEndingColumn() {
    }
}

module.exports = ObjectProtocol.define(ClassDefinitionSectionProtocol)
