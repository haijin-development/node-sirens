const PrimitiveComponent = require('../PrimitiveComponent')
const ChoiceModel = require('../../models/ChoiceModel')
const ListView = require('../../views/ListView')

class ChoicesList extends PrimitiveComponent {
    /// Initializing

    initializeProps(props) {
        super.initializeProps(props)

        if(this.props.columns === undefined) {
            throw Error(`The class ${this.constructor.name} props must defined a .columns property.`)
        }
    }

    initializeModel(props) {
        super.initializeModel(props)

        if(props.choices !== undefined) {
            this.getModel().setChoices(props.choices)
        }
        if(props.selection !== undefined) {
            this.getModel().setSelection(props.selection)
        }
    }

    defaultModel() {
        return new ChoiceModel()
    }

    createView() {
        return new ListView({
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

    }
}

module.exports = ChoicesList