const Classification = require('../../O').Classification
const Command = require('./Command')
const ValueModel = require('../models/ValueModel')
const StatefulCommandPoint = require('./StatefulCommandPoint')

class StatefulCommand {

    /// Definition

    static definition() {
        this.instanceVariables = ['enabled', 'calculateEnabledClosure', 'flowPointsModel' ]
        this.assumes = [Command]
    }

    /// Initializing

    afterInstantiation() {
        this.enabled = true
        this.flowPointsModel = ValueModel.new({ value: this.enabled })
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
        const enabledState = this.calculateEnabledState()

        this.enabled = enabledState

        this.updateCommandPointsModel()

        return enabledState
    }

    calculateEnabledState() {
        const calculateEnabledClosure = this.calculateEnabledClosure

        if( calculateEnabledClosure === true || calculateEnabledClosure === false ) {
            return calculateEnabledClosure
        }

        return this.calculateEnabledClosure()
    }

    updateCommandPointsModel() {
        this.flowPointsModel.setValue( this.enabled )
    }

    /// Flow

    asFlowPoint() {
        const commandPoint = StatefulCommandPoint.new({ command: this })

        this.flowPointsModel.onValueChanged({
            with: this,
            do: commandPoint.onCommandEnabledStatusChanged.bind(commandPoint),
        })

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