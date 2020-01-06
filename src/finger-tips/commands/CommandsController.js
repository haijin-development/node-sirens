const Classification = require('../../O').Classification

class CommandsController {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainFlow', 'isUpdatingFlowPoints']
    }

    /// Initializing

    initialize({ mainFlow: flow }) {
        if( flow === undefined ) { throw new Error(`Invalid main flow.`) }

        this.mainFlow = flow
        this.isUpdatingFlowPoints = false
    }

    /// Entry points to flows accessors

    doExecuteEventHandler({
        flowId: flowId, event: eventName, params: params, eventHandler: eventHandler,
    }) {
        if( flowId === undefined ) { throw new Error(`Invalid flow id.`) }
        if( eventName === undefined ) { throw new Error(`Invalid event.`) }
        if( eventHandler === undefined ) { throw new Error(`Invalid eventHandler.`) }

        const result = eventHandler( ...params )

        this.runUpdateFlowPointsIteration()

        return result
    }

    doExecuteCommand({ command: command, params: params }) {
        const result = command.executeActionHandlerClosure({ params: params })

        this.runUpdateFlowPointsIteration()

        return result
    }

    // Blubbling up

    bubbleUp({
        commandName: commandName, params: params, startingAtFlow: flow, ifUnhandled: unhandledClosure
    }) {
        const bottomFlowId = flow.getIdPath()

        const ids = bottomFlowId.split( '.' )

        const reversedFlowsPath = []

        let currentFlow = this.mainFlow

        for( const eachId of ids.slice(1) ) {
            reversedFlowsPath.unshift( currentFlow )

            currentFlow = currentFlow.findDirectChildFlow({ id: eachId })
        }

        for( const eachFlowInPath of reversedFlowsPath ) {
            const commandResult = eachFlowInPath.handleBubbledUpCommand({
                commandName: commandName,
                params: params,
                startingAtFlow: flow,
                ifUnhandled: unhandledClosure,
            })

            if( commandResult.wasHandled === true ) {
                return commandResult.result
            }
        }

        if( unhandledClosure === undefined ) {
            unhandledClosure = this.onUnhandledBubbleUpCommand.bind(this)
        }

        return unhandledClosure({
            commandName: commandName,
            params: params,
            startingAtFlow: flow
        })
    }

    onUnhandledBubbleUpCommand({ commandName: commandName, params: params, startingAtFlow: flow }) {
        const id = flow.getIdPath()

        throw new Error(`Unhandled command '${commandName}' bubbled up from flow '${id}'.`)
    }

    // Events

    runUpdateFlowPointsIteration() {
        if( this.isUpdatingFlowPoints === true ) { return }

        this.isUpdatingFlowPoints = true

        try {
            this.runProcessPendingEvents()
        } finally {
            this.isUpdatingFlowPoints = false            
        }
    }

    runProcessPendingEvents() {
        this.mainFlow.processPendingEvents()

        this.mainFlow.allChildFlowsDo( (childFlow) => {
            childFlow.processPendingEvents()
        })
    }
}

module.exports = Classification.define(CommandsController)