const Classification = require('../../O').Classification
const Command = require('./Command')
const ValueModel = require('../models/ValueModel')
const StatefulCommandPoint = require('./StatefulCommandPoint')
const Announcer = require('../announcements/Announcer')

class StatefulCommand {

    /// Definition

    static definition() {
        this.instanceVariables = ['enabled', 'calculateEnabledClosure' ]
        this.assumes = [Command, Announcer]
    }

    /// Initializing

    afterInstantiation() {
        this.enabled = true
    }

    initialize({
        id: id, idPath: idPath, calculateEnabledClosure: calculateEnabledClosure, actionHandlerClosure: actionHandlerClosure
    }) {
        this.previousClassificationDo( () => {
            this.initialize({ id: id, idPath: idPath, actionHandlerClosure: actionHandlerClosure })
        })

        this.calculateEnabledClosure = calculateEnabledClosure === undefined ? true : calculateEnabledClosure
    }

    // Enabled state

    enabledIf(calculateEnabledClosure) {
        this.calculateEnabledClosure = calculateEnabledClosure

        this.updateEnabledState()
    }

    isEnabled() {
        return this.enabled
    }

    updateEnabledState() {
        const oldEnabledState = this.enabled

        const enabledState = this.calculateEnabledState()

        if( oldEnabledState !== enabledState ) {
            this.enabled = enabledState

            this.updateCommandPointState({ newValue: enabledState, oldValue: oldEnabledState })
        }

        return enabledState
    }

    calculateEnabledState() {
        const calculateEnabledClosure = this.calculateEnabledClosure

        if( calculateEnabledClosure === true || calculateEnabledClosure === false ) {
            return calculateEnabledClosure
        }

        return this.calculateEnabledClosure()
    }

    processPendingEvents() {
        this.updateEnabledState()
    }

    updateCommandPointState({ newValue: enabledState, oldValue: oldEnabledState }) {
        this.emit(
            'value-changed',
            { newValue: enabledState, oldValue: oldEnabledState }
        )
    }

    /// Flow

    asFlowPoint() {
        const commandPoint = StatefulCommandPoint.new({ command: this })

        this.on(
            'value-changed',
            commandPoint.onCommandEnabledStatusChanged.bind(commandPoint)
        )

        return commandPoint
    }

    /// Executing

    executeActionHandlerClosure({ params: params }) {
        const isEnabled = this.calculateEnabledState()

        if( isEnabled === false ) { return }

        return this.previousClassificationDo( () => {
            return this.executeActionHandlerClosure({ params: params })
        })
    }
}

module.exports = Classification.define(StatefulCommand)