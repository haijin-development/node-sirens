const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const ClassSummaryComponent = require ('./ClassSummaryComponent')
const ClassDetailsComponent = require ('./ClassDetailsComponent')

class ClassDocumentationComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {

            this.container( function() {

                this.styles({
                    css: [ 'documentation', 'class-documentation' ], 
                    hScroll: 'never', 
                })

                this.verticalStack(function() {

                    this.component(
                        ClassSummaryComponent.new({
                            model: flow,
                            viewAttributes: { stackSize: 'fixed' },
                        })
                    )

                    this.verticalSeparator()

                    this.component(
                        ClassDetailsComponent.new({
                            model: flow,
                            window: this.getProps().window,
                            viewAttributes: { stackSize: 'fixed' },
                        })
                    )

                })

            })

        })
    }
}

module.exports = Classification.define(ClassDocumentationComponent)