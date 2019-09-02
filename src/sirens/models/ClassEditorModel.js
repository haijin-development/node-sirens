const Classification = require('../../o-language/classifications/Classification')
const ValueModel = require('../../gui/models/ValueModel')

class ClassEditorModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['selectedFileModel']
    }


    /// Initializing

    initialize() {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.selectedFileModel = ValueModel.new()
    }

    /// Actions    

    openFile({ filename: filename }) {
        this.selectedFileModel.setValue( filename )
    }
}

module.exports = Classification.define(ClassEditorModel)
