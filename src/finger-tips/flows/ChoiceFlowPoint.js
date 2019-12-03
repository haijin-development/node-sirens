const Classification = require('../../O').Classification
const FlowPoint = require('./FlowPoint')
const ChoiceModel = require('../models/ChoiceModel')

class ChoiceFlowPoint {
    /// Definition

    static definition() {
        this.instanceVariables = ['_setSelection']
        this.assumes = [ChoiceModel, FlowPoint]
    }

    /// Initializing

    initialize({ flow: flow }) {
        this.withClassificationDo(ChoiceModel, () => {
            this.initialize({
                choices: flow.getChoices(),
            })
        })

        this.withClassificationDo(FlowPoint, () => {
            this.initialize({ flow: flow })
        })

        this.onSelectionChanged({
            with: this,
            do: this.updateFlowOnSelectionChange,
        })

        this._setSelection = flow.setSelection.bind(flow)
    }

    /// Events

    updateFlowOnSelectionChange({ newValue: newValue, oldValue: oldValue }) {
        this._setSelection( newValue )
    }

    onFlowSelectionChanged({ newValue: newValue }) {
        this.setSelectionValue(newValue)
    }

    onFlowChoicesChanged({ newList: newChoices }) {
        this.setChoices(newChoices)
    }
}

module.exports = Classification.define(ChoiceFlowPoint)