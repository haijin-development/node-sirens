const Classification = require('../../O').Classification
const StatefulCommand = require('./StatefulCommand')
const Flow = require('../flows/Flow')

class CommandsGroup {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Flow]
    }

    isCommandsGroup() {
        return true
    }

    /// Iterating

    evaluateCommandsEnabledClosure({ application: application }) {
        this.commandsDo( (command) => {
            command.evaluateEnabledClosure({ application: application })
        })
    }

    commandsDo(closure) {
        this.getChildFlowPoints().forEach( closure )
    }
}

module.exports = Classification.define(CommandsGroup)