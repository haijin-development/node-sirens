const Classification = require('../../../O').Classification
const ObjectWithNamespace = require('../../../O').ObjectWithNamespace

class DocumentationReader {

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithNamespace]
    }

    readClassDocumentationFromString({ string: documentationString, className: className }) {
        const documentationReaderPicker =
            this.namespace().DocumentationFormatPlugins.new()

        return documentationReaderPicker.pickReaderForClass({
            className: className,
            documentationString: documentationString,
            ifFound: (classDocumentation) => {
                return classDocumentation 
            },
            ifNotFound: () => {
                const classDocumentation = this.namespace().ClassDocumentation.new()

                classDocumentation.setClassName( className )
                classDocumentation.setDescriptionFrom({ text: documentationString })

                return classDocumentation
            }
        })
    }

    readMethodDocumentationFromString({
        string: documentationString, methodName: methodName, params: params
    })
    {
        const documentationReaderPicker =
            this.namespace().DocumentationFormatPlugins.new()

        return documentationReaderPicker.pickReaderForMethod({
            methodName: methodName,
            documentationString: documentationString,
            ifFound: (methodDocumentation) => {
                methodDocumentation.setMethodParams( params )
                return methodDocumentation 
            },
            ifNotFound: () => {
                const methodDocumentation = this.namespace().MethodDocumentation.new()

                methodDocumentation.setMethodName( methodName )
                methodDocumentation.setMethodParams( params )
                methodDocumentation.setDescriptionFrom({ text: documentationString })

                return methodDocumentation
            }
        })
    }
}

module.exports = Classification.define(DocumentationReader)
