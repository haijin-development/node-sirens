const Classification = require('../O').Classification
const ValueModel = require('./models/ValueModel')
const ChoiceModel = require('./models/ChoiceModel')
const ObjectAttributeModel = require('./models/ObjectAttributeModel')
const BufferedAttributeModel = require('./models/BufferedAttributeModel')
const TreeChoiceModel = require('./models/TreeChoiceModel')
const FlowPoint = require('./FlowPoint')
const CommandsGroupBuilder = require('./commands/CommandsGroupBuilder')

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

    To execute commands the FlowModel can use an optional CommandsRouter.

    If the main application defines a CommandsRouter it  is propagated to every other logical component defined during the flow.

    Each command defined in a FlowModel goes through the CommandsRouter before its execution, giving the main application
    a single point with full control over each command execution.


    Every logical component defined within a FlowModel announces its own events when it changes.

    A visual component or external system can hook specific events of a particular logical component and show an up to date
    visual representation of each component.
 `)
*/
class _FlowBuilder {
    /// Definition

    /*
     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['rootModel']
    }

    /// Initializing

    /*
     Tags([
        'public', 'initializing'
     ])
    */
    initialize({ rootModel: rootModel }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.rootModel = rootModel

          this.rootModel.behaveAs( FlowPoint )
    }

    /// Accessing

    /*
     Tags([
        'public', 'querying', 'getters'
     ])
    */
    getRootModel() {
        return this.rootModel
    }

    /// Building

    /*
     Tags([
        'dsl', 'public', 'evaluating'
     ])
    */
    evaluate({ closure: closure, params: params }) {
        if( params === undefined ) { params = [] }

        return this.bindYourself( closure, ...params )
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    main(closure) {
        this.evaluate({ closure: closure, params: [this.rootModel] })

        return this
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    commands({ id: commandsGroupId }, closure) {
        const commandsGroupBuilder = CommandsGroupBuilder.new()

        commandsGroupBuilder.setCommandsRouter( this.getCommandsRouter() )

        const commandsGroup = commandsGroupBuilder.build( closure )

        this.rootModel.addChildModel({ id: commandsGroupId, model: commandsGroup })
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    value({ id: childId, value: value, whenValueChanges: valueChangedClosure }) {
        if( value === undefined ) { value = null }

        const valueModel = ValueModel.new({ value: value })

        this.rootModel.addChildModel({ id: childId, model: valueModel })

        if( valueChangedClosure !== undefined ) {
            valueModel.onValueChanged( (...params) => {
                this.evaluateEventHandler({
                    flowPointId: childId,
                    event: 'valueChanged',
                    params: params,
                    eventHandler: valueChangedClosure,
                })
            })
        }
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    objectAttributeValue({
        id: childId,
        object: object, attributeReader: attributeReader, attributeWriter: attributeWriter,
        whenValueChanges: valueChangedClosure
    }) {
        if( object === undefined ) { object = null }

        const valueModel = ObjectAttributeModel.new({
            object: object,
            attributeReader: attributeReader,
            attributeWriter: attributeWriter,
        })

        this.rootModel.addChildModel({ id: childId, model: valueModel })

        if( valueChangedClosure !== undefined ) {
            valueModel.onValueChanged( (...params) => {
                this.evaluateEventHandler({
                    flowPointId: childId,
                    event: 'objectAttributeChanged',
                    params: params,
                    eventHandler: valueChangedClosure,
                })
            })
        }
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    bufferedAttributeValue({
        id: childId,
        object: object, attributeReader: attributeReader,
        whenValueChanges: valueChangedClosure
    }) {
        if( object === undefined ) { object = null }

        const valueModel = BufferedAttributeModel.new({
            object: object,
            attributeReader: attributeReader,
        })

        this.rootModel.addChildModel({ id: childId, model: valueModel })

        if( valueChangedClosure !== undefined ) {
            valueModel.onValueChanged( (...params) => {
                this.evaluateEventHandler({
                    flowPointId: childId,
                    event: 'bufferedAttributeChanged',
                    params: params,
                    eventHandler: valueChangedClosure,
                })
            })
        }
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    toggle({ id: childId, value: value, whenValueChanges: valueChangedClosure }) {
        if( value === undefined ) { value = false }

        this.value({ id: childId, value: value, whenValueChanges: valueChangedClosure })
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    choice({ id: childId, choices: choices, whenSelectionChanges: selectionChangedClosure }) {
        if( choices === undefined ) { choices = [] }

        const choiceModel = ChoiceModel.new({ choices: choices })

        this.rootModel.addChildModel({ id: childId, model: choiceModel })

        if( selectionChangedClosure !== undefined ) {
            choiceModel.onSelectionChanged( (...params) => {
                this.evaluateEventHandler({
                    flowPointId: childId,
                    event: 'choiceSelectionChanged',
                    params: params,
                    eventHandler: selectionChangedClosure,
                })
            })
        }
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    treeChoice({
        id: childId,
        roots: roots, getChildrenClosure: getChildrenClosure,
        whenSelectionChanges: selectionChangedClosure
    }) {
        if( roots === undefined ) { roots = [] }

        const treeChoiceModel = TreeChoiceModel.new({
            roots: roots, getChildrenClosure: getChildrenClosure
        })

        this.rootModel.addChildModel({ id: childId, model: treeChoiceModel })

        if( selectionChangedClosure !== undefined ) {
            treeChoiceModel.onSelectionChanged( (...params) => {
                this.evaluateEventHandler({
                    flowPointId: childId,
                    event: 'treeSelectionChanged',
                    params: params,
                    eventHandler: selectionChangedClosure,
                })
            })
        }
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    object({
        id: childId, object: object, whenObjectChanges: valueChangedClosure, definedWith: modelObject },
         closure
    ) {
        if( modelObject === undefined ) {

            const FlowModel = require('./models/FlowModel')

            modelObject = FlowModel.new({ object: object, build: false })

        }

        modelObject.behaveAs( FlowPoint )
        modelObject.setCommandsRouter( this.getCommandsRouter() )

        this.rootModel.addChildModel({ id: childId, model: modelObject })

        if( closure !== undefined ) {
            const modelObjectBuilder = FlowBuilder.new({ rootModel: modelObject })

            modelObjectBuilder.main( closure, modelObject )
        }

        if( valueChangedClosure !== undefined ) {
            modelObject.onValueChanged( (...params) => {
                this.evaluateEventHandler({
                    flowPointId: childId,
                    event: 'objectChanged',
                    params: params,
                    eventHandler: valueChangedClosure,
                })
            })
        }
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    whenObjectChanges(valueChangedClosure) {
        this.rootModel.onValueChanged( (...params) => {
            this.evaluateEventHandler({
                flowPointId: 'main',
                event: 'objectChanged',
                params: params,
                eventHandler: valueChangedClosure,
            })
        })
    }

    /*
     Tags([
        'initializing', 'setters', 'public'
     ])
    */
    setCommandsRouter(commandsRouter) {
        this.rootModel.setCommandsRouter( commandsRouter )
    }

    /*
     Tags([
        'getters', 'public'
     ])
    */
    getCommandsRouter() {
        return this.rootModel.getCommandsRouter()
    }

    notifyCommandsRouterOfEvent({ event: event, flowPointId: flowPointId, params: params }) {
        const commandsRouter = this.getCommandsRouter()

        if( ! commandsRouter ) { return }

        if( params === undefined ) { params = [] }

        commandsRouter.eventNofification({
            flowPointId: flowPointId,
            event: event,
            params: params,
        })        
    }

    /*
     Tags([
        'implementation'
     ])
    */
    evaluateEventHandler({
        flowPointId: flowPointId, event: event, params: params, eventHandler: eventHandler
    }) {
        const commandsRouter = this.getCommandsRouter()

        if( ! commandsRouter ) {
            eventHandler( ...params )
            return
        }

        commandsRouter.executeEvent({
            flowPointId: flowPointId,
            event: event,
            params: params,
            eventHandler: eventHandler,
        })
    }
}

FlowBuilder = Classification.define(_FlowBuilder)

module.exports = FlowBuilder