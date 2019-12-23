const Classification = require('../../O').Classification

class FlowPoint {
    /// Definition

    static definition() {
        this.instanceVariables = ['id', 'idPath', '_findFlowPoint', '_getCommand']
    }

    /// Initializing

    initialize({ flow: flow }) {
        this.id = flow.getId()
        this.idPath = flow.getIdPath()
        this._findFlowPoint = flow.findFlowPoint.bind(flow)
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
        const childFlowPoint = this.findFlowPoint({ id: flowPointId })

        if( ! childFlowPoint ) {
            throw new Error(`Child flow point with {id: '${flowPointId}'} not found.`)
        }

        return childFlowPoint
    }

    findFlowPoint({ id: flowPointId }) {
        return this._findFlowPoint({ id: flowPointId })
    }

    getCommand({ id: commandId }) {
        return this._getCommand({ id: commandId })  
    }
}

module.exports = Classification.define(FlowPoint)