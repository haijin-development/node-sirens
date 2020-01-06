const Classification = require('../../../O').Classification
const Protocol = require('../../../O').Protocol
const DocumentationDescription = require('./sections/DocumentationDescription')
const DocumentationImplementationNote = require('./sections/DocumentationImplementationNote')
const DocumentationExample = require('./sections/DocumentationExample')
const DocumentationParam = require('./sections/DocumentationParam')
const DocumentationReturnValue = require('./sections/DocumentationReturnValue')
const DocumentationTag = require('./sections/DocumentationTag')

class MethodDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'methodName',
            'methodParams',
            'description',
            'params',
            'returnValue',
            'implementationNotes',
            'tags',
            'examples'
        ]
        this.implements = [MethodDocumentationProtocol]
    }

    /// Initializing

    initialize() {
        this.methodName = ''
        this.methodParams = []
        this.description = DocumentationDescription.new()
        this.params = []
        this.returnValue = DocumentationReturnValue.new()
        this.implementationNotes = []
        this.tags = []
        this.examples = []
    }

    /// Asking

    hasDescription() {
        return this.description.isNotBlank()
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

    setDescriptionFrom({ text: text }) {
        this.setDescription( DocumentationDescription.new({ text: text }) )
    }

    getParams() {
        return this.params
    }

    addParam(param) {
        this.params.push( param )
    }

    addParamFrom({ name: name, description: description }) {
        const param = DocumentationParam.new({
            name: name,
            description: description,
        })

        this.addParam( param )
    }

    updateParamFrom({ param: param, name: name, description: description }) {
        param.setName( name )
        param.setDescription( description )
    }

    deleteParam({ param: param }) {
        this.params = this.params.filter( (each) => {
            return each !== param
        })
    }

    getReturnValue() {
        return this.returnValue
    }

    setReturnValue(returnValue) {
        this.returnValue = returnValue
    }

    setReturnValueFrom({ description: description }) {
        const returnValue = DocumentationReturnValue.new({ description: description })

        this.setReturnValue( returnValue )
    }

    getImplementationNotes() {
        return this.implementationNotes
    }

    addImplementationNoteFrom({ text: implementationNoteText }) {
        const implementationNote = DocumentationImplementationNote.new({
                text: implementationNoteText
            })

        this.addImplementationNote( implementationNote )
    }

    addImplementationNote(implementationNote) {
        this.implementationNotes.push( implementationNote )
    }

    updateImplementationNote({ implementationNote: implementationNote, implementationNoteText: implementationNoteText }) {
        implementationNote.setText( implementationNoteText )
    }

    deleteImplementationNote({ implementationNote: implementationNote }) {
        this.implementationNotes = this.implementationNotes.filter( (each) => {
            return each !== implementationNote
        })
    }

    getTags() {
        return this.tags
    }

    setTags(tags) {
        this.tags = tags
    }

    setTagsFrom({ tagsStrings: tagsStrings }) {
        const tags = tagsStrings.map( (eachString) => {
            return DocumentationTag.new({ label: eachString })
        })

        this.setTags( tags )
    }

    getTagLabels() {
        return this.getTags().map( (eachTag) => {
            return eachTag.getLabel()
        })
    }

    getExamples() {
        return this.examples
    }

    addExample(example) {
        example.index = this.examples.length

        this.examples.push( example )
    }

    addExampleFrom({ description: description, code: code }) {
        const newExample = DocumentationExample.new({
            description: description,
            code: code,
        })

        this.addExample( newExample )
    }

    updateExample({ example: example, description: description, code: code }) {
        example.setDescription( description )
        example.setCode( code )
    }

    deleteExample({ index: index }) {
        this.examples.splice( index, 1 )
    }

    getSignatureString() {
        const paramsSignature = this.methodParams.join( ', ' )
        return `${ this.methodName }(${paramsSignature})`
    }

    /// Generating method comment

    generateCommentContents() {
        return this.generateMethodCommentContents({
            methodDocumentation: this
        })            
    }
}

class MethodDocumentationProtocol {
    setDescription(description) {
        this.param(description) .behavesAs(DocumentationDescription)
    }

    setDescriptionFrom({ text: text }) {
        this.param(text) .isString()
    }

    setTags( tags ) {
        tags.forEach( (tag) => {
            this.param(tag) .behavesAs(DocumentationTag)
        })
    }

    setTagsFrom({ tagsStrings: tagsStrings }) {
        this.param(tagsStrings) .isArray()

        tagsStrings.forEach( (tag) => {
            this.param(tag) .isString()
        })
    }

    addImplementationNote(implementationNote) {
        this.param(implementationNote) .behavesAs(DocumentationImplementationNote)
    }

    addImplementationNoteFrom({ text: implementationNoteText }) {
        this.param(implementationNoteText) .isString()
    }

    updateImplementationNote({ implementationNote: implementationNote, implementationNoteText: implementationNoteText }) {
        this.param(implementationNote) .behavesAs(DocumentationImplementationNote)
        this.param(implementationNoteText) .isString()
    }

    addExample(example) {
        this.param(example) .behavesAs(DocumentationExample)
    }

    addExampleFrom({ description: description, code: code }) {
        this.param(description) .isString()
        this.param(code) .isString()
    }

    updateExample({ example: example, description: description, code: code }) {
        this.param(example) .behavesAs(DocumentationExample)
        this.param(description) .isString()
        this.param(code) .isString()
    }

    addParam(param) {
        this.param(param) .behavesAs(DocumentationParam)
    }

    addParamFrom({ name: name, description: description }) {
        this.param(name) .isString()
        this.param(description) .isString()
    }

    updateParamFrom({ param: param, name: name, description: description }) {
        this.param(param) .behavesAs(DocumentationParam)
        this.param(name) .isString()
        this.param(description) .isString()
    }

    setReturnValue(returnValue) {
        this.param(returnValue) .behavesAs(DocumentationReturnValue)
    }

    setReturnValueFrom({ description: description }) {
        this.param(description) .isString()
    }
}

MethodDocumentationProtocol = Protocol.define(MethodDocumentationProtocol)


module.exports = Classification.define(MethodDocumentation)
