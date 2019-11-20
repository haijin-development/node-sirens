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

    /// Initializing

    defaultModel() {
        return ClassPropertiesFlow.new()
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
                        onAction: model.getActionHandler({ id: 'browseSelectedProperty' }),
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
                        model.getChild({ id: 'browseSelectedProperty' }).evaluateEnabledClosure({
                            application: model
                        })

                        this.item({
                            label: 'Browse it',
                            enabled: model.getChild({ id: 'browseSelectedProperty' }),
                            action: model.getActionHandler({ id: 'browseSelectedProperty' }),
                        })
                    })
                })

            })
        })
    }
}

module.exports = Classification.define(ClassPropertiesComponent)
