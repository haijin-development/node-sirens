const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')

/*
 * The definition of a javascript function.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class Function {

    /// Definition

    static definition() {
        this.instanceVariables = ['name', 'params', 'comment']
        this.assumes = [JsStatement]
        this.classificationBehaviours = [FunctionDefinitionBuilder]
    }

    /// Initializing

    initialize({ name: name, params: params, sourceFile: sourceFile, parseNode: parseNode }) {
        this.previousClassificationDo( () => {
            this.initialize({
                sourceFile: sourceFile,
                parseNodes: [parseNode]
            })
        })

        this.name = name
        this.params = params
        this.comment = this.buildComment()
    }

    /// Queyring

    getName() {
        return this.name
    }

    getParams() {
        return this.params
    }

    getFlattenedParams() {
        const flattenedParams = []

        this.getParams().forEach( (param) => {
            if( Array.isArray( param) ) {

                param.forEach( (namedParam) => {
                    flattenedParams.push( namedParam )
                })

            } else {
                flattenedParams.push( param )
            }
        })

        return flattenedParams
    }

    getDeclarationString() {
        const methodName = this.getName()
        const methodParams = this.getParams()

        let methodText = methodName

        methodText += '('

        const paramsTexts = methodParams.map( (param) => {
            if( typeof( param ) === 'string' ) {
                return param
            } else {
                const namedParams = param.map( (namedParam) => {
                    return `${namedParam.key}: ${namedParam.value}`
                })

                return `{ ${namedParams.join( ', ' )} }`
            }
        })

        methodText += paramsTexts.join( ', ' )

        methodText += ')'

        return methodText
    }

    getComment() {
        return this.comment
    }
}

class FunctionDefinitionBuilder {

    from({ file: file, line: line, column: column }) {
        const SourceFile = require('../SourceFile')

        const sourceFile = SourceFile.new({ filepath: file })

        return sourceFile.getFunctionAt({ line: line, column: column })
    }

}

FunctionDefinitionBuilder = Classification.define(FunctionDefinitionBuilder)

module.exports = Classification.define(Function)