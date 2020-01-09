const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')

const FolderObject = require('../../objects/file-structure/FolderObject')
const TextualContentInspectorFlow = require('../file-object-inspectors/TextualContentInspectorFlow')

class FileInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineMethodsAsCommands({
                methods: [
                    'getSourceFile',
                    'getSelectedFileObject',
                    'getFileObjectComponent',
                    'getFileObjectInspectorFlow'
                ],
            })

            this.acceptedBubbledUps({
                commands: [
                    'reloadSourceFile',
                ]
            })

            this.whenObjectChanges( ({ newValue: sourceFile }) => {
                const fileObjects = this.getChildFlow({ id: 'fileObjects' })

                if( ! sourceFile ) {
                    fileObjects.setRoots({ items: [] })
                    fileObjects.setSelection( null )
                    return
                }

                const jsFileStructure = thisFlow.parseSourceFileStructure({
                    sourceFile: sourceFile,
                })

                const roots = [jsFileStructure]
                const selection = [jsFileStructure]

                fileObjects.setRoots({ items: roots })
                fileObjects.setSelection( selection )
            })

            this.treeChoice({
                id: 'fileObjects',
                roots: [],
                getChildrenClosure: function (fileObject) { return fileObject.getChildObjects() },
                whenSelectionChanges: function({ newValue: pathToFileObject }) {
                    const fileObject = pathToFileObject[ pathToFileObject.length - 1 ]

                    const newObject = fileObject ? fileObject : null

                    const fileTypeFlow = thisFlow.getFileObjectInspectorFlow({
                        fileObject: fileObject
                    })

                    thisFlow.replaceChildFlow({
                        id: 'selectedFileObject',
                        withFlow: fileTypeFlow, 
                    })

                    fileTypeFlow.setInspectedObject( newObject )
                },
            })

        })
    }

    mainNamespace() {
        return this.bubbleUp({
            command: 'mainNamespace'
        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'getSourceFile',
            'getSelectedFileObject',
            'getFileObjectInspectorFlow',
            'getFileObjectComponent',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint,
        })
    }

    /// Querying

    getSourceFile() {
        return this.getValue()
    }

    setSourceFile({
        sourceFile: sourceFile,
        forceUpdate: forceUpdate,
    }) {
        return this.setValue( sourceFile, forceUpdate )
    }

    getRootFileObject() {
        const roots = this.getChildFlow({ id: 'fileObjects' }).getRoots()

        return roots.length === 0 ? null : roots[0]
    }

    getSelectedFileObject() {
        return this.getChildFlow({ id: 'fileObjects' }).getSelectionValue()
    }

    setSelectedFileObject({ pathToObject: pathToObject }) {
        return this.getChildFlow({ id: 'fileObjects' })
                    .setSelection(pathToObject)
    }

    getFileObjectComponent({ parentWindow: parentWindow }) {
        const selectedFileObjectFlow = this.getChildFlow({ id: 'selectedFileObject' })

        return selectedFileObjectFlow.getFlowComponent({ parentWindow: parentWindow })
    }

    parseSourceFileStructure({ sourceFile: sourceFile }) {
        if( sourceFile.isFolderPath() ) {
            return FolderObject.new()
        }

        const namespace = this.mainNamespace()

        const fileStructuredContentsParser =
            namespace.SourceFileStructureParser.new()

        return fileStructuredContentsParser.parseSourceFile({
                sourceFile: sourceFile,
                onParsingErrorDo: function() { return namespace.UknownFileStructure.new() },
            })
    }

    setShowUnformattedComments({ value: boolean }) {
        this.getChildFlow({ id: 'selectedFileObject' })
            .setShowUnformattedComments({ value: boolean })
    }

    setIsEditingDocumentation({ value: boolean }) {
        this.getChildFlow({ id: 'selectedFileObject' })
            .setIsEditingDocumentation({ value: boolean })        
    }

    reloadSourceFile({ thenDo: closure } = {}) {
        const fileObjectsTree = this.getChildFlow({ id: 'fileObjects' })

        const currentSelectionIndexPath = fileObjectsTree.getSelectionIndexPath()

        this.setSourceFile({
            sourceFile: this.getSourceFile(),
            forceUpdate: true,
        })

        fileObjectsTree.setSelectionIndexPath({ indexPath: currentSelectionIndexPath })

        if( closure !== undefined ) {
            closure( this )
        }
    }

    getFileObjectInspectorFlow({ fileObject: fileObject }){
        if( ! fileObject ) { return TextualContentInspectorFlow.new() }

        const fileObjectInspectorFlowPicker = 
            this.mainNamespace().FileInspectorPlugins.new()

        return fileObjectInspectorFlowPicker.pickFileObjectInspectorFlowFor({
            fileObject: fileObject,
        })
    }
}

module.exports = Classification.define(FileInspectorFlow)
