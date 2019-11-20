const Classification = require('../../O').Classification
const CommandsGroup = require('./CommandsGroup')
const Command = require('./Command')

class CommandsGroupBuilder {

    /// Definition

    static definition() {
        this.instanceVariables = ['commandsGroup', 'commandsRouter']
    }

    /// Initializing

    initialize({ commandsGroup: commandsGroup } = { commandsGroup: undefined }) {
        this.commandsGroup = commandsGroup ? commandsGroup : CommandsGroup.new()
    }

    setCommandsRouter(commandsRouter) {
        this.commandsRouter = commandsRouter

        if( this.commandsGroup ) {
            this.commandsGroup.setCommandsRouter( this.getCommandsRouter() )
        }
    }

    getCommandsRouter() {
        return this.commandsRouter
    }

    /// Building

    build(closure) {
        this.bindYourself( closure )

        return this.commandsGroup
    }

    command({ id: id, enabledIf: enabledClosure, whenActioned: actionClosure }) {
        const command = Command.new({ id: id, enabledClosure: enabledClosure, actionClosure: actionClosure })

        command.setCommandsRouter( this.getCommandsRouter() )

        this.commandsGroup.add({ command: command })

        return command
    }
}

module.exports = Classification.define(CommandsGroupBuilder)