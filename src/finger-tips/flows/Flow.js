const Classification = require('../../O').Classification
const CommandsController = require('../commands/CommandsController')
const FlowPoint = require('./FlowPoint')
const FlowNode = require('./FlowNode')
const FlowWithChildren = require('./FlowWithChildren')
const FlowWithEvents = require('./FlowWithEvents')

/*
    Class(`
        A Flow is a FlowNode that can have child flows and can trigger events.

        With a Flow it is possible to define a tree of FlowNodes.
    `)
*/
class Flow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FlowNode, FlowWithChildren, FlowWithEvents]
    }

    newFlowBuilder() {
        // review
        const FlowBuilder = require('../flow-builders/FlowBuilder')

        return FlowBuilder.new({ flow: this })
    }

    /// Exporting

    asFlowPoint() {
        const flowPoint = FlowPoint.new({ flow: this })

        this.attachCommandsToFlowPoint({ flowPoint: flowPoint })

        return flowPoint
    }
}

module.exports = Classification.define(Flow)