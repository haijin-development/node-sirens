const Classification = require('../../../../../src/O').Classification
const JsFileObject = require('../../../../../src/sirens/objects/js-parser/structure-objects/JsFileObject')

class JsSpecHook {
    /// Definition

    static definition() {
        this.instanceVariables = ['hookType']
        this.assumes = [JsFileObject]
    }

    isJsSpecObject() {
        return true
    }

    isJsSpecHook() {
        return true
    }

    getFileObjectType() {
        return 'jsSpecHook'
    }


    getHookType() {
        return this.hookType
    }

    setHookType(hookType) {
        this.hookType = hookType
    }

    // Source code

    getFileObjectDescription() {
        return this.getHookType()
    }

    getDisplayString() {
        return this.getHookType()        
    }
}

module.exports = Classification.define(JsSpecHook)
