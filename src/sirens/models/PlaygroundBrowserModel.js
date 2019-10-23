const Classification = require('../../o-language/classifications/Classification')
const BufferedAttributeModel = require('../../gui/models/BufferedAttributeModel')
const ListModel = require('../../gui/models/ListModel')
const ClassSourceFile = require('../../sirens/objects/ClassSourceFile')
const ClassEditionModel = require('./ClassEditionModel')
const SourceFile = require('../objects/SourceFile')

class PlaygroundBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'sourceFile',
            'titleModel',
            'playgroundTextModel',
        ]
    }


    /// Initializing

    initialize() {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.sourceFile = null

        this.titleModel = BufferedAttributeModel.new({
            attributeReader: this.getTitle.bind(this)
        })

        this.playgroundTextModel = BufferedAttributeModel.new({
            attributeReader: this.getPlaygroundTextContents.bind(this)
        })
    }

    /// Accessing

    getTitleModel() {
        return this.titleModel
    }

    getPlaygroundTextModel() {
        return this.playgroundTextModel
    }

    getTitle(sourceFile) {
        if( sourceFile === null && this.sourceFile === null ) {
            return 'Playground - No source file selected.'
        }

        return 'Playground - ' + sourceFile.getFilePath()
    }

    getPlaygroundTextContents(sourceFile) {
        if( sourceFile === null ) { return '' }

        return sourceFile.getFileContents()
    }

    /// Actions    

    reloadFile() {
        const filename = this.sourceFile.getFilePath()

        this.openFile({ filename: filename })
    }

    openFile({ filename: filename }) {
        this.sourceFile = SourceFile.new({ filepath: filename })

        this.titleModel.setObject( this.sourceFile )

        this.playgroundTextModel.setObject( this.sourceFile )
    }

    saveFile() {
        if( this.sourceFile === null ) { return }

        const sourceCode = this.playgroundTextModel.getValue()

        this.sourceFile.saveFileContents( sourceCode )
    }
}

module.exports = Classification.define(PlaygroundBrowserModel)
