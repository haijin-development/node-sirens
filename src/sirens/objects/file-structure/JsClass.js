const Classification = require('../../../O').Classification
const JsFileSection = require('./JsFileSection')

class JsClass {
    /// Definition

    static definition() {
        this.instanceVariables = ['classComment', 'className']
        this.assumes = [JsFileSection]
    }

    // Asking

    isJsClass() {
        return true
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

    getSectionDescription() {
        return `Class ${this.className}`
    }
}

module.exports = Classification.define(JsClass)
