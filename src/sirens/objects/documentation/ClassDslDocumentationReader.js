const esprima = require('esprima')
const Classification = require('../../../o-language/classifications/Classification')
const ParseTreeVisitor = require('../parsers/ParseTreeVisitor')
const ClassDefinition = require('../source-code/ClassDefinition')
const FullParseTreeVisitorProtocol_Implementation = require('../../protocols/FullParseTreeVisitorProtocol_Implementation')
const SourceCodeText = require('../SourceCodeText')

/*
 * A visitor of a javascript parse tree that collects the documentation of a class.
 */
class ClassDslDocumentationReader {

    static definition() {
        this.instanceVariables = ['classDocumentation']
        this.assumes = [ParseTreeVisitor]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    initialize({ classDocumentation: classDocumentation }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.classDocumentation = classDocumentation
    }

    buildFromString(documentationDslString) {
        const parseTree = this.parseString( documentationDslString )

        this.visit( parseTree )

        return this.classDocumentation
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
            case 'Class':
                this.classDocumentation.setDescription( firstArgument )
                break

            case 'Implementation':
                this.classDocumentation.addImplementationNote( firstArgument )

                break

            case 'Tags':
                this.classDocumentation.setTags( firstArgument )

                break

            case 'Example':
                const example = {
                    Description: firstArgument.key,
                    Code: firstArgument.value,
                }

                firstArgument.forEach( (property) => {
                    if( property.key === 'Description' ) {
                        example.Description = property.value
                    }

                    if( property.key === 'Code' ) {
                        example.Code = property.value
                    }
                })

                this.classDocumentation.addExample( example )

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

module.exports = Classification.define(ClassDslDocumentationReader)
