const Classification = require('../../../src/o-language/classifications/Classification')
const ComponentClassification = require('../../gui/components/ComponentClassification')
const Sirens = require('../../Sirens')
const Component = require('../../gui/components/Component')

class ObjectPropertiesComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
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

    renderWith(builder) {
        builder.render( function(component) {

            this.treeChoice( function(tree) {
                this.model( component.getModel().getObjectPropertiesTree() )

                this.styles({
                    splitProportion: 2.0/3.0,
                    showHeaders: false,
                    clickableHeaders: false,
                })

                this.handlers({
                    onAction: component.inspectSelectedObject.bind(component),
                })

                this.column({
                    label: '',
                    getTextBlock: function(instVar) { return instVar.displayString() },
                })

                this.popupMenu( function({menu: menu, ownerView: ownerView}) {
                    const selectedObject =
                        component.getModel().getSelectedPropertyValue()

                    menu.addItem({
                        label: 'Browse it',
                        enabled: selectedObject !== undefined,
                        action: component.inspectSelectedObject.bind(component),
                    })

                    menu.addSeparator()

                    menu.addItem({
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
