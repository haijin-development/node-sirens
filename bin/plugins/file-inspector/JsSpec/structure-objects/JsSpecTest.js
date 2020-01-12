const Classification = require('../../../../../src/O').Classification
const JsFileObject = require('../../../../../src/sirens/objects/js-parser/structure-objects/JsFileObject')
const Resource = require('../../../../../src/sirens/objects/Resource')

class JsSpecTest {
    /// Definition

    static definition() {
        this.instanceVariables = ['testDescription']
        this.assumes = [JsFileObject]
    }

    isJsSpecObject() {
        return true
    }

    isJsSpecTest() {
        return true
    }

    getFileObjectType() {
        return 'jsSpecTest'
    }

    setTestDescription(text) {
        this.testDescription = text
    }

    getTestDescription() {
        return this.testDescription
    }

    // Source code

    getFileObjectDescription() {
        return `it(...)`
    }

    getIcon() {
        return Resource.image.test
    }
}

module.exports = Classification.define(JsSpecTest)
