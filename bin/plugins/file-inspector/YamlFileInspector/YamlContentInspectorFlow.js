const Classification = require('../../../../src/O').Classification
const ObjectInspectorFlow = require('../../../../src/sirens/flows/file-object-inspectors/ObjectInspectorFlow')
const YamlContentComponent = require('./YamlContentComponent')

class YamlContentInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectInspectorFlow]
    }

    /// Building

    buildWith(flow) {

        flow.main({ id: 'main' }, function(thisFlow) {

            this.whenObjectChanges( ({ newValue: yamlContent }) => {

                if( ! yamlContent ) {
                    this.getChildFlow({ id: 'yamlProperties' }).setRoots({ items: [] })
                    return
                }

                const yamlObject = yamlContent.getYamlObject()

                const roots = [
                        thisFlow.mainNamespace().ObjectProperty.new({ key: null, value: yamlObject })
                    ]

                this.getChildFlow({ id: 'yamlProperties' }).setRoots({ items: roots })
             })

            this.treeChoice({
                id: 'yamlProperties',
                roots: [],
                getChildrenClosure: function (objectProperty) {
                    return objectProperty.getChildProperties()
                },
            })
        })
    }

    getFlowComponent() {
        return YamlContentComponent.new({
            model: this.asFlowPoint(),
        })
    }
}

module.exports = Classification.define(YamlContentInspectorFlow)
