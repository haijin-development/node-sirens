const Classification = require('../../../o-language/classifications/Classification')
const ClassDocumentationBuilder = require('./ClassDocumentationBuilder')
const IndentedStringStream = require('../../../o-language/classifications/IndentedStringStream')

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

    /// Generating class comment

    generateComment({ indentation: indentation } = { indentation: 0 }) {
        const stringStream = IndentedStringStream.new()
        stringStream.setIndentationCount( indentation )

        stringStream.append({ string: '/*' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {
            this.appendDocumentationDslTo({ stringStream: stringStream })
        })

        stringStream.appendLine({ string: '*/' })

        return stringStream.getString()
    }

    appendDocumentationDslTo({ stringStream: stringStream }) {
        const hasDescription = this.description.trim() !== ''
        const hasImplementationNotes = this.implementationNotes.length > 0
        const hasExamples = this.examples.length > 0
        const hasTags = this.tags.length > 0

        if( hasDescription ) {
            this.appendDescriptionTo({ stringStream: stringStream })
        }

        if( hasImplementationNotes ) {
            if( hasDescription ) {
                stringStream.cr()
            }

            stringStream.forEach({
                in: this.implementationNotes,
                do: (implementationNote) => {
                    this.appendImplementationNoteTo({
                        implementationNote: implementationNote,
                        stringStream: stringStream
                    })
                },
                inBetweenDo: () => {
                    stringStream.cr()
                } 
            })
        }

        if( hasExamples ) {
            if( hasDescription || hasImplementationNotes ) {
                stringStream.cr()
            }

            stringStream.forEach({
                in: this.examples,
                do: (example) => {
                    this.appendExampleTo({
                        example: example,
                        stringStream: stringStream
                    })
                },
                inBetweenDo: () => {
                    stringStream.cr()
                } 
            })
        }

        if( hasTags ) {
            if( hasDescription || hasImplementationNotes || hasExamples ) {
                stringStream.cr()
            }

            this.appendTagsTo({
                tags: this.tags,
                stringStream: stringStream
            })
        }
    }

    appendDescriptionTo({ stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Class(`' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            this.appendsLinesTo({
                string: this.description,
                stringStream: stringStream,
            })

        })

        stringStream.appendLine({ string: '`)' })
    }

    appendImplementationNoteTo({ implementationNote: implementationNote, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Implementation(`' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            this.appendsLinesTo({
                string: implementationNote,
                stringStream: stringStream,
            })

        })

        stringStream.appendLine({ string: '`)' })
    }

    appendExampleTo({ example: example, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Example({' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLine({ string: 'Description: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                this.appendsLinesTo({
                    string: example.Description,
                    stringStream: stringStream,
                })

            })

            stringStream.appendLine({ string: '`,' })

            stringStream.appendLine({ string: 'Code: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                this.appendsLinesTo({
                    string: example.Code,
                    stringStream: stringStream,
                })

            })

            stringStream.appendLine({ string: '`,' })
        })

        stringStream.appendLine({ string: '})' })
    }

    appendTagsTo({ tags: tags, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Tags([' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.cr()
            stringStream.appendIndentation()

            stringStream.forEach({
                in: tags,
                do: (tag) => {
                    stringStream.append({ string: `'${tag}'` })
                },
                inBetweenDo: () => {
                    stringStream.append({ string: ', ' })
                } 
            })

        })

        stringStream.appendLine({ string: '])' })        
    }

    appendsLinesTo({ string: string, stringStream: stringStream }) {
        const lines = string.split( "\n" )

        lines.forEach( (line) => {

            if( line.trim() === '' ) {
                stringStream.cr()
            } else {
                stringStream.appendLine({ string: line })
            }
        })
    }

}

ClassDocumentation = Classification.define(ClassDocumentation)



module.exports = ClassDocumentation
