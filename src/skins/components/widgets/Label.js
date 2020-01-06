const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Label {
    /// Definition

    static definition() {
        this.instanceVariables = ['namespaceFlow']
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        const value = this.getProps().text !== undefined ? 
                        this.getProps().text : ''

        return this.namespace().Models.ValueModel.new({ value: value })
    }

    createView() {
        const view = this.namespace().Views.LabelView.new()

        view.assemble()

        return view
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        this.duringClassificationDo( UpdatingView, () => {
            const text = this.getModel().getValue()

            this.getView().setText(text)
        })
    }

    /// Events

    subscribeToModelEvents() {
        this.previousClassificationDo( () => {
            this.subscribeToModelEvents()
        })

        this.getModel().onValueChanged({
            with: this,
            do: this.onValueChanged.bind(this),
        })
    }

    onValueChanged({ newValue: newValue, oldValue: oldValue }) {
        this.synchronizeViewFromModel()
    }
}

class UpdatingView {
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(Label)