const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator
const Sirens = require('../../../Sirens')
const PrototypesBrowserFlow = require('../../flows/prototypes/PrototypesBrowserFlow')
const ClassPropertiesComponent = require('./ClassPropertiesComponent')

const Resource = require('../../objects/Resource')

class PrototypeBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    defaultModel() {
        const object = this.getProps().prototype

        const flow = PrototypesBrowserFlow.new().asFlowPoint()

        flow.setBrowsedObject( object )

        return flow
    }

    /// Icons

    getPrototypeIcon() {
        return Resource.image.prototype
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    title: 'Prototypes Browser',
                    width: 500,
                    height: 400,
                })

                this.verticalSplitter( function() {

                    this.horizontalSplitter( function() {
                        this.styles({
                            viewAttributes: { splitProportion: 2.0/3.0 },
                        })

                        this.listChoice( function() {
                            this.model( flow.getFlowPoint({ id: 'classes' }) )

                            this.styles({
                                viewAttributes: { splitProportion: 1.0/4.0 },
                            })

                            this.handlers({
                                onAction: () => { flow.browseSelectedPrototype() },
                            })

                            this.column({
                                label: '',
                                getImageClosure: function(object) { return component.getPrototypeIcon() },
                                imageWidth: 24,
                                imageHeight: 24,
                            })

                            this.column({
                                label: 'Prototypes',
                                getTextClosure: function(object) { return object.constructor.name },
                            })

                            this.popupMenu( function() {
                                this.item({
                                    label: 'Browse it',
                                    enabled: flow.hasAClassSelected(),
                                    action: () => { flow.browseSelectedPrototype() },
                                })
                            })

                        })

                        this.component(
                            ClassPropertiesComponent.new({
                                model: flow.getFlowPoint({ id: 'playground' }),
                                viewAttributes: { splitProportion: 3.0/4.0 },
                            })
                        )

                    })

                    this.text({
                        model: flow.getFlowPoint({ id: 'selectedProp' }),
                        viewAttributes: { splitProportion: 1.0/3.0 },
                    })
                })
            })
        })
    }
}


module.exports = Classification.define(PrototypeBrowser)