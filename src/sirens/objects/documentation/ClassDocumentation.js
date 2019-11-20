const Classification = require('../../../O').Classification

class ClassDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = ['className', 'description', 'implementationNotes', 'tags', 'examples']
        this.assumes = []
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
        return this.generateClassComment({
            classDocumentation: this
        })
    }

    generateCommentContents() {
        return this.generateClassCommentContents({
            classDocumentation: this
        })
    }
}

ClassDocumentation = Classification.define(ClassDocumentation)

module.exports = ClassDocumentation
