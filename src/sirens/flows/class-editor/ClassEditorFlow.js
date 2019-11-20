const path = require('path')
const Classification = require('../../../O').Classification
const ApplicationCommandsRouter = require('../ApplicationCommandsRouter')
const FlowModel = require('../../../Skins').FlowModel
const ClassSourceFile = require('../../objects/ClassSourceFile')
const FileClassesEditionFlow = require('./FileClassesEditionFlow')
const Sirens = require('../../../Sirens')

class ClassEditorFlow {
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
                application.getChild({ id: 'sourceFileEdition' }).setObject( sourceFile )
            })

            this.objectAttributeValue({
                id: 'windowTitle',
                attributeReader: (sourceFile) => { 
                    return sourceFile ? `Class editor - ${sourceFile.getFilePath()}` :
                        'Class editor - No source file selected.'
                },
            })

            this.object({
                id: 'sourceFileEdition',
                definedWith: FileClassesEditionFlow.new(),
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
                    Sirens.openClassEditor({ filename: filename })
                }
            })

            this.command({
                id: 'openClassEditor',
                enabledIf: function(application) {
                    return application.hasAClassSelected()
                },
                whenActioned: function() {
                    const sourceFileEdition = application.getChild({ id: 'sourceFileEdition' })
                    const filename = sourceFileEdition.getSourceFile().getFilePath()
                    Sirens.openClassEditor({ filename: filename })
                }
            })

            this.command({
                id: 'openPlayground',
                enabledIf: function() { return true },
                whenActioned: function() {
                    Sirens.openPlayground()
                }
            })

            this.command({
                id: 'openDocumentationBrowser',
                enabledIf: function() {
                    return application.hasAClassSelected()
                },
                whenActioned: function() {
                    const sourceFileEdition = application.getChild({ id: 'sourceFileEdition' })
                    const fileSection = sourceFileEdition.getSelectedClassDefinition()
                    const methodName = sourceFileEdition.getSelectedMethodName()
                    Sirens.browseClassDocumentation({ classDefinition: fileSection, methodName: methodName })
                }
            })

        })
    }

    /// Actions

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
        return this.getObject()
    }

    setSourceFile({ sourceFile: sourceFile }) {
        return this.setObject( sourceFile )
    }

    hasAClassSelected() {
        const sourceFileEdition = this.getChild({ id: 'sourceFileEdition' })
        const section = sourceFileEdition.getChild({ id: 'selectedSectionContents' }).getObject()
        return section ? sourceFileEdition.isClassDefinition({ fileSection: section }) : false
    }
}

module.exports = Classification.define(ClassEditorFlow)
