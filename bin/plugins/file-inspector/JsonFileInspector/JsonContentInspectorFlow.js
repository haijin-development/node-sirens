const Classification = require('../../../../src/O').Classification
const ObjectInspectorFlow = require('../../../../src/sirens/flows/file-object-inspectors/ObjectInspectorFlow')
const JsonContentComponent = require('./JsonContentComponent')

class JsonContentInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectInspectorFlow]
    }

    /// Building

    buildWith(flow) {

        flow.main({ id: 'main' }, function(thisFlow) {

            this.whenObjectChanges( ({ newValue: jsonContent }) => {

                if( ! jsonContent ) {
                    this.getChildFlow({ id: 'jsonProperties' }).setRoots({ items: [] })
                    return
                }

                const jsonObject = jsonContent.getJsonObject()

                const roots = [
                        thisFlow.mainNamespace().ObjectProperty.new({ key: null, value: jsonObject })
                    ]

                this.getChildFlow({ id: 'jsonProperties' }).setRoots({ items: roots })
             })

            this.treeChoice({
                id: 'jsonProperties',
                roots: [],
                getChildrenClosure: function (objectProperty) {
                    return objectProperty.getChildProperties()
                },
            })
        })
    }

    getFlowComponent() {
        return JsonContentComponent.new({
            model: this.asFlowPoint(),
        })
    }
}

module.exports = Classification.define(JsonContentInspectorFlow)
