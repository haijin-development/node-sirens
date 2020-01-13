const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const MethodSummaryComponent = require ('./MethodSummaryComponent')
const MethodDetailsComponent = require ('./MethodDetailsComponent')

class MethodDocumentationComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {

            this.container({ hScroll: 'never' }, function() {

                this.verticalStack(function() {
                    this.component(
                        MethodSummaryComponent.new({
                            model: flow,
                            window: component.getProps().window,
                        })
                    )

                    this.verticalSeparator()

                    this.component(
                        MethodDetailsComponent.new({
                            model: flow,
                            window: component.getProps().window,
                        })
                    )
                })

            })

        })
    }
}

module.exports = Classification.define(MethodDocumentationComponent)
