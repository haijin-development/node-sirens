const Classification = require('../../O').Classification
const FlowPointFinder = require('./FlowPointFinder')
const StatefulCommand = require('../commands/StatefulCommand')
const StatelessCommand = require('../commands/StatelessCommand')

class Flow {
    /// Definition

    static definition() {
        this.instanceVariables = ['id', 'idPath', 'childFlows', 'commandsController', ]
    }

    /// Initializing

    afterInstantiation() {
        this.childFlows = {}
    }

    initialize({ id: id, idPath: idPath } = { id: undefined, idPath: undefined }) {
        this.id = id
        this.idPath = idPath ? `${idPath}.${id}` : id

        if( this.respondsTo('buildWith') ) {
            const flow = this

            this.build( function() {
                const flowBuilder = this
                flow.buildWith( flowBuilder )
            })
        }
    }

    build(closure) {
        const FlowBuilder = require('./FlowBuilder')

        const flowBuilder = FlowBuilder.new({ flow: this })

        flowBuilder.evaluate({ closure: closure, with: this })
    }

    addChildFlow({ id: childFlowId, flow: childFlow }) {
        if( childFlow.getId() && childFlow.getId() !== childFlowId ) {
            throw new Error(`Child flow already has an id: '${childFlow.getId()}'.`)
        }

        if( this.childFlows[childFlowId] !== undefined ) {
            throw new Error(`This flow already has a child flow with id: '${childFlowId}'.`)
        }

        childFlow.setId({ id: childFlowId, idPath: this.id })
        childFlow.setCommandsController( this.commandsController )

        this.childFlows[childFlowId] = childFlow
    }

    addCommand({ id: commandId, command: command }) {
        this.addChildFlow({ id: commandId, flow: command })
    }

    defineCommand({ id: commandId, enabledIf: calculateEnabledClosure, whenActioned: actionHandlerClosure }) {
        const ids = commandId.split('.')
        const firstIds = ids.slice(0, -1)
        const lastId = ids[ ids.length - 1 ]

        let child = this

        firstIds.forEach( (eachId) => {
            child = child.getChildFlow({ id: eachId })
        })

        const command = typeof(calculateEnabledClosure) !== undefined ?
            StatefulCommand.new({
                calculateEnabledClosure: calculateEnabledClosure, actionHandlerClosure: actionHandlerClosure
            })
            :
            StatelessCommand.new({ actionHandlerClosure: actionHandlerClosure })

        child.addCommand({
            id: lastId,
            command: command,
        })
    }

    /// Id

    getId() {
        return this.id
    }

    setId({ id: id, idPath: idPath }) {
        this.id = id
        this.idPath = idPath ? `${idPath}.${id}` : id
    }

    getIdPath() {
        return this.idPath
    }

    /// Searching

    getChildFlows() {
        return Object.values( this.childFlows )
    }

    getFlowPoint({ id: flowPointId }) {
        const childFlow = this.getChildFlow({ id: flowPointId })

        return childFlow.asFlowPoint()
    }

    getChildFlow({ id: flowPointId }) {
        const childFlow = this.findChildFlow({ id: flowPointId })

        if( childFlow === undefined ) {
            throw new Error(`Child flow with {id: '${flowPointId}'} not found.`)
        }

        return childFlow
    }

    findChildFlow({ id: flowPointId }) {
        const finder = FlowPointFinder.new()

        return finder.findFlowPoint({ id: flowPointId, startingAt: this })
    }

    findDirectChildFlow({ id: flowPointId }) {
        return this.childFlows[ flowPointId ]
    }

    allChildFlowsDo(closure) {
        const childFlows = this.getChildFlows()

        childFlows.forEach( (childFlow) => {
            closure(childFlow)

            childFlow.allChildFlowsDo(closure)
        })
    }

    // Commands

    setCommandsController(commandsController) {
        this.commandsController = commandsController

        this.getChildFlows().forEach( (childFlow) => {
            childFlow.setCommandsController( commandsController )
        })
    }

    getCommandsController() {
        return this.commandsController
    }

    evaluateEventHandler({ event: event, params: params, eventHandler: eventHandler }) {
        if( params === undefined ) { params = [] }

        const commandsController = this.getCommandsController()

        if( ! commandsController ) {
            return eventHandler(...params)
        }

        return commandsController.doExecuteEventHandler({
            flowPointId: this.id,
            event: event,
            params: params,
            eventHandler: eventHandler,
        })        
    }

    executeCommand({ id: commandId, with: param, withAll: params }) {
        if( param !== undefined && params !== undefined ) {
            throw new Error(`Only one of 'with:' or 'withAll:' can be defined.`)
        }
        if( param != undefined ) { params = [ param ] }

        const command = this.getChildFlow({ id: commandId })

        return command.execute({ params: params })
    }

    getCommand({ id: commandId }) {
        const command = this.getChildFlow({ id: commandId })

        if( ! command.respondsTo('isCommand') ) {
            throw new Error(`The flow child with id {id: '${commandId}'} exists but it is not a Command.`)
        }

        return command.asFlowPoint()
    }

    getActionHandler({ id: commandId }) {
        return this.getCommand({ id: commandId }).getActionHandler()
    }

    allCommandsDo(closure) {
        const commands = []

        this.allChildFlowsDo( (childFlow) => {
            if( childFlow.respondsTo('isCommand') ) {
                commands.push( childFlow )                
            }
        })

        commands.forEach( closure )
    }

    getDirectCommands() {
        return this.getChildFlows().filter( (childFlow) => {
            return childFlow.respondsTo('isCommand')
        })
    }

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const flowCommands = this.getDirectCommands()

        if( flowCommands.length === 0 ) { return }

        const classificationDefinition = class DynamicClassification {}

        flowCommands.forEach( (command) => {
            const commandId = command.getId()

            classificationDefinition.prototype[commandId] = command.getActionHandler()
        })

        const classification = Classification.define(classificationDefinition)

        flowPoint.behaveAs( classification )

        return flowPoint
    }
}

module.exports = Classification.define(Flow)