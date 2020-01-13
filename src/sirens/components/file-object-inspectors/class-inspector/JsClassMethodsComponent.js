const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')
const Resource = require('../../../objects/Resource')

class JsClassMethodsComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const methodTagLabels = flow.getAllMethodsTagLabels().sort()

        const selectedTagsFlow = flow.getFlowPoint({ id: 'selectedTags' })

        componentsRenderer.render( function(component) {

            this.verticalSplitter( function() {

                this.horizontalSplitter({ viewAttributes: { splitProportion: 1.0 / 2 }}, function() {

                    this.listChoice( function() {

                        this.model( flow.getFlowPoint({ id: 'classMethods' }) )

                        this.styles({
                            showHeaders: false,
                            viewAttributes: { splitProportion: 3.0 / 4.0 },
                        })

                        this.column({
                            label: '',
                            getImageClosure: function(jsMethod) {
                                return Resource.image.method
                            },
                            imageWidth: 24,
                            imageHeight: 24,
                        })

                        this.column({
                            getTextClosure: function(jsMethod) {
                                return jsMethod.getSignatureString()
                            },
                        })

                    })

                    this.container({ viewAttributes: { splitProportion: 1.0 / 4.0 }}, function() {

                        this.verticalStack( function() {

                            methodTagLabels.forEach( (tagLabel) => {
                                this.multipleCheckBox({
                                    model: selectedTagsFlow,
                                    item: tagLabel,
                                    label: tagLabel,
                                })
                            })

                        })

                    })

                })

                this.text( function() {
                    this.model(
                        flow.getFlowPoint({ id: 'selectedMethod' })
                    )

                    this.styles({
                        viewAttributes: { splitProportion: 1.0 / 2 },
                    })

                    this.popupMenu( function() {
                        this.separator()

                        this.item({
                            label: 'Save method',
                            action: function() { flow.saveSelectedMethod() },
                        })
                    })
                })
            })

        })

    }
}

module.exports = Classification.define(JsClassMethodsComponent)
