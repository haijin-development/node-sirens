const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const FileObjectInspectorComponent = require('./FileObjectInspectorComponent')
const Resource = require('../../objects/Resource')

class FileInspectorBodyComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }


    /// Displaying

    getIconFor({ fileObject: fileObject }) {
        const icons = {
            fileObject: Resource.image.file,
            jsFileStructure: Resource.image.file,
            jsClass: Resource.image.class,
            jsMethod: Resource.image.method,
            jsonContent: Resource.image.object,
            default: Resource.image.haiku,
        }

        const icon = icons[ fileObject.getFileObjectType() ]

        return icon ?
            icon
            :
            icons.default
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
                        getImageClosure: function(fileObject) { return component.getIconFor({ fileObject: fileObject }) },
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
