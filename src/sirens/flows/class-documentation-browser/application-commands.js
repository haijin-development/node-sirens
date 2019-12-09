const Sirens = require('../../../Sirens')

function applicationCommands(thisFlow) {

    this.category( 'application commands', () => {

        this.command({
            id: 'reloadClassDefinition',
            whenActioned: function() {
                thisFlow.reloadClassDefinition()
            }
        })

        this.command({
            id: 'openFileEditor',
            whenActioned: function() {
                const filename = thisFlow.getBrowsedClass().getSourceFile().getFilePath()
                Sirens.openFileEditor({ filename: filename })
            }
        })

        this.command({
            id: 'openClassDocumentation',
            whenActioned: function() {
                const jsClass = thisFlow.getChildFlow({ id: 'classDefinition' }).getValue()
                Sirens.browseClassDocumentation({ jsClass: jsClass })
            }
        })

        this.command({
            id: 'openPlayground',
            whenActioned: function() {
                Sirens.openPlayground()
            }
        })

    })
}

module.exports = {
    applicationCommands: applicationCommands,
}