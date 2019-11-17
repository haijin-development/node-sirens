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
}

module.exports = Classification.define(FlowPoint)