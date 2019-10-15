const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const Sirens = require('../../../Sirens')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')

class FunctionsComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Actions

    browseSelectedProperty() {
        const selectedPropertyValue = this.getModel().getSelectedPropValue()

        Sirens.browseObject(selectedPropertyValue)
    }

    /// Building

    renderWith(componentsRenderer) {
        const prototypesModel = this.getModel()

        componentsRenderer.render(function (component) {
            this.verticalStack( function() {

                this.horizontalStack( function() {
                    this.styles({
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.checkBox({
                        model: prototypesModel.getShowInheritedModel(),
                        label: 'Show inherited',
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.checkBox({
                        model: prototypesModel.getShowFunctionsModel(),
                        label: 'Show functions',
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.checkBox({
                        model: prototypesModel.getShowPropsModel(),
                        label: 'Show props',
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })
                })

                this.listChoice( function() {
                    this.model( prototypesModel.getSelectedPrototypePropsModel() )

                    this.handlers({
                        onAction: component.browseSelectedProperty.bind(component),
                    })

                    this.column({
                        label: '',
                        getImageBlock: function(objectProperty) { return objectProperty.icon() },
                        imageWidth: 24,
                        imageHeight: 24,
                    })

                    this.column({
                        label: 'Properties',
                        getTextBlock: function(objectProperty) { return objectProperty.getKey() },
                    })

                    this.popupMenu( function() {
                        const selectedObject =
                            component.getModel().getSelectedPropValue()

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

module.exports = Classification.define(FunctionsComponent)