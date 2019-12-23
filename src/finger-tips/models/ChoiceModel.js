const Classification = require('../../O').Classification
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

    onChoicesChanged({ with: listener, do: closure }) {
        this.listModel.onListChanged({
            with: listener,
            do: closure,
        })

        return this
    }

    onChoicesAdded({ with: listener, do: closure }) {
        this.listModel.onItemsAdded({
            with: listener,
            do: closure,
        })

        return this
    }

    onChoicesUpdated({ with: listener, do: closure }) {
        this.listModel.onItemsUpdated({
            with: listener,
            do: closure,
        })

        return this
    }

    onChoicesRemoved({ with: listener, do: closure }) {
        this.listModel.onItemsRemoved({
            with: listener,
            do: closure,
        })

        return this
    }

    onSelectionChanged({ with: listener, do: closure }) {
        this.selectionModel.onValueChanged({
            with: listener,
            do: closure,
        })

        return this
    }

    dropAllAnnouncementsFor({ listener: listener }) {
        this.listModel.dropAllAnnouncementsFor({ listener: listener })
        this.selectionModel.dropAllAnnouncementsFor({ listener: listener })  
    }
}

module.exports = Classification.define(ChoiceModel)