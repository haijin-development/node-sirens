const Classification = require('../../O').Classification
const ValueModelBehaviour = require('../models/ValueModelBehaviour')
const ValueModelProtocol = require('../protocols/ValueModelProtocol')

class StatefulCommandPoint {

    /// Definition

    static definition() {
        this.instanceVariables = ['id', 'idPath', '_commandExecute', '_commandIsEnabled', '_commandUpdateEnabledState']
        this.assumes = [ValueModelBehaviour]
        this.implements = [ValueModelProtocol]
    }

    /// Initializing

    initialize({ command: command }) {
        this.id = command.getId()
        this.idPath = command.getIdPath()
        this._commandExecute = command.execute.bind(command)
        this._commandIsEnabled = command.isEnabled.bind(command)
        this._commandUpdateEnabledState = command.updateEnabledState.bind(command)
    }

    /// Id

    getId() {
        return this.id
    }

    getIdPath() {
        return this.idPath
    }

    /// Enabled state

    isEnabled() {
        return this._commandIsEnabled()
    }

    doGetValue() {
        return this.isEnabled()
    }

    updateEnabledState() {
        this._commandUpdateEnabledState()
    }

    // A command enabled status can be changed only through its ifEnabled closure.
    doSetValue(newValue) {
        return undefined
    }

    /// Executing

    execute({ with: param, withAll: params }) {
        if( param !== undefined ) { params: [ param ] }

        const result = this._commandExecute({ params: params })

        return result
    }

    /// Events

    onCommandEnabledStatusChanged({ newValue: newValue, oldValue: oldValue }) {
        this.announce({
            event: 'value-changed',
            with: { newValue: newValue, oldValue: oldValue }
        })
    }
}

module.exports = Classification.define(StatefulCommandPoint)