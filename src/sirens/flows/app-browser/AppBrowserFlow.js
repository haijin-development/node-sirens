const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')
const ApplicationCommandsController = require('../ApplicationCommandsController')
const Folder = require('../../objects/paths/Folder')
const FileInspectorFlow = require('../file-inspector/FileInspectorFlow')
const SourceFile = require('../../objects/SourceFile')

class AppBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainFlow', 'lastOpenedFolder']
        this.assumes = [ValueFlow]
    }

    // review along with acceptedBubbledUps
    setMainFlow(mainFlow) {
        this.mainFlow = mainFlow
    }

    // review in the next iteration
    bubbleUpCommandToMainFlow({ commandName: commandName, params: params }) {
        return this.mainFlow.executeCommand({
            id: commandName,
            withAll: params,
        })
    }

    /// Building

    buildWith(flow) {
        const commandsController = ApplicationCommandsController.new({ mainFlow: this })

        this.setCommandsController( commandsController )

        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineMethodsAsCommands({
                methods: [
                    'pickAndOpenFolder',
                    'openPlayground',
                    'pickFolder',
                    'openFolder',
                    'getSelectedFilePath',
                    'hasAClassSelected',
                ],
            })

            this.acceptedBubbledUps({
                commands: [
                    'setIsBrowsingDocumentation',
                    'showsUnformattedComments',
                    'isEditingDocumentation',
                    'isBrowsingDocumentation',
                ],
            })

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

            this.acceptedBubbledUps({
                defaultHandler: function({ commandName: commandName, params: params }) {
                    return thisFlow.bubbleUpCommandToMainFlow({
                        commandName: commandName,
                        params: params
                    })
                }
            })

        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'pickAndOpenFolder',
            'openPlayground',
            'openFolder',
            'getSelectedFilePath',
            'hasAClassSelected',
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
        this.mainFlow.executeCommand({
            id: 'openPlayground',
        })
    }

    pickFolder({ parentWindow: parentWindow }) {
        // review in the next iteration
        const SirensNamespace = require('../SirensNamespace')
        const namespace = SirensNamespace.new().getChildFlow({ id: 'Skins' })

        const chosenFolder = namespace.FolderChooser.new().chooseFolder({
            title: 'Choose a folder',
            window: parentWindow,
            initialFolder: this.getLastOpenedFolder(),
        })

        return chosenFolder        
    }

    openFolder({ folderPath: folderPath } = {}) {
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
