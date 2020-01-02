const Classification = require('../../O').Classification
const NodeFlowBuilder = require('./NodeFlowBuilder')
const OInstance = require('../../O').OInstance
const CreateObjectCommand = require('../commands/CreateObjectCommand')
const NamespaceFlow = require('../flows/NamespaceFlow')

/*
 Class(`
    A NamespaceFlowBuilder defines a DSL to build a NamespaceFlow.
 `)
*/
class NamespaceFlowBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['rootFlow']
        this.assumes = [NodeFlowBuilder]
    }

    /*
        Method(`
            A CreateObjectCommand is used to instantiate objects using the given
            createObjectClosure.

            Using a CreateObjectCommand

                const createAClassificationCommand = CreateObjectCommand.new({
                    id: 'AClassification',
                    actionHandlerClosure: () => { AClassification.new() }
                })
    
                createObjectCommand.new()

            instead of calling the method

                    AClassification.new()

            allows the ascedant nodes to override and customize the creation of the 
            object just like with any other Command in the Flow tree.

            To make a fluent DSL this method also creates an instance property on the
            main flow named with the given objectCreatorName.

            This allows the use

                mainFlow.AClassification.new(...)

            and if the mainFlow is renamed then

                namespace.AClassification.new(...)

            which allows to use Flows to implement namespaces to create
            objects with a fluent DSL.

            This namespaces can be nested and overriden by the main flow just like
            any other Command in the Flow tree.
        `)
    */
    createObject({
        id: objectCreatorName, with: createObjectClosure, inNamespace: namespace
    }) {
        if( objectCreatorName === undefined ) { throw new Error(`The id must be defined.`) }

        const thisFlow = this.getRootFlow()

        const createObjectCommand = CreateObjectCommand.new({
            id: objectCreatorName,
            actionHandlerClosure: function(...props) {
                const newObject = createObjectClosure(...props)

                if(
                    OInstance.isOInstance( newObject )
                    &&
                    newObject.respondsTo('setNamespace')
                  )
                {
                    if( namespace === undefined ) {
                        namespace = thisFlow
                    }

                    newObject.setNamespace( namespace )
                    newObject.lockNamespace()
                }

                return newObject
            },
        })

        this.getRootFlow().addChildFlow({
            id: objectCreatorName,
            flow: createObjectCommand,
        })

        this.defineNamespaceAccessor({
            accessor: objectCreatorName,
            value: createObjectCommand,
        })
    }

    /*
        Method(`
            A group is just a category to gather related commands.
            Defining object creators within a .group() does not change the NamespaceFlow.
        `)
    */
    group({ id: groupId }, closure) {
        closure.call(this)
    }

    /*
        Method(`
            A group is just a category to gather related commands.
            Defining object creators within a .group() does not change the NamespaceFlow.
        `)
    */
    namespace({ id: nestedNamespaceId, from: anotherNamespaceFlow }, closure) {
        if( nestedNamespaceId === undefined ) { throw new Error(`The id must be defined.`) }

        if( closure !== undefined ) {
            this.defineNamespaceFromClosure({ id: nestedNamespaceId }, closure)
        }

        if( anotherNamespaceFlow !== undefined ) {
            this.defineNamespaceFromNamespaceFlow({
                id: nestedNamespaceId,
                namespaceFlow: anotherNamespaceFlow
            })
        }
    }

    defineNamespaceFromNamespaceFlow({ id: nestedNamespaceId, namespaceFlow: namespaceFlow }) {
        this.getRootFlow().addChildFlow({
            id: nestedNamespaceId,
            flow: namespaceFlow
        })

        const nestedNamespaceAccessor = {}

        for( const childFlow of namespaceFlow.getChildFlows() ) {
            const nestedId = childFlow.getId()

            nestedNamespaceAccessor[ nestedId ] = namespaceFlow[ nestedId ]
        }

        this.defineNamespaceAccessor({
            accessor: nestedNamespaceId,
            value: nestedNamespaceAccessor
        })
    }

    defineNamespaceFromClosure({ id: nestedNamespaceId }, closure) {
        const nestedFlow = NamespaceFlow.new()

        nestedFlow.build( closure )

        this.getRootFlow().addChildFlow({
            id: nestedNamespaceId,
            flow: nestedFlow
        })

        const nestedNamespaceAccessor = {}

        for( const childFlow of nestedFlow.getChildFlows() ) {
            const nestedId = childFlow.getId()

            nestedNamespaceAccessor[ nestedId ] = nestedFlow[ nestedId ]
        }

        this.defineNamespaceAccessor({
            accessor: nestedNamespaceId,
            value: nestedNamespaceAccessor
        })
    }

    defineNamespaceAccessor({ accessor: accessor, value: value })
    {
        this.getRootFlow().setUnclassifiedProperty({
            name: accessor,
            value: value,
        })        
    }

    defineMethodsAsCreateObjectCommands({ methods: methodNames, inNamespace: namespace }) {
        if( namespace === undefined ) { namespace = this.getRootFlow() }

        const targetFlow = this.getRootFlow()

        const CommandsMethodsDynamicClassification =
            Classification.define( class _CommandsMethodsDynamicClassification {} )

        for( const eachMethodName of methodNames ) {
            const method = targetFlow[eachMethodName]

            this.createObject({
                id: eachMethodName,
                with: method.bind(targetFlow),
                inNamespace: namespace,
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

module.exports = Classification.define(NamespaceFlowBuilder)