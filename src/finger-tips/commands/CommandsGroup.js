const Classification = require('../../O').Classification
const FlowNode = require('../flows/FlowNode')
const FlowWithChildren = require('../flows/FlowWithChildren')

class CommandsGroup {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FlowNode, FlowWithChildren]
    }

    isCommandsGroup() {
        return true
    }

    /*
        Method(`
            Returns a CommandsBuilder to build this NamespaceFlow using a DSL.
        `)
    */
    newFlowBuilder() {
        // review
        const CommandsBuilder = require('../flow-builders/CommandsBuilder')
        return CommandsBuilder.new({ flow: this })
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