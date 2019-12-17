const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ClassDocumentation = require('../documentation-browser/formatted-documentation/ClassDocumentation')
const ClassUnformattedComment = require('../documentation-browser/unformatted-documentation/ClassUnformattedComment')
const Resource = require('../../objects/Resource')

class JsClassInspectorComponent {
    /// Definition

    static definition() {
        this.instanceVariables = ['tabSelectionIndex']
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Rendering

    reRenderWhen() {
        const flow = this.getModel()

        this.reRenderOnValueChangeOf( flow )
    }

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const tabsSelectionIndex = this.tabSelectionIndex

        componentsRenderer.render( function(component) {

            this.tabs({ id: 'tabs', aligment: 'top' }, function() {

                this.handlers({
                    onTabPageChanged: function({ tabPageIndex: newTabPageIndex }) {
                        component.rememberTabSelectionIndex({ tabPageIndex: newTabPageIndex })
                    }
                })

                this.tabPage({ label: 'Methods' }, function() {
                    this.verticalSplitter( function() {

                        this.listChoice( function() {

                            this.model( flow.getFlowPoint({ id: 'classMethods' }) )

                            this.styles({
                                showHeaders: false,
                                viewAttributes: { splitProportion: 1.0 / 2 },
                            })

                            this.column({
                                label: '',
                                getImageClosure: function(jsMethod) { return Resource.image.method },
                                imageWidth: 24,
                                imageHeight: 24,
                            })

                            this.column({
                                getTextClosure: function(jsMethod) { return jsMethod.getSignatureString() },
                            })

                        })

                        this.text({
                            model: flow.getFlowPoint({ id: 'selectedMethod' }),
                            viewAttributes: { splitProportion: 1.0 / 2 },
                        })

                    })
                })

                this.tabPage({ label: 'Documentation' }, function() {
                    const documentationComponent = 
                        component.createDocumentationComponent()

                    this.container( function() {
                        this.component(
                            documentationComponent
                        )
                    })
                })

            })

        })

        if( tabsSelectionIndex !== undefined ) {
            this.getChildComponent({ id: 'tabs' })
                .showTabPageAt({ index: tabsSelectionIndex })
        }
    }

    createDocumentationComponent() {
        const flow = this.getModel()

        const showsUnformattedComments = flow.showsUnformattedComments()

        if( showsUnformattedComments ) {
            return ClassUnformattedComment.new({
                model: flow,
            })
        } else {
            const classDocumentationFlow =
                flow.getFlowPoint({ id: 'classDocumentation' })

            return ClassDocumentation.new({
                model: classDocumentationFlow,
            })
        }
    }

    rememberTabSelectionIndex({ tabPageIndex: newTabPageIndex }) {
        this.tabSelectionIndex = newTabPageIndex
    }
}

module.exports = Classification.define(JsClassInspectorComponent)
