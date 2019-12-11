const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const Resource = require('../../objects/Resource')

class JsClassComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {

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
                        getTextClosure: function(jsMethod) { return jsMethod.getFunctionSignatureString() },
                    })

                })

                this.text({
                    model: flow.getFlowPoint({ id: 'selectedMethod' }),
                    viewAttributes: { splitProportion: 1.0 / 2 },
                })

            })

        })
    }
}

module.exports = Classification.define(JsClassComponent)
