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

    getListModel() {
        return this.listModel
    }

    getSelectionModel() {
        return this.selectionModel
    }

    getChoices() {
        return this.listModel.getList()
    }

    setChoices(newArray) {
        return this.listModel.setList(newArray)
    }

    getSelectionValue() {
        return this.selectionModel.getValue()
    }

    setSelectionValue(newSelection) {
        if( newSelection === undefined ) {
            newSelection = null
        }

        return this.selectionModel.setValue(newSelection)
    }

    setSelectionSuchThat({ matches: matchingClosure }) {
        const matchingItem = this.getChoices().find( matchingClosure )

        this.setSelectionValue( matchingItem )
    }


    getSelectionIndex() {
        const item = this.getSelectionValue()

        return this.listModel.getIndexOf({ item: item })
    }

    setSelectionIndex({ index: index }) {
        const item = this.listModel.getItemAt({ index: index })

        return this.setSelectionValue(item)
    }

    /// Events

    onChoicesChanged(closure) {
        this.listModel.onListChanged(closure)

        return this
    }

    onChoicesAdded(closure) {
        this.listModel.onItemsAdded(closure)

        return this
    }

    onChoicesUpdated(closure) {
        this.listModel.onItemsUpdated(closure)

        return this
    }

    onChoicesRemoved(closure) {
        this.listModel.onItemsRemoved(closure)

        return this
    }

    onSelectionChanged(closure) {
        this.selectionModel.onValueChanged(closure)

        return this
    }
}

module.exports = Classification.define(ChoiceModel)