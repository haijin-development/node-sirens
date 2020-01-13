const Classification = require('../../../../../src/O').Classification
const JsFileObject = require('../../../../../src/sirens/objects/js-parser/structure-objects/JsFileObject')
const Resource = require('../../../../../src/sirens/objects/Resource')

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

    getIcon() {
        return Resource.image.method
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

    /*
        Method(`
            Writes the given methodContents to the method Location
            preserving the original indentation of the method.
        `)
    */
    writeContents({ methodContents: methodContents }) {
        const contentsIndentation = this.getContentsIndentation()

        const sourceCodeText = this.namespace().SourceCodeText.new({
            text: this.getContents()
        })

        sourceCodeText.setIndentationChar( contentsIndentation.char )
        sourceCodeText.setIndentationLevel( contentsIndentation.level )

        const plainContents =
            sourceCodeText.unformatBackText( methodContents )

        this.writePlainContents({ contents: plainContents })
    }
}

module.exports = Classification.define(JsMethod)
