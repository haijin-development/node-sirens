const path = require('path')
const Classification = require('../../../O').Classification
const FlowModel = require('../../../Skins').FlowModel
const SourceFile = require('../../objects/SourceFile')

class PlaygroundBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [FlowModel]
    }

    /// Building

    buildWith(flow) {
        flow.main( function(application) {

            this.whenObjectChanges( ({ newValue: sourceFile }) => {
                application.getChild({ id: 'windowTitle' }).setObject( sourceFile )
                application.getChild({ id: 'fileContents' }).setObject( sourceFile )
            })

            this.objectAttributeValue({
                id: 'windowTitle',
                attributeReader: (sourceFile) => { 
                    return sourceFile ? `Playground - ${sourceFile.getFilePath()}` : 'Playground - No source file selected.'
                },
            })

            this.bufferedAttributeValue({
                id: 'fileContents',
                attributeReader: (sourceFile) => { 
                    return sourceFile ? sourceFile.getFileContents() : ''
                },
            })
        })
    }

    /// Actions

    openFile({ filename: filename }) {
        const sourceFile = SourceFile.new({ filepath: filename })

        if( filename !== null ) {
            this.lastOpenedFolder = path.dirname( filename )
        }

        this.setSourceFile({ sourceFile: sourceFile })
    }

    saveOpenedFile() {
        const sourceFile = this.getSourceFile()

        if( sourceFile === undefined ) { return }

        const fileNewContents = this.getChild({ id: 'fileContents' }).getValue()

        sourceFile.saveFileContents( fileNewContents )
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
}

module.exports = Classification.define(PlaygroundBrowserModel)
