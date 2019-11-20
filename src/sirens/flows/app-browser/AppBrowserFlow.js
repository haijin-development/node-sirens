const Classification = require('../../../O').Classification
const FlowModel = require('../../../Skins').FlowModel
const ApplicationCommandsRouter = require('../ApplicationCommandsRouter')
const Folder = require('../../objects/paths/Folder')
const FileClassesEditionFlow = require('../class-editor/FileClassesEditionFlow')
const ClassSourceFile = require('../../objects/ClassSourceFile')
const Sirens = require('../../../Sirens')

class AppBrowserFlow {

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

            this.whenObjectChanges( ({ newValue: appFolder }) => {
                application.getChild({ id: 'windowTitle' }).setObject( appFolder )
                application.getChild({ id: 'filesTree' }).setRoots({ items: [ appFolder ] })
            })

            this.objectAttributeValue({
                id: 'windowTitle',
                attributeReader: (appFolder) => { 
                    return appFolder ? `App Browser - ${appFolder.getPath()}` : 'App Browser - No folder selected.'
                },
            })

            this.treeChoice({
                id: 'filesTree',
                roots: [],
                getChildrenClosure: (path) => { return path.getChildren() },
                whenSelectionChanges: function({ newValue: treePath }) {
                    const selectedFilePath = treePath[ treePath.length - 1 ]

                    let sourceFile = null

                    if( selectedFilePath ) {
                        sourceFile = ClassSourceFile.new({ filepath: selectedFilePath.getPath() })
                        if( ! sourceFile.isJavascriptFile() ) { sourceFile = null }
                    }

                    application.getChild({ id: 'sourceFileEdition' }).setObject( sourceFile )
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
                id: 'openApplicationFolder',
                enabledIf: function() { return true },
                whenActioned: function({ folderPath: folderPath }) {
                    application.openFolder({ path: folderPath })
                }
            })

            this.command({
                id: 'openClassDocumentation',
                enabledIf: function(application) {
                    const classesDefinitions = application.getClassesDefinitionsInSelectedFile()
                    return classesDefinitions.length > 0
                },
                whenActioned: function() {
                    const sourceFileEdition = application.getChild({ id: 'sourceFileEdition' })
                    const fileSection = sourceFileEdition.getSelectedClassDefinition()
                    const methodName = sourceFileEdition.getSelectedMethodName()
                    Sirens.browseClassDocumentation({ classDefinition: fileSection, methodName: methodName })
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
                id: 'openClassEditor',
                enabledIf: function() { return true },
                whenActioned: function() {
                    const selectedPath = application.getSelectedFilePath()
                    Sirens.openClassEditor({ filename: selectedPath })
                }
            })

        })
    }

    /// Actions

    openFolder({ path: folderPath }) {
        const appFolder = Folder.new({ path: folderPath })

        if( folderPath !== null ) {
            this.lastOpenedFolder = folderPath
        }

        this.setValue( appFolder )
    }

    /// Querying

    getLastOpenedFolder() {
        return this.lastOpenedFolder
    }

    getSelectedFilePath() {
        const currentSourceFile = this.getChild({ id: 'sourceFileEdition' }).getSourceFile()

        if( ! currentSourceFile ) { return null }

        return currentSourceFile.getFilePath()
    }

    getClassesDefinitionsInSelectedFile() {
        const currentSourceFile = this.getChild({ id: 'sourceFileEdition' }).getSourceFile()

        if( ! currentSourceFile ) { return [] }

        return currentSourceFile.getClasses()
    }
}

module.exports = Classification.define(AppBrowserFlow)
