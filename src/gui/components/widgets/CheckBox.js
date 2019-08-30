const Classification = require('../../../o-language/classifications/Classification')
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const ValueModel = require('../../models/ValueModel')
const CheckBoxView = require('../../views/CheckBoxView')

class CheckBox {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        return CheckBoxView.new({
            onClicked: this.onClicked.bind(this)
        })
    }

    defaultModel() {
        const value = this.getProps().value !== undefined ? 
                        this.getProps().value : false

        return ValueModel.new({ value: value })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const text = this.getProps().label
        const value = this.getModel().getValue()

        this.getView().setText(text)
        this.getView().setValue(value)
    }

    /// Events

    onValueChanged({newValue: newValue, oldValue: oldValue}) {
        this.synchronizeViewFromModel()
    }

    onClicked() {
        this.duringClassificationDo( UpdatingModel, () => {
            this.getModel().setValue( this.getView().getValue() )
        })
    }
}

module.exports = Classification.define(CheckBox)