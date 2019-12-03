const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator

const ObjectPropertiesComponent = require('./ObjectPropertiesComponent')
const PlaygroundComponent = require('../shared/PlaygroundComponent')
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
        const props = this.getProps()

        const browsedObject = props.object

        const flow = ObjectBrowserFlow.new().asFlowPoint()

        flow.browseObject( browsedObject )

        return flow
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

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
                            model: flow.getFlowPoint({ id: 'objectProperties' }),
                            viewAttributes: { splitProportion: 1.0/2.0 },                            
                        })
                    )

                    this.component(
                        PlaygroundComponent.new({
                            model: flow.getFlowPoint({ id: 'playground' }),
                            viewAttributes: { splitProportion: 1.0/2.0 },                            
                        })
                    )
                })
            })
        })
    }
}

module.exports = Classification.define(ObjectBrowser)
