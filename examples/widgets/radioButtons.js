const Sirens = require('../../src/Sirens')
const Component = require('../../src/components/Component')
const ChoiceModel = require('../../src/models/ChoiceModel')

class CustomComponent extends Component{
    /// Building

    defaultModel() {
        const choiceModel = new ChoiceModel()

        choiceModel.setChoices([1, 2, 3])

        return choiceModel
    }

    renderWith(builder) {
        builder.render(function (component) {
            this.window( () => {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.verticalStack( () => {
                    this.radioButton({
                        model: component.getModel(),
                        id: 1,
                        text: 'Option 1'
                    })

                    this.radioButton({
                        model: component.getModel(),
                        id: 2,
                        text: 'Option 2'
                    })

                    this.radioButton({
                        model: component.getModel(),
                        id: 3,
                        text: 'Option 3'
                    })
                })
            })
        })
    }
}

Sirens.do( () => {
    CustomComponent.open()
})