const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')
const FileObjectInspectorComponent = require('./FileObjectInspectorComponent')

class FileInspectorBodyComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        if( flow.getSourceFile() === null ) { return }

        const treeFlow = flow.getFlowPoint({ id: 'fileObjects' })

        componentsRenderer.render( function(component) {

            this.horizontalSplitter( function() {

                this.treeChoice( function() {
                    this.model( treeFlow )

                    this.styles({
                        id: 'fileObjectsTree',
                        showHeaders: false,
                        roots: treeFlow.getRoots(),
                        viewAttributes: { splitProportion: 1.0/4.0 },
                    })

                    this.column({
                        label: '',
                        getImageClosure: function(fileObject) { return fileObject.getIcon() },
                        imageWidth: 16,
                        imageHeight: 16,
                    })

                    this.column({
                        getTextClosure: function(fileObject) { return fileObject.getFileObjectDescription() },
                    })
                })

                this.component(
                    FileObjectInspectorComponent.new({
                        model: flow,
                        window: component.getProps().window,
                    })
                )
            })

        })

        this.expandTreeRoot()

        treeFlow.onRootsChanged({
            with: this,
            do: this.expandTreeRoot,
        })
    }

    expandTreeRoot() {
        const treeComponent = this.getChildComponent({
            id: 'fileObjectsTree',
            ifNone: null,
        })

        if( treeComponent === null ) { return }

        treeComponent.expandNodeAtIndex({ indexPath: [0] })
    }
}

module.exports = Classification.define(FileInspectorBodyComponent)
