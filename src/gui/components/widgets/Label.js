const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const LabelView = require('../../views/LabelView')
const ValueModel = require('../../models/ValueModel')

const Label = Classification.define( class {
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
        return LabelView.new()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const text = this.getModel().getValue()

        this.getView().setText(text)
    }

    /// Events

    onValueChanged({newValue: newValue, oldValue: oldValue}) {
        this.synchronizeViewFromModel()
    }
})

module.exports = Label