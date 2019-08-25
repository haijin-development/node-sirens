const Sirens = require('../../src/Sirens')
const Classification = require('../../src/o-language/classifications/Classification')
const ComponentClassification = require('../../src/gui/components/ComponentClassification')
const Component = require('../../src/gui/components/Component')
const ChoiceModel = require('../../src/gui/models/ChoiceModel')

const CustomComponent = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
    }

    /// Building

    defaultModel() {
        const choiceModel = ChoiceModel.new()

        choiceModel.setChoices([1, 2, 3])

        return choiceModel
    }

    renderWith(builder) {
        builder.render(function (component) {
            this.window( function() {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.verticalStack( function() {
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
})

CustomComponent.behaveAs( ComponentClassification )

Sirens.do( () => {
    CustomComponent.open()
})