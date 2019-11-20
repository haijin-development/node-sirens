const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const SourceFileEditionComponent = require('./SourceFileEditionComponent')
const Sirens = require('../../../Sirens')

class AppBrowserBody {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {
            this.horizontalSplitter( function() {

                this.container( function() {

                    this.styles({
                        viewAttributes: { splitProportion: 2.0/3.0 },
                        hasScrollBars: false,
                    })

                    this.component(
                        SourceFileEditionComponent.new({
                            model: model.getChild({ id: 'sourceFileEdition' }),
                            openClassDocumentation: component.getProps().openClassDocumentation,
                        })
                    )

                })

                this.treeChoice( function() {
                    this.model( model.getChild({ id: 'filesTree' }) )

                    this.styles({
                        viewAttributes: { splitProportion: 1.0/3.0 },
                        showHeaders: false,
                        clickableHeaders: false,
                    })

                    this.handlers({
                        onAction: component.getProps().openClassEditor,
                    })

                    this.column({
                        label: '',
                        getImageClosure: function(pathObject) { return pathObject.getIcon() },
                        imageWidth: 16,
                        imageHeight: 16,
                    })

                    this.column({
                        label: '',
                        getTextClosure: function(pathObject) { return pathObject.getBaseName() },
                    })

                    this.popupMenu( function() {
                        const selectedFilePath = model.getSelectedFilePath()

                        const classesDefinitions = model.getClassesDefinitionsInSelectedFile()

                        this.item({
                            label: 'Browse it on a new window',
                            enabled: selectedFilePath !== null,
                            action: component.getProps().openClassEditor,
                        })

                        this.separator()

                        this.item({
                            label: 'Browse its class documentation',
                            enabled: classesDefinitions.length === 1,
                            action: component.getProps().openClassDocumentation,
                        })
                    })
                })

            })
        })
    }
}

module.exports = Classification.define(AppBrowserBody)
