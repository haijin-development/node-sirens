const Classification = require('../../../O').Classification
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Text {
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
        const view = this.namespace().Views.TextView.new({
            onTextChanged: (text) => { this.onTextChanged(text) },
            hasScrollBars: this.getProps().hasScrollBars,
        })

        view.assemble()

        return view
    }

    /// Querying

    getSelectedText() {
        return this.getView().getSelectedText()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        this.duringClassificationDo( UpdatingView, () => {
            const model = this.getModel()

            const text = model ? model.getValue() : ''

            this.getView().setText( text )
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

class UpdatingView {
    onTextChanged(text) {}
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(Text)