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

        flowBuilder.main({ id: 'playground' }, function(application) {

            this.setCommandsController( commandsController )

            this.defineFlowCommandsIn({ method: application.flowMethods })
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

            application.evaluateEventHandler({ event: 'application-flow-built', eventHandler: () => {} })
        })
    }

    flowMethods(thisFlow) {
        this.category( 'flow methods', () => {
            const methods = [
                'pickFile',
                'getLastOpenedFolder',
            ]

            this.defineCommandMethods({ methodNames: methods })
        })
    }

    flowCommands(thisFlow) {
        this.category( 'application commands methods', () => {
            this.command({
                id: 'openFile',
                whenActioned: function({ filename: filename }) {
                    if( ! filename ) { return }

                    thisFlow.openFile({ filename: filename })
                }
            })

            this.command({
                id: 'openFileInNewWindow',
                whenActioned: function({ filename: filename }) {
                    if( ! filename ) { return }
                    Sirens.openPlayground({ filename: filename })
                }
            })

            this.command({
                id: 'saveFile',
                enabledIf: function() {
                    return thisFlow.hasSourceFile()
                },
                whenActioned: function() {
                    thisFlow.saveOpenedFile()
                }
            })

            this.command({
                id: 'openClassEditor',
                whenActioned: function() {
                    Sirens.openClassEditor()
                }
            })

            this.command({
                id: 'openPlayground',
                whenActioned: function() {
                    Sirens.openPlayground()
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

    /// Actions

    pickFile() {
        throw new Error(`This methods is expected to be implemented by the application.`)
    }

    openFile({ filename: filename }) {
        const sourceFile = SourceFile.new({ filepath: filename })

        if( filename !== null ) {
            this.lastOpenedFolder = path.dirname( filename )
        }

        this.setSourceFile({ sourceFile: sourceFile })
    }

    saveOpenedFile() {
        const sourceFile = this.getSourceFile()

        if( sourceFile === undefined ) { return }

        const fileNewContents = this.getChildFlow({ id: 'fileContents' }).getValue()

        sourceFile.saveFileContents( fileNewContents )
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
