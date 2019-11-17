const Classification = require('../../O').Classification
const CommandsRouterProtocol = require('../../finger-tips/protocols/CommandsRouterProtocol')

class ApplicationCommandsRouter {

    /// Definition

    static definition() {
        this.instanceVariables = ['application']
        this.assumes = []
        this.implements = [CommandsRouterProtocol]
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

    afterEvent({ event: eventName, id: childId, params: params }) {
        this.enableCommands()
    }

    enableCommands() {
        const commandsGroup = this.getChild({ id: 'applicationCommands' })

        commandsGroup.evaluateCommandsEnabledClosure({ application: this.application })
    }

    executeCommand({ command: command, params: params }) {
        const isEnabled = command.calculateEnableValue({ application: this.application })

        if( isEnabled === false ) { return }

        command.doExecute({ params: params })
    }

}

module.exports = Classification.define(ApplicationCommandsRouter)