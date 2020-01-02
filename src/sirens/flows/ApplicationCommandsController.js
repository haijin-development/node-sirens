const Classification = require('../../O').Classification
const CommandsControllerProtocol = require('../../finger-tips/protocols/CommandsControllerProtocol')
const CommandsController = require('../../finger-tips/commands/CommandsController')

class ApplicationCommandsController {

    /// Definition

    static definition() {
        this.instanceVariables = ['mainFlow']
        this.assumes = [CommandsController]
        this.implements = [CommandsControllerProtocol]
    }

    initialize({ mainFlow: mainFlow }) {
        this.previousClassificationDo( () => {
            this.initialize({ mainFlow: mainFlow })
        })

        // This instance variable is redundant with the one in CommandsController classification
        // but a CommandsController should not have a getter on the main Flow object since
        // it would allow any child flow to access the main Flow, breaking the tree 
        // encapsulation.
        this.mainFlow = mainFlow
    }

    // Executing

    doExecuteCommand({ command: command, params: params }) {
        // An example of changing the command evaluation on the doExecuteCommand method.
        // This is not the recomended way of overriding a Command but it is feasable.
        if( command.getId() === 'pickFile' ) {
            return this.pickFile(...params)
        }

        return this.previousClassificationDo( () => {
            return this.doExecuteCommand({ command: command, params: params })
        })
    }

    // Commands definitions and overrides

    pickFile({ parentWindow: parentWindow }) {
        const namespace = this.mainFlow.skinsNamespace()

        const filename = namespace.FileChooser.new().openFile({
            title: 'Choose a file',
            window: parentWindow,
            initialFolder: this.mainFlow.getLastOpenedFolder(),
        })

        return filename
    }
}

module.exports = Classification.define(ApplicationCommandsController)