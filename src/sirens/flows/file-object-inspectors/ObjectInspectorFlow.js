const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')

class ObjectInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'setIsBrowsingDocumentationClosure',
            'getIsBrowsingDocumentationClosure'
        ]
        this.assumes = [ValueFlow]
    }

    initialize({
        setIsBrowsingDocumentationClosure: setIsBrowsingDocumentationClosure,
        getIsBrowsingDocumentationClosure: getIsBrowsingDocumentationClosure,
    } = {}) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.setIsBrowsingDocumentationClosure = setIsBrowsingDocumentationClosure
        this.getIsBrowsingDocumentationClosure = getIsBrowsingDocumentationClosure
    }

    defaultValue() {
        return {
            object: null,
            isEditingDocumentation: false,
            showsUnformattedComments: false,
            reloadSourceFile: null,
        }
    }

    /// Building

    setInspectedObject(...params) {
        this.setValue(...params)
    }

    setshowUnformattedComments({ value: boolean }) {
        this.getValue().showsUnformattedComments = boolean
    }

    setIsEditingDocumentation({ value: boolean }) {
        this.getValue().isEditingDocumentation = boolean
    }

    isInEditionMode() {
        return this.getValue().isEditingDocumentation
    }

    showsUnformattedComments() {
        return this.getValue().showsUnformattedComments
    }

    setshowUnformattedComments({ value: boolean }) {
        const value = this.getValue()

        value.showsUnformattedComments = boolean

        this.setInspectedObject({
            object: value.object,
            showsUnformattedComments: value.showsUnformattedComments,
            isEditingDocumentation: value.isEditingDocumentation,
            reloadSourceFile: value.reloadSourceFile,
        })
    }

    setIsEditingDocumentation({ value: boolean }) {
        const value = this.getValue()

        value.isEditingDocumentation = boolean

        this.setInspectedObject({
            object: value.object,
            showsUnformattedComments: value.showsUnformattedComments,
            isEditingDocumentation: value.isEditingDocumentation,
            reloadSourceFile: value.reloadSourceFile,
        })
    }

    reloadSourceFile() {
        const value = this.getValue()

        value.reloadSourceFile()
    }

    setIsBrowsingDocumentation({ value: boolean }) {
        this.setIsBrowsingDocumentationClosure({ value: boolean })
    }

    isBrowsingDocumentation() {
        return this.getIsBrowsingDocumentationClosure()
    }
}

module.exports = Classification.define(ObjectInspectorFlow)
