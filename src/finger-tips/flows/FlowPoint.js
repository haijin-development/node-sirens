const Classification = require('../../O').Classification

class FlowPoint {
    /// Definition

    static definition() {
        this.instanceVariables = ['id', 'idPath', '_getFlowPoint', '_getCommand']
    }

    /// Initializing

    initialize({ flow: flow }) {
        this.id = flow.getId()
        this.idPath = flow.getIdPath()
        this._getFlowPoint = flow.getFlowPoint.bind(flow)
        this._getCommand = flow.getCommand.bind(flow)

        flow.attachCommandsToFlowPoint({ flowPoint: this })
    }

    /// Id

    getId() {
        return this.id
    }

    getIdPath() {
        return this.idPath
    }

    /// Children

    getFlowPoint({ id: flowPointId }) {
        return this._getFlowPoint({ id: flowPointId })
    }

    getCommand({ id: commandId }) {
        return this._getCommand({ id: commandId })        
    }
}

module.exports = Classification.define(FlowPoint)