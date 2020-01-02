const Classification = require('../../../O').Classification
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const CheckBoxProtocol_Implementation = require('../../protocols/CheckBoxProtocol_Implementation')

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

        return this.namespace().Models.ValueModel.new({ value: value })
    }

    createView() {
        const view = this.namespace().Views.CheckBoxView.new({
            onClicked: this.handleClicked.bind(this)
        })

        view.assemble()

        return view
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

        this.getModel().onValueChanged({
            with: this,
            do: this.handleValueChanged,
        })
    }

    handleValueChanged(announcement) {
        this.synchronizeViewFromModel()
    }

    handleClicked() {
        const viewValue = this.getView().getValue()

        this.duringClassificationDo( UpdatingModel, () => {
            this.setValueFromViewToModel({ newValue: viewValue })
        })
    }
}

class UpdatingView {
    handleClicked() {}
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(CheckBox)