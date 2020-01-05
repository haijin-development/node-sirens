const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')
const SourceFile = require('../../objects/SourceFile')

class PlaygroundBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainFlow', 'lastOpenedFolder']
        this.assumes = [ValueFlow]
    }

    initialize({ mainFlow: mainFlow }) {
        this.mainFlow = mainFlow

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    bubbleUpCommandToMainFlow({ commandName: commandName, params: params }) {
        return this.mainFlow.executeCommand({
            id: commandName,
            withAll: params,
        })
    }

    /// Building

    buildWith(flowBuilder) {
        flowBuilder.main({ id: 'playground' }, function(thisFlow) {

            this.defineMethodsAsCommands({
                methods: [
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

            this.whenObjectChanges( ({ newValue: sourceFile }) => {
                this.getChildFlow({ id: 'windowTitle' }).setObject( sourceFile )
                this.getChildFlow({ id: 'fileContents' }).setObject( sourceFile )
            })

            this.bufferedValue({
                id: 'windowTitle',
                convertToValueWith: ({ object: sourceFile }) => {
                    return sourceFile ?
                        `Playground - ${sourceFile.getFilePath().getPath()}` :
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

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'openFile',
            'openFileInNewWindow',
            'saveFile',
            'openPlayground',
            'pickAndOpenFile',
            'pickAndOpenFileInNewWindow',
            'pickFile',
            'getLastOpenedFolder',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    /// Accessing namespaces

    skinsNamespace() {
        return this.mainFlow.skinsNamespace()
    }

    /// Actions

    openFile({ filename: filename }) {
        if( ! filename ) { return }

        const sourceFile = SourceFile.new({ filepath: filename })

        this.lastOpenedFolder = sourceFile.getFilePath().getFolderPath().getPath()

        this.setSourceFile({ sourceFile: sourceFile })
    }

    openFileInNewWindow({ filename: filename }) {
        if( ! filename ) { return }

        this.openPlayground({ filename: filename })
    }

    saveFile() {
        const sourceFile = this.getSourceFile()

        if( sourceFile === undefined ) { return }

        const fileNewContents = this.getChildFlow({ id: 'fileContents' }).getValue()

        sourceFile.saveFileContents( fileNewContents )
    }

    openPlayground({ filename: filename } = {}) {
        this.mainFlow.executeCommand({
            id: 'openPlayground',
            with: { filename: filename }
        })
    }

    pickAndOpenFile({ parentWindow: parentWindow }) {
        const filename = this.executeCommand({
            id: 'pickFile',
            with: { parentWindow: parentWindow }
        })

        if( filename === null ) { return }

        this.openFile({ filename: filename })
    }

    pickAndOpenFileInNewWindow({ parentWindow: parentWindow }) {
        const filename = this.executeCommand({ id: 'pickFile', with: { parentWindow: parentWindow } })

        if( filename === null ) { return }

        this.executeCommand({
            id: 'openFileInNewWindow',
            with: { filename: filename }
        })
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
