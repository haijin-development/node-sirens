const Classification = require('../../O').Classification
const ValueFlow = require('./ValueFlow')
const BufferedValueFlow = require('./BufferedValueFlow')
const ChoiceFlow = require('./ChoiceFlow')
const TreeChoiceFlow = require('./TreeChoiceFlow')

/*
 Class(`
    With this object a developer can define

        - the logical components of an application.
        - the events handlers for the events triggered by the logical components of the application.
        - the flow of objects between all the different logical components of the application.
        - the commands that the application executes.
        - the conditions that each of those commands must meet to be executed.

    Building an application flow using this DSL gives the developer a glance of the application flow in a similar way as
    a flow chart diagram would but using a textual representation.

    Commands can define a closure to evaluate if the command should be enabled based on the current state of the application and
    another closure to execute the command.

    To execute commands the FlowModel can use an optional CommandsController.

    If the main application defines a CommandsController it  is propagated to every other logical component defined during the flow.

    Each command defined in a FlowModel goes through the CommandsController before its execution, giving the main application
    a single point with full control over each command execution.


    Every logical component defined within a FlowModel announces its own events when it changes.

    A visual component or external system can hook specific events of a particular logical component and show an up to date
    visual representation of each component.
 `)
*/
class FlowBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['rootFlow']
    }

    initialize({ flow: rootFlow }) {
        this.rootFlow = rootFlow
    }

    /// Evaluating

    evaluate({ closure: closure, with: param, withAll: params }) {
        if( param !== undefined ) { params = [param] }
        if( params === undefined ) { params = [] }

        closure.call( this, ...params )
    }

    /// Building

    setCommandsController(commandsController) {
        this.rootFlow.setCommandsController( commandsController )
    }

    whenObjectChanges(onFlowObjectChangesClosure) {
        this.whenValueChanges( onFlowObjectChangesClosure )
    }

    whenValueChanges(onFlowValueChangesClosure) {
        this.rootFlow.setWhenFlowValueChangedClosure( onFlowValueChangesClosure )
    }

    getChildFlow({ id: childFlowId }) {
        return this.rootFlow.getChildFlow({ id: childFlowId })
    }

    category(description, closure) {
        closure.call(this)
    }

    main({ id: id }, closure) {
        if( id === undefined ) { throw new Error(`The main flow id must be defined.`) }

        this.rootFlow.setId({ id: id })

        if( closure != undefined ) {
            this.evaluate({ closure: closure, with: this.rootFlow })
        }
    }

    object({ id: childFlowId, definedWith: anotherFlow }, closure) {
        if( childFlowId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        this.rootFlow.addChildFlow({
            id: childFlowId,
            flow: anotherFlow,
        })

        if( closure != undefined ) {
            anotherFlow.build( closure )
        }
    }

    value({ id: childFlowId, whenValueChanges: whenValueChangesClosure }, closure) {
        if( childFlowId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        const childFlow = ValueFlow.new({ id: childFlowId })

        childFlow.setWhenFlowValueChangedClosure( whenValueChangesClosure )

        this.rootFlow.addChildFlow({
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

        this.rootFlow.addChildFlow({
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

        this.rootFlow.addChildFlow({
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

        this.rootFlow.addChildFlow({
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

        this.rootFlow.addChildFlow({
            id: childFlowId,
            flow: childFlow,
        })

        if( closure != undefined ) {
            childFlow.build( closure )
        }
    }

    commands({ id: commandsGroupId }, closure) {
        if( commandsGroupId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        const commandsGroup = ValueFlow.new({ id: commandsGroupId })

        this.rootFlow.addChildFlow({
            id: commandsGroupId,
            flow: commandsGroup,
        })

        if( closure != undefined ) {
            commandsGroup.build( closure )
        }
    }

    command({ id: commandId, enabledIf: calculateEnabledClosure, whenActioned: actionHandlerClosure }) {
        if( commandId === undefined ) { throw new Error(`The childFlowId must be defined.`) }

        this.rootFlow.defineCommand({
            id: commandId,
            enabledIf: calculateEnabledClosure,
            whenActioned: actionHandlerClosure
        })
    }

    defineFlowCommandsIn({ method: method }) {
        this.evaluate({ closure: method, with: this.rootFlow })
    }

    defineCommandMethods({ methodNames: methodNames, flow: flow }) {
        if( flow === undefined ) {
            flow = this.rootFlow
        }

        methodNames.forEach( (methodName) => {
            const method = flow[methodName]

            if( method.isMethodNotFound === true ) {
                const flowString = flow.toString()
                throw new Error(`The flow ${flowString} was expected to define the method .${methodName}()`)
            }

            this.command({
                id: methodName,
                whenActioned: flow[methodName].bind(flow),
            })
        })
    }

}

FlowBuilder = Classification.define(FlowBuilder)

module.exports = FlowBuilder