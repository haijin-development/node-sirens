const Classification = require('../../../o-language/classifications/Classification')
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const CheckBoxView = require('../../gtk-views/CheckBoxView')
const CheckBoxProtocol_Implementation = require('../../protocols/CheckBoxProtocol_Implementation')
const ValueModel = require('../../models/ValueModel')

class CheckBox {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.expects = [CheckBoxProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        const value = this.getProps().value !== undefined ? 
                        this.getProps().value : this.defaultModelValue()

        return ValueModel.new({ value: value })
    }

    createView() {
        return CheckBoxView.new({
            onClicked: this.onClicked.bind(this)
        })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        this.duringClassificationDo( UpdatingView, () => {
            const text = this.getProps().label
            const value = this.getSelectionFromModel()

            this.getView().setText(text)
            this.getView().setValue(value)
        })
    }

    /// Events

    subscribeToModelEvents() {
        this.previousClassificationDo( () => {
            this.subscribeToModelEvents()
        })

        this.getModel().onValueChanged( this.onValueChanged.bind(this) )
    }

    onValueChanged({ newValue: newValue, oldValue: oldValue }) {
        this.synchronizeViewFromModel()
    }

    onClicked() {
        const viewValue = this.getView().getValue()

        this.duringClassificationDo( UpdatingModel, () => {
            this.setValueFromViewToModel({ newValue: viewValue })
        })
    }
}

class UpdatingView {
    onClicked() {}
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(CheckBox)