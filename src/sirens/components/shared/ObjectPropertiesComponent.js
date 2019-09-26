const Classification = require('../../../../src/o-language/classifications/Classification')
const Sirens = require('../../../Sirens')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')

class ObjectPropertiesComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Actions

    getSelectedObject() {
        let selectedValue = this.getModel().getSelectedPropertyValue()

        if(selectedValue === undefined) {
            selectedValue = this.getModel().getRootObject()
        }

        return selectedValue
    }

    inspectSelectedObject() {
        const selectedValue = this.getSelectedObject()

        Sirens.browseObject(selectedValue)
    }

    browseSelectedObjectPrototypes() {
        const selectedValue = this.getSelectedObject()

        Sirens.browsePrototypes(selectedValue)
    }

    /// Building

    renderWith(componentsRenderer) {
        componentsRenderer.render( function(component) {

            this.treeChoice( function(tree) {
                this.model( component.getModel().getObjectPropertiesTreeModel() )

                this.styles({
                    showHeaders: false,
                    clickableHeaders: false,
                })

                this.handlers({
                    onAction: component.inspectSelectedObject.bind(component),
                })

                this.column({
                    label: '',
                    getImageBlock: function(instVar) { return instVar.icon() },
                    imageWidth: 16,
                    imageHeight: 16,
                })

                this.column({
                    label: '',
                    getTextBlock: function(instVar) { return instVar.displayString() },
                })

                this.popupMenu( function() {
                    const selectedObject =
                        component.getModel().getSelectedPropertyValue()

                    this.item({
                        label: 'Browse it',
                        enabled: selectedObject !== undefined,
                        action: component.inspectSelectedObject.bind(component),
                    })

                    this.separator()

                    this.item({
                        label: 'Browse its prototype',
                        enabled: selectedObject !== undefined,
                        action: component.browseSelectedObjectPrototypes.bind(component),
                    })
                })
            })
        })
    }
}

module.exports = Classification.define(ObjectPropertiesComponent)
