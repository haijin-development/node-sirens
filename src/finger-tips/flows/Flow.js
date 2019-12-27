const Classification = require('../../O').Classification
const CommandsController = require('../commands/CommandsController')
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
}

module.exports = Classification.define(Flow)