const Sirens = require('../../src/Sirens')
const ComponentClassification = require('../../src/gui/components/ComponentClassification')
const Component = require('../../src/gui/components/Component')
const TreeChoiceModel = require('../../src/gui/models/TreeChoiceModel')

class CustomComponent extends ComponentClassification {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
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

    renderWith(builder) {
        const choices = this.getModel()

        builder.render(function (component) {
            this.window( function() {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.treeChoice( function() {
                    this.model(choices)

                    this.column({
                        label: 'Column 1',
                        getTextBlock: (n) => { return n.toString() },
                    })

                    this.column({
                        label: 'Column 2',
                    })
                })
            })
        })
    }
}

Sirens.do( () => {
    CustomComponent.open()
})