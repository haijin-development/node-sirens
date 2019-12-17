const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const MethodDocumentation = require('../documentation-browser/formatted-documentation/MethodDocumentation')
const MethodUnformattedComment = require('../documentation-browser/unformatted-documentation/MethodUnformattedComment')

class JsMethodInspectorComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    /// Rendering

    reRenderWhen() {
        const flow = this.getModel()

        this.reRenderOnValueChangeOf( flow )
    }

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {

            this.tabs({ aligment: 'top' }, function() {
                this.tabPage({ label: 'Source code' }, function() {
                    this.text({
                        model: flow.getFlowPoint({ id: 'methodSourceCode' }),
                    })
                })

                this.tabPage({ label: 'Documentation' }, function() {
                    const documentationComponent = 
                        component.createDocumentationComponent()

                    this.component(
                        documentationComponent
                    )
                })

            })

        })
    }

    createDocumentationComponent() {
        const flow = this.getModel()

        const showsUnformattedComments = flow.showsUnformattedComments()

        if( showsUnformattedComments ) {
            return MethodUnformattedComment.new({
                model: flow,
            })
        } else {
            const methodDocumentationFlow =
                flow.getFlowPoint({ id: 'methodDocumentation' })

            return MethodDocumentation.new({
                model: methodDocumentationFlow,
            })
        }
    }
}

module.exports = Classification.define(JsMethodInspectorComponent)
