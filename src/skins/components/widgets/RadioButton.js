const Classification = require('../../../O').Classification
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class RadioButton {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    createView() {
        const view = this.namespace().Views.RadioButtonView.new()

        view.assemble()

        return view
    }

    defaultModel() {
        return this.namespace().Models.ChoiceModel.new()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        this.duringClassificationDo( UpdatingView, () => {
            const selectedChoice = this.getModel().getSelectionValue()

            const value = this.getId() === selectedChoice

            this.getView().setValue(value)
        })
    }

    /// Events

    /**
     * Subscribes this component to the model events
     */
    subscribeToModelEvents() {
        this.getModel().onSelectionChanged({
            with: this,
            do: this.onSelectedValueChanged,
        })
    }

    onSelectedValueChanged() {
        this.synchronizeViewFromModel()
    }
}

class UpdatingView {
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(RadioButton)