const Classification = require('../../O').Classification

class CommandsController {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainFlow']
    }

    /// Initializing

    initialize({ mainFlow: flow }) {
        this.mainFlow = flow
    }

    /// Events

    doExecuteEventHandler({
        flowPointId: flowPointId, event: eventName, params: params, eventHandler: eventHandler,
    }) {
        const result = eventHandler( ...params )

        this.updateCommandsEnabledState()

        return result
    }

    /// Commands

    executeCommand({ id: commandId, with: param, withAll: params }) {
        return this.mainFlow.executeCommand({ id: commandId, with: param, withAll: params })
    }

    doExecuteCommand({ command: command, params: params }) {
        const result = command.executeActionHandlerClosure({ params: params })

        this.updateCommandsEnabledState()

        return result
    }

    updateCommandsEnabledState() {
        this.allCommandsDo( (command) => {
            command.updateEnabledState()
        })
    }

    allCommandsDo(closure) {
        if( ! this.mainFlow ) { return }

        this.mainFlow.allCommandsDo(closure)
    }
}

module.exports = Classification.define(CommandsController)