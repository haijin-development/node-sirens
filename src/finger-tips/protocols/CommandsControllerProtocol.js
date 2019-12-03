const Protocol = require('../../O').Protocol

class CommandsControllerProtocol {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
        this.implements = []
    }

    doExecuteEventHandler({
        flowPointId: flowPointId, event: eventName, params: params, eventHandler: eventHandler,
    }) {}

    doExecuteCommand({ command: command, params: params }) {}
}

module.exports = Protocol.define(CommandsControllerProtocol)