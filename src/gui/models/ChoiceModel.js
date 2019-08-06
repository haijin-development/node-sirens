const EventEmitter = require('events')
const ListModel = require('./ListModel')
const ValueModel = require('./ValueModel')

class ChoiceModel extends EventEmitter {
    /// Initializing

    constructor({choices: choices, selection: selection} = {choices: [], selection: null}) {
        super()

        this.listModel = new ListModel()
        this.selectionModel = new ValueModel()

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