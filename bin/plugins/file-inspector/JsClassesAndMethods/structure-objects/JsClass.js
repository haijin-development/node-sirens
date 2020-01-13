const Classification = require('../../../../../src/O').Classification
const JsFileObject = require('../../../../../src/sirens/objects/js-parser/structure-objects/JsFileObject')
const Resource = require('../../../../../src/sirens/objects/Resource')

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

    // Displaying

    getFileObjectDescription() {
        return `${this.className} class`
    }

    getIcon() {
        return Resource.image.class
    }
}

module.exports = Classification.define(JsClass)
