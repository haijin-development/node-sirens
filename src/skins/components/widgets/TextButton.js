const Classification = require('../../../O').Classification
const Widget = require('../Widget')
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

        return this.namespace().Models.ValueModel.new({ value: value })
    }

    createView() {
        const view = this.namespace().Views.TextButtonView.new({
            onClicked: this.onClicked.bind(this),
            image: this.getProps().image,
        })

        view.assemble()

        return view
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        this.duringClassificationDo( UpdatingView, () => {
            const value = this.getModel().getValue()

            const getTextClosure = this.getProps().getTextClosure

            const text = getTextClosure ? getTextClosure(value) : value.toString()

            this.getView().setText(text)
        })
    }

    /// Events

    subscribeToModelEvents() {
        this.previousClassificationDo( () => {
            this.subscribeToModelEvents()
        })

        this.getModel().onValueChanged({
            with: this,
            do: this.onValueChanged,
        })
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