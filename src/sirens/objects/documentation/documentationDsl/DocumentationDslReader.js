const Classification = require('../../../../O').Classification
const ParseTreeVisitor = require('../../parsers/ParseTreeVisitor')
const FullParseTreeVisitorProtocol_Implementation = require('../../../protocols/FullParseTreeVisitorProtocol_Implementation')
const SourceCodeText = require('../../SourceCodeText')

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
            case 'Class':
                this.documentation.setDescription( firstArgument )
                break

            case 'Method':
                this.documentation.setDescription( firstArgument )
                break

            case 'Param':
                const param = {
                    Name: '',
                    Protocols: [],
                    Description: '',
                }

                firstArgument.forEach( (property) => {
                    if( property.key === 'Name' ) {
                        param.Name = property.value
                    }

                    if( property.key === 'Protocols' ) {
                        param.Protocols = property.value
                    }

                    if( property.key === 'Description' ) {
                        param.Description = property.value
                    }
                })

                this.documentation.addParam( param )
                break

            case 'Returns':
                const returns = {
                    Protocols: [],
                    Description: '',
                }

                firstArgument.forEach( (property) => {
                    if( property.key === 'Protocols' ) {
                        returns.Protocols = property.value
                    }

                    if( property.key === 'Description' ) {
                        returns.Description = property.value
                    }
                })

                this.documentation.setReturns( returns )
                break

            case 'Implementation':
                this.documentation.addImplementationNote( firstArgument )

                break

            case 'Tags':
                this.documentation.setTags( firstArgument )

                break

            case 'Example':
                const example = {
                    Description: '',
                    Code: '',
                }

                firstArgument.forEach( (property) => {
                    if( property.key === 'Description' ) {
                        example.Description = property.value
                    }

                    if( property.key === 'Code' ) {
                        example.Code = property.value
                    }
                })

                this.documentation.addExample( example )

                break

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
