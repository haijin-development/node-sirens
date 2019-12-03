const path = require('path')
const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const Sirens = require('../../../Sirens')
const ClassPropertiesFlow = require('../../flows/prototypes/ClassPropertiesFlow')

class ClassPropertiesComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render(function (component) {
            this.verticalStack( function() {

                this.horizontalStack( function() {
                    this.styles({
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.checkBox({
                        model: flow.getFlowPoint({ id: 'showInheritedProps' }),
                        label: 'Show inherited',
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.checkBox({
                        model: flow.getFlowPoint({ id: 'showFunctionProps' }),
                        label: 'Show functions',
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.checkBox({
                        model: flow.getFlowPoint({ id: 'showNonFunctionProps' }),
                        label: 'Show props',
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })
                })

                this.listChoice( function() {
                    this.model( flow.getFlowPoint({ id: 'properties' }) )

                    this.handlers({
                        onAction: () => { flow.browseSelectedProperty() }
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
                        flow.getCommand({ id: 'browseSelectedProperty' }).updateEnabledState()

                        this.item({
                            label: 'Browse it',
                            enabled: flow.getFlowPoint({ id: 'browseSelectedProperty' }),
                            action: () => { flow.browseSelectedProperty() }
                        })
                    })
                })

            })
        })
    }
}

module.exports = Classification.define(ClassPropertiesComponent)
