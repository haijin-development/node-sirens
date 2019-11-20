const Protocol = require('../../O').Protocol

class CommandsRouterProtocol {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
        this.implements = []
    }

    eventNofification({ flowPointId: flowPointId, event: eventName, params: params }) {}

    executeEvent({
        flowPointId: flowPointId, event: event, params: params, eventHandler: valueChangedClosure,
    }) {}

    executeCommand({ command: command, params: params }) {}
}

module.exports = Protocol.define(CommandsRouterProtocol)