const Classification = require('../../../O').Classification
const JsFileObject = require('./JsFileObject')
const DocumentationReader = require('../documentation/DocumentationReader')

class JsClass {
    /// Definition

    static definition() {
        this.instanceVariables = ['classComment', 'className']
        this.assumes = [JsFileObject]
    }

    // Asking

    isJsClass() {
        return true
    }

    getFileObjectType() {
        return 'jsClass'
    }

    // Accessing

    setClassComment(jsComment) {
        this.classComment = jsComment
    }

    getClassComment() {
        return this.classComment
    }

    getClassName() {
        return this.className
    }

    setClassName(className) {
        this.className = className
    }

    getDocumentation() {
        const commentBodyContents = this.getClassComment().getBodyContents()

        return DocumentationReader.readClassDocumentationFromString({
            string: commentBodyContents,
            className: this.className,
        })
    }

    // Displaying

    getFileObjectDescription() {
        return `${this.className} class`
    }
}

module.exports = Classification.define(JsClass)
