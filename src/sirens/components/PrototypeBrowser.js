const Classification = require('../../o-language/classifications/Classification')
const ComponentInstantiator = require('../../gui/components/ComponentInstantiator')
const Component = require('../../gui/components/Component')
const Sirens = require('../../Sirens')
const PrototypesBrowserModel = require('../models/PrototypesBrowserModel')
const FunctionsComponent = require('./prototype-browser/FunctionsComponent')
const ComponentProtocol_Implementation = require('../../gui/protocols/ComponentProtocol_Implementation')

const Resource = require('../objects/Resource')

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

        return PrototypesBrowserModel.new({ object: object })
    }

    /// Actions

    browseSelectedPrototype() {
        const selectedPrototype = this.getModel().getSelectedPrototype()

        Sirens.browsePrototypes(selectedPrototype)
    }

    /// Icons

    getPrototypeIcon() {
        return Resource.image.prototype
    }

    /// Building

    renderWith(componentsRenderer) {
        const prototypesModel = this.getModel()

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
                            this.model( prototypesModel.getPrototypesModel() )

                            this.styles({
                                viewAttributes: { splitProportion: 1.0/4.0 },
                            })

                            this.handlers({
                                onAction: component.browseSelectedPrototype.bind(component),
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
                                const selectedObject =
                                    component.getModel().getSelectedPrototype()

                                this.item({
                                    label: 'Browse it',
                                    enabled: selectedObject !== undefined,
                                    action: component.browseSelectedPrototype.bind(component),
                                })
                            })

                        })

                        this.component(
                            FunctionsComponent.new({
                                model: prototypesModel,
                                viewAttributes: { splitProportion: 3.0/4.0 },
                            })
                        )
                    })

                    this.text({
                        viewAttributes: { splitProportion: 1.0/3.0 },
                        model: prototypesModel.getSelectedPropDescriptionModel(),
                    })
                })
            })
        })
    }
}


module.exports = Classification.define(PrototypeBrowser)