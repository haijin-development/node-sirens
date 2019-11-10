const Classification = require('../../src/o-language/classifications/Classification')
const Sirens = require('../../src/Sirens')
const Component = require('../../src/gui/components/Component')
const ComponentProtocol_Implementation = require('../../src/gui/protocols/ComponentProtocol_Implementation')

const ComponentInstantiator = require('../../src/gui/components/ComponentInstantiator')
const ChoiceModel = require('../../src/gui/models/ChoiceModel')

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
        const choiceModel = ChoiceModel.new()

        choiceModel.setChoices([1, 2, 3])

        return choiceModel
    }

    renderWith(componentsRenderer) {
        componentsRenderer.render(function (component) {
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
}

CustomComponent = Classification.define(CustomComponent)

Sirens.do( () => {
    CustomComponent.new().open()
})