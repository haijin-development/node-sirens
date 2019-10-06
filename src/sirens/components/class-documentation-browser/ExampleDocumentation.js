const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const ExampleHeader = require ('./ExampleHeader')
const DocumentationPlayground = require ('./DocumentationPlayground')


class ExampleDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const example = this.getModel()

        componentsRenderer.render( function(component) {

            this.component(
                ExampleHeader.new({
                    exampleNumber: example.index,
                    exampleDescription: example.Description,
                })
            )

            this.component(
                DocumentationPlayground.new({
                    text: example.Code,
                })
            )

        })
    }
}

module.exports = Classification.define(ExampleDocumentation)
