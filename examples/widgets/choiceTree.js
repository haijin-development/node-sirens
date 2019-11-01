const Classification = require('../../src/o-language/classifications/Classification')
const Sirens = require('../../src/Sirens')
const Component = require('../../src/gui/components/Component')
const ComponentProtocol_Implementation = require('../../src/gui/protocols/ComponentProtocol_Implementation')

const ComponentInstantiator = require('../../src/gui/components/ComponentInstantiator')
const TreeChoiceModel = require('../../src/gui/models/TreeChoiceModel')

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Building

    defaultModel() {
        const treeModel = TreeChoiceModel.new({
            roots: ['root1', 'root2'],
            getChildrenBlock: function (item) {
                return ['child 1', 'child 2', 'child 3']
            },
        })

        return treeModel
    }

    renderWith(componentsRenderer) {
        const choices = this.getModel()

        componentsRenderer.render(function (component) {
            this.window( function() {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.treeChoice( function() {
                    this.model(choices)

                    this.column({
                        label: 'Column 1',
                        getTextClosure: (n) => { return n.toString() },
                    })

                    this.column({
                        label: 'Column 2',
                    })
                })
            })
        })
    }
}

CustomComponent = Classification.define(CustomComponent)

Sirens.do( () => {
    CustomComponent.new().open()
})