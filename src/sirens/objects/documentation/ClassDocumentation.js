const Classification = require('../../../o-language/classifications/Classification')
const ClassDocumentationBuilder = require('./ClassDocumentationBuilder')


class ClassDocumentationInstantiator {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    /// Building

    fromString(documentationDslString) {
        const classDocumentation = ClassDocumentation.new()

        ClassDocumentationBuilder.new({ classDocumentation: classDocumentation })
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

ClassDocumentation = Classification.define(ClassDocumentation)



module.exports = ClassDocumentation
