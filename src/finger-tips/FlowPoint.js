const Classification = require('../O').Classification

/*
 Class(`
    This classification can be attached to an object to have a CommandsRouter.
 `)
*/
class FlowPoint {
    /// Definition

    static definition() {
        this.instanceVariables = ['commandsRouter']
    }

    /// Initializing

    setCommandsRouter(commandsRouter) {
        this.commandsRouter = commandsRouter
    }

    getCommandsRouter() {
        return this.commandsRouter
    }

    executeCommandClosure({ commandId: commandId, closure: closure }) {
        const command = this.getChild({ id: commandId })

        const commandsRouter = this.getCommandsRouter()

        return commandsRouter.executeCommandClosure({
            command: command,
            closure: closure,
        })
    }
}

module.exports = Classification.define(FlowPoint)