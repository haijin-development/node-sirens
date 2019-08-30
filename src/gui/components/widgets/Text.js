const Classification = require('../../../o-language/classifications/Classification')
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const TextView = require('../../views/TextView')
const ValueModel = require('../../models/ValueModel')

class Text {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    defaultModel() {
        const value = this.getProps().text !== undefined ? 
                        this.getProps().text : ''

        return ValueModel.new({ value: value })
    }

    createView() {
        return TextView.new({ onTextChanged: this.onTextChanged.bind(this) })
    }

    /// Querying

    getSelectedText() {
        return this.getView().getSelectedText()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const text = this.getModel().getValue()

        this.getView().setText(text)
    }

    /// Events

    /*
     * The model value changed. Updates this widget model.
     */
    onValueChanged({newValue: newValue, oldValue: oldValue}) {
        this.synchronizeViewFromModel()
    }

    /*
     * The widget value changed. Updates this object model.
     */
    onTextChanged(text) {
        this.duringClassificationDo( UpdatingModel, () => {
            this.getModel().setValue(text)
        })
    }
}

module.exports = Classification.define(Text)