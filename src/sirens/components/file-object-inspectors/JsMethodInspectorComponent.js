const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')
const MethodDocumentationComponent = require('../documentation-browser/methods/MethodDocumentationComponent')
const MethodUnformattedCommentComponent = require('../documentation-browser/methods/MethodUnformattedCommentComponent')

class JsMethodInspectorComponent {
    /// Definition

    static definition() {
        this.instanceVariables = ['ignoreTabEvents']
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

        // this needs to be fixed at the tabs component level
        this.ignoreTabEvents = true

        componentsRenderer.render( function(component) {

            this.tabs({ id: 'tabs', aligment: 'top' }, function() {

                this.handlers({
                    onTabPageChanged: function({ tabPageIndex: newTabPageIndex }) {
                        component.setIsBrowsingDocumentation({ value: newTabPageIndex === 1 })
                    }
                })

                this.tabPage({ label: 'Source code' }, function() {

                    this.text( function() {
                        this.model(
                            flow.getFlowPoint({ id: 'methodSourceCode' }),
                        )

                        this.popupMenu( function() {
                            this.separator()

                            this.item({
                                label: 'Save method',
                                action: function() { flow.saveSelectedMethod() },
                            })
                        })
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

        if( flow.isBrowsingDocumentation() ) {
            this.getChildComponent({ id: 'tabs' })
                .showTabPageAt({ index: 1 })
        }

        this.ignoreTabEvents = false
    }

    createDocumentationComponent() {
        const flow = this.getModel()

        const showsUnformattedComments = flow.showsUnformattedComments()

        if( showsUnformattedComments ) {
            return MethodUnformattedCommentComponent.new({
                model: flow,
                window: this.getProps().window,
            })
        } else {
            const methodDocumentationFlow =
                flow.getFlowPoint({ id: 'methodDocumentation' })

            return MethodDocumentationComponent.new({
                model: methodDocumentationFlow,
                window: this.getProps().window,
            })
        }
    }

    setIsBrowsingDocumentation({ value: boolean }) {
        if( this.ignoreTabEvents === true ) { return }

        const flow = this.getModel()

        flow.setIsBrowsingDocumentation({ value: boolean })
    }
}

module.exports = Classification.define(JsMethodInspectorComponent)
