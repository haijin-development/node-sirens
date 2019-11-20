const path = require('path')
const Classification = require('../../../O').Classification
const FlowModel = require('../../../Skins').FlowModel
const ApplicationCommandsRouter = require('../ApplicationCommandsRouter')
const SourceFile = require('../../objects/SourceFile')
const Sirens = require('../../../Sirens')

class PlaygroundBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [FlowModel]
    }

    /// Building

    buildWith(flow) {
        const commandsRouter = ApplicationCommandsRouter.new({ application: this })

        flow.main( function(application) {

            this.setCommandsRouter( commandsRouter )

            this.evaluate({ closure: application.defineApplicationCommands, params: [application] })

            this.whenObjectChanges( ({ newValue: sourceFile }) => {
                application.getChild({ id: 'windowTitle' }).setObject( sourceFile )
                application.getChild({ id: 'fileContents' }).setObject( sourceFile )
            })

            this.objectAttributeValue({
                id: 'windowTitle',
                attributeReader: (sourceFile) => { 
                    return sourceFile ? `Playground - ${sourceFile.getFilePath()}` : 'Playground - No source file selected.'
                },
            })

            this.bufferedAttributeValue({
                id: 'fileContents',
                attributeReader: (sourceFile) => { 
                    return sourceFile ? sourceFile.getFileContents() : ''
                },
            })

            this.notifyCommandsRouterOfEvent({ flowPointId: 'application', event: 'main-flow-built' })
        })
    }

    defineApplicationCommands(application) {
        this.commands({ id: 'applicationCommands' }, function() {

            this.command({
                id: 'openFile',
                enabledIf: function() { return true },
                whenActioned: function({ filename: filename }) {
                    if( ! filename ) { return }

                    application.openFile({ filename: filename })
                }
            })

            this.command({
                id: 'openFileInNewWindow',
                enabledIf: function() { return true },
                whenActioned: function({ filename: filename }) {
                    if( ! filename ) { return }
                    Sirens.openPlayground({ filename: filename })
                }
            })

            this.command({
                id: 'saveFile',
                enabledIf: function() {
                    return this.getSourceFile() !== undefined
                },
                whenActioned: function() {
                    application.saveOpenedFile()
                }
            })

            this.command({
                id: 'openClassEditor',
                enabledIf: function(application) { return true },
                whenActioned: function() {
                    Sirens.openClassEditor()
                }
            })

            this.command({
                id: 'openPlayground',
                enabledIf: function() { return true },
                whenActioned: function() {
                    Sirens.openPlayground()
                }
            })

        })
    }

    /// Actions

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

        const fileNewContents = this.getChild({ id: 'fileContents' }).getValue()

        sourceFile.saveFileContents( fileNewContents )
    }

    /// Querying

    getLastOpenedFolder() {
        return this.lastOpenedFolder
    }

    getSourceFile() {
        return this.getObject()
    }

    setSourceFile({ sourceFile: sourceFile }) {
        return this.setObject( sourceFile )
    }
}

module.exports = Classification.define(PlaygroundBrowserFlow)
