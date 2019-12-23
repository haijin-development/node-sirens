const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')

const FolderObject = require('../../objects/file-structure/FolderObject')

const SourceFileStructureParser = require('../../objects/SourceFileStructureParser')
const UknownFileStructure = require('../../objects/file-structure/UknownFileStructure')

const TextualContentInspectorFlow = require('../file-object-inspectors/TextualContentInspectorFlow')
const JsClassInspectorFlow = require('../file-object-inspectors/JsClassInspectorFlow')
const JsMethodInspectorFlow = require('../file-object-inspectors/JsMethodInspectorFlow')

class FileInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

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

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {

            this.statelessCommands({
                definedInFlow: thisFlow,
                withMethods: [
                    'getSourceFile',
                    'getSelectedFileObject',
                    'getFileObjectComponent',
                ],
            })

            // This is a Command to allow the main application to override it.
            this.command({
                id: 'getFileObjectInspectorFlow',
                whenActioned: function({ fileObject: fileObject }) {
                    if( fileObject && fileObject.respondsTo('isJsClass') ) {
                        return JsClassInspectorFlow.new()
                    }

                    if( fileObject && fileObject.respondsTo('isJsMethod') ) {
                        return JsMethodInspectorFlow.new()
                    }

                    return TextualContentInspectorFlow.new()
                }
            })

        })

        this.acceptedBubbledUps({
            commands: [
                'reloadSourceFile',
            ]
        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.getSourceFile',
            'flow-commands.getSelectedFileObject',
            'flow-commands.getFileObjectInspectorFlow',
            'flow-commands.getFileObjectComponent',
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

    getFileObjectInspectorFlow({ fileObject: fileObject }) {
        return this.executeCommand({
            id: 'getFileObjectInspectorFlow',
            with: { fileObject: fileObject },
        })
    }

    getFileObjectComponent() {
        const selectedFileObjectFlow = this.getChildFlow({ id: 'selectedFileObject' })

        return selectedFileObjectFlow.getFlowComponent()
    }

    parseSourceFileStructure({ sourceFile: sourceFile }) {
        if( sourceFile.isFolder() ) {
            return FolderObject.new()
        }

        try {
            return SourceFileStructureParser.new()
                .parseSourceFile({ sourceFile: sourceFile })
        } catch(error) {
            return UknownFileStructure.new()
        }
    }

    setShowUnformattedComments({ value: boolean }) {
        this.getChildFlow({ id: 'selectedFileObject' })
            .setShowUnformattedComments({ value: boolean })
    }

    setIsEditingDocumentation({ value: boolean }) {
        this.getChildFlow({ id: 'selectedFileObject' })
            .setIsEditingDocumentation({ value: boolean })        
    }

    reloadSourceFile() {
        const fileObjectsTree = this.getChildFlow({ id: 'fileObjects' })

        const currentSelectionIndexPath = fileObjectsTree.getSelectionIndexPath()

        this.setSourceFile({
            sourceFile: this.getSourceFile(),
            forceUpdate: true,
        })

        fileObjectsTree.setSelectionIndexPath({ indexPath: currentSelectionIndexPath })
    }
}

module.exports = Classification.define(FileInspectorFlow)
