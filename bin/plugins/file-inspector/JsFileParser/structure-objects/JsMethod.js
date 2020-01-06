const Classification = require('../../../../../src/O').Classification
const JsFileObject = require('./JsFileObject')

class JsMethod {
    /// Definition

    static definition() {
        this.instanceVariables = ['methodComment', 'methodName', 'methodParams']
        this.assumes = [JsFileObject]
    }

    isJsMethod() {
        return true
    }

    getFileObjectType() {
        return 'jsMethod'
    }

    setMethodComment(methodComment) {
        this.methodComment = methodComment
    }

    getMethodComment() {
        return this.methodComment
    }

    getMethodName() {
        return this.methodName
    }

    setMethodName(methodName) {
        this.methodName = methodName
    }

    getMethodParams() {
        return this.methodParams
    }

    setMethodParams(methodParams) {
        this.methodParams = methodParams.map( (param) => {
            return this.paramSignatureString({ param: param })
        })
    }

    // Source code

    getFileObjectDescription() {
        return `${this.methodName}(...)`
    }

    getSignatureString() {
        const methodName = this.getMethodName()
        const methodParams = this.getMethodParams()

        const paramsTexts = methodParams.map( (param) => {
            return this.paramSignatureString({ param: param })
        })

        return `${ methodName }(${ paramsTexts.join( ', ' ) })`
    }

    paramSignatureString({ param: param }) {
        if( typeof( param ) === 'string' ) {
            return param
        }

        if( param.right !== undefined ) {
            const left = this.paramSignatureString({ param: param.left })
            const right = this.paramSignatureString({ param: param.right })

            return `${ left } = ${ right }`
        }

        const namedParams = param.map( (namedParam) => {
            return `${namedParam.key}: ${namedParam.value}`
        })

        return `{ ${namedParams.join( ', ' )} }`
    }
}

module.exports = Classification.define(JsMethod)
