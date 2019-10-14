const esprima = require('esprima')
const Classification = require('../../../o-language/classifications/Classification')
const ParseTreeVisitor = require('../parsers/ParseTreeVisitor')
const ClassDefinition = require('../source-code/ClassDefinition')
const FullParseTreeVisitorProtocol_Implementation = require('../../protocols/FullParseTreeVisitorProtocol_Implementation')
const SourceCodeText = require('../SourceCodeText')

/*
 * A visitor of a javascript parse tree that collects the documentation of a class.
 */
class MethodDslDocumentationReader {

    static definition() {
        this.instanceVariables = ['methodDocumentation']
        this.assumes = [ParseTreeVisitor]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    initialize({ methodDocumentation: methodDocumentation }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.methodDocumentation = methodDocumentation
    }

    buildFromString(documentationDslString) {
        const parseTree = this.parseString( documentationDslString )

        this.visit( parseTree )

        return this.methodDocumentation
    }

    parseString(string) {
        const parsingOptions = {
            loc: false,
            comment: false,
            tokens: false,
            tolerant: false,
            jsx: false,
        }

        return esprima.parse( string, parsingOptions )
    }

    visitCallExpression(callExpression) {
        const calledFunction = this.visit( callExpression.callee )

        const args = this.visit_all( callExpression.arguments )

        const firstArgument = args[0]

        switch( calledFunction ) {
            case 'Method':
                this.methodDocumentation.setDescription( firstArgument )
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

                this.methodDocumentation.addParam( param )
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

                this.methodDocumentation.setReturns( returns )
                break

            case 'Implementation':
                this.methodDocumentation.addImplementationNote( firstArgument )

                break

            case 'Tags':
                this.methodDocumentation.setTags( firstArgument )

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

                this.methodDocumentation.addExample( example )

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

module.exports = Classification.define(MethodDslDocumentationReader)
