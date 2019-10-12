const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../../gui/protocols/ComponentProtocol')
const ExampleHeader = require ('./ExampleHeader')
const DocumentationPlayground = require ('../DocumentationPlayground')


class ExampleDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
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
                    exampleDescription: example.Description,
                    deleteExample: component.getProps().deleteExample,
                    editExample: component.getProps().editExample,
                })
            )

            this.verticalSeparator()

            this.component(
                DocumentationPlayground.new({
                    text: example.Code,
                })
            )
        })
    }
}

module.exports = Classification.define(ExampleDocumentation)
