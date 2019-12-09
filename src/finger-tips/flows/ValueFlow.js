const Classification = require('../../O').Classification
const Flow = require('./Flow')
const Announcer = require('../announcements/Announcer')
const ValueFlowPoint = require('./ValueFlowPoint')

class ValueFlow {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'value', 'whenFlowValueChangedClosure' ]
        this.assumes = [Flow, Announcer]
    }

    /// Initializing

    afterInstantiation() {
        this.value = null
    }

    /// Converting

    asFlowPoint() {
        const flowPoint = ValueFlowPoint.new({ flow: this })

        this.on('value-changed', flowPoint.onFlowValueChanged.bind(flowPoint) )

        return flowPoint
    }

    /// Value

    getValue() {
        return this.value
    }

    setValue(newValue) {
        this.evaluateEventHandler({
            event: 'setValue',
            params: [newValue],
            eventHandler: () => {
                this.updateValue( newValue )
            }            
        })

        return this
    }

    updateValue(newValue) {
        const oldValue = this.value

        if( oldValue == newValue ) { return }

        this.value = newValue

        if( this.hasWhenFlowValueChangedClosure() ) {
            this.evaluateWhenFlowValueChangedClosure({ newValue: newValue, oldValue: oldValue })
        }

        this.addPendingEvent({
            event: 'value-changed',
            params: { newValue: newValue, oldValue: oldValue },
        })
    }

    // Events

    setWhenFlowValueChangedClosure(whenFlowValueChangedClosure) {
        this.whenFlowValueChangedClosure = whenFlowValueChangedClosure
    }

    evaluateWhenFlowValueChangedClosure({ newValue: newValue, oldValue: oldValue }) {
        this.whenFlowValueChangedClosure({ newValue: newValue, oldValue: oldValue })
    }

    hasWhenFlowValueChangedClosure() {
        return this.whenFlowValueChangedClosure !== undefined
    }
}

module.exports = Classification.define(ValueFlow)