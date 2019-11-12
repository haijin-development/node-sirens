const Classification = require('../../../O').Classification

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
        return this.generateMethodComment({
            methodDocumentation: this
        })
    }

    generateCommentContents() {
        return this.generateMethodCommentContents({
            methodDocumentation: this
        })
    }
}

MethodDocumentation = Classification.define(MethodDocumentation)



module.exports = MethodDocumentation
