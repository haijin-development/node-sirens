const Classification = require('../../o-language/classifications/Classification')
const ComponentInstantiator = require('../../gui/components/ComponentInstantiator')
const Component = require('../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../gui/protocols/ComponentProtocol')

class DocumentationBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a new ObjectBrowserModel.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {

                this.styles({
                    title: 'Documentation browser',
                    width: 900,
                    height: 600,
                })

                this.text({
                    model: model.getClassCommentModel(),
                })

            })
        })
    }
}

module.exports = Classification.define(DocumentationBrowser)