const Sirens = require('../../src/Sirens')
const Component = require('../../src/components/Component')
const TreeChoiceModel = require('../../src/models/TreeChoiceModel')

class CustomComponent extends Component{
    /// Building

    defaultModel() {
        const treeModel = new TreeChoiceModel({
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
            this.window( () => {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.treeChoice( (tree) => {
                    tree.model(choices)

                    tree.column({
                        label: 'Column 1',
                        getTextBlock: (n) => { return n.toString() },
                    })

                    tree.column({
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