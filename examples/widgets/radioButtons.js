const Classification = require('../../src/O').Classification
const Component = require('../../src/skins/components/Component')
const ComponentProtocol_Implementation = require('../../src/skins/protocols/ComponentProtocol_Implementation')
const ChoiceModel = require('../../src/Skins').ChoiceModel
const SkinsNamespace = require('../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    afterInstantiation() {
        this.setNamespace( namespace )
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

namespace.useGtkViews()
namespace.withGUIDo( () => {
    CustomComponent.new().open()
})