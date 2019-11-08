const Classification = require('../../o-language/classifications/Classification')
const BufferedAttributeModel = require('../../gui/models/BufferedAttributeModel')
const TreeChoiceModel = require('../../gui/models/TreeChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ObjectPropModel = require('../../gui/models/ObjectPropModel')
const Folder = require('../objects/paths/Folder')
const Preferences = require('../objects/Preferences')
const ClassEditorModel = require('./ClassEditorModel')

class AppBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'preferences',
            'appFolder',
            'titleModel',
            'renderSelectedFileModel',
            'appFilesTreeModel',
        ]
    }


    /// Initializing

    initialize() {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.appFolder = null

        this.titleModel = ValueModel.new({ value: 'App Browser - No folder selected.' })

        this.renderSelectedFileModel = ValueModel.new()

        this.appFilesTreeModel = TreeChoiceModel.new({
            roots: [],
            getChildrenBlock: (path) => { return this.getPathChildren({ path: path }) },
        })

        this.connectModels()
    }

    /// Accessing

    getTitleModel() {
        return this.titleModel
    }

    getRenderSelectedFileModel() {
        return this.renderSelectedFileModel
    }

    getAppFilesTreeModel() {
        return this.appFilesTreeModel
    }

    getPathChildren({path: path}) {
        return path.getChildren()
    }

    getClassEditorModel() {
        const classEditorModel = ClassEditorModel.new()

        const selectedPath = this.getSelectedFilePath()

        if( selectedPath !== null  ) {
            classEditorModel.openFile({ filename: selectedPath })
        }

        return classEditorModel
    }

    /// Querying

    getSelectedFile() {
        return this.appFilesTreeModel.getSelectionValue()
    }

    getSelectedFilePath() {
        const selectedFile = this.getSelectedFile()

        if( selectedFile === null ) { return null }
        if( selectedFile.isFolder() ) { return null }

        return selectedFile.getPath()
    }

    getClassesDefinitions() {
        const classEditorModel = this.getClassEditorModel()

        return classEditorModel.getClassesDefinitions()
    }

    getClassesDefinitionsCount() {
        return this.getClassesDefinitions().length
    }

    hasNoClassDefinition() {
        return this.getClassesDefinitionsCount() === 0
    }

    /// Events

    connectModels() {
        this.appFilesTreeModel.onSelectionChanged( this.triggerRenderSelectedFile.bind(this) )
    }

    triggerRenderSelectedFile({ oldValue: oldValue, newValue: newValue }) {
        this.renderSelectedFileModel.triggerValueChanged({
            oldValue: null,
            newValue: null,
        })
    }

    /// Actions

    openFolder({ appFolder: appFolder }) {
        this.appFolder = Folder.new({ path: appFolder })

        this.appFilesTreeModel.setRoots({
            items: [this.appFolder]
        })

        this.titleModel.setValue( 'App Browser - ' + this.appFolder.getPath() )
    }
}

module.exports = Classification.define(AppBrowserModel)
