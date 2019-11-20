const Classification = require('../../O').Classification
const ValueModelProtocol_Implementation = require('../protocols/ValueModelProtocol_Implementation')
const ValueModelBehaviour = require('../models/ValueModelBehaviour')
const FlowPoint = require('../FlowPoint')

class Command {

    /// Definition

    static definition() {
        this.instanceVariables = ['id', 'isEnabled', 'enabledClosure', 'actionClosure']
        this.assumes = [ValueModelBehaviour, FlowPoint]
        this.implements = [ValueModelProtocol_Implementation]
    }

    /// Initializing

    initialize({ id: id, enabledClosure: enabledClosure, actionClosure: actionClosure }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.id = id
        this.isEnabled = false
        this.enabledClosure = enabledClosure
        this.actionClosure = actionClosure

        if( this.actionClosure ) {
            this.actionClosure
        }
    }

    /// Accessing

    getId() {
        return this.id
    }

    getEnabledClosure() {
        return this.enabledClosure
    }

    getActionClosure() {
        return this.actionClosure
    }

    getActionHandler() {
        return this.actionHandlerWrapper.bind(this)
    }

    /// Evaluating

    calculateEnableValue({ application: application }) {
        return this.enabledClosure.call( application, application )
    }

    evaluateEnabledClosure({ application: application }) {
        const isEnabled = this.calculateEnableValue({ application: application })

        this.setValue( isEnabled )
    }

    actionHandlerWrapper(...params) {
        const commandsRouter = this.getCommandsRouter()

        if( ! commandsRouter ) {
            this.doExecute({ params: params })
            return
        }

        commandsRouter.executeCommand({ command: this, params: params })
    }

    doExecute({ params: params }) {
        const actionHandler = this.actionClosure

        if( ! actionHandler ) {
            throw new Error(`The actionHandler for the command '${this.id}' is not defined, the application should define it.`)
        }

        actionHandler.call( this, ...params )        
    }

    /// Reading

    doGetValue() {
        return this.isEnabled
    }

    /// Writing

    doSetValue(boolean) {
        this.isEnabled = boolean
    }
}

module.exports = Classification.define(Command)