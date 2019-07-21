const Sirens = require('../../src/index')
const Component = require('../../src/components/Component')
const ChoiceModel = require('../../src/models/ChoiceModel')

class CustomComponent extends Component{
    /// Building

    defaultModel() {
        const choiceModel = new ChoiceModel()

        choiceModel.setChoices([1, 2.0, 'a string'])

        return choiceModel
    }

    renderWith(builder) {
        const choices = this.getModel()

        builder.render(function (component) {
            this.window( () => {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.listChoice( (list) => {
                    list.model(choices)

                    list.column({
                        label: 'Column 1',
                        getTextBlock: (n) => { return n.toString() },
                    })

                    list.column({
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