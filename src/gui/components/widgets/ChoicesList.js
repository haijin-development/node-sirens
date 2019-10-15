const Classification = require('../../../o-language/classifications/Classification')
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const ChoiceModel = require('../../models/ChoiceModel')
const ListView = require('../../gtk-views/ListView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')
const ListModelComponentProtocol_Implementation = require('../../protocols/ListModelComponentProtocol_Implementation')

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
        })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        this.duringClassificationDo( UpdatingView, () => {
            const currentSelectionIndex = this.getModel().getSelectionIndex()
            const currentIndices = currentSelectionIndex == -1 ? [] : [currentSelectionIndex]

            this.onItemsListChanged()

            this.getView().setSelectionIndices(currentIndices)
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

        this.getModel().onChoicesChanged( this.onItemsListChanged.bind(this) )
        this.getModel().onChoicesAdded( this.onItemsAdded.bind(this) )
        this.getModel().onChoicesUpdated( this.onItemsUpdated.bind(this) )
        this.getModel().onChoicesRemoved( this.onItemsRemoved.bind(this) )

        this.getModel().onSelectionChanged( this.onSelectedValueChanged.bind(this) )
    }

    onItemsListChanged() {
        this.duringClassificationDo( UpdatingView, () => {
            const items = this.getModel().getChoices()

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

            this.getView().setSelectionIndices([selectionIndex])
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