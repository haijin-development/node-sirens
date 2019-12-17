const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const ExampleHeader = require ('./ExampleHeader')
const PlaygroundComponent = require ('../../shared/PlaygroundComponent')


class ExampleDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const example = this.getProps().example

        componentsRenderer.render( function(component) {

            this.component(
                ExampleHeader.new({
                    model: model,
                    index: example.index,
                    example: example,
                    editClosure: component.getProps().editClosure,
                    deleteClosure: component.getProps().deleteClosure,
                })
            )

            this.verticalSeparator()

            this.component(
                PlaygroundComponent.new({
                    id: 'playground',
                    text: "\n" + example.Code + "\n",
                    hScroll: 'never',
                    vScroll: 'never',
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })
            )
        })
    }
}

module.exports = Classification.define(ExampleDocumentation)
