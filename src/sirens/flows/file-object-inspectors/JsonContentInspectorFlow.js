const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const Sirens = require('../../../Sirens')
const JsonContentComponent = require('../../components/file-object-inspectors/JsonContentComponent')
const ObjectProperty = require('../../objects/ObjectProperty')

class JsonContentInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
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
                        ObjectProperty.new({ key: null, value: jsonObject })
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
