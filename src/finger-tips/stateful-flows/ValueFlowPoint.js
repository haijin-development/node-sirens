const Classification = require('../../O').Classification
const FlowPoint = require('../flows/FlowPoint')
const ValueModelBehaviour = require('../models/ValueModelBehaviour')
const ValueModelProtocol = require('../protocols/ValueModelProtocol')

class ValueFlowPoint {
    /// Definition

    static definition() {
        this.instanceVariables = ['_getFlowValue', '_setFlowValue']
        this.assumes = [FlowPoint, ValueModelBehaviour]
        this.implements = [ValueModelProtocol]
    }

    /// Initializing

    initialize({ flow: flow }) {
        this.previousClassificationDo( () => {
            this.initialize({ flow: flow })
        })

        this._getFlowValue = flow.getValue.bind(flow)
        this._setFlowValue = flow.setValue.bind(flow)
    }

    /// Value

    doGetValue() {
        return this._getFlowValue()
    }

    doSetValue(newValue) {
        this._setFlowValue( newValue )

        return this
    }

    /// Events

    onFlowValueChanged({ newValue: newValue, oldValue: oldValue }) {
        this.announce({
            event: 'value-changed',
            with: { newValue: newValue, oldValue: oldValue }
        })
    }
}

module.exports = Classification.define(ValueFlowPoint)