const path = require('path')
const Classification = require('../../../O').Classification
const ModelObject = require('../../../GUI').ModelObject
const ClassSourceFile = require('../../objects/ClassSourceFile')
const FileClassesEditionModel = require('./FileClassesEditionModel')

class ClassEditorModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [ModelObject]
    }

    /// Building

    buildWith(modelBuilder) {
        modelBuilder.build( function(appModel) {

            this.whenObjectChanges( ({ newValue: sourceFile }) => {
                appModel.getChild({ id: 'windowTitle' }).setObject( sourceFile )
                appModel.getChild({ id: 'sourceFileEdition' }).setObject( sourceFile )
            })

            this.objectAttributeValue({
                id: 'windowTitle',
                attributeReader: (sourceFile) => { 
                    return sourceFile ? `Class editor - ${sourceFile.getFilePath()}` :
                        'Class editor - No source file selected.'
                },
            })

            this.object({
                id: 'sourceFileEdition',
                definedWith: FileClassesEditionModel.new(),
            })

        })
    }

    /// Actions

    openFile({ filename: filename }) {
        let sourceFile = ClassSourceFile.new({ filepath: filename })

        if( filename !== null ) {
            this.lastOpenedFolder = path.dirname( filename )
        }

        if( ! sourceFile.isJavascriptFile() ) {
            sourceFile = null
        }

        this.setSourceFile({ sourceFile: sourceFile })
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

module.exports = Classification.define(ClassEditorModel)
