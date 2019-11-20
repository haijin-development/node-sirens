const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ClassEditorBody = require('../class-editor/ClassEditorBody')
const DocumentationBrowserBody = require('../class-documentation-browser/DocumentationBrowserBody')

class SourceFileEditionComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    reRenderWhen() {
        const model = this.getModel()

        this.reRenderOnValueChangeOf( model )
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                this.component(
                    ClassEditorBody.new({
                        model: model,
                        openDocumentationBrowser: component.getProps().openClassDocumentation,
                    })
                )

            })
        })
    }
}

module.exports = Classification.define(SourceFileEditionComponent)
