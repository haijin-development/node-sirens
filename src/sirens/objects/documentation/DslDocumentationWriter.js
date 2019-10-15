const Classification = require('../../../o-language/classifications/Classification')
const IndentedStringStream = require('../../../o-language/classifications/IndentedStringStream')


class DslDocumentationWriter {
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
        const hasDescription = classDocumentation.getDescription().trim() !== ''
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
            if( hasDescription ) {
                stringStream.cr()
            }

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
        const hasDescription = methodDocumentation.getDescription().trim() !== ''
        const hasParams = methodDocumentation.getParams().length > 0
        const hasReturns = methodDocumentation.getReturns() !== undefined
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

            this.appendReturnsTo({
                returns: methodDocumentation.getReturns(),
                stringStream: stringStream,
            })
        }

        if( hasImplementationNotes ) {
            if( hasDescription || hasParams ) {
                stringStream.cr()
            }

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
        stringStream.appendLine({ string: 'Class(`' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLinesIn({ string: description })

        })

        stringStream.appendLine({ string: '`)' })
    }

    appendMethodDescriptionTo({ description: description, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Method(`' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLinesIn({ string: description })

        })

        stringStream.appendLine({ string: '`)' })
    }

    appendParamTo({ param: param, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Param({' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLine({ string: 'Name: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                stringStream.appendLinesIn({ string: param.Name })

            })

            stringStream.appendLine({ string: '`,' })

            stringStream.appendLine({ string: 'Description: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                stringStream.appendLinesIn({ string: param.Description })

            })

            stringStream.appendLine({ string: '`,' })
        })

        stringStream.appendLine({ string: '})' })
    }

    appendReturnsTo({ returns: returns, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Returns({' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLine({ string: 'Description: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                stringStream.appendLinesIn({ string: returns.Description })

            })

            stringStream.appendLine({ string: '`,' })
        })

        stringStream.appendLine({ string: '})' })
    }

    appendImplementationNoteTo({ implementationNote: implementationNote, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Implementation(`' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLinesIn({ string: implementationNote })

        })

        stringStream.appendLine({ string: '`)' })
    }

    appendExampleTo({ example: example, stringStream: stringStream }) {
        stringStream.appendLine({ string: 'Example({' })

        stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

            stringStream.appendLine({ string: 'Description: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                stringStream.appendLinesIn({ string: example.Description })

            })

            stringStream.appendLine({ string: '`,' })

            stringStream.appendLine({ string: 'Code: `' })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {

                stringStream.appendLinesIn({ string: example.Code })

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
}

module.exports = Classification.define(DslDocumentationWriter)
