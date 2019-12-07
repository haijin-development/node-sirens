const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const FileSectionEditionComponent = require('./FileSectionEditionComponent')
const Resource = require('../../objects/Resource')

class ClassEditorBody {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }


    /// Displaying

    getIconFor({ fileSection: fileSection }) {
        if( fileSection.respondsTo('isJsFile') ) {
            return Resource.image.file
        }

        if( fileSection.respondsTo('isJsClass') ) {
            return Resource.image.class
        }

        if( fileSection.respondsTo('isJsMethod') ) {
            return Resource.image.method
        }

        return Resource.image.haiku
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        if( flow.getSourceFile() === null ) { 
            return
        }

        const treeFlow = flow.getFlowPoint({ id: 'fileSections' })

        componentsRenderer.render( function(component) {

            this.horizontalSplitter( function() {

                this.treeChoice( function() {
                    this.model( treeFlow )

                    this.styles({
                        showHeaders: false,
                        roots: treeFlow.getRoots(),
                        viewAttributes: { splitProportion: 1.0/4.0 },
                    })

                    this.column({
                        label: '',
                        getImageClosure: function(fileSection) { return component.getIconFor({ fileSection: fileSection }) },
                        imageWidth: 16,
                        imageHeight: 16,
                    })

                    this.column({
                        getTextClosure: function(fileSection) { return fileSection.getSectionDescription() },
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
