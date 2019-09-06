const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const RadioButtonView = require('../../gtk-views/RadioButtonView')
const ChoiceModel = require('../../models/ChoiceModel')

class RadioButton {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
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
        const selectedChoice = this.getModel().getSelectionValue()

        const value = this.getId() === selectedChoice

        this.getView().setValue(value)
    }

    /// Events

    /**
     * Subscribes this component to the model events
     */
    subscribeToModelEvents() {
        this.getModel().getSelectionModel().on(
            'value-changed',
            this.onSelectedValueChanged.bind(this)
        )
    }

    onSelectedValueChanged() {
        this.synchronizeViewFromModel()
    }
}

module.exports = Classification.define(RadioButton)