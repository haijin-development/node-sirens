const Classification = require('../../O').Classification

class StatelessCommandPoint {

    /// Definition

    static definition() {
        this.instanceVariables = ['id', 'idPath', '_commandExecute']
        this.assumes = []
        this.implements = []
    }

    /// Initializing

    initialize({ command: command }) {
        this.id = command.getId()
        this.idPath = command.getIdPath()
        this._commandExecute = command.execute.bind(command)
    }

    /// Id

    getId() {
        return this.id
    }

    getIdPath() {
        return this.idPath
    }

    /// Executing

    execute({ with: param, withAll: params } = {}) {
        if( param !== undefined ) { params: [ param ] }

        const result = this._commandExecute({ params: params })

        return result
    }
}

module.exports = Classification.define(StatelessCommandPoint)