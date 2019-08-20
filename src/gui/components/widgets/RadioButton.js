const Widget = require('../Widget')
const RadioButtonView = require('../../views/RadioButtonView')
const ChoiceModel = require('../../models/ChoiceModel')

class RadioButton extends Widget {
    /// Initializing

    createView() {
        return RadioButtonView.new()
    }

    defaultModel() {
        return ChoiceModel.new()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const selectedChoice = this.getModel().getSelection()

        const value = this.getId() === selectedChoice

        this.view.setValue(value)
    }

    /// Events

    /**
     * Subscribes this component to the model events
     */
    subscribeToModelEvents() {
        this.getModel().getValue().on('value-changed', this.onSelectedValueChanged.bind(this))
    }

    onSelectedValueChanged() {
        this.synchronizeViewFromModel()
    }
}

module.exports = RadioButton