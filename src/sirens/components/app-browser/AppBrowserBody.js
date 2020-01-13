const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')
const SourceFileEditionComponent = require('./SourceFileEditionComponent')

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

        const filesTreeFlow = flow.getFlowPoint({ id: 'filesTree' })

        componentsRenderer.render( function(component) {
            this.horizontalSplitter( function() {

                this.container( function() {

                    this.styles({
                        viewAttributes: { splitProportion: 3.0/4.0 },
                        hasScrollBars: false,
                    })

                    this.component(
                        SourceFileEditionComponent.new({
                            model: flow.getFlowPoint({ id: 'selectedFile' }),
                            window: component.getProps().window,
                        })
                    )

                })

                this.treeChoice( function() {
                    this.model( filesTreeFlow )

                    this.styles({
                        id: 'filesTree',
                        viewAttributes: { splitProportion: 1.0/4.0 },
                        showHeaders: false,
                        clickableHeaders: false,
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

                })

            })
        })

        this.expandFilesTreeRoot()

        filesTreeFlow.onRootsChanged({
            with: this,
            do: this.expandFilesTreeRoot,
        })
    }

    expandFilesTreeRoot() {
        const filesTreeComponent = this.getChildComponent({ id: 'filesTree' })

        filesTreeComponent.expandNodeAtIndex({ indexPath: [0] })
    }
}

module.exports = Classification.define(AppBrowserBody)
