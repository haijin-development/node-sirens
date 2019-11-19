const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator

const ObjectPropertiesComponent = require('./ObjectPropertiesComponent')
const PlaygroundComponent = require('../shared/PlaygroundComponent')
const Pluggables = require('../../objects/Pluggables')
const ObjectBrowserFlow = require('../../flows/object-browser/ObjectBrowserFlow')

class ObjectBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    defaultModel() {
        const browsedObject = this.getProps().object

        const model = ObjectBrowserFlow.new()

        model.browseObject( browsedObject )

        return model
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    css: ['window', 'object-browser'],
                    title: 'Object Browser',
                    width: 400,
                    height: 400,
                })

                this.verticalSplitter( function() {

                    this.component(
                        ObjectPropertiesComponent.new({
                            model: model.getChild({ id: 'objectProperties' }),
                            viewAttributes: { splitProportion: 1.0/2.0 },                            
                        })
                    )

                    this.component(
                        PlaygroundComponent.new({
                            model: model.getChild({ id: 'playground' }),
                            viewAttributes: { splitProportion: 1.0/2.0 },                            
                        })
                    )

                })
            })
        })
    }
}

module.exports = Classification.define(ObjectBrowser)
