const Classification = require('../../../../src/O').Classification
const CommandsController = require('../../../../src/finger-tips/commands/CommandsController')

class CustomCommandsController {
    static definition() {
        this.instanceVariables = ['events', 'commands']
        this.assumes = [CommandsController]
    } 

    initialize({ mainFlow: mainFlow }) {
        this.previousClassificationDo( () => {
            this.initialize({ mainFlow: mainFlow })
        })

        this.events = []
        this.commands = []
    }

    getEvents() {
        return this.events
    }

    getCommands() {
        return this.commands
    }

    doExecuteEventHandler({
        flowId: flowId, event: eventName, params: params, eventHandler: eventHandler,
    }) {
        this.previousClassificationDo( () => {
            this.doExecuteEventHandler({
                flowId: flowId,
                event: eventName,
                params: params,
                eventHandler: eventHandler,
            })  
        })

        this.events.push({
            flowId: flowId,
            event: eventName,
            params: params
        })
    }

    doExecuteCommand({ command: command, params: params }) {
        const result = this.previousClassificationDo( () => {
            return this.doExecuteCommand({
                command: command,
                params: params,
            })  
        })

        this.commands.push({
            command: command,
            params: params,
            result: result,
        })
    }
}

module.exports = Classification.define(CustomCommandsController)