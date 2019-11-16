const Classification = require('../../../O').Classification
const Component = require('../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../GUI').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../GUI').ComponentInstantiator
const Sirens = require('../../../Sirens')
const PrototypesBrowserModel = require('../../models/prototypes/PrototypesBrowserModel')
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

        const model = PrototypesBrowserModel.new()

        model.setBrowsedObject( object )

        return model
    }

    /// Actions

    browseSelectedPrototype() {
        const selectedClass = this.getModel().getSelectedClass()

        Sirens.browsePrototypes(selectedClass)
    }

    /// Icons

    getPrototypeIcon() {
        return Resource.image.prototype
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

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
                            this.model( model.getChild({ id: 'classes' }) )

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
                                    component.getModel().getSelectedClass()

                                this.item({
                                    label: 'Browse it',
                                    enabled: selectedObject !== undefined,
                                    action: component.browseSelectedPrototype.bind(component),
                                })
                            })

                        })

                        this.component(
                            ClassPropertiesComponent.new({
                                model: model.getChild({ id: 'selectedClass' }),
                                viewAttributes: { splitProportion: 3.0/4.0 },
                            })
                        )

                    })

                    this.text({
                        model: model.getChild({ id: 'selectedProp' }),
                        viewAttributes: { splitProportion: 1.0/3.0 },
                    })
                })
            })
        })
    }
}


module.exports = Classification.define(PrototypeBrowser)