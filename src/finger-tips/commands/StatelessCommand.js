const Classification = require('../../O').Classification
const Command = require('./Command')
const StatelessCommandPoint = require('./StatelessCommandPoint')

class StatelessCommand {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Command]
    }

    /// Initializing

    asFlowPoint() {
        const commandPoint = StatelessCommandPoint.new({ command: this })

        return commandPoint
    }
}

module.exports = Classification.define(StatelessCommand)