const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')
const UpdatingModel = require('../UpdatingModel')


class ToogleToolButton {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        const value = this.getProps().value !== undefined ? 
                        this.getProps().value : false

        return this.namespace().Models.ValueModel.new({ value: value })
    }

    createView() {
        const props = this.getProps()

        const view = this.namespace().Views.ToggleToolButtonView.new({
            imageProps: props.imageProps,
            label: props.label,
            tooltip: props.tooltip,
            action: (...params) => { this.handleClick(...params) },
        })

        view.assemble()

        return view
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        this.duringClassificationDo( UpdatingView, () => {
            const value = this.getModel().getValue()

            this.getView().setValue(value)
        })
    }

    subscribeToModelEvents() {
        this.previousClassificationDo( () => {
            this.subscribeToModelEvents()
        })

        this.getModel().onValueChanged({
            with: this,
            do: this.onValueChanged,
        })
    }

    onValueChanged({newValue: newValue, oldValue: oldValue}) {
        this.synchronizeViewFromModel()
    }

    handleClick() {
        this.duringClassificationDo( UpdatingModel, () => {
            this.getModel().setValue( this.getView().getValue() )
        })
    }
}

class UpdatingView {
    handleClick() {}
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(ToogleToolButton)