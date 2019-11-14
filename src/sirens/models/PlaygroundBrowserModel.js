const Classification = require('../../O').Classification
const BufferedAttributeModel = require('../../GUI').BufferedAttributeModel
const ValueModel = require('../../GUI').ValueModel
const ClassSourceFile = require('../../sirens/objects/ClassSourceFile')
const ClassEditionModel = require('./ClassEditionModel')
const SourceFile = require('../objects/SourceFile')

class PlaygroundBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [ValueModel]
    }

    /// Initializing

    initialize() {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.lastOpenedFolder = null
    }

    /// Accessing

    getSourceFile() {
        return this.getValue()
    }

    setSourceFile({ filename: filename }) {
        return this.setValue( filename )
    }

    getLastOpenedFolder() {
        return this.lastOpenedFolder
    }

    setLastOpenedFolder(folder) {
        this.lastOpenedFolder = folder
    }

    /// Querying

    getWindowTitle() {
        const sourceFile = this.getSourceFile()

        if( ! sourceFile ) {
            return 'Playground - No source file selected.'
        }

        return 'Playground - ' + sourceFile.getFilePath()
    }

    /// Actions

    reloadFile() {
        const filename = this.getSourceFile().getFilePath()

        this.openFile({ filename: filename })
    }

    openFile({ filename: filename }) {
        const sourceFile = SourceFile.new({ filepath: filename })

        this.setSourceFile({ filename: sourceFile })
    }

    saveFile({ fileContents: fileContents }) {
        if( this.fileContents === null ) { return }

        const sourceFile = this.getSourceFile()

        sourceFile.saveFileContents( fileContents )
    }
}

module.exports = Classification.define(PlaygroundBrowserModel)
