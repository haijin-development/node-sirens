const Classification = require('../../../O').Classification
const FlowModel = require('../../../Skins').FlowModel
const Folder = require('../../objects/paths/Folder')
const FileClassesEditionModel = require('../class-editor/FileClassesEditionModel')
const ClassSourceFile = require('../../objects/ClassSourceFile')

class AppBrowserModel {

    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [FlowModel]
    }

    /// Building

    buildWith(flow) {
        flow.main( function(application) {

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
                definedWith: FileClassesEditionModel.new(),
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

module.exports = Classification.define(AppBrowserModel)
