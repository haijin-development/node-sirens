const Classification = require('../../O').Classification
const {AnotherClassificationMustImplementMethod} = require('../../O').Errors
const CommandsController = require('../commands/CommandsController')

/*
    Class(`
        A FlowNode models a single node in a flow tree.

        It has an id, a unique idPath and a CommandsController.

        The id is the id of the node. It is a String and it can be set
        in the FlowNode initialize method or afterwards. For example:

            'leafNode'

        The idPath is the concatenation of the ids in the Flow tree path
        from the main FlowNode up to this FlowNode. For example:

            'main.child1.child2.leafNode'

        The idPath is set be its parent FlowNode when this NodeFlow is added 
        as a child of it. It will override any previous idPath so it makes no sense
        to define one from outside the flow tree.

        The CommandsController is the object that controls the commands and events
        executed by the whole tree flow.

        A CommandsController can be set to a FlowNode in isolation but it will be
        overriden by the parent node in the flow tree when this node is added as a child
        of it.
        For that reason the FlowNode should not use custom behabiour or make assumption
        about the CommandsController is has in isolation.

        A FlowNode does not have the protocol to add children or trigger events.
        If you want to a Flow to have that behaviour include attach the
        FlowWithChildren and FlowWithEvents classifications.
    `)
*/
class FlowNode {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'id', 'idPath',
            'commandsController',
        ]
    }

    /// Initializing

    afterInstantiation() {
        this.commandsController = CommandsController.new({ mainFlow: this })
    }

    initialize({ id: id, idPath: idPath } = { id: undefined, idPath: undefined }) {
        this.id = id
        this.idPath = idPath ? `${idPath}.${id}` : id

        if( this.respondsTo('buildWith') ) {
            this.commandsController = CommandsController.new({ mainFlow: this })

            const flow = this

            this.build( function() {
                const flowBuilder = this
                flow.buildWith( flowBuilder )
            })

            flow.evaluateEventHandler({ event: 'main-flow-built', eventHandler: () => {} })
        }
    }

    build(closure) {
        const flowBuilder = this.newFlowBuilder()

        flowBuilder.evaluate({ closure: closure, with: this })
    }

    newFlowBuilder() {
        throw new AnotherClassificationMustImplementMethod()
    }

    releaseFlow() {
        this.commandsController = null
    }

    /// Id

    getId() {
        return this.id
    }

    setId({ id: id, idPath: idPath }) {
        this.id = id
        this.idPath = idPath
    }

    getIdPath() {
        return this.idPath
    }

    setIdPath(idPath) {
        this.idPath = idPath
    }

    // Commands

    setCommandsController(commandsController) {
        this.commandsController = commandsController
    }

    getCommandsController() {
        return this.commandsController
    }

    evaluateEventHandler({ event: event, params: params, eventHandler: eventHandler }) {
        if( params === undefined ) { params = [] }

        const commandsController = this.getCommandsController()

        return commandsController.doExecuteEventHandler({
            flowId: this.getIdPath(),
            event: event,
            params: params,
            eventHandler: eventHandler,
        })  
    }

    // Overrideables

    allChildFlowsDo(closure) {}

    findDirectChildFlow() { return undefined }

    getChildFlows() { return [] }

    processPendingEvents() {}
}

module.exports = Classification.define(FlowNode)