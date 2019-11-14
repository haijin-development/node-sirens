const Classification = require('../../../O').Classification
const Component = require('../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../GUI').ComponentProtocol_Implementation
const TreeChoiceModel = require('../../../GUI').TreeChoiceModel

const ObjectProperty = require('../../objects/ObjectProperty')
const Preferences = require('../../objects/Preferences')
const Sirens = require('../../../Sirens')

class ObjectPropertiesComponent {
    /// Definition

    static definition() {
        this.instanceVariables = ['propertiesTreeModel']
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Initializing

    initializeModel() {
        this.propertiesTreeModel = TreeChoiceModel.new({
            roots: this.getTreeRootProperties(),
            getChildrenClosure: function (objectProperty) { return objectProperty.getChildProperties() }
        })
    }

    getTreeRootProperties() {
        const inspectedObject = this.getRootObject()

        const root = ObjectProperty.new({ key: null, value: inspectedObject })

        return [root]
    }

    /// Building

    renderWith(componentsRenderer) {
        const propertiesTreeModel = this.propertiesTreeModel

        componentsRenderer.render( function(component) {

            this.treeChoice( function(tree) {
                this.model( propertiesTreeModel )

                this.styles({
                    showHeaders: false,
                    clickableHeaders: false,
                })

                this.handlers({
                    onSelectionChanged: component.getProps().onSelectionChanged,
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
                    const selectedObject = component.getSelectedPropertyValue()

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

    /// Accessing

    getRootObject() {
        return this.getProps().rootObject
    }

    getSelectedPropertyValue() {
        const selectedTreePropertyWrapper = this.propertiesTreeModel.getSelectionValue()

        return selectedTreePropertyWrapper.getValue()
    }

    /// Actions

    inspectSelectedObject() {
        const selectedValue = this.getSelectedPropertyValue()

        Sirens.browseObject(selectedValue)
    }

    browseSelectedObjectPrototypes() {
        const selectedValue = this.getSelectedPropertyValue()

        Sirens.browsePrototypes(selectedValue)
    }
}

module.exports = Classification.define(ObjectPropertiesComponent)
