const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const LabelView = require('../../gtk-views/LabelView')
const ValueModel = require('../../models/ValueModel')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Label {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        const value = this.getProps().text !== undefined ? 
                        this.getProps().text : ''

        return ValueModel.new({ value: value })
    }

    createView() {
        return LabelView.new()
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

        this.getModel().on('value-changed', this.onValueChanged.bind(this))
    }

    onValueChanged({ newValue: newValue, oldValue: oldValue }) {
        this.synchronizeViewFromModel()
    }
}

class UpdatingView {
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(Label)