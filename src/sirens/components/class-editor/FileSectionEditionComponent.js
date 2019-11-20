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
        const model = this.getModel()

        this.reRenderOnValueChangeOf( model )
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const section = model.getObject()

        if( section === undefined || section === null ) { return }

        componentsRenderer.render( function(component) {

            this.container({ id: 'selectedSectionContents', hasScrollBars: false, }, function() {

                if( section.respondsTo('isHeader') && section.isHeader() ) {
                    this.component(
                        ClassHeaderComponent.new({
                            model: model,
                        })
                    )
                }

                if( section.respondsTo('isClassDefinition') && section.isClassDefinition() ) {
                    this.component(
                        ClassComponent.new({
                            model: model,
                            openDocumentationBrowser: component.getProps().openDocumentationBrowser,
                        })
                    )
                }

                if( section.respondsTo('isFooter') && section.isFooter() ) {
                    this.component(
                        FileFooterComponent.new({
                            model: model,
                        })
                    )
                }
            })

        })
    }
}

module.exports = Classification.define(FileSectionEditionComponent)
