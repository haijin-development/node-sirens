const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ClassHeaderComponent = require('./ClassHeaderComponent')
const ClassComponent = require('./ClassComponent')
const FileFooterComponent = require('./FileFooterComponent')

class FileSectionEditionComponent {
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

            this.container({ id: 'selectedSectionContents', hasScrollBars: false, }, function() {

                if( section.respondsTo('isHeader') && section.isHeader() ) {
                    this.component(
                        ClassHeaderComponent.new({
                            model: flow,
                        })
                    )
                }

                if( section.respondsTo('isClassDefinition') && section.isClassDefinition() ) {
                    this.component(
                        ClassComponent.new({
                            model: flow,
                            openDocumentationBrowser: component.getProps().openDocumentationBrowser,
                        })
                    )
                }

                if( section.respondsTo('isFooter') && section.isFooter() ) {
                    this.component(
                        FileFooterComponent.new({
                            model: flow,
                        })
                    )
                }

            })

        })
    }
}

module.exports = Classification.define(FileSectionEditionComponent)
