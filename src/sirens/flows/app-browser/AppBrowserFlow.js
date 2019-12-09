const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const ApplicationCommandsController = require('../ApplicationCommandsController')
const Folder = require('../../objects/paths/Folder')
const FileInspectorFlow = require('../file-inspector/FileInspectorFlow')
const SourceFile = require('../../objects/SourceFile')
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

        flow.main({ id: 'main' }, function(thisFlow) {

            this.setCommandsController( commandsController )

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })
            this.defineFlowCommandsIn({ method: thisFlow.flowMethods })

            this.whenObjectChanges( ({ newValue: appFolder }) => {
                const filesTreeRoots = appFolder ? [ appFolder ] : []

                thisFlow.getChildFlow({ id: 'windowTitle' }).setObject( appFolder )
                thisFlow.getChildFlow({ id: 'filesTree' }).setRoots({ items: filesTreeRoots })
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
                        sourceFile = SourceFile.new({ filepath: selectedFilePath.getPath() })
                    }

                    thisFlow.getChildFlow({ id: 'selectedFile' }).setValue( sourceFile )
                },
            })

            this.object({
                id: 'selectedFile',
                definedWith: FileInspectorFlow.new(),
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
                id: 'openFileEditor',
                whenActioned: function() {
                    const selectedPath = thisFlow.getSelectedFilePath()
                    Sirens.openFileEditor({ filename: selectedPath })
                }
            })

            this.command({
                id: 'openPlayground',
                whenActioned: function() {
                    Sirens.openPlayground()
                }
            })

        })

    }

    flowMethods(thisFlow) {
        this.category( 'flow methods', () => {
            const methods = [
                'pickFolder',
                'openFolder',
                'getSelectedFilePath',
                'hasAClassSelected',
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
        const appFolder = folderPath ? Folder.new({ path: folderPath }) : null

        if( folderPath !== null ) {
            this.lastOpenedFolder = folderPath
        }

        this.setValue( appFolder )
    }

    getLastOpenedFolder() {
        return this.lastOpenedFolder
    }

    getSelectedFilePath() {
        const currentSourceFile = this.getChildFlow({ id: 'selectedFile' }).getSourceFile()

        if( ! currentSourceFile ) { return null }

        return currentSourceFile.getFilePath()
    }

    hasAClassSelected() {
        const section = this.getChildFlow({ id: 'selectedFile.selectedSectionContents' })

        return section.hasAClassSelected()
    }
}

module.exports = Classification.define(AppBrowserFlow)
