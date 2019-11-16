const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const FileSectionEditionComponent = require('./FileSectionEditionComponent')

class ClassEditorBody {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const model = this.getModel()

        if( model.getSourceFile() === null ) { 
            return
        }

        const classDefinitions = model.getSectionsDefinedInOpenedFile()

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.listChoice( function() {
                    this.model( model.getChild({ id: 'fileSections' }) )

                    this.styles({
                        showHeaders: false,
                        choices: classDefinitions,
                        hasScrollBars: false,
                        viewAttributes: { stackSize: 'fixed', },
                    })

                    this.column({
                        getTextClosure: function(section) {
                            return section.getDisplayString()
                        },
                    })

                })

                this.component(
                    FileSectionEditionComponent.new({
                        model: model.getChild({ id: 'selectedSectionContents' }),
                        openDocumentationBrowser: component.getProps().openDocumentationBrowser,
                    })
                )

            })

        })
    }
}

module.exports = Classification.define(ClassEditorBody)
