const Classification = require('../../O').Classification

/*
    Class(`
        A FlowPoint object is wrapper of a FlowNode with restrictions on the
        accesibility to the FlowNode it wraps.

        Given a direct reference of a FlowNode to other object from outside the
        flow tree would allow the other object to access and modify the tree flow
        structure.

        To avoid that when an object external to the flow tree needs a refence
        to a FlowNode instead of getting a reference to the NodeFlow it get a
        FlowPoint wrapping it.

        The FlowPoint does not hold a direct reference to the FlowNode either,
        only a reference to the Commands FlowPoint is able to execute.

        The FlowNode choose dynamically which Commands to grant to a FlowPoint
        when it creates it.

        This mechanism helps to asure the integrity of the node when it used by
        external objects and to ensure that all the methods of the FlowNode
        goes through the CommandsController when they are called from the outside.

        The Commands exported to a FlowPoint are called like a regular js method:

            flowPoint.doSomething({ param1: ... })

        although at the implementation level the FlowPoint executes a function granted
        by the FlowNode that invokes the CommandsController to execute the Command.
    `)
*/
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