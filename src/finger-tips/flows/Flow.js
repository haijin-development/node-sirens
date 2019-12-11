const Classification = require('../../O').Classification
const FlowPointFinder = require('./FlowPointFinder')
const CommandsController = require('../commands/CommandsController')
const StatefulCommand = require('../commands/StatefulCommand')
const StatelessCommand = require('../commands/StatelessCommand')

class Flow {
    /// Definition

    static definition() {
        this.instanceVariables = ['id', 'idPath', 'childFlows', 'commandsController', 'pendingEvents']
    }

    /// Initializing

    afterInstantiation() {
        this.childFlows = new Map()
        this.commandsController = CommandsController.new({ mainFlow: this })
        this.pendingEvents = new Map()
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
        }
    }

    build(closure) {
        const FlowBuilder = require('./FlowBuilder')

        const flowBuilder = FlowBuilder.new({ flow: this })

        flowBuilder.evaluate({ closure: closure, with: this })
    }

    releaseFlow() {
        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })

        this.pendingEvents = new Map()
        this.childFlows = new Map()
    }

    replaceChildFlow({ id: id, withFlow: newFlow }) {
        this.removeChildFlow({ id: id })

        this.addChildFlow({
            id: id,
            flow: newFlow,
        })
    }

    removeChildFlow({ id: childFlowId }) {
        const childFlow = this.childFlows.get(childFlowId)

        if( childFlow === undefined ) { return }

        childFlow.releaseFlow()

        delete this.childFlows.delete(childFlowId)
    }

    addChildFlow({ id: childFlowId, flow: childFlow }) {
        if( this.childFlows.has(childFlowId) ) {
            throw new Error(`This flow already has a child flow with id: '${childFlowId}'.`)
        }

        childFlow.setId({ id: childFlowId, idPath: this.idPath + '.' + childFlowId })
        childFlow.setCommandsController( this.commandsController )

        this.childFlows.set(childFlowId, childFlow)

        childFlow.allChildFlowsDo( (eachChildFlow) => {
            const currentIdPath = eachChildFlow.getIdPath().split('.').slice(1).join('.')
            const newIdPath = childFlow.getIdPath() + '.' + currentIdPath
            eachChildFlow.setIdPath( newIdPath )
        })
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

        const command = typeof( calculateEnabledClosure ) !== undefined ?
            StatefulCommand.new({
                id: lastId,
                idPath: this.idPath + '.' + lastId,
                calculateEnabledClosure: calculateEnabledClosure,
                actionHandlerClosure: actionHandlerClosure
            })
            :
            StatelessCommand.new({
                id: lastId,
                idPath: this.idPath + '.' + lastId,
                actionHandlerClosure: actionHandlerClosure,
            })

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
        this.idPath = idPath
    }

    getIdPath() {
        return this.idPath
    }

    setIdPath(idPath) {
        this.idPath = idPath
    }

    /// Searching

    getChildFlows() {
        return [... this.childFlows.values() ]
    }

    findFlowPoint({ id: flowPointId }) {
        const childFlow = this.findChildFlow({ id: flowPointId })

        return childFlow ? childFlow.asFlowPoint() : null
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
        return this.childFlows.get( flowPointId )
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

        return commandsController.doExecuteEventHandler({
            flowId: this.getIdPath(),
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

    findCommand({ id: commandId }) {
        const command = this.findChildFlow({ id: commandId })

        if( command && ! command.respondsTo('isCommand') ) {
            throw new Error(`The flow child with id {id: '${commandId}'} exists but it is not a Command.`)
        }

        return command ? command.asFlowPoint() : undefined
    }

    getCommand({ id: commandId }) {
        const command = this.findCommand({ id: commandId })

        if( ! command ) {
            throw new Error(`The command with {id: '${commandId}'} was not found.`)
        }

        return command
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

    getFlowPointsCommands() {
        let flowPointCommands = []

        this.getChildFlows().filter( (childFlow) => {
            if( childFlow.respondsTo('isCommand') ){
                flowPointCommands.push( childFlow )
            }

            if( childFlow.respondsTo('isCommandGroup') ){
                flowPointCommands = flowPointCommands.concat( childFlow.getFlowPointsCommands() )
            }
        })

        return flowPointCommands
    }

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const flowCommands = this.getFlowPointsCommands()

        if( flowCommands.length === 0 ) { return }

        const classificationDefinition = class DynamicClassification {}

        flowCommands.forEach( (command) => {

            const commandId = command.getId()

            classificationDefinition.prototype[commandId] = function(...params) {
                return command.execute({ params: params })
            }
        })

        const classification = Classification.define(classificationDefinition)

        flowPoint.behaveAs( classification )

        return flowPoint
    }

    // Events

    addPendingEvent({ event: eventName, params: params }) {
        this.pendingEvents.set(
            eventName,
            {
                event: eventName,
                params: params
            }
        )
    }

    clearPendingEvents() {
        this.pendingEvents.clear()
    }

    processPendingEvents() {
        this.pendingEvents.forEach( (pendingEvent, eventName) => {
            this.processPendingEvent(pendingEvent)
        })

        this.clearPendingEvents()
    }

    processPendingEvent({ event: eventName, params: params }) {
        this.emit(eventName, params)
    }
}

module.exports = Classification.define(Flow)