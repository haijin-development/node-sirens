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

            this.defineFlowCommandsIn({ method: thisFlow.flowMethods })

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

                    const fileTypeFlow = thisFlow.executeCommand({
                        id: 'getFileObjectInspectorFlow',
                        with: { fileObject: fileObject },
                    })

                    thisFlow.replaceChildFlow({
                        id: 'selectedFileObject',
                        withFlow: fileTypeFlow, 
                    })

                    fileTypeFlow.setValue( newValue )
                },
            })

        })
    }

    flowMethods(thisFlow) {
        this.commandsGroup({ id: 'flow-methods' }, function() {
            this.defineMethodAsCommand({ flow: thisFlow, methodName: 'getSourceFile' })
            this.defineMethodAsCommand({ flow: thisFlow, methodName: 'getFileObjectInspectorFlow' })
            this.defineMethodAsCommand({ flow: thisFlow, methodName: 'getFileObjectComponent' })
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
        return TextualContentInspectorFlow.new()
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
                .parseStructureIn({ sourceFile: sourceFile })
        } catch(error) {
            return UknownFileStructure.new()
        }
    }
}

module.exports = Classification.define(FileInspectorFlow)
