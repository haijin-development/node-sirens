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

    defineMethodsAsCommands({ flow: targetFlow, methods: methodNames }) {
        if( targetFlow === undefined ) { targetFlow = this.getRootFlow() }

        const CommandsMethodsDynamicClassification =
            Classification.define( class _CommandsMethodsDynamicClassification {} )

        for( const eachMethodName of methodNames ) {
            const method = targetFlow[eachMethodName]

            targetFlow.defineCommand({
                id: eachMethodName,
                whenActioned: method.bind(targetFlow),
            })

            const commandMethodReplacement = function(...params) {
                return this.executeCommand({
                    id: eachMethodName,
                    withAll: params,
                })
            }

            CommandsMethodsDynamicClassification.defineMethod({
                methodName: eachMethodName,
                methodClosure: commandMethodReplacement,
            })
        }

        targetFlow.behaveAs( CommandsMethodsDynamicClassification )
    }
}

module.exports = Classification.define(CommandsBuilder)