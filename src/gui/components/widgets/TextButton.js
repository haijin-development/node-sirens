const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const TextButtonView = require('../../gtk-views/TextButtonView')
const ValueModel = require('../../models/ValueModel')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class TextButton {
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
        return TextButtonView.new({
            onClicked: this.onClicked.bind(this),
            image: this.getProps().image,
        })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        this.duringClassificationDo( UpdatingView, () => {
            const value = this.getModel().getValue()

            const getTextBlock = this.getProps().getTextBlock

            const text = getTextBlock ? getTextBlock(value) : value.toString()

            this.getView().setText(text)
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
        this.getProps().onClicked()
    }
}

class UpdatingView {
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(TextButton)