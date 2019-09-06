const path = require('path')
const Classification = require('../../../src/o-language/classifications/Classification')
const Sirens = require('../../Sirens')
const Component = require('../../gui/components/Component')

class FunctionsComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
    }

    /// Actions

    browseSelectedProperty() {
        const selectedPropertyValue = this.getModel().getSelectedPropValue()

        Sirens.browseObject(selectedPropertyValue)
    }

    /// Building

    renderWith(builder) {
        const prototypesModel = this.getModel()

        builder.render(function (component) {
            this.verticalStack( function() {

                this.horizontalStack( function() {
                    this.styles({
                        viewCustomAttributes: {
                            packExpand: false,
                        },
                    })

                    this.checkBox({
                        model: prototypesModel.getShowInheritedModel(),
                        label: 'Show inherited',
                        viewCustomAttributes: {
                            packExpand: false,
                        },
                    })

                    this.checkBox({
                        model: prototypesModel.getShowFunctionsModel(),
                        label: 'Show functions',
                        viewCustomAttributes: {
                            packExpand: false,
                        },
                    })

                    this.checkBox({
                        model: prototypesModel.getShowPropsModel(),
                        label: 'Show props',
                        viewCustomAttributes: {
                            packExpand: false,
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
                        imageWidth: 16,
                        imageHeight: 16,
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
