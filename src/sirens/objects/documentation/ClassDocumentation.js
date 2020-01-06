const Classification = require('../../../O').Classification
const Protocol = require('../../../O').Protocol
const DocumentationDescription = require('./sections/DocumentationDescription')
const DocumentationImplementationNote = require('./sections/DocumentationImplementationNote')
const DocumentationExample = require('./sections/DocumentationExample')
const DocumentationTag = require('./sections/DocumentationTag')

class ClassDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = ['className', 'description', 'implementationNotes', 'tags', 'examples']
        this.implements = [ClassDocumentationProtocol]
    }

    /// Initializing

    initialize() {
        this.className = ''
        this.description = DocumentationDescription.new()
        this.implementationNotes = []
        this.tags = []
        this.examples = []
    }

    /// Asking

    hasDescription() {
        return this.description.isNotBlank()
    }

    /// Accessing

    getClassName() {
        return this.className
    }

    setClassName(className) {
        this.className = className
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

    deleteExample({ example: example }) {
        this.examples = this.examples.filter( (each) => {
            return each !== example
        })
    }

    /// Generating class comment

    generateCommentContents() {
        return this.generateClassCommentContents({
            classDocumentation: this
        })
    }
}

class ClassDocumentationProtocol {
    setDescription(description) {
        this.param(description) .behavesAs(DocumentationDescription)
    }

    setDescriptionFrom({ text: text }) {
        this.param(text) .isString()
    }

    setTags(tags) {
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
}

ClassDocumentationProtocol = Protocol.define(ClassDocumentationProtocol)



module.exports = Classification.define(ClassDocumentation)
