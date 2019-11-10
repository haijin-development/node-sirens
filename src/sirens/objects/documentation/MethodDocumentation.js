const Classification = require('../../../o-language/classifications/Classification')
const MethodDslDocumentationReader = require('./MethodDslDocumentationReader')
const DslDocumentationWriter = require('./DslDocumentationWriter')

class MethodDocumentationInstantiator {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    /// Building

    fromString(documentationDslString) {
        const methodDocumentation = MethodDocumentation.new()

        MethodDslDocumentationReader.new({ methodDocumentation: methodDocumentation })
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

    updateParamAt({ index: index, param: param }) {
        this.params[index] = param
    }

    deleteParamAt({ index: index }) {
        this.params.splice( index, 1 )
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

    updateImplementationNoteAt({ index: index, implementationNoteText: implementationNoteText }) {
        this.implementationNotes[index] = implementationNoteText
    }

    deleteImplementationNoteAt({ index: index }) {
        this.implementationNotes.splice( index, 1 )
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

    updateExampleAt({ index: index, example: example }) {
        this.examples[index] = example
    }

    deleteExampleAt({ index: index }) {
        this.examples.splice( index, 1 )
    }

    getTagsSortedAlphabetically({ reversed: reversed } = { reversed: false }) {
        const tags = this.getTags().slice()

        if( reversed === true ) {
            return tags.sort( (item1, item2) => { return item1 < item2 })
        } else {
            return tags.sort()
        }
    }

    /// Generating method comment

    generateComment() {
        return this.getDocumentationWriter().generateMethodComment({
            methodDocumentation: this
        })
    }

    generateCommentContents() {
        return this.getDocumentationWriter().generateMethodCommentContents({
            methodDocumentation: this
        })
    }

    getDocumentationWriter() {
        return DslDocumentationWriter.new()
    }
}

MethodDocumentation = Classification.define(MethodDocumentation)



module.exports = MethodDocumentation
