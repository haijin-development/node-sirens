const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const TextualContentInspectorFlow = require('../file-object-inspectors/TextualContentInspectorFlow')
const SourceFileStructureParser = require('../../objects/SourceFileStructureParser')
const UknownFileStructure = require('../../objects/file-structure/UknownFileStructure')
const FolderObject = require('../../objects/file-structure/FolderObject')

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

            this.whenObjectChanges( ({ newValue: sourceFile, oldValue: oldValue }) => {
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

                    const newValue = fileObject ? fileObject : null

                    const fileTypeFlow = thisFlow.getFileObjectInspectorFlow({ fileObject: fileObject })

                    thisFlow.replaceChildFlow({
                        id: 'selectedFileObject',
                        withFlow: fileTypeFlow, 
                    })

                    fileTypeFlow.setValue( newValue )
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
                id: 'getFileObjectInspectorFlow',
                whenActioned: function({ fileObject: fileObject }) {
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
            'flow-commands.getFileObjectInspectorFlow',
            'flow-commands.getFileObjectComponent',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    /// Querying

    getSourceFile() {
        return this.getValue()
    }

    setSourceFile({ sourceFile: sourceFile }) {
        return this.setValue( sourceFile )
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
}

module.exports = Classification.define(FileInspectorFlow)
