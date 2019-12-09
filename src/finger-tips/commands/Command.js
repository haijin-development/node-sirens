const Classification = require('../../O').Classification

class Command {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'id', 'idPath',
            'actionHandlerClosure',
            'commandsController',
        ]
    }

    /// Initializing

    initialize({ id: id, idPath: idPath, actionHandlerClosure: actionHandlerClosure }) {
        this.id = id
        this.idPath = idPath ? `${idPath}.${id}` : id
        this.actionHandlerClosure = actionHandlerClosure
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

    setIdPath(idPath) {
        this.idPath = idPath
    }

    setActionHandlerClosure(actionHandlerClosure) {
        this.actionHandlerClosure = actionHandlerClosure
    }

    // Commands

    setCommandsController(commandsController) {
        this.commandsController = commandsController
    }

    getCommandsController() {
        return this.commandsController
    }

    hasActionHandler() {
        return typeof( this.actionHandlerClosure ) === 'function'
    }

    isCommand() {
        return true
    }

    /// Flow

    allChildFlowsDo(closure) {}

    findDirectChildFlow() { return undefined }

    getChildFlows() { return [] }

    asFlowPoint() {
        throw new Error(`Another classification should implement this method.`)
    }

    /// Executing

    execute({ params: params }) {
        if( params === undefined ) { params = [] }

        const commandsController = this.getCommandsController()

        const result = commandsController.doExecuteCommand({
            command: this,
            params: params
        })

        return result
    }

    executeActionHandlerClosure({ params: params }) {
        if( ! this.hasActionHandler() ) {
            throw new Error(`The actionHandler for the command '${this.idPath}' is not defined, the application should define it.`)
        }

        const actionHandler = this.actionHandlerClosure

        return actionHandler( ... params)
    }
}

module.exports = Classification.define(Command)