const Classification = require('../../O').Classification
const Command = require('./Command')
const FlowPoint = require('../FlowPoint')

class CommandsGroup {

    /// Definition

    static definition() {
        this.instanceVariables = ['commands']
        this.assumes = [FlowPoint]
    }

    /// Initializing

    initialize() {
        this.commands = []
    }

    /// Adding

    add({ command: command }) {
        this.commands.push( command )
    }

    /// Searching

    findChild({ id: childId }) {
        return this.commands.find( (command) => {
            return command.getId() === childId
        })
    }

    /// Iterating

    evaluateCommandsEnabledClosure({ application: application }) {
        this.commandsDo( (command) => {
            command.evaluateEnabledClosure({ application: application })
        })
    }

    commandsDo(closure) {
        this.commands.forEach( closure )
    }
}

module.exports = Classification.define(CommandsGroup)