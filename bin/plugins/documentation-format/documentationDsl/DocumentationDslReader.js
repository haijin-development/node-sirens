const Classification = require('../../../../src/O').Classification
const ParseTreeVisitor = require('../../../../src/sirens/objects/js-parser/ParseTreeVisitor')
const FullParseTreeVisitorProtocol_Implementation = require('../../../../src/sirens/protocols/FullParseTreeVisitorProtocol_Implementation')
const SourceCodeText = require('../../../../src/sirens/objects//SourceCodeText')

/*
 * A visitor of a javascript parse tree that collects the documentation of a class.
 */
class DocumentationDslReader {

    static definition() {
        this.instanceVariables = ['documentation']
        this.assumes = [ParseTreeVisitor]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    readFromString({ string: documentationString, into: documentation }) {
        this.documentation = documentation

        const parseTree = this.parseString({ string: documentationString, parsingOptions: {} })

        this.visitTree( parseTree )

        return this.documentation
    }

    visitCallExpression(callExpression) {
        const calledFunction = this.visit( callExpression.callee )

        const args = this.visit_all( callExpression.arguments )

        const firstArgument = args[0]

        switch( calledFunction ) {
            case 'Class': {
                this.documentation.setDescriptionFrom({ text: firstArgument })
                break
            }
            case 'Method': {
                this.documentation.setDescriptionFrom({ text: firstArgument })
                break
            }
            case 'Param': {
                let name = ''
                let description = ''

                firstArgument.forEach( (property) => {
                    if( property.key === 'Name' ) {
                        name = property.value
                    }

                    if( property.key === 'Description' ) {
                        description = property.value
                    }
                })

                this.documentation.addParamFrom({ name: name, description: description })
                break
            }
            case 'Returns': {
                let returnsDescription = ''

                firstArgument.forEach( (property) => {
                    if( property.key === 'Description' ) {
                        returnsDescription = property.value
                    }
                })

                this.documentation.setReturnValueFrom({ description: returnsDescription })
                break
            }
            case 'Implementation':
                this.documentation.addImplementationNoteFrom({ text: firstArgument })

                break

            case 'Tags':
                this.documentation.setTagsFrom({ tagsStrings: firstArgument })

                break

            case 'Example': {
                let description = ''
                let code = ''

                firstArgument.forEach( (property) => {
                    if( property.key === 'Description' ) {
                        description = property.value
                    }

                    if( property.key === 'Code' ) {
                        code = property.value
                    }
                })

                this.documentation.addExampleFrom({ description: description, code: code })

                break
            }
            default:
                throw new Error(`Unsupported documentation of: '${calledFunction}'.`)
                break
        }
    }

    visitTemplateLiteral(templateLiteral) {
        const quasis = this.visit_all( templateLiteral.quasis )

        return this.formatString( quasis[0].cooked )
    }

    visitLiteral(literal) {
        return this.formatString( literal.value )
    }

    formatString(string) {
        string = string.trim()

        const sourceCodeText = SourceCodeText.new({ text: string })

        return sourceCodeText.getFormattedText()
    }
}

module.exports = Classification.define(DocumentationDslReader)
