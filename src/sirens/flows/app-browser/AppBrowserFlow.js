const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const ApplicationCommandsController = require('../ApplicationCommandsController')
const Folder = require('../../objects/paths/Folder')
const FileClassesEditionFlow = require('../class-editor/FileClassesEditionFlow')
const ClassSourceFile = require('../../objects/ClassSourceFile')
const Sirens = require('../../../Sirens')
const FolderChooser = require('../../../Skins').FolderChooser

class AppBrowserFlow {

    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        const commandsController = ApplicationCommandsController.new({ mainFlow: this })

        flow.main({ id: 'appBrowser' }, function(thisFlow) {

            this.setCommandsController( commandsController )

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })
            this.defineFlowCommandsIn({ method: thisFlow.flowMethods })

            this.whenObjectChanges( ({ newValue: appFolder }) => {
                thisFlow.getChildFlow({ id: 'windowTitle' }).setValue( appFolder )
                thisFlow.getChildFlow({ id: 'filesTree' }).setRoots({ items: [ appFolder ] })
            })

            this.bufferedValue({
                id: 'windowTitle',
                convertToValueWith: ({ object: appFolder }) => {
                    return appFolder ?
                        `App Browser - ${appFolder.getPath()}` :
                        'App Browser - No folder selected.'
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

                    thisFlow.getChildFlow({ id: 'sourceFileEdition' }).setValue( sourceFile )
                },
            })

            this.object({
                id: 'sourceFileEdition',
                definedWith: FileClassesEditionFlow.new(),
            })

            thisFlow.evaluateEventHandler({ event: 'appBrowser-flow-built', eventHandler: () => {} })
        })
    }

    flowCommands(thisFlow) {
        this.category( 'application commands', () => {

            this.command({
                id: 'pickAndOpenFolder',
                whenActioned: function({ parentWindow: parentWindow }) {
                    const appFolderPath = thisFlow.pickFolder({ parentWindow: parentWindow })

                    if( appFolderPath === null ) { return }

                    const handler = thisFlow.openFolder({ folderPath: appFolderPath })
                }
            })

            this.command({
                id: 'openClassEditor',
                whenActioned: function() {
                    const selectedPath = thisFlow.getSelectedFilePath()
                    Sirens.openClassEditor({ filename: selectedPath })
                }
            })

            this.command({
                id: 'openPlayground',
                whenActioned: function() {
                    Sirens.openPlayground()
                }
            })

            this.command({
                id: 'openClassDocumentation',
                enabledIf: function() {
                    const classesDefinitions = thisFlow.getClassesDefinitionsInSelectedFile()
                    return classesDefinitions.length > 0
                },
                whenActioned: function() {
                    const sourceFileEdition = thisFlow.getChildFlow({ id: 'sourceFileEdition' })
                    const fileSection = sourceFileEdition.getSelectedClassDefinition()
                    const methodName = sourceFileEdition.getSelectedMethodName()
                    Sirens.browseClassDocumentation({ classDefinition: fileSection, methodName: methodName })
                }
            })

        })

    }

    flowMethods(thisFlow) {
        this.category( 'flow methods', () => {
            const methods = [
                'pickFolder',
                'openFolder',
            ]

            this.defineCommandMethods({ methodNames: methods })
        })
    }

    //////////////////////
    /// Flow methods
    //////////////////////

    pickFolder({ parentWindow: parentWindow }) {
        const chosenFolder = FolderChooser.chooseFolder({
            title: 'Choose a folder',
            window: parentWindow,
            initialFolder: this.getLastOpenedFolder(),
        })

        return chosenFolder        
    }

    openFolder({ folderPath: folderPath }) {
        const appFolder = Folder.new({ path: folderPath })

        if( folderPath !== null ) {
            this.lastOpenedFolder = folderPath
        }

        this.setValue( appFolder )
    }

    getLastOpenedFolder() {
        return this.lastOpenedFolder
    }

    getSelectedFilePath() {
        const currentSourceFile = this.getChildFlow({ id: 'sourceFileEdition' }).getSourceFile()

        if( ! currentSourceFile ) { return null }

        return currentSourceFile.getFilePath()
    }

    getClassesDefinitionsInSelectedFile() {
        const currentSourceFile = this.getChildFlow({ id: 'sourceFileEdition' }).getSourceFile()

        if( ! currentSourceFile ) { return [] }

        return currentSourceFile.getClasses()
    }
}

module.exports = Classification.define(AppBrowserFlow)
