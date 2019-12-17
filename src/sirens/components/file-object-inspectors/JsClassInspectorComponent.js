const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ClassDocumentation = require('../documentation-browser/formatted-documentation/ClassDocumentation')
const ClassUnformattedComment = require('../documentation-browser/unformatted-documentation/ClassUnformattedComment')
const Resource = require('../../objects/Resource')

class JsClassInspectorComponent {
    /// Definition

    static definition() {
        this.instanceVariables = ['ignoreTabEvents']
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

        // this needs to be fixed at the tabs component level
        this.ignoreTabEvents = true

        componentsRenderer.render( function(component) {

            this.tabs({ id: 'tabs', aligment: 'top' }, function() {

                this.handlers({
                    onTabPageChanged: function({ tabPageIndex: newTabPageIndex }) {
                        component.setIsBrowsingDocumentation({ value: newTabPageIndex === 1 })
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

    setIsBrowsingDocumentation({ value: boolean }) {
        if( this.ignoreTabEvents === true ) { return }

        const flow = this.getModel()

        flow.setIsBrowsingDocumentation({ value: boolean })
    }
}

module.exports = Classification.define(JsClassInspectorComponent)
