const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

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
                            viewAttributes: { stackSize: 'fixed' },
                        })
                    )

                    this.verticalSeparator()

                    this.component(
                        MethodDetailsComponent.new({
                            model: flow,
                            viewAttributes: { stackSize: 'fixed' },
                        })
                    )

                })

            })

        })
    }
}

module.exports = Classification.define(MethodDocumentationComponent)
