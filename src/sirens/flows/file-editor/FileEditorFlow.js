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

        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

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
        this.commandsGroup({ id: 'flow-commands' }, function() {
            this.command({
                id: 'openFile',
                whenActioned: thisFlow.openFile.bind(thisFlow),
            })

            this.command({
                id: 'openFileInNewWindow',
                whenActioned: thisFlow.openFileInNewWindow.bind(thisFlow),
            })

            this.command({
                id: 'openFileEditor',
                enabledIf: function() {
                    return thisFlow.hasAClassSelected()
                },
                whenActioned: thisFlow.openFileEditor.bind(thisFlow),
            })

            this.command({
                id: 'openPlayground',
                whenActioned: thisFlow.openPlayground.bind(thisFlow),
            })

            this.command({
                id: 'openDocumentationBrowser',
                enabledIf: function() {
                    return thisFlow.hasAClassSelected()
                },
                whenActioned: thisFlow.openDocumentationBrowser.bind(thisFlow),
            })

            this.command({
                id: 'pickAndOpenFile',
                whenActioned: thisFlow.pickAndOpenFile.bind(thisFlow),
            })

            this.command({
                id: 'pickAndOpenFileInNewWindow',
                whenActioned: thisFlow.pickAndOpenFileInNewWindow.bind(thisFlow),
            })

            this.command({
                id: 'pickFile',
                whenActioned: thisFlow.pickFile.bind(thisFlow),
            })

            this.command({
                id: 'getLastOpenedFolder',
                whenActioned: thisFlow.getLastOpenedFolder.bind(thisFlow),
            })
        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.openFile',
            'flow-commands.openFileInNewWindow',
            'flow-commands.openFileEditor',
            'flow-commands.openPlayground',
            'flow-commands.openDocumentationBrowser',
            'flow-commands.pickAndOpenFile',
            'flow-commands.pickAndOpenFileInNewWindow',
            'flow-commands.pickFile',
            'flow-commands.getLastOpenedFolder',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    //////////////////
    /// Flow methods
    //////////////////

    openFile({ filename: filename }) {
        this.openFile({ filename: filename })
    }

    openFileInNewWindow({ filename: filename })  {
        Sirens.openFileEditor({ filename: filename })
    }

    openFileEditor() {
        const selectedFile = this.getChildFlow({ id: 'selectedFile' })

        const filename = selectedFile.getSourceFile().getFilePath()

        Sirens.openFileEditor({ filename: filename })
    }

    openPlayground() {
        Sirens.openPlayground()
    }

    openDocumentationBrowser() {
        const selectedSection = this.getChildFlow({ id: 'selectedFile.selectedFileObject' })

        const jsClass = selectedSection.getValue()

        const methodName = selectedSection.getSelectedMethodName()

        Sirens.browseClassDocumentation({ jsClass: jsClass, methodName: methodName })
    }


    pickAndOpenFile({ parentWindow: parentWindow }) {
        const filename = this.executeCommand({ id: 'pickFile', with: { parentWindow: parentWindow } })

        if( filename === null ) { return }

        this.openFile({ filename: filename })
    }


    pickAndOpenFileInNewWindow({ parentWindow: parentWindow }) {
        const filename = this.executeCommand({ id: 'pickFile', with: { parentWindow: parentWindow } })

        if( filename === null ) { return }

        this.executeCommand({ id: 'openFileInNewWindow',  with: {filename: filename} })
    }

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
