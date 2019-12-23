const path = require('path')
const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const ApplicationCommandsController = require('../ApplicationCommandsController')
const SourceFile = require('../../objects/SourceFile')
const Sirens = require('../../../Sirens')

class PlaygroundBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flowBuilder) {
        const commandsController = ApplicationCommandsController.new({ mainFlow: this })

        this.setCommandsController( commandsController )

        flowBuilder.main({ id: 'playground' }, function(application) {

            this.defineFlowCommandsIn({ method: application.flowCommands })

            this.whenObjectChanges( ({ newValue: sourceFile }) => {
                this.getChildFlow({ id: 'windowTitle' }).setObject( sourceFile )
                this.getChildFlow({ id: 'fileContents' }).setObject( sourceFile )
            })

            this.bufferedValue({
                id: 'windowTitle',
                convertToValueWith: ({ object: sourceFile }) => {
                    return sourceFile ?
                        `Playground - ${sourceFile.getFilePath()}` :
                        'Playground - No source file selected.'
                },
            })

            this.bufferedValue({
                id: 'fileContents',
                convertToValueWith: ({ object: sourceFile }) => {
                    return sourceFile ? sourceFile.getFileContents() : ''
                },
            })
        })
    }

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {

            this.statelessCommands({
                definedInFlow: thisFlow,
                withMethods: [
                    'openFile',
                    'openFileInNewWindow',
                    'openPlayground',
                    'pickAndOpenFile',
                    'pickAndOpenFileInNewWindow',
                    'pickFile',
                    'getLastOpenedFolder',
                ],
            })

            this.command({
                id: 'saveFile',
                enabledIf: function() {
                    return thisFlow.hasSourceFile()
                },
                whenActioned: thisFlow.saveFile.bind(thisFlow),
            })

        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.openFile',
            'flow-commands.openFileInNewWindow',
            'flow-commands.saveFile',
            'flow-commands.openPlayground',
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

    /// Actions

    openFile({ filename: filename }) {
        if( ! filename ) { return }

        const sourceFile = SourceFile.new({ filepath: filename })

        if( filename !== null ) {
            this.lastOpenedFolder = path.dirname( filename )
        }

        this.setSourceFile({ sourceFile: sourceFile })
    }

    openFileInNewWindow({ filename: filename }) {
        if( ! filename ) { return }

        Sirens.openPlayground({ filename: filename })
    }

    saveFile() {
        const sourceFile = this.getSourceFile()

        if( sourceFile === undefined ) { return }

        const fileNewContents = this.getChildFlow({ id: 'fileContents' }).getValue()

        sourceFile.saveFileContents( fileNewContents )
    }

    openPlayground() {
        Sirens.openPlayground()
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
        throw new Error(`This Command is expected to be implemented by the application.`)
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

    hasSourceFile() {
        const sourceFile = this.getSourceFile()

        return sourceFile !== undefined && sourceFile !== null
    }
}

module.exports = Classification.define(PlaygroundBrowserFlow)
