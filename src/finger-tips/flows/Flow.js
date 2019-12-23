const Classification = require('../../O').Classification
const FlowPointFinder = require('./FlowPointFinder')
const CommandsController = require('../commands/CommandsController')
const StatefulCommand = require('../commands/StatefulCommand')
const StatelessCommand = require('../commands/StatelessCommand')

class Flow {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'id', 'idPath',
            'childFlows',
            'commandsController',
            'pendingEvents',
            'bubbledUpCommands',
            'defaultBubbledUpHandlerClosure'
        ]
    }

    /// Initializing

    afterInstantiation() {
        this.childFlows = new Map()
        this.commandsController = CommandsController.new({ mainFlow: this })
        this.pendingEvents = new Map()
        this.bubbledUpCommands = new Set()
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
        const FlowBuilder = require('./FlowBuilder')

        const flowBuilder = FlowBuilder.new({ flow: this })

        flowBuilder.evaluate({ closure: closure, with: this })
    }

    releaseFlow() {
        const childFlows = this.getChildFlows()

        childFlows.forEach( (childFlow) => {
            childFlow.releaseFlow()
        })

        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })

        this.pendingEvents = new Map()
        this.childFlows = new Map()
        this.bubbledUpCommands = new Set()
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

    defineCommand({ id: commandId, enabledIf: calculateEnabledClosure, whenActioned: actionHandlerClosure }) {
        const commandFlow = this.searchCommandParentFlowFromId({ id: commandId })

        const command = typeof( calculateEnabledClosure ) !== undefined ?
            StatefulCommand.new({
                id: commandFlow.commandId,
                idPath: commandFlow.parent.idPath + '.' + commandFlow.commandId,
                calculateEnabledClosure: calculateEnabledClosure,
                actionHandlerClosure: actionHandlerClosure
            })
            :
            StatelessCommand.new({
                id: commandFlow.commandId,
                idPath: commandFlow.parent.idPath + '.' + commandFlow.commandId,
                actionHandlerClosure: actionHandlerClosure,
            })

        commandFlow.parent.addChildFlow({
            id: commandFlow.commandId,
            flow: command,
        })
    }

    overrideCommand({ id: commandId, enabledIf: calculateEnabledClosure, whenActioned: actionHandlerClosure }) {
        const commandFlow = this.searchCommandParentFlowFromId({ id: commandId })

        commandFlow.parent.removeChildFlow({ id: commandFlow.commandId })

        commandFlow.parent.defineCommand({
            id: commandFlow.commandId,
            enabledIf: calculateEnabledClosure,
            whenActioned: actionHandlerClosure
        })
    }

    searchCommandParentFlowFromId({ id: commandId }) {
        const ids = commandId.split('.')
        const firstIds = ids.slice(0, -1)
        const lastId = ids[ ids.length - 1 ]

        let parent = this

        firstIds.forEach( (eachId) => {
            parent = parent.getChildFlow({ id: eachId })
        })

        return { parent: parent, commandId: lastId }
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

    /*
        Hook method for other classifications to override.
        Picks which commands to export to the given flowPoint.
    */
    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        this.exportCommandsToFlowPoint({
            commandsIds: 'all',
            flowPoint: flowPoint
        })
    }

    selectCommands({ commandIds: commandIds }) {
        const thisFlowIdPath = this.getIdPath()

        if( commandIds !== 'all' ) {
            commandIds = commandIds.map( (commandId) => {
                return thisFlowIdPath + '.' + commandId
            })
        }

        const selectedCommands = []
        const remainingCommandIds = new Set(commandIds)

        this.allChildFlowsDo( (command) => {
            if( ! command.respondsTo('isCommand') ) { return }

            const commandIdPath = command.getIdPath()

            if( commandIds === 'all' || commandIds.includes( commandIdPath ) ) {
                selectedCommands.push( command )
                remainingCommandIds.delete( commandIdPath )
            }
        })

        if( commandIds !== 'all' && remainingCommandIds.size > 0 ) {
            const missingCommands = Array.from(remainingCommandIds).join(', ')
            throw new Error(`Commands [${ missingCommands }] were not found in the flow ${this}`)
        }

        return selectedCommands
    }

    exportCommandsToFlowPoint({ commandsIds: commandsIds, flowPoint: flowPoint }) {
        const flowCommands = this.selectCommands({ commandIds: commandsIds })

        if( flowCommands.length === 0 ) { return }

        const classification = Classification.define( class ExportedCommands {} )

        flowCommands.forEach( (command) => {

            const commandId = command.getId()

            classification.defineMethod({
                methodName: commandId,
                methodClosure: function(...params) {
                    return command.execute({ params: params })
                },
            })
        })


        flowPoint.behaveAs( classification )

        return flowPoint
    }

    bubbleUp({ command: commandName, params: params, param: param, ifUnhandled: unhandledClosure }) {
        if( param !== undefined ) { params = [param] }
        if( params === undefined ) { params = [] }

        const commandsController = this.getCommandsController()

        const result = commandsController.bubbleUp({
            commandName: commandName,
            params: params,
            startingAtFlow: this,
            ifUnhandled: unhandledClosure,
        })

        return result
    }

    handleBubbledUpCommand({
        commandName: commandName, params: params, startingAtFlow: flow, unhandledClosure: unhandledClosure
    }) {
        if( ! this.bubbledUpCommands.has( commandName ) ) {
            return this.handleBubbledUpCommandWithDefaultHandler({
                commandName: commandName,
                params: params,
                startingAtFlow: flow,
                unhandledClosure: unhandledClosure,
            })
        }

        const handlerMethod = this[commandName].bind(this)

        const result = handlerMethod(...params)

        return {
            wasHandled: true,
            result: result,
        }
    }

    hasBubbledUpCommandDefaultHandler() {
        return this.defaultBubbledUpHandlerClosure !== undefined     
    }

    handleBubbledUpCommandWithDefaultHandler({
        commandName: commandName, params: params, startingAtFlow: flow, ifUnhandled: unhandledClosure
    }) {
        if( ! this.hasBubbledUpCommandDefaultHandler() ) {
            return { wasHandled: false }
        }

        if( unhandledClosure !== undefined ) {
            const result = unhandledClosure({
                commandName: commandName,
                params: params,
                startingAtFlow: flow
            })

            return { wasHandled: true, result: result } 
        }

        if( this.defaultBubbledUpHandlerClosure !== undefined ) {
            const result = this.defaultBubbledUpHandlerClosure({
                commandName: commandName,
                params: params,
                startingAtFlow: flow
            })

            return { wasHandled: true, result: result } 
        }

        const result = this.onUnhandledBubbleUpCommand({
            commandName: commandName,
            params: params,
            startingAtFlow: flow
        })

        return { wasHandled: true, result: result } 
    }

    onUnhandledBubbleUpCommand({ commandName: commandName, params: params, startingAtFlow: flow }) {
        const id = flow.getIdPath()

        throw new Error(`Unhandled command '${commandName}' bubbled up from flow '${id}'.`)
    }

    acceptAllBubbledUps({ commands: methodNames, defaultHandler: defaultHandlerClosure }) {
        for( const eachMethodName of methodNames ) {
            this.acceptBubbledUp( eachMethodName )
        }

        this.defaultBubbledUpHandlerClosure = defaultHandlerClosure
    }

    acceptBubbledUp(methodName) {
        this.bubbledUpCommands.add( methodName )
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