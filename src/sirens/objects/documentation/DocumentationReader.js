const Classification = require('../../../O').Classification
const ClassDocumentation = require('./ClassDocumentation')
const MethodDocumentation = require('./MethodDocumentation')

class DocumentationReader {

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    readClassDocumentationFromString({ string: documentationString, className: className }) {
        const Pluggables = require('../../Pluggables')

        const classDocumentation = ClassDocumentation.new()

        classDocumentation.setClassName( className )

        const documentationReaderClassifications = Pluggables.documentationFormats.available

        for( const readerClassification of documentationReaderClassifications ) {

            try {
                const documentationReader = readerClassification.new()

                documentationReader.readClassDocumentationFromString({
                    string: documentationString,
                    into: classDocumentation
                })

                // Attaching this behaviour the classDocumentation already knows how to write itself back to its
                // original format
                classDocumentation.behaveAs( readerClassification )

                return classDocumentation

            } catch( e ) {}
        }

        classDocumentation.setDescriptionFrom({ text: documentationString })

        return classDocumentation
    }

    readMethodDocumentationFromString({
        string: documentationString, methodName: methodName, params: params
    })
    {
        const Pluggables = require('../../Pluggables')

        const methodDocumentation = MethodDocumentation.new()

        methodDocumentation.setMethodName( methodName )
        methodDocumentation.setMethodParams( params )

        const documentationReaderClassifications = Pluggables.documentationFormats.available

        for( const readerClassification of documentationReaderClassifications ) {

            try {
                const documentationReader = readerClassification.new({ methodDocumentation: methodDocumentation })
                
                documentationReader.readMethodDocumentationFromString({
                    string: documentationString,
                    into: methodDocumentation
                })

                // Attaching this behaviour the methodDocumentation already knows how to write itself back to its
                // original format
                methodDocumentation.behaveAs( readerClassification )

                return methodDocumentation

            } catch( e ) {}
        }

        methodDocumentation.setDescriptionFrom({ text: documentationString })

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
