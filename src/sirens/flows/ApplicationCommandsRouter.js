const Classification = require('../../O').Classification
const CommandsRouterProtocol = require('../../finger-tips/protocols/CommandsRouterProtocol')

class ApplicationCommandsRouter {

    /// Definition

    static definition() {
        this.instanceVariables = ['application']
        this.assumes = []
        this.implements = [CommandsRouterProtocol]
    }

    /// Initializing

    initialize({ application: application }) {
        this.application = application
    }

    /// Accessing

    setApplication(application) {
        this.application = application
    }

    getApplication() {
        return this.application
    }

    getChild({ id: id }) {
        return this.application.getChild({ id: id })
    }

    /// Evaluating

    eventNofification({ flowPointId: flowPointId, event: event, params: params }) {
        this.enableCommands()
    }

    executeEvent({
        flowPointId: flowPointId, event: event, params: params, eventHandler: eventHandler,
    }) {
        eventHandler( ...params )

        this.enableCommands()
    }

    executeCommand({ command: command, params: params }) {
        const isEnabled = command.calculateEnableValue({ application: this.application })

        if( isEnabled === false ) { return }

        command.doExecute({ params: params })

        this.enableCommands()
    }

    executeCommandClosure({ command: command, closure: closure }) {
        const isEnabled = command.calculateEnableValue({ application: this.application })

        if( isEnabled === false ) { return }

        const result = closure()

        this.enableCommands()

        return result
    }

    enableCommands() {
        const commandsGroup = this.getChild({ id: 'applicationCommands' })

        commandsGroup.evaluateCommandsEnabledClosure({ application: this.application })
    }

}

module.exports = Classification.define(ApplicationCommandsRouter)