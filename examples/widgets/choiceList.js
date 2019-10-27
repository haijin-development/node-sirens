const Classification = require('../../src/o-language/classifications/Classification')
const Sirens = require('../../src/Sirens')
const Component = require('../../src/gui/components/Component')
const ComponentProtocol_Implementation = require('../../src/gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../src/gui/protocols/ComponentProtocol')
const ComponentInstantiator = require('../../src/gui/components/ComponentInstantiator')
const ChoiceModel = require('../../src/gui/models/ChoiceModel')

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
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