const Classification = require('../../O').Classification
const NodeFlowBuilder = require('./NodeFlowBuilder')
const CommandsGroup = require('../commands/CommandsGroup')

/*
 Class(`
    A CommandsBuilder defines a DSL to group and build commands.
 `)
*/
class CommandsBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NodeFlowBuilder]
    }

    /*
        Method(`
            Creates a Command with the given commandId and adds it as a child of
            this Flow.

            If a calculateEnabledClosure is given it creates a StatefulCommand.
            If no is given it creates a StateflessCommand.

            When the command is execute it goes through the CommandsController and
            it evaluates the given actionHandlerClosure.
        `)
    */
    command({ id: commandId, enabledIf: calculateEnabledClosure, whenActioned: actionHandlerClosure }) {
        if( commandId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        this.getRootFlow().defineCommand({
            id: commandId,
            enabledIf: calculateEnabledClosure,
            whenActioned: actionHandlerClosure
        })
    }

    commandsGroup({ id: commandsGroupId }, closure) {
        if( commandsGroupId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        const commandsGroup = CommandsGroup.new({ id: commandsGroupId })

        this.getRootFlow().addChildFlow({
            id: commandsGroupId,
            flow: commandsGroup,
        })

        if( closure != undefined ) {
            commandsGroup.build( closure )
        }
    }

    /*
        Method(`
            This method converts the given methodNames into Commands, preserving
            the original behaviour and the calling sintax.
        `)
    */
    defineMethodsAsCommands({ flow: targetFlow, methods: methodNames }) {
        for( const eachMethodName of methodNames ) {
            this.defineMethodAsCommand({
                flow: targetFlow,
                method: eachMethodName
            })
        }
    }

    /*
        Method(`
            This method converts the given methodName into a Command preserving
            its behaviour and the calling sintax of the method but going through the
            CommandsController mechanism.

            It assumes that the given methodName is a method defined in a classification
            of the targetFlow.

            The implementation does not modify the original method, instead it defines
            a new method to override it.
        `)
    */
    defineMethodAsCommand({ flow: targetFlow, method: methodName }) {
        if( targetFlow === undefined ) { targetFlow = this.getRootFlow() }

        const method = targetFlow[methodName]

        const commandName = methodName

        targetFlow.defineCommand({
            id: commandName,
            whenActioned: method.bind(targetFlow),
        })

        targetFlow.defineCommandMethod({
            named: commandName
        })
    }
}

module.exports = Classification.define(CommandsBuilder)