const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')
const JsStatementProtocol = require('../../protocols/JsStatementProtocol')

class FunctionDeclaration {

    /// Definition

    static definition() {
        this.instanceVariables = ['name', 'params']
        this.assumes = [JsStatement]
        this.implements = [JsStatementProtocol]
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

    getFunctionSignatureString() {
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
}

module.exports = Classification.define(FunctionDeclaration)