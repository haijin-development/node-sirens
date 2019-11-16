const Classification = require('../../src/O').Classification
const Component = require('../../src/Skins').Component
const ComponentProtocol_Implementation = require('../../src/Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../src/Skins').ComponentInstantiator
const Sirens = require('../../src/Sirens')
const ChoiceModel = require('../../src/Skins').ChoiceModel

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

        choiceModel.setChoices( [1, 2.0, 'a string'] )

        return choiceModel
    }

    renderWith(componentsRenderer) {
        const choices = this.getModel()

        componentsRenderer.render( function (component) {
            this.window( function() {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.listChoice( function(list) {
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