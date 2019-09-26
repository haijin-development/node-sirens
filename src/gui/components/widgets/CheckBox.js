const Classification = require('../../../o-language/classifications/Classification')
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const ValueModel = require('../../models/ValueModel')
const CheckBoxView = require('../../gtk-views/CheckBoxView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class CheckBox {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
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
        this.duringClassificationDo( UpdatingView, () => {
            const text = this.getProps().label
            const value = this.getModel().getValue()

            this.getView().setText(text)
            this.getView().setValue(value)
        })
    }

    /// Events

    subscribeToModelEvents() {
        this.previousClassificationDo( () => {
            this.subscribeToModelEvents()
        })

        this.getModel().on('value-changed', this.onValueChanged.bind(this))
    }

    onValueChanged({newValue: newValue, oldValue: oldValue}) {
        this.synchronizeViewFromModel()
    }

    onClicked() {
        this.duringClassificationDo( UpdatingModel, () => {
            this.getModel().setValue( this.getView().getValue() )
        })
    }
}

class UpdatingView {
    onClicked() {}
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(CheckBox)