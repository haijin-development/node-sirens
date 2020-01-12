const Classification = require('../../../../../src/O').Classification
const JsFileObject = require('../../../../../src/sirens/objects/js-parser/structure-objects/JsFileObject')
const Resource = require('../../../../../src/sirens/objects/Resource')

class JsSpecDescribe {
    /// Definition

    static definition() {
        this.instanceVariables = ['describeText']
        this.assumes = [JsFileObject]
    }

    isJsSpecObject() {
        return true
    }

    isJsSpecTest() {
        return true
    }

    getFileObjectType() {
        return 'jsSpecDescribe'
    }

    setDescribeText(text) {
        this.describeText = text
    }

    getDescribeText() {
        return this.describeText
    }

    // Source code

    getFileObjectDescription() {
        return `describe(...)`
    }

    getIcon() {
        return Resource.image.testGroup
    }
}

module.exports = Classification.define(JsSpecDescribe)
