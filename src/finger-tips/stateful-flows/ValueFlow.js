const Classification = require('../../O').Classification
const Flow = require('../flows/Flow')
const Announcer = require('../announcements/Announcer')
const ValueFlowPoint = require('./ValueFlowPoint')

class ValueFlow {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'value', 'whenFlowValueChangedClosure' ]
        this.assumes = [Flow, Announcer]
    }

    /// Initializing

    initialize({ id: id, idPath: idPath } = { id: undefined, idPath: undefined }) {
        this.previousClassificationDo( () => {
            this.initialize({ id: id, idPath: idPath })
        })

        this.value = this.defaultValue()

        this.doUpdateValue({ newValue: this.value, oldValue: undefined })
    }

    releaseFlow() {
        this.dropAllAnnouncementsForAllListeners()

        this.previousClassificationDo( () => {
            this.releaseFlow()
        })
    }

    defaultValue() {
        return null
    }

    /// Exporting

    asFlowPoint() {
        const flowPoint = ValueFlowPoint.new({ flow: this })

        this.on('value-changed', flowPoint.onFlowValueChanged.bind(flowPoint) )

        this.attachCommandsToFlowPoint({ flowPoint: flowPoint })

        return flowPoint
    }

    /// Value

    getValue() {
        return this.value
    }

    setValue(newValue, forceUpdate = false) {
        this.evaluateEventHandler({
            event: 'setValue',
            params: [newValue, forceUpdate],
            eventHandler: () => {
                this.updateValue( newValue, forceUpdate )
            }            
        })

        return this
    }

    updateValue(newValue, forceUpdate) {
        const oldValue = this.value

        if( forceUpdate !== true && oldValue == newValue ) { return }

        this.value = newValue

        this.doUpdateValue({ newValue: newValue, oldValue: oldValue })
    }

    doUpdateValue({ newValue: newValue, oldValue: oldValue }) {
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