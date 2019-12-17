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

    defaultValue() {
        return {
            sourceFile: null,
            isEditingDocumentation: false,
            showsUnformattedComments: false,
        }
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

            this.whenObjectChanges( ({ newValue:
                { 
                    sourceFile: sourceFile,
                    showsUnformattedComments: showsUnformattedComments,
                    isEditingDocumentation: isEditingDocumentation
                }
            }) => {
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

                    fileTypeFlow.setInspectedObject({
                        object: newObject,
                        isEditingDocumentation: thisFlow.isEditingDocumentation(),
                        showsUnformattedComments: thisFlow.showsUnformattedComments(),
                        reloadSourceFile: thisFlow.reloadSourceFile.bind(thisFlow),
                    })
                },
            })

        })
    }

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {
            this.command({
                id: 'getSourceFile',
                whenActioned: thisFlow.getSourceFile.bind(thisFlow),
            })

            this.command({
                id: 'getSelectedFileObject',
                whenActioned: thisFlow.getSelectedFileObject.bind(thisFlow),
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

            this.command({
                id: 'getFileObjectComponent',
                whenActioned: thisFlow.getFileObjectComponent.bind(thisFlow),
            })
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
        return this.getValue().sourceFile
    }

    setSourceFile({
        sourceFile: sourceFile,
        showsUnformattedComments: showsUnformattedComments,
        isEditingDocumentation: isEditingDocumentation,
    }) {
        if( showsUnformattedComments === undefined ) { showsUnformattedComments = this.showsUnformattedComments() }
        if( isEditingDocumentation === undefined ) { isEditingDocumentation = this.isEditingDocumentation() }

        return this.setValue({
            sourceFile: sourceFile,
            showsUnformattedComments: showsUnformattedComments,
            isEditingDocumentation: isEditingDocumentation,
        })
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

    setshowUnformattedComments({ value: boolean }) {
        this.getValue().showsUnformattedComments = boolean

        this.getChildFlow({ id: 'selectedFileObject' })
            .setshowUnformattedComments({ value: boolean })
    }

    showsUnformattedComments() {
        return this.getValue().showsUnformattedComments
    }

    setIsEditingDocumentation({ value: boolean }) {
        this.getValue().isEditingDocumentation = boolean

        this.getChildFlow({ id: 'selectedFileObject' })
            .setIsEditingDocumentation({ value: boolean })        
    }

    isEditingDocumentation() {
        return this.getValue().isEditingDocumentation
    }

    reloadSourceFile() {
        const fileObjectsTree = this.getChildFlow({ id: 'fileObjects' })

        const currentSelectionIndexPath = fileObjectsTree.getSelectionIndexPath()

        this.setSourceFile({
            sourceFile: this.getSourceFile(),
            showsUnformattedComments: this.showsUnformattedComments(),
            isEditingDocumentation: this.isEditingDocumentation(),
        })

        fileObjectsTree.setSelectionIndexPath({ indexPath: currentSelectionIndexPath })
    }
}

module.exports = Classification.define(FileInspectorFlow)
