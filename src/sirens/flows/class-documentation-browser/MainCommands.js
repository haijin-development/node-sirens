const Classification = require('../../../O').Classification

class MainCommands {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    flowCommands({ flowBuilder: flowBuilder, thisFlow: thisFlow }) {

        this.previousClassificationDo( () => {
            this.flowCommands({ flowBuilder: flowBuilder, thisFlow: thisFlow })
        })

        flowBuilder.commandsGroup({ id: 'application-commands' }, function() {

            this.command({
                id: 'reloadClassDefinition',
                whenActioned: thisFlow.reloadClassDefinition.bind(thisFlow),
            })

            this.command({
                id: 'openFileEditor',
                whenActioned: thisFlow.openFileEditor.bind(thisFlow),
            })

            this.command({
                id: 'openDocumentationBrowser',
                whenActioned: thisFlow.openDocumentationBrowser.bind(thisFlow),
            })

            this.command({
                id: 'openPlayground',
                whenActioned: thisFlow.openPlayground.bind(thisFlow),
            })

        })
    }

    openFileEditor() {
        const filename = this.getBrowsedClass().getSourceFile().getFilePath()

        Sirens.openFileEditor({ filename: filename })
    }

    openDocumentationBrowser() {
        const jsClass = this.getChildFlow({ id: 'classDefinition' }).getValue()

        Sirens.browseClassDocumentation({ jsClass: jsClass })
    }

    openPlayground() {
        Sirens.openPlayground()
    }
}

module.exports = Classification.define(MainCommands)