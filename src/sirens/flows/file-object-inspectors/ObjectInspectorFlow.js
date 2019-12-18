const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')

class ObjectInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
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
        return this.bubbleUp({
            command: 'setIsBrowsingDocumentation',
            param: { value: boolean },
        })
    }

    isBrowsingDocumentation() {
        return this.bubbleUp({
            command: 'isBrowsingDocumentation',
        })
    }
}

module.exports = Classification.define(ObjectInspectorFlow)
