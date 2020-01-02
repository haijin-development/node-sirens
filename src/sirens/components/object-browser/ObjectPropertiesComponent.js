const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')

/*
    Class(`
        Browses the properties of a javascript object with an expandable tree.

        // review this comment in the next iteration!
        Expects a ObjectPropertiesFlow flowPoint as its model.
    `)
*/
class ObjectPropertiesComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {
            this.treeChoice( function(tree) {
                const treeModel = flow.getFlowPoint({ id: 'properties' })

                this.model( treeModel )

                this.styles({
                    showHeaders: false,
                    clickableHeaders: false,
                })

                this.handlers({
                    onAction: () => { flow.inspectSelectedObject() },
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
                    const selectedValue = flow.getSelectedPropertyValue()

                    this.item({
                        label: 'Browse it',
                        enabled: selectedValue !== null,
                        action: () => { flow.inspectSelectedObject() },
                    })

                    this.separator()

                    this.item({
                        label: 'Browse its prototype',
                        enabled: selectedValue !== null,
                        action: () => { flow.browseSelectedObjectPrototypes() },
                    })
                })
            })
        })
    }
}

module.exports = Classification.define(ObjectPropertiesComponent)
