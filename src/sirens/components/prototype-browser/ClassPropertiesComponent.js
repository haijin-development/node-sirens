const path = require('path')
const Classification = require('../../../O').Classification
const Component = require('../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../GUI').ComponentProtocol_Implementation
const Sirens = require('../../../Sirens')
const ClassPropertiesModel = require('../../models/prototypes/ClassPropertiesModel')

class ClassPropertiesComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        return ClassPropertiesModel.new()
    }

    /// Actions

    browseSelectedProperty() {
        const selectedPropertyValue = this.getModel().getSelectedPropertyValue()

        Sirens.browseObject( selectedPropertyValue )
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render(function (component) {
            this.verticalStack( function() {

                this.horizontalStack( function() {
                    this.styles({
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.checkBox({
                        model: model.getChild({ id: 'showInheritedProps' }),
                        label: 'Show inherited',
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.checkBox({
                        model: model.getChild({ id: 'showFunctionProps' }),
                        label: 'Show functions',
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.checkBox({
                        model: model.getChild({ id: 'showNonFunctionProps' }),
                        label: 'Show props',
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })
                })

                this.listChoice( function() {
                    this.model( model.getChild({ id: 'properties' }) )

                    this.handlers({
                        onAction: component.browseSelectedProperty.bind(component),
                    })

                    this.column({
                        label: '',
                        getImageClosure: function(objectProperty) { return objectProperty.icon() },
                        imageWidth: 24,
                        imageHeight: 24,
                    })

                    this.column({
                        label: 'Properties',
                        getTextClosure: function(objectProperty) { return objectProperty.getKey() },
                    })

                    this.popupMenu( function() {
                        const selectedObject = model.getSelectedPropertyValue()

                        this.item({
                            label: 'Browse it',
                            enabled: selectedObject !== undefined,
                            action: component.browseSelectedProperty.bind(component),
                        })
                    })
                })

            })
        })
    }
}

module.exports = Classification.define(ClassPropertiesComponent)
