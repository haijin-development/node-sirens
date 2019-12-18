const Classification = require('../../../src/O').Classification

/*
    Class(`
        An attachable to a CommandsControllers object to remember which unhandled commands were
        bubbled up and allow further expections on them.
    `)
*/
class UnhandledBubbledUpCommandHandler {
    /// Definition

    static definition() {
        this.instanceVariables = ['bubbledCommandsReceived']
    }

    afterInstantiation() {
        this.bubbledCommandsReceived = []
    }

    receivedCommandsCount() {
        return this.bubbledCommandsReceived.length
    }

    receivedCommandAt({ index: index }) {
        return this.bubbledCommandsReceived[index]
    }

    onUnhandledBubbleUpCommand({ commandName: commandName, params: params, startingAt: flow }) {
        this.bubbledCommandsReceived.push({
            commandName: commandName,
            params: params,
            startingAt: flow,
        })
    }

}

module.exports = Classification.define(UnhandledBubbledUpCommandHandler)