const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const ToggleToolButtonView = require('../../gtk-views/ToggleToolButtonView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')
const ValueModel = require('../../models/ValueModel')
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

        return ValueModel.new({ value: value })
    }

    createView() {
        const actionProp = {
            action: () => { this.onClicked() }
        }

        const props = Object.assign( this.getProps(), actionProp )

        return ToggleToolButtonView.new( props )
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

        this.getModel().onValueChanged( this.onValueChanged.bind(this) )
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

module.exports = Classification.define(ToogleToolButton)