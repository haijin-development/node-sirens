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

        this.setCommandsController( commandsController )

        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

            this.whenObjectChanges( ({ newValue: appFolder }) => {
                const filesTreeRoots = appFolder ? [ appFolder ] : []

                thisFlow.getChildFlow({ id: 'windowTitle' })
                    .setObject( appFolder )
                thisFlow.getChildFlow({ id: 'filesTree' })
                    .setRoots({ items: filesTreeRoots })
            })

            this.value({ id: 'browsingMode' }, function() {

                this.toggle({
                    id: 'showsUnformattedComments',
                    whenValueChanges: ({ newValue: boolean }) => {
                        thisFlow.getChildFlow({ id: 'selectedFile' })
                            .setShowUnformattedComments({ value: boolean })
                    },
                })

                this.toggle({
                    id: 'isEditingDocumentation',
                    whenValueChanges: ({ newValue: boolean }) => {
                        thisFlow.getChildFlow({ id: 'selectedFile' })
                            .setIsEditingDocumentation({ value: boolean })
                    },
                })

                this.toggle({ id: 'browsingDocumentation' })

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

                    thisFlow.getChildFlow({ id: 'selectedFile' })
                        .setSourceFile({
                            sourceFile: sourceFile,
                            isEditingDocumentation: thisFlow.isEditingDocumentation(),
                            showsUnformattedComments: thisFlow.showsUnformattedComments(),
                        })
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

            this.statelessCommands({
                definedInFlow: thisFlow,
                withMethods: [
                    'pickAndOpenFolder',
                    'openPlayground',
                    'pickFolder',
                    'openFolder',
                    'getSelectedFilePath',
                    'hasAClassSelected',
                ],
            })

        })

        this.acceptedBubbledUps({
            commands: [
                'setIsBrowsingDocumentation',
                'showsUnformattedComments',
                'isEditingDocumentation',
                'isBrowsingDocumentation',
            ],
        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.pickAndOpenFolder',
            'flow-commands.openPlayground',
            'flow-commands.openFolder',
            'flow-commands.getSelectedFilePath',
            'flow-commands.hasAClassSelected',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    //////////////////////
    /// Flow methods
    //////////////////////

    pickAndOpenFolder({ parentWindow: parentWindow }) {
        const appFolderPath = this.pickFolder({ parentWindow: parentWindow })

        if( appFolderPath === null ) { return }

        const handler = this.openFolder({ folderPath: appFolderPath })
    }

    openPlayground() {
        Sirens.openPlayground()
    }

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
        const selectedFileObjectFlow = this.getChildFlow({ id: 'selectedFile.selectedFileObject' })

        return  selectedFileObjectFlow.respondsTo('hasAClassSelected')
                && 
                selectedFileObjectFlow.hasAClassSelected()
    }

    showsUnformattedComments() {
        return this.getChildFlow({ id: 'browsingMode.showsUnformattedComments' })
            .getValue()
    }

    isEditingDocumentation() {
        return this.getChildFlow({ id: 'browsingMode.isEditingDocumentation' })
            .getValue()        
    }

    // Set to remember that the flow is browsing documentation.
    // This flow uses this flag for the child flows it creates.
    setIsBrowsingDocumentation({ value: boolean }) {
        this.getChildFlow({ id: 'browsingDocumentation' })
            .setValue( boolean )
    }

    isBrowsingDocumentation() {
        return this.getChildFlow({ id: 'browsingDocumentation' })
            .getValue()        
    }
}

module.exports = Classification.define(AppBrowserFlow)
