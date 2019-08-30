const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const TextButtonView = require('../../views/TextButtonView')
const ValueModel = require('../../models/ValueModel')

class TextButton {
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
        return TextButtonView.new({
            onClicked: this.getProps().onClicked
        })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const value = this.getModel().getValue()

        const getTextBlock = this.getProps().getTextBlock

        const text = getTextBlock ? getTextBlock(value) : value.toString()

        this.getView().setText(text)
    }

    /// Events

    onValueChanged({newValue: newValue, oldValue: oldValue}) {
        this.synchronizeViewFromModel()
    }
}

module.exports = Classification.define(TextButton)