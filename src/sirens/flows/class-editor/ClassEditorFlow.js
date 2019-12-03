const path = require('path')
const Classification = require('../../../O').Classification
const ApplicationCommandsController = require('../ApplicationCommandsController')
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const ClassSourceFile = require('../../objects/ClassSourceFile')
const FileClassesEditionFlow = require('./FileClassesEditionFlow')
const Sirens = require('../../../Sirens')

class ClassEditorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        const commandsController = ApplicationCommandsController.new({ mainFlow: this })

        flow.main({ id: 'classEditor' }, function(application) {

            this.setCommandsController( commandsController )

            this.defineFlowCommandsIn({ method: application.flowCommands })
            this.defineFlowCommandsIn({ method: application.flowMethods })

            this.whenObjectChanges( ({ newValue: sourceFile }) => {
                this.getChildFlow({ id: 'windowTitle' }).setObject( sourceFile )
                this.getChildFlow({ id: 'sourceFileEdition' }).setValue( sourceFile )
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
                id: 'sourceFileEdition',
                definedWith: FileClassesEditionFlow.new(),
            })

            application.evaluateEventHandler({ event: 'application-flow-built', eventHandler: () => {} })
        })
    }

    flowCommands(thisFlow) {
        this.category( 'application commands', () => {
            this.command({
                id: 'openFile',
                whenActioned: function({ filename: filename }) {
                    thisFlow.openFile({ filename: filename })
                }
            })

            this.command({
                id: 'openFileInNewWindow',
                whenActioned: function({ filename: filename }) {
                    Sirens.openClassEditor({ filename: filename })
                }
            })

            this.command({
                id: 'openClassEditor',
                enabledIf: function() {
                    return thisFlow.hasAClassSelected()
                },
                whenActioned: function() {
                    const sourceFileEdition = thisFlow.getChildFlow({ id: 'sourceFileEdition' })
                    const filename = sourceFileEdition.getSourceFile().getFilePath()
                    Sirens.openClassEditor({ filename: filename })
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
                    const sourceFileEdition = thisFlow.getChildFlow({ id: 'sourceFileEdition' })
                    const fileSection = sourceFileEdition.getSelectedClassDefinition()
                    const methodName = sourceFileEdition.getSelectedMethodName()
                    Sirens.browseClassDocumentation({ classDefinition: fileSection, methodName: methodName })
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
        this.category( 'flow methods', () => {
            const methods = [
                'pickFile',
                'getLastOpenedFolder',
            ]

            this.defineCommandMethods({ methodNames: methods })
        })
    }

    //////////////////
    /// Flow methods
    //////////////////

    pickFile() {
        throw new Error('The implementation of this method is responsibility of the application')
    }

    openFile({ filename: filename }) {
        let sourceFile = ClassSourceFile.new({ filepath: filename })

        if( filename !== null ) {
            this.lastOpenedFolder = path.dirname( filename )
        }

        if( ! sourceFile.isJavascriptFile() ) {
            sourceFile = null
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
        const sourceFileEdition = this.getChildFlow({ id: 'sourceFileEdition' })
        const section = sourceFileEdition.getChildFlow({ id: 'selectedSectionContents' }).getValue()

        return section ? sourceFileEdition.isClassDefinition({ fileSection: section }) : false
    }
}

module.exports = Classification.define(ClassEditorFlow)
