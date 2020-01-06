const Classification = require('../../../src/O').Classification
const DocumentationDslReader = require('./documentationDsl/DocumentationDslReader')
const DocumentationDslWriter = require('./documentationDsl/DocumentationDslWriter')

class DocumentationDsl {

    static definition() {
        this.instanceVariables = []
        this.assumes = []
        this.classificationBehaviours = []
    }

    readClassDocumentationFromString({ string: documentationString, into: classDocumentation }) {
        return DocumentationDslReader.new()
            .readFromString({ string: documentationString, into: classDocumentation })
    }

    readMethodDocumentationFromString({ string: documentationString, into: methodDocumentation }) {
        return DocumentationDslReader.new()
            .readFromString({ string: documentationString, into: methodDocumentation })
    }

    generateClassCommentContents({ classDocumentation: classDocumentation }) {
        return DocumentationDslWriter.new()
            .generateClassCommentContents({ classDocumentation: classDocumentation })
    }

    generateMethodCommentContents({ methodDocumentation: methodDocumentation }) {
        return DocumentationDslWriter.new()
            .generateMethodCommentContents({ methodDocumentation: methodDocumentation })
    }
}

module.exports = Classification.define(DocumentationDsl)
