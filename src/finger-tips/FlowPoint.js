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

    defineCommand({ id: commandId, enabledIf: enabledClosure, whenActioned: actionClosure }) {
        const Command = require('./commands/Command')

        const command = Command.new({
            id: commandId,
            enabledClosure: enabledClosure,
            actionClosure: actionClosure
        })

        this.addChildModel({ id: commandId, model: command })

        return this
    }
}

module.exports = Classification.define(FlowPoint)