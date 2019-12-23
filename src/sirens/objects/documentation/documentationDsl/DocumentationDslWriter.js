const Classification = require('../../../../O').Classification
const IndentedStringStream = require('../../../../O').IndentedStringStream

class DocumentationDslWriter {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
        this.classificationBehaviours = []
    }

    /// Generating comment

    generateClassComment({ classDocumentation: classDocumentation }) {
        const stringStream = IndentedStringStream.new()

        stringStream.append({ string: '/*' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            this.appendClassDocumentationDslTo({
                classDocumentation: classDocumentation,
                stringStream: stringStream,
            })

        })

        stringStream.appendLine({ string: '*/' })

        return stringStream.getString()
    }

    generateClassCommentContents({ classDocumentation: classDocumentation }) {
        const stringStream = IndentedStringStream.new()

        this.appendClassDocumentationDslTo({
            classDocumentation: classDocumentation,
            stringStream: stringStream,
        })

        return stringStream.getString()
    }

    generateMethodComment({ methodDocumentation: methodDocumentation }) {
        const stringStream = IndentedStringStream.new()

        stringStream.append({ string: '/*' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            this.appendMethodDocumentationDslTo({
                methodDocumentation: methodDocumentation,
                stringStream: stringStream,
            })

        })

        stringStream.appendLine({ string: '*/' })

        return stringStream.getString()
    }

    generateMethodCommentContents({ methodDocumentation: methodDocumentation }) {
        const stringStream = IndentedStringStream.new()

        this.appendMethodDocumentationDslTo({
            methodDocumentation: methodDocumentation,
            stringStream: stringStream,
        })

        return stringStream.getString()
    }

    appendClassDocumentationDslTo({ classDocumentation: classDocumentation, stringStream: stringStream }) {
        const hasDescription = classDocumentation.hasDescription()
        const hasImplementationNotes = classDocumentation.getImplementationNotes().length > 0
        const hasExamples = classDocumentation.getExamples().length > 0
        const hasTags = classDocumentation.getTags().length > 0

        if( hasDescription ) {
            this.appendClassDescriptionTo({
                description: classDocumentation.getDescription(), 
                stringStream: stringStream,
            })
        }

        if( hasImplementationNotes ) {
            if( hasDescription ) { stringStream.cr() }

            stringStream.forEach({
                in: classDocumentation.getImplementationNotes(),
                do: (implementationNote) => {
                    this.appendImplementationNoteTo({
                        implementationNote: implementationNote,
                        stringStream: stringStream,
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
                in: classDocumentation.getExamples(),
                do: (example) => {
                    this.appendExampleTo({
                        example: example,
                        stringStream: stringStream,
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
                tags: classDocumentation.getTags(),
                stringStream: stringStream,
            })
        }
    }

    appendMethodDocumentationDslTo({ methodDocumentation: methodDocumentation, stringStream: stringStream }) {
        const hasDescription = methodDocumentation.hasDescription()
        const hasParams = methodDocumentation.getParams().length > 0
        const hasReturns = methodDocumentation.getReturnValue() !== undefined
        const hasImplementationNotes = methodDocumentation.getImplementationNotes().length > 0
        const hasExamples = methodDocumentation.getExamples().length > 0
        const hasTags = methodDocumentation.getTags().length > 0

        if( hasDescription ) {
            this.appendMethodDescriptionTo({
                description: methodDocumentation.getDescription(), 
                stringStream: stringStream,
            })
        }

        if( hasParams ) {
            if( hasDescription ) {
                stringStream.cr()
            }

            stringStream.forEach({
                in: methodDocumentation.getParams(),
                do: (param) => {
                    this.appendParamTo({
                        param: param,
                        stringStream: stringStream,
                    })
                },
                inBetweenDo: () => {
                    stringStream.cr()
                } 
            })
        }

        if( hasReturns ) {
            if( hasParams ) {
                stringStream.cr()
            }

            this.appendReturnValueTo({
                returnValue: methodDocumentation.getReturnValue(),
                stringStream: stringStream,
            })
        }

        if( hasImplementationNotes ) {
            if( hasDescription || hasParams ) { stringStream.cr() }

            stringStream.forEach({
                in: methodDocumentation.getImplementationNotes(),
                do: (implementationNote) => {
                    this.appendImplementationNoteTo({
                        implementationNote: implementationNote,
                        stringStream: stringStream,
                    })
                },
                inBetweenDo: () => {
                    stringStream.cr()
                } 
            })
        }

        if( hasExamples ) {
            if( hasDescription || hasParams || hasImplementationNotes ) {
                stringStream.cr()
            }

            stringStream.forEach({
                in: methodDocumentation.getExamples(),
                do: (example) => {
                    this.appendExampleTo({
                        example: example,
                        stringStream: stringStream,
                    })
                },
                inBetweenDo: () => {
                    stringStream.cr()
                } 
            })
        }

        if( hasTags ) {
            if( hasDescription || hasParams || hasImplementationNotes || hasExamples ) {
                stringStream.cr()
            }

            this.appendTagsTo({
                tags: methodDocumentation.getTags(),
                stringStream: stringStream,
            })
        }
    }

    appendClassDescriptionTo({ description: description, stringStream: stringStream }) {
        const descriptionText = description.getText()

        stringStream.appendLine({ string: 'Class(`' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLinesIn({ string: descriptionText })

        })

        stringStream.appendLine({ string: '`)' })
    }

    appendMethodDescriptionTo({ description: description, stringStream: stringStream }) {
        const descriptionText = description.getText()

        stringStream.appendLine({ string: 'Method(`' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLinesIn({ string: descriptionText })

        })

        stringStream.appendLine({ string: '`)' })
    }

    appendParamTo({ param: param, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Param({' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLine({ string: 'Name: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                stringStream.appendLinesIn({ string: param.getName() })

            })

            stringStream.appendLine({ string: '`,' })

            stringStream.appendLine({ string: 'Description: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                stringStream.appendLinesIn({ string: param.getDescription() })

            })

            stringStream.appendLine({ string: '`,' })
        })

        stringStream.appendLine({ string: '})' })
    }

    appendReturnValueTo({ returnValue: returnValue, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Returns({' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLine({ string: 'Description: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                stringStream.appendLinesIn({ string: returnValue.getDescription() })

            })

            stringStream.appendLine({ string: '`,' })
        })

        stringStream.appendLine({ string: '})' })
    }

    appendImplementationNoteTo({ implementationNote: implementationNote, stringStream: stringStream }) {
        const implementationNoteText = implementationNote.getText()

        stringStream.appendLine({ string: 'Implementation(`' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLinesIn({ string: implementationNoteText })

        })

        stringStream.appendLine({ string: '`)' })
    }

    appendExampleTo({ example: example, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Example({' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLine({ string: 'Description: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                stringStream.appendLinesIn({ string: example.getDescription() })

            })

            stringStream.appendLine({ string: '`,' })

            stringStream.appendLine({ string: 'Code: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                stringStream.appendLinesIn({ string: example.getCode() })

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
                    const tagLabel = tag.getLabel()

                    stringStream.append({ string: `'${tagLabel}'` })
                },
                inBetweenDo: () => {
                    stringStream.append({ string: ', ' })
                } 
            })

        })

        stringStream.appendLine({ string: '])' })  
    }
}

module.exports = Classification.define(DocumentationDslWriter)
