const Classification = require('../../o-language/classifications/Classification')
const ListModel = require('./ListModel')
const ValueModel = require('./ValueModel')

class ChoiceModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['listModel', 'selectionModel']
    }

    /// Initializing

    initialize({ choices: choices, selection: selection } = { choices: [], selection: null }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

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

module.exports = Classification.define(ChoiceModel)