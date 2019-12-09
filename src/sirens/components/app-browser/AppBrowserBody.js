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
        const flow = this.getModel()

        componentsRenderer.render( function(component) {
            this.horizontalSplitter( function() {

                this.container( function() {

                    this.styles({
                        viewAttributes: { splitProportion: 2.0/3.0 },
                        hasScrollBars: false,
                    })

                    this.component(
                        SourceFileEditionComponent.new({
                            model: flow.getFlowPoint({ id: 'selectedFile' }),
                            openClassDocumentation: component.getProps().openClassDocumentation,
                        })
                    )

                })

                this.treeChoice( function() {
                    this.model( flow.getFlowPoint({ id: 'filesTree' }) )

                    this.styles({
                        viewAttributes: { splitProportion: 1.0/3.0 },
                        showHeaders: false,
                        clickableHeaders: false,
                    })

                    this.handlers({
                        onAction: component.getProps().openFileEditor,
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
                        const selectedFilePath = flow.getSelectedFilePath()

                        const enableOpenDocumentation = flow.hasAClassSelected()

                        this.item({
                            label: 'Browse it on a new window',
                            enabled: selectedFilePath !== null,
                            action: component.getProps().openFileEditor,
                        })

                    })
                })

            })
        })
    }
}

module.exports = Classification.define(AppBrowserBody)
