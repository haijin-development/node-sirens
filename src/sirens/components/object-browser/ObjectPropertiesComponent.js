const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ObjectPropertiesFlow = require('../../flows/object-browser/ObjectPropertiesFlow')
const Sirens = require('../../../Sirens')

class ObjectPropertiesComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        return ObjectPropertiesFlow.new()
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {

            this.treeChoice( function(tree) {
                this.model( model.getChild({ id: 'properties' }) )

                this.styles({
                    showHeaders: false,
                    clickableHeaders: false,
                })

                this.handlers({
                    onAction: component.inspectSelectedObject.bind(component),
                })

                this.column({
                    label: '',
                    getImageClosure: function(instVar) { return instVar.icon() },
                    imageWidth: 24,
                    imageHeight: 24,
                })

                this.column({
                    label: '',
                    getTextClosure: function(instVar) { return instVar.displayString() },
                })

                this.popupMenu( function() {
                    const selectedValue = component.getModel().getSelectedPropertyValue()

                    this.item({
                        label: 'Browse it',
                        enabled: selectedValue !== undefined,
                        action: component.inspectSelectedObject.bind(component),
                    })

                    this.separator()

                    this.item({
                        label: 'Browse its prototype',
                        enabled: selectedValue !== undefined,
                        action: component.browseSelectedObjectPrototypes.bind(component),
                    })
                })
            })
        })
    }

    /// Actions

    inspectSelectedObject() {
        const selectedValue = this.getModel().getSelectedPropertyValue()

        Sirens.browseObject(selectedValue)
    }

    browseSelectedObjectPrototypes() {
        const selectedValue = this.getModel().getSelectedPropertyValue()

        Sirens.browsePrototypes(selectedValue)
    }
}

module.exports = Classification.define(ObjectPropertiesComponent)
