const Sirens = require('../../src/Sirens')
const Classification = require('../../src/o-language/classifications/Classification')
const ComponentClassification = require('../../src/gui/components/ComponentClassification')
const Component = require('../../src/gui/components/Component')
const ChoiceModel = require('../../src/gui/models/ChoiceModel')

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
    }

    /// Building

    defaultModel() {
        const choiceModel = ChoiceModel.new()

        choiceModel.setChoices( [1, 2.0, 'a string'] )

        return choiceModel
    }

    renderWith(builder) {
        const choices = this.getModel()

        builder.render( function (component) {
            this.window( function() {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.listChoice( function(list) {
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

const customComponent = Classification.define(CustomComponent)

customComponent.behaveAs( ComponentClassification )

Sirens.do( () => {
    customComponent.open()
})