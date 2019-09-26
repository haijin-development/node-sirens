const Classification = require('../../o-language/classifications/Classification')
const BufferedAttributeModel = require('../../gui/models/BufferedAttributeModel')
const ListModel = require('../../gui/models/ListModel')
const ClassSourceFile = require('../../sirens/objects/ClassSourceFile')
const ClassEditionModel = require('./ClassEditionModel')

class ClassEditorModel {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'sourceFile',
            'sourceFilenameModel',
            'classesDefinitionsModel',
            'footerSourceCodeModel',
        ]
    }


    /// Initializing

    initialize() {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.sourceFile = null

        this.sourceFilenameModel = BufferedAttributeModel.new({
            attributeReader: this.getFilePath.bind(this)
        })

        this.classesDefinitionsModel = ListModel.new({ list: [] })

        this.footerSourceCodeModel = BufferedAttributeModel.new({
            attributeReader: this.getFooterDefinitionSourceCode.bind(this)
        })
    }

    /// Accessing

    getSourceFilenameModel() {
        return this.sourceFilenameModel
    }

    getClassesDefinitionsModel() {
        return this.classesDefinitionsModel
    }

    getFooterSourceCodeModel() {
        return this.footerSourceCodeModel
    }

    getFilePath(classSourceFile) {
        if( classSourceFile === undefined && this.sourceFile === null ) {
            return 'No source file selected.'
        }

        if( classSourceFile === undefined && this.sourceFile !== null ) {
            return 'Not a valid javascript file.'
        }

        return classSourceFile.getFilePath()
    }

    getFooterDefinitionSourceCode(footerDefinition) {
        if( footerDefinition === undefined && this.sourceFile === null ) {
            return 'No source file selected.'
        }

        if( footerDefinition === undefined && this.sourceFile !== null ) {
            return 'Not a valid javascript file.'
        }

        return footerDefinition.getSourceCode()
    }

    /// Actions    

    reloadFile() {
        const filename = this.sourceFile.getFilePath()

        this.openFile({ filename: filename })
    }

    openFile({ filename: filename }) {
        this.sourceFile = ClassSourceFile.new({ filepath: filename })

        if( ! this.sourceFile.isJavascriptFile() ) {
            this.clearModels()

            return
        }

        this.sourceFilenameModel.setObject( this.sourceFile )

        const classesDefinitionsInFile =
            this.sourceFile.getClassDefinitions().map( (classDefinition) =>{
                return ClassEditionModel.new({ classDefinition: classDefinition })
            })

        this.classesDefinitionsModel.setList(classesDefinitionsInFile)

        this.footerSourceCodeModel.setObject(
            this.sourceFile.getFooterDefinition()
        )
    }

    clearModels() {
        this.sourceFilenameModel.setObject( undefined )

        this.classesDefinitionsModel.setList( [] )

        this.footerSourceCodeModel.setObject( undefined )
    }

    saveFile({ selectedPageModel: selectedPageModel }) {
        const selectedPageSourceCode = selectedPageComponent.getModel().getValue()

        const pageObject = selectedPageModel.getObject()

        pageObject.writeSourceCode( selectedPageSourceCode )

        this.reloadFile()
    }
}

module.exports = Classification.define(ClassEditorModel)
