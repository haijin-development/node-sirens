const Classification = require('../../O').Classification
const CommandsControllerProtocol = require('../../finger-tips/protocols/CommandsControllerProtocol')
const CommandsController = require('../../finger-tips/commands/CommandsController')
const FileChooser = require('../../Skins').FileChooser

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

        this.mainFlow = mainFlow
    }

    doExecuteCommand({ command: command, params: params }) {
        if( command.getId() === 'pickFile' ) {
            return this.pickFile(...params)
        }

        return this.previousClassificationDo( () => {
            return this.doExecuteCommand({ command: command, params: params })
        })
    }

    pickFile({ parentWindow: parentWindow }) {
        const filename = FileChooser.openFile({
            title: 'Choose a file',
            window: parentWindow,
            initialFolder: this.mainFlow.executeCommand({ id: 'getLastOpenedFolder' }),
        })

        return filename
    }
}

module.exports = Classification.define(ApplicationCommandsController)