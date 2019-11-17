const Protocol = require('../../O').Protocol

class CommandsRouterProtocol {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
        this.implements = []
    }

    afterEvent({ event: eventName, id: childId, params: params }) {}

    executeCommand({ command: command, params: params }) {}
}

module.exports = Protocol.define(CommandsRouterProtocol)