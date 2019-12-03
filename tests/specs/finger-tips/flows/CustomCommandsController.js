const Classification = require('../../../../src/O').Classification
const CommandsController = require('../../../../src/finger-tips/commands/CommandsController')

class CustomCommandsController {
    static definition() {
        this.instanceVariables = ['events', 'commands']
        this.assumes = [CommandsController]
    } 

    initialize() {
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
        flowPointId: flowPointId, event: eventName, params: params, eventHandler: eventHandler,
    }) {
        this.previousClassificationDo( () => {
            this.doExecuteEventHandler({
                flowPointId: flowPointId,
                event: eventName,
                params: params,
                eventHandler: eventHandler,
            })                    
        })

        this.events.push({
            flowPointId: flowPointId,
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