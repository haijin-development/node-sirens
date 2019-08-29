const Classification = require('../../src/o-language/classifications/Classification')
const ComponentClassification = require('../gui/components/ComponentClassification')
const Component = require('../gui/components/Component')
const Sirens = require('../Sirens')
const PrototypesBrowserModel = require('./models/PrototypesBrowserModel')
const FunctionsComponent = require('./components/FunctionsComponent')

class PrototypeBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
    }

    /// Initializing

    defaultModel() {
        const object = this.getProps().prototype

        return PrototypesBrowserModel.new({ object: object })
    }

    /// Actions

    browseSelectedPrototype() {
        const selectedPrototype = this.getModel().getSelectedPrototype()

        Sirens.browsePrototypes(selectedPrototype)
    }

    /// Icons

    getImageFor(object) {
        return 'resources/icons/array.png'
    }

    /// Building

    renderWith(builder) {
        const prototypesModel = this.getModel()

        builder.render( function(component) {
            this.window( function() {
                this.styles({
                    title: 'Prototypes Browser',
                    width: 500,
                    height: 400,
                })

                this.verticalSplitter( function() {

                    this.horizontalSplitter( function() {
                        this.styles({
                            splitProportion: 2.0/3.0,
                        })

                        this.listChoice( function() {
                            this.model( prototypesModel.getPrototypesModel() )

                            this.styles({
                                splitProportion: 1.0/4.0,
                            })

                            this.handlers({
                                onAction: component.browseSelectedPrototype.bind(component),
                            })

                            this.column({
                                label: 'Prototypes',
                                getTextBlock: function(object) { return object.constructor.name },
                            })

                            this.popupMenu( function() {
                                const selectedObject =
                                    component.getModel().getSelectedPrototype()

                                this.addItem({
                                    label: 'Browse it',
                                    enabled: selectedObject !== undefined,
                                    action: component.browseSelectedPrototype.bind(component),
                                })
                            })

                        })

                        this.component(
                            FunctionsComponent.new({
                                model: prototypesModel,
                                splitProportion: 3.0/4.0,
                            })
                        )
                    })

                    this.text({
                        splitProportion: 1.0/3.0,
                        model: prototypesModel.getSelectedPropDescriptionModel(),
                    })
                })
            })
        })
    }
}


module.exports = Classification.define(PrototypeBrowser)
                    .behaveAs(ComponentClassification)