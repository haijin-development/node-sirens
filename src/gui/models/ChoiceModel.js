const OInstance = require('../../o-language/classifications/OInstance')
const ListModel = require('./ListModel')
const ValueModel = require('./ValueModel')

class ChoiceModel {

    /// Instantiating

    static new() {
        return this.with({ choices: [], selection: null })
    }

    static with({ choices: choices, selection: selection }) {
        return OInstance.new().yourself( (object) => {
            object
                .behaveAs(this)
                .initialize({ choices: choices, selection: selection })
        })
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['listModel', 'selectionModel']
    }

    /// Initializing

    initialize({ choices: choices, selection: selection }) {
        this.listModel = ListModel.new()
        this.selectionModel = ValueModel.new()

        this.listModel.setList(choices)
        this.selectionModel.setValue(selection)
    }

    /// Accessing

    getList() {
        return this.listModel
    }

    getValue() {
        return this.selectionModel
    }

    getChoices() {
        return this.listModel.getList()
    }

    getSelection() {
        return this.selectionModel.getValue()
    }

    getSelectionIndex() {
        const item = this.getSelection()

        return this.listModel.getIndexOf(item)
    }

    setChoices(newArray) {
        return this.listModel.setList(newArray)
    }

    setSelection(newSelection) {
        return this.selectionModel.setValue(newSelection)
    }
}

module.exports = ChoiceModel