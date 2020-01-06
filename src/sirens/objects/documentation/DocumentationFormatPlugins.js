const Classification = require('../../../O').Classification
const ObjectWithNamespace = require('../../../O').ObjectWithNamespace

/*
    Class(`
        This objects picks a DocumentationReader for a given documentationString.

        A documentation can be writen in different formats, this object iterates
        through all available format readers and picks the first that can parse
        the given format.
    `)
*/
class DocumentationFormatPlugins {

    static definition() {
        this.instanceVariables = ['documentationReaders']
        this.assumes = [ObjectWithNamespace]
    }

    initialize() {
        this.documentationReaders = []
    }

    addDocumentationReader(documentationReaderClassification) {
        this.documentationReaders.push( documentationReaderClassification )
    }

    /*
        Pick the first DocumentationReader classification that can parse the
        documentation from the given documentationString.
    */
    pickReaderForClass({
        className: className, documentationString: documentationString,
        ifFound: foundClosure, ifNotFound: notFoundClosure,
    }) {
        const documentationReaderClassifications = this.documentationReaders

        for( const documentationReaderClassification of documentationReaderClassifications ) {

            try {
                const classDocumentation = this.namespace().ClassDocumentation.new()

                classDocumentation.setClassName( className )

                const documentationReader = documentationReaderClassification.new()

                documentationReader.readClassDocumentationFromString({
                    string: documentationString,
                    into: classDocumentation
                })

                classDocumentation.behaveAs( documentationReaderClassification )

                return foundClosure(classDocumentation)

            } catch( e ) {}
        }

        return notFoundClosure()
    }

    /*
        Pick the first DocumentationReader classification that can parse the
        documentation from the given documentationString.
    */
    pickReaderForMethod({
        methodName: methodName, documentationString: documentationString,
        ifFound: foundClosure, ifNotFound: notFoundClosure,
    }) {
        const documentationReaderClassifications = this.documentationReaders

        for( const documentationReaderClassification of documentationReaderClassifications ) {

            try {
                const methodDocumentation = this.namespace().MethodDocumentation.new()

                methodDocumentation.setMethodName( methodName )

                const documentationReader = documentationReaderClassification.new()

                documentationReader.readMethodDocumentationFromString({
                    string: documentationString,
                    into: methodDocumentation
                })

                methodDocumentation.behaveAs( documentationReaderClassification )

                return foundClosure(methodDocumentation)

            } catch( e ) {}
        }

        return notFoundClosure()
    }
}

module.exports = Classification.define(DocumentationFormatPlugins)
