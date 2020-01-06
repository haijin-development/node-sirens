const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')

class ObjectInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    setInspectedObject(object, forceUpdate) {
        this.setValue( object, forceUpdate )
    }

    isInEditionMode() {
        return this.bubbleUp({
            command: 'isEditingDocumentation'
        })
    }

    showsUnformattedComments() {
        return this.bubbleUp({
            command: 'showsUnformattedComments'
        })
    }

    reloadObject() {
        const object = this.getValue()

        this.setInspectedObject( object, true )
    }

    setShowUnformattedComments({ value: boolean }) {
        this.reloadObject()
    }

    setIsEditingDocumentation({ value: boolean }) {
        this.reloadObject()
    }

    reloadSourceFile() {
        this.bubbleUp({
            command: 'reloadSourceFile'
        })
    }

    setIsBrowsingDocumentation({ value: boolean }) {
        return this.bubbleUp({
            command: 'setIsBrowsingDocumentation',
            param: { value: boolean },
        })
    }

    isBrowsingDocumentation() {
        const result = this.bubbleUp({
            command: 'isBrowsingDocumentation',
        })

        return result
    }

    mainNamespace() {
        const result = this.bubbleUp({
            command: 'mainNamespace',
        })

        return result        
    }
}

module.exports = Classification.define(ObjectInspectorFlow)
