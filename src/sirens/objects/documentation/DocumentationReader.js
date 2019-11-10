const Classification = require('../../../o-language/classifications/Classification')
const ClassDocumentationDslReader = require('./documentationDsl/ClassDocumentationDslReader')
const MethodDocumentationDslReader = require('./documentationDsl/MethodDocumentationDslReader')
const ClassDocumentation = require('./ClassDocumentation')
const MethodDocumentation = require('./MethodDocumentation')

class DocumentationReader {

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    readClassDocumentationFromString({ string: documentationString, className: className }) {
        const classDocumentation = ClassDocumentation.new()

        classDocumentation.setClassName( className )

        try {

            ClassDocumentationDslReader.new({ classDocumentation: classDocumentation })
                .buildFromString( documentationString )

        } catch( e ) {

            classDocumentation.setDescription( documentationString )

        }

        return classDocumentation
    }

    readMethodDocumentationFromString({
        string: documentationString, methodName: methodName, params: params
    })
    {
        const methodDocumentation = MethodDocumentation.new()

        methodDocumentation.setMethodName( methodName )
        methodDocumentation.setMethodParams( params )

        try {

            MethodDocumentationDslReader.new({ methodDocumentation: methodDocumentation })
                .buildFromString( documentationString )

        } catch( e ) {

            methodDocumentation.setDescription( documentationString )

        }

        return methodDocumentation
    }
}

DocumentationReader = Classification.define(DocumentationReader)

DocumentationReader.readClassDocumentationFromString = function(...params) {
    return this.new().readClassDocumentationFromString( ...params )
}

DocumentationReader.readMethodDocumentationFromString = function(...params) {
    return this.new().readMethodDocumentationFromString( ...params )
}

module.exports = DocumentationReader
