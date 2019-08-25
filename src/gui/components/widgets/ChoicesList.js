const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const ChoiceModel = require('../../models/ChoiceModel')
const ListView = require('../../views/ListView')

const ChoicesList = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    initializeProps() {
        if(this.getProps().columns === undefined) {
            throw Error(`The class ${this.constructor.name} props must defined a .columns property.`)
        }
    }

    defaultModel() {
        const model = ChoiceModel.new()

        if(this.getProps().choices !== undefined) {
            model.setChoices( this.getProps().choices )
        }

        if(this.getProps().selection !== undefined) {
            model.setSelection( this.getProps().selection )
        }

        return model
    }

    createView() {
        return ListView.new({
            onSelectionChanged: this.onUserSelectionChanged.bind(this),
            onSelectionAction: this.onUserSelectionAction.bind(this)
        })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const items = this.getModel().getChoices()
        const selectionIndex = this.getModel().getSelectionIndex()
        const indices = selectionIndex == -1 ? [] : [selectionIndex]

        this.getView().addItems(items)

        this.getView().setSelectionIndices(indices)
    }

    /// Events

    /**
     * Subscribes this component to the model events
     */
    subscribeToModelEvents() {
        this.getModel().getList().on('list-changed', this.onChoicesChanged.bind(this))

        this.getModel().getList().on('items-added', this.onItemsAdded.bind(this))
        this.getModel().getList().on('items-updated', this.onItemsUpdated.bind(this))
        this.getModel().getList().on('items-removed', this.onItemsRemoved.bind(this))

        this.getModel().getValue().on('value-changed', this.onSelectedValueChanged.bind(this))
    }

    onChoicesChanged() {
        const choices = this.getModel().getChoices()

        this.getView().clearItems()
        this.getView().addItems(choices)
    }

    onItemsAdded({list: list, items: items, index: index}) {
        this.getView().addItems(items, index)
    }

    onItemsUpdated({list: list, items: items, indices: indices}) {
        this.getView().updateItems({items: items, indices: indices})
    }

    onItemsRemoved({list: list, items: items, indices: indices}) {
        this.getView().removeItems({items: items, indices: indices})
    }

    onSelectedValueChanged() {
        const selectionIndex = this.getModel().getSelectionIndex()

        this.getView().setSelectionIndices([selectionIndex])
    }

    onUserSelectionChanged() {
        const indices = this.getView().getSelectionIndices()

        const selectedIndex = indices[0]

        const choices = this.getModel().getChoices()

        const selectedItem = choices[selectedIndex]

        this.getModel().setSelection(selectedItem)
    }

    onUserSelectionAction() {
        if(this.getProps().onAction === undefined) {
            return
        }

        this.getProps().onAction()
    }
})

module.exports = ChoicesList