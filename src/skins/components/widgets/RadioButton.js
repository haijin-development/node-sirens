const Classification = require('../../../O').Classification
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const RadioButtonView = require('../../gtk-views/RadioButtonView')
const ChoiceModel = require('../../../finger-tips/models/ChoiceModel')
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
        return RadioButtonView.new()
    }

    defaultModel() {
        return ChoiceModel.new()
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
        this.getModel().onSelectionChanged(
            this.onSelectedValueChanged.bind(this)
        )
    }

    onSelectedValueChanged() {
        this.synchronizeViewFromModel()
    }
}

class UpdatingView {
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(RadioButton)