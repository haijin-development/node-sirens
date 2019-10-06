const Classification = require('../../../o-language/classifications/Classification')
const MethodDocumentationBuilder = require('./MethodDocumentationBuilder')

class MethodDocumentationInstantiator {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    /// Building

    fromString(documentationDslString) {
        const methodDocumentation = MethodDocumentation.new()

        MethodDocumentationBuilder.new({ methodDocumentation: methodDocumentation })
            .buildFromString( documentationDslString )

        return methodDocumentation
    }

    isDocumentationString({
        string: string, ifTrue: validDocumentationClosure, ifFalse: invalidDocumentationClosure
    }) {
        try {

            const documentation = this.fromString( string )

            return validDocumentationClosure( documentation )

        } catch( e ) {

            return invalidDocumentationClosure()

        }
    }
}

MethodDocumentationInstantiator = Classification.define(MethodDocumentationInstantiator)

class MethodDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'methodName',
            'methodParams',
            'description',
            'params',
            'returns',
            'implementationNotes',
            'tags',
            'examples'
        ]
        this.assumes = []
        this.classificationBehaviours = [MethodDocumentationInstantiator]
    }

    /// Initializing

    initialize() {
        this.methodName = ''
        this.methodParams = []
        this.description = ''
        this.params = []
        this.returns = undefined
        this.implementationNotes = []
        this.tags = []
        this.examples = []
    }

    /// Accessing

    getMethodName() {
        return this.methodName
    }

    setMethodName(methodName) {
        this.methodName = methodName
    }

    getMethodParams() {
        return this.methodParams
    }

    setMethodParams(methodParams) {
        this.methodParams = methodParams
    }


    getDescription() {
        return this.description
    }

    setDescription(description) {
        this.description = description
    }


    getParams() {
        return this.params
    }

    setParams(params) {
        this.params = params
    }

    addParam(param) {
        this.params.push( param )
    }


    getReturns() {
        return this.returns
    }

    setReturns(returns) {
        this.returns = returns
    }


    getImplementationNotes() {
        return this.implementationNotes
    }

    addImplementationNote(implementationNote) {
        this.implementationNotes.push( implementationNote )
    }


    getTags() {
        return this.tags
    }

    setTags(tags) {
        this.tags = tags
    }


    getExamples() {
        return this.examples
    }

    addExample(example) {
        example.index = this.examples.length

        this.examples.push( example )
    }
}

MethodDocumentation = Classification.define(MethodDocumentation)




module.exports = MethodDocumentation
