const Classification = require('../../../../../src/O').Classification
const JsFileObject = require('../../../../../src/sirens/objects/js-parser/structure-objects/JsFileObject')
const Resource = require('../../../../../src/sirens/objects/Resource')

/*
    Class(`
        This object models a statement

            describe('A test description ...', () => {
                ...
            })

        in a file containing tests.
    `)
*/
class JsSpecDescribe {
    /// Definition

    static definition() {
        this.instanceVariables = ['describeText']
        this.assumes = [JsFileObject]
    }

    /*
        Method(`
            This method adds polimorphism with other JsSpecObjects.
        `)
    */
    isJsSpecObject() {
        return true
    }

    isJsSpecDescribe() {
        return true
    }

    /*
        Method(`
            Returns the type of this JsFileObject.

            The type of the object can be used by the application to decide which
            browser to use based on a dynamic configuration.
        `)
    */
    getFileObjectType() {
        return 'jsSpecDescribe'
    }

    setDescribeText(text) {
        this.describeText = text
    }

    getDescribeText() {
        return this.describeText
    }

    /*
        Method(`
            Returns a human readable text describing this object.

            This method adds polimorphism with other JsSpecObjects.
        `)
    */
    getDisplayString() {
        return this.getDescribeText()
    }

    // Source code

    /*
        Method(`
            Returns a brief description of this object.
        `)
    */
    getFileObjectDescription() {
        return `describe(...)`
    }

    getIcon() {
        return Resource.image.testGroup
    }
}

module.exports = Classification.define(JsSpecDescribe)
