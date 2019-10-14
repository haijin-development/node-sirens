const Classification = require('../../../o-language/classifications/Classification')
const ClassDslDocumentationReader = require('./ClassDslDocumentationReader')
const DslDocumentationWriter = require('./DslDocumentationWriter')

class ClassDocumentationInstantiator {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    /// Building

    fromString(documentationDslString) {
        const classDocumentation = ClassDocumentation.new()

        ClassDslDocumentationReader.new({ classDocumentation: classDocumentation })
            .buildFromString( documentationDslString )

        return classDocumentation
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

ClassDocumentationInstantiator = Classification.define(ClassDocumentationInstantiator)


class ClassDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = ['className', 'description', 'implementationNotes', 'tags', 'examples']
        this.assumes = []
        this.classificationBehaviours = [ClassDocumentationInstantiator]
    }

    /// Initializing

    initialize() {
        this.className = ''
        this.description = ''
        this.implementationNotes = []
        this.tags = []
        this.examples = []
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

    /// Generating class comment

    generateComment() {
        return this.getDocumentationWriter().generateClassComment({
            classDocumentation: this
        })
    }

    generateCommentContents() {
        return this.getDocumentationWriter().generateClassCommentContents({
            classDocumentation: this
        })
    }

    getDocumentationWriter() {
        return DslDocumentationWriter.new()
    }
}

ClassDocumentation = Classification.define(ClassDocumentation)

module.exports = ClassDocumentation
