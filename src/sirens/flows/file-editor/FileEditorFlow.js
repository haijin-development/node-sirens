    const path = require('path')
const Classification = require('../../../O').Classification
const ApplicationCommandsController = require('../ApplicationCommandsController')
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const SourceFile = require('../../objects/SourceFile')
const FileInspectorFlow = require('../file-inspector/FileInspectorFlow')
const Sirens = require('../../../Sirens')

class FileEditorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        const commandsController = ApplicationCommandsController.new({ mainFlow: this })

        this.setCommandsController( commandsController )

        flow.main({ id: 'main' }, function(application) {

            this.defineFlowCommandsIn({ method: application.flowCommands })
            this.defineFlowCommandsIn({ method: application.flowMethods })

            this.whenObjectChanges( ({ newValue: sourceFile }) => {
                this.getChildFlow({ id: 'windowTitle' }).setObject( sourceFile )
                this.getChildFlow({ id: 'selectedFile' }).setValue( sourceFile )
            })

            this.bufferedValue({
                id: 'windowTitle',
                convertToValueWith: ({ object: sourceFile }) => {
                    return sourceFile ?
                        `Class editor - ${sourceFile.getFilePath()}` :
                        'Class editor - No source file selected.'
                },
            })

            this.object({
                id: 'selectedFile',
                definedWith: FileInspectorFlow.new(),
            })
        })
    }

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'application-commands' }, function() {
            this.command({
                id: 'openFile',
                whenActioned: function({ filename: filename }) {
                    thisFlow.openFile({ filename: filename })
                }
            })

            this.command({
                id: 'openFileInNewWindow',
                whenActioned: function({ filename: filename }) {
                    Sirens.openFileEditor({ filename: filename })
                }
            })

            this.command({
                id: 'openFileEditor',
                enabledIf: function() {
                    return thisFlow.hasAClassSelected()
                },
                whenActioned: function() {
                    const selectedFile = thisFlow.getChildFlow({ id: 'selectedFile' })
                    const filename = selectedFile.getSourceFile().getFilePath()
                    Sirens.openFileEditor({ filename: filename })
                }
            })

            this.command({
                id: 'openPlayground',
                whenActioned: function() {
                    Sirens.openPlayground()
                }
            })

            this.command({
                id: 'openDocumentationBrowser',
                enabledIf: function() {
                    return thisFlow.hasAClassSelected()
                },
                whenActioned: function() {
                    const selectedSection = thisFlow.getChildFlow({ id: 'selectedFile.selectedFileObject' })
                    const jsClass = selectedSection.getValue()
                    const methodName = selectedSection.getSelectedMethodName()
                    Sirens.browseClassDocumentation({ jsClass: jsClass, methodName: methodName })
                }
            })

            this.command({
                id: 'pickAndOpenFile',
                whenActioned: function({ parentWindow: parentWindow }) {
                    const filename = thisFlow.executeCommand({ id: 'pickFile', with: { parentWindow: parentWindow } })

                    if( filename === null ) { return }

                    thisFlow.openFile({ filename: filename })
                },
            })

            this.command({
                id: 'pickAndOpenFileInNewWindow',
                whenActioned: function({ parentWindow: parentWindow }) {
                    const filename = thisFlow.executeCommand({ id: 'pickFile', with: { parentWindow: parentWindow } })

                    if( filename === null ) { return }

                    thisFlow.executeCommand({ id: 'openFileInNewWindow',  with: {filename: filename} })
                },
            })
        })
    }

    flowMethods(thisFlow) {
        this.commandsGroup({ id: 'flow-methods' }, function() {
            this.defineMethodAsCommand({ flow: thisFlow, methodName: 'pickFile' })
            this.defineMethodAsCommand({ flow: thisFlow, methodName: 'getLastOpenedFolder' })
        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'application-commands.openFile',
            'application-commands.openFileInNewWindow',
            'application-commands.openFileEditor',
            'application-commands.openPlayground',
            'application-commands.openDocumentationBrowser',
            'application-commands.pickAndOpenFile',
            'application-commands.pickAndOpenFileInNewWindow',

            'flow-methods.pickFile',
            'flow-methods.getLastOpenedFolder',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    //////////////////
    /// Flow methods
    //////////////////

    pickFile() {
        throw new Error('The implementation of this method is responsibility of the application')
    }

    openFile({ filename: filename }) {
        let sourceFile = SourceFile.new({ filepath: filename })

        if( filename !== null ) {
            this.lastOpenedFolder = path.dirname( filename )
        }

        this.setSourceFile({ sourceFile: sourceFile })
    }

    /// Querying

    getLastOpenedFolder() {
        return this.lastOpenedFolder
    }

    getSourceFile() {
        return this.getValue()
    }

    setSourceFile({ sourceFile: sourceFile }) {
        return this.setValue( sourceFile )
    }

    hasAClassSelected() {
        const selectedFileObjectFlow = this.getChildFlow({ id: 'selectedFile.selectedFileObject' })

        return  selectedFileObjectFlow.respondsTo('hasAClassSelected')
                && 
                selectedFileObjectFlow.hasAClassSelected()
    }
}

module.exports = Classification.define(FileEditorFlow)
