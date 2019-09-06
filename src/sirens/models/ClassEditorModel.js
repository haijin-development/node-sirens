const Classification = require('../../o-language/classifications/Classification')
const ValueModel = require('../../gui/models/ValueModel')
const ChoiceModel = require('../../gui/models/ChoiceModel')
const ClassSourceFile = require('../../sirens/objects/ClassSourceFile')

class ClassEditorModel {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'sourceFile',
            'classFileModel', 'classNameModel', 'classMethodsModel',
            'headerSourceCodeModel',
            'selectedMethodSourceCodeModel',
            'footerSourceCodeModel',
        ]
    }


    /// Initializing

    initialize() {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.sourceFile = null

        this.classFileModel = ValueModel.new()

        this.classNameModel = ValueModel.new({ value: '' })

        this.classMethodsModel = ChoiceModel.new({
            choices: [],
            selection: undefined,
        })

        this.headerSourceCodeModel = ValueModel.new({ value: '' })
        this.selectedMethodSourceCodeModel = ValueModel.new({ value: '' })
        this.footerSourceCodeModel = ValueModel.new({ value: '' })

        this.connectModels()
    }

    /// Accessing

    getClassNameModel() {
        return this.classNameModel
    }

    getClassMethodsModel() {
        return this.classMethodsModel
    }

    getHeaderSourceCodeModel() {
        return this.headerSourceCodeModel
    }

    getSelectedMethodSourceCodeModel() {
        return this.selectedMethodSourceCodeModel
    }

    getFooterSourceCodeModel() {
        return this.footerSourceCodeModel
    }

    /// Actions    

    reloadFile() {
        const filename = this.sourceFile.getFilePath()

        const selectedMethodIndex = this.classMethodsModel.getSelectionIndex()

        this.openFile({ filename: filename })

        this.classMethodsModel.setSelectionIndex({ index: selectedMethodIndex })
    }

    openFile({ filename: filename }) {
        this.sourceFile = ClassSourceFile.new({ filepath: filename })

        this.classFileModel.setValue( this.sourceFile.getFilePath() )

        const classDefinition = this.sourceFile.getClassDefinition()

        if( classDefinition === undefined ) {
            this.classNameModel.setValue( 'No class found')

            this.classMethodsModel.setChoices( [] )

            this.headerSourceCodeModel.setValue('No class found')

            this.footerSourceCodeModel.setValue('No class found')

            return
        }

        this.classNameModel.setValue( classDefinition.getClassName() + ' class')

        this.classMethodsModel.setChoices( classDefinition.getFunctionDefinitions() )

        this.headerSourceCodeModel.setValue(
            classDefinition.getHeaderDefinition().getSourceCode({ cr: "\r" })
        )

        this.footerSourceCodeModel.setValue(
            classDefinition.getFooterDefinition().getSourceCode({ cr: "\r" })
        )
    }

    /*
     * Note: this implementation must be think and built again.
     */
    saveFile({ changedModel: changedModel }) {

        if( changedModel === this.headerSourceCodeModel ) {
            this.saveHeaderToFile()
        } else if ( changedModel === this.footerSourceCodeModel ) {
            this.saveFooterToFile()
        } else {
            this.saveSelectedMethodToFile()
        }

        this.reloadFile()
    }

    saveHeaderToFile() {
        const headerSourceCode = this.headerSourceCodeModel.getValue()

        this.sourceFile.setHeaderSourceCode(headerSourceCode)
    }

    saveSelectedMethodToFile() {
        const selectedMethodDefinition = this.classMethodsModel.getSelectionValue()

        const methodSourceCode = this.selectedMethodSourceCodeModel.getValue()

        selectedMethodDefinition.setSourceCode(methodSourceCode)
    }

    saveFooterToFile() {
        const footerSourceCode = this.footerSourceCodeModel.getValue()

        this.sourceFile.setFooterSourceCode(footerSourceCode)
    }

    /// Events

    connectModels() {
        this.classMethodsModel.getSelectionModel().on(
            'value-changed',
            this.onSelectedMethodChanged.bind(this)
        )
    }

    onSelectedMethodChanged({ oldValue: oldMethod, newValue: selectedMethod }) {
        const sourceCode = selectedMethod !== undefined ?
            selectedMethod.getFormattedSourceCode() : undefined

        this.selectedMethodSourceCodeModel.setValue(sourceCode)
    }
}

module.exports = Classification.define(ClassEditorModel)
