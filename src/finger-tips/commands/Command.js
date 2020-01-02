const Classification = require('../../O').Classification
const FlowNode = require('../flows/FlowNode')

class Command {
    /// Definition

    static definition() {
        this.instanceVariables = ['actionHandlerClosure']
        this.assumes = [FlowNode]
    }

    /// Initializing

    initialize({ id: id, idPath: idPath, actionHandlerClosure: actionHandlerClosure }) {
        if( id === undefined ) { throw new Error(`An id must be provided.`) }

        this.actionHandlerClosure = actionHandlerClosure

        this.previousClassificationDo( () => {
            this.initialize({ id: id, idPath: idPath })
        })
    }

    releaseFlow() {
        this.previousClassificationDo( () => {
            this.releaseFlow()
        })

        this.actionHandlerClosure = null
    }

    /// Id

    setActionHandlerClosure(actionHandlerClosure) {
        this.actionHandlerClosure = actionHandlerClosure
    }

    // Commands

    hasActionHandler() {
        return typeof( this.actionHandlerClosure ) === 'function'
    }

    isCommand() {
        return true
    }

    /// Flow

    asFlowPoint() {
        throw new Error(`Another classification should implement this method.`)
    }

    /// Executing

    execute({ params: params }) {
        if( params === undefined ) { params = [] }

        const commandsController = this.getCommandsController()

        if( ! commandsController ) { return }

        const result = commandsController.doExecuteCommand({
            command: this,
            params: params
        })

        return result
    }

    executeActionHandlerClosure({ params: params }) {
        if( ! this.hasActionHandler() ) {
            const idPath = this.getIdPath()

            throw new Error(`The actionHandler for the command '${idPath}' is not defined, the application should define it.`)
        }

        const actionHandler = this.actionHandlerClosure

        return actionHandler( ... params)
    }
}

module.exports = Classification.define(Command)