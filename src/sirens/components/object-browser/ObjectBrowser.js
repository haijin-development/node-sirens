const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')

const ObjectPropertiesComponent = require('./ObjectPropertiesComponent')
const PlaygroundComponent = require('../shared/PlaygroundComponent')

class ObjectBrowser {
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
