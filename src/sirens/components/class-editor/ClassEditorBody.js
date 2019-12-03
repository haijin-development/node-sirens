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
        const flow = this.getModel()

        if( flow.getSourceFile() === null ) { 
            return
        }

        const classDefinitions = flow.getSectionsDefinedInOpenedFile()

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.listChoice( function() {
                    this.model( flow.getFlowPoint({ id: 'fileSections' }) )

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
                        model: flow.getFlowPoint({ id: 'selectedSectionContents' }),
                        openDocumentationBrowser: component.getProps().openDocumentationBrowser,
                    })
                )

            })

        })
    }
}

module.exports = Classification.define(ClassEditorBody)
