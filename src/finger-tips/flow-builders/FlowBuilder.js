const Classification = require('../../O').Classification
const NodeFlowBuilder = require('./NodeFlowBuilder')
const CommandsBuilder = require('./CommandsBuilder')
const NamespaceFlowBuilder = require('./NamespaceFlowBuilder')

const ValueFlow = require('../stateful-flows/ValueFlow')
const BufferedValueFlow = require('../stateful-flows/BufferedValueFlow')
const ChoiceFlow = require('../stateful-flows/ChoiceFlow')
const TreeChoiceFlow = require('../stateful-flows/TreeChoiceFlow')

/*
 Class(`
    A FlowBuilder defines a DSL to build a tree of FlowNodes.

    With a FlowBuilder a developer can define

        - the logical components of an application.
        - the events handlers for the events triggered by the logical components of the application.
        - the flow of objects between all the different logical components of the application.
        - the commands that the application executes.
        - the conditions that each of those commands must meet to be executed.

    Building an application Flow using this DSL gives the developer a glance of the application
    logic and behavior in a similar way as a flow chart diagram would but using a textual
    and executable representation.

    Commands can be stateless or stateful.
    Stateful commands define a closure to evaluate if the command should be enabled
    or not based on the current state of the rest of the flow tree.
    Both commands have a closure to execute the command.

    To execute commands the Flow uses an CommandsController.

    The main FlowNode propagates its own CommandsController to every other FlowNode 
    add to the tree.

    Each command defined in a Flow goes through the CommandsController before its
    execution, giving the main Flow a single point with full control over each command 
    execution.

    A Flow can announce its own events when it changes.

    A visual component or external system can hook specific events of one or more Flows
    in the tree to show an up to date visual representation of the Flow contents or to
    perform some other action.

    A FlowBuilder can be used as a standalone object but most commonly it is used
    implicitly when a Flow defines a method

         buildWith(closure)

    For example:

        class MainFlow {

            /// Definition

            static definition() {
                this.instanceVariables = []
                this.assumes = [Flow]
            }

            /// Building

            buildWith(flow) {
                flow.main({ id: 'main' }, function(thisFlow) {

                    this.value({ id: 'selectedItem' })

                    this.command({
                        id: 'openFile',
                        whenActioned: () => { ... }
                    })
                })
            }
        }
 `)
*/
class FlowBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['rootFlow']
        this.assumes = [NodeFlowBuilder, CommandsBuilder, NamespaceFlowBuilder]
    }

    /// Building

    setCommandsController(commandsController) {
        this.getRootFlow().setCommandsController( commandsController )
    }

    whenObjectChanges(onFlowObjectChangesClosure) {
        this.whenValueChanges( onFlowObjectChangesClosure )
    }

    whenValueChanges(onFlowValueChangesClosure) {
        this.getRootFlow().setWhenFlowValueChangedClosure( onFlowValueChangesClosure )
    }

    getChildFlow({ id: childFlowId }) {
        return this.getRootFlow().getChildFlow({ id: childFlowId })
    }

    main({ id: id }, closure) {
        if( id === undefined ) { throw new Error(`The main flow id must be defined.`) }

        this.getRootFlow().setId({ id: id, idPath: id })

        if( closure != undefined ) {
            this.evaluate({ closure: closure, with: this.getRootFlow() })
        }
    }

    object({ id: childFlowId, definedWith: anotherFlow }, closure) {
        if( childFlowId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        this.getRootFlow().addChildFlow({
            id: childFlowId,
            flow: anotherFlow,
        })

        if( closure != undefined ) {
            anotherFlow.build( closure )
        }
    }

    value({ id: childFlowId, value: initialValue, whenValueChanges: whenValueChangesClosure }, closure) {
        if( childFlowId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        const childFlow = ValueFlow.new({ id: childFlowId })

        if( initialValue != undefined ) {
            childFlow.setValue( initialValue )
        }

        childFlow.setWhenFlowValueChangedClosure( whenValueChangesClosure )

        this.getRootFlow().addChildFlow({
            id: childFlowId,
            flow: childFlow,
        })

        if( closure != undefined ) {
            childFlow.build( closure )
        }
    }

    toggle({ id: childFlowId, value: value, whenValueChanges: whenValueChangesClosure }, closure) {
        if( childFlowId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        if( value === undefined ) { value = false }

        const childFlow = ValueFlow.new({ id: childFlowId })

        childFlow.setValue( value )
        childFlow.setWhenFlowValueChangedClosure( whenValueChangesClosure )

        this.getRootFlow().addChildFlow({
            id: childFlowId,
            flow: childFlow,
        })

        if( closure != undefined ) {
            childFlow.build( closure )
        }
    }

    bufferedValue({
        id: childFlowId, whenValueChanges: whenValueChangesClosure, convertToValueWith: convertToValueClosure
    },  closure) {
        if( childFlowId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        const childFlow = BufferedValueFlow.new({ id: childFlowId })

        childFlow.setWhenFlowValueChangedClosure( whenValueChangesClosure )
        childFlow.setConvertToValueClosure( convertToValueClosure )

        this.getRootFlow().addChildFlow({
            id: childFlowId,
            flow: childFlow,
        })

        if( closure != undefined ) {
            childFlow.build( closure )
        }
    }

    treeChoice({
        id: childFlowId,
        roots: treeRoots,
        getChildrenClosure: getChildrenClosure,
        whenSelectionChanges: whenSelectionChangesClosure,
    }, closure) {
        if( childFlowId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        const childFlow = TreeChoiceFlow.new({
            id: childFlowId,
            roots: treeRoots,
            getChildrenClosure: getChildrenClosure,
        })

        childFlow.setWhenSelectionChangesClosure( whenSelectionChangesClosure )

        this.getRootFlow().addChildFlow({
            id: childFlowId,
            flow: childFlow,
        })

        if( closure != undefined ) {
            childFlow.build( closure )
        }
    }

    choice({
        id: childFlowId,
        choices: choices,
        whenSelectionChanges: whenSelectionChangesClosure,
    }, closure) {
        if( childFlowId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        const childFlow = ChoiceFlow.new({
            id: childFlowId,
            choices: choices,
        })

        childFlow.setWhenSelectionChangesClosure( whenSelectionChangesClosure )

        this.getRootFlow().addChildFlow({
            id: childFlowId,
            flow: childFlow,
        })

        if( closure != undefined ) {
            childFlow.build( closure )
        }
    }

    /// Commands

    /*
        Method(`
            Allows each method in the given methodNames collection to be invoked from a
            child flow throuwg the bubbling up mechanism.

            A method can not be invoked from a bubbled up command unless it is explicetely
            declared in this method call.
        `)
    */
    acceptedBubbledUps({ commands: flowMethodNames, defaultHandler: defaultHandlerClosure }) {
        this.getRootFlow().acceptAllBubbledUps({
            commands: flowMethodNames,
            defaultHandler: defaultHandlerClosure
        })
    }
}

FlowBuilder = Classification.define(FlowBuilder)

module.exports = FlowBuilder