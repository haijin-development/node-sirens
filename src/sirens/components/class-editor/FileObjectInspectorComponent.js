const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ClassComponent = require('./ClassComponent')

class FileObjectInspectorComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    reRenderWhen() {
        const flow = this.getModel()

        this.reRenderOnValueChangeOf( flow )
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const section = flow.getValue()

        if( section === undefined || section === null ) { return }

        componentsRenderer.render( function(component) {
            this.container({ id: 'selectedSectionContents', hasScrollBars: false }, function() {

                if( section.respondsTo('isJsClass') ) {
                    this.component(
                        ClassComponent.new({
                            model: flow,
                            openDocumentationBrowser: component.getProps().openDocumentationBrowser,
                        })
                    )
                }

            })

        })
    }
}

module.exports = Classification.define(FileObjectInspectorComponent)
