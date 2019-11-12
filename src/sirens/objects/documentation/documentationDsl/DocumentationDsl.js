const Classification = require('../../../../O').Classification
const DocumentationDslReader = require('./DocumentationDslReader')
const DocumentationDslWriter = require('./DocumentationDslWriter')

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

    generateClassComment({ classDocumentation: classDocumentation }) {
        return DocumentationDslWriter.new()
            .generateClassComment({ classDocumentation: classDocumentation })
    }

    generateClassCommentContents({ classDocumentation: classDocumentation }) {
        return DocumentationDslWriter.new()
            .generateClassCommentContents({ classDocumentation: classDocumentation })
    }

    generateMethodComment({ methodDocumentation: methodDocumentation }) {
        return DocumentationDslWriter.new()
            .generateMethodComment({ methodDocumentation: methodDocumentation })
    }

    generateMethodCommentContents({ methodDocumentation: methodDocumentation }) {
        return DocumentationDslWriter.new()
            .generateMethodCommentContents({ methodDocumentation: methodDocumentation })
    }
}

module.exports = Classification.define(DocumentationDsl)
