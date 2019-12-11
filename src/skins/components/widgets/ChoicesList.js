const Classification = require('../../../O').Classification
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const ChoiceModel = require('../../../finger-tips/models/ChoiceModel')
const ListView = require('../../gtk-views/ListView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')
const ListModelComponentProtocol_Implementation = require('../../../finger-tips/protocols/ListModelComponentProtocol_Implementation')

class ChoicesList {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [
            ComponentBehaviourProtocol_Implementation,
            ListModelComponentProtocol_Implementation
        ]
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
            model.setSelectionValue( this.getProps().selection )
        }

        return model
    }

    createView() {
        return ListView.new({
            onSelectionChanged: this.onUserSelectionChanged.bind(this),
            onSelectionAction: this.onUserSelectionAction.bind(this),
            allowSelectionChange: this.allowSelectionChange.bind(this),
            hasScrollBars: this.getProps().hasScrollBars,
        })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        this.duringClassificationDo( UpdatingView, () => {
            const currentSelectionIndex = this.getModel().getSelectionIndex()

            this.onItemsListChanged()

            this.getView().setSingleSelection({ index: currentSelectionIndex })
        })
    }

    /// Events

    /**
     * Subscribes this component to the model events
     */
    subscribeToModelEvents() {
        this.previousClassificationDo( () => {
            this.subscribeToModelEvents()
        })

        this.getModel().onChoicesChanged({
            with: this,
            do: this.onItemsListChanged,
        })
        this.getModel().onChoicesAdded({
            with: this,
            do: this.onItemsAdded,
        })
        this.getModel().onChoicesUpdated({
            with: this,
            do: this.onItemsUpdated,
        })
        this.getModel().onChoicesRemoved({
            with: this,
            do: this.onItemsRemoved,
        })

        this.getModel().onSelectionChanged({
            with: this,
            do: this.onSelectedValueChanged,
        })
    }

    onItemsListChanged() {
        this.duringClassificationDo( UpdatingView, () => {
            const model = this.getModel()

            const items = model ? model.getChoices() : []

            this.getView().clearItems()
            this.getView().addItems(items)
        })
    }

    onItemsAdded({list: list, items: items, index: index}) {
        this.duringClassificationDo( UpdatingView, () => {
            this.getView().addItems(items, index)
        })
    }

    onItemsUpdated({list: list, items: items, indices: indices}) {
        this.duringClassificationDo( UpdatingView, () => {
            this.getView().updateItems({items: items, indices: indices})
        })
    }

    onItemsRemoved({list: list, items: items, indices: indices}) {
        this.duringClassificationDo( UpdatingView, () => {
            this.getView().removeItems({items: items, indices: indices})
        })
    }

    onSelectedValueChanged() {
        this.duringClassificationDo( UpdatingView, () => {
            const selectionIndex = this.getModel().getSelectionIndex()

            this.getView().setSingleSelection({ index: selectionIndex })
        })
    }

    onUserSelectionChanged() {
        this.duringClassificationDo( UpdatingModel, () => {
            const indices = this.getView().getSelectionIndices()

            const selectedIndex = indices[0]

            const choices = this.getModel().getChoices()

            const selectedItem = choices[selectedIndex]

            this.getModel().setSelectionValue(selectedItem)
        })
    }

    onUserSelectionAction() {
        if(this.getProps().onAction === undefined) {
            return
        }

        this.getProps().onAction()
    }

    allowSelectionChange({ selectedIndices: selectedIndices }) {
        const allowSelectionChangeClosure = this.getProps().allowSelectionChange

        if( allowSelectionChangeClosure === undefined ) {
            return true
        }

        const allowed = allowSelectionChangeClosure()

        return allowed
    }
}

class UpdatingView {
    onUserSelectionChanged() {}
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(ChoicesList)