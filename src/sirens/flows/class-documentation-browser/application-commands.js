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
            id: 'openClassEditor',
            whenActioned: function() {
                const filename = thisFlow.getBrowsedClass().getSourceFile().getFilePath()
                Sirens.openClassEditor({ filename: filename })
            }
        })

        this.command({
            id: 'openClassDocumentation',
            whenActioned: function() {
                const classDefinition = thisFlow.getChildFlow({ id: 'classDefinition' }).getValue()
                Sirens.browseClassDocumentation({ classDefinition: classDefinition })
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