const Classification = require('../../../O').Classification
const ApplicationCommandsRouter = require('../ApplicationCommandsRouter')
const FlowModel = require('../../../Skins').FlowModel
const ObjectProperty = require('../../objects/ObjectProperty')
const ClassPropertiesFlow = require('./ClassPropertiesFlow')
const Sirens = require('../../../Sirens')

class PrototypesBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FlowModel]
    }

    buildWith(flow) {
        const commandsRouter = ApplicationCommandsRouter.new({ application: this })

        flow.main( function(application) {

            this.setCommandsRouter( commandsRouter )

            this.evaluate({ closure: application.defineApplicationCommands, params: [application] })

            this.whenObjectChanges( ({ newValue: object }) => {
                const classes = application.getChild({ id: 'classes' })
                classes.setChoices( application._getClassesChainOfObject() )
                classes.setSelectionValue( object )
            })

            this.choice({
                id: 'classes',
                choices: application._getClassesChainOfObject(),
                whenSelectionChanges: ({ newValue: aClass }) => {
                    const selectedClass = application.getChild({ id: 'selectedClass' })
                    selectedClass.setBrowsedObject( aClass )
                },
            })

            this.object({
                id: 'selectedClass',
                definedWith: ClassPropertiesFlow.new(),
            })

            this.notifyCommandsRouterOfEvent({ flowPointId: 'application', event: 'main-flow-built' })
        })

    }

    defineApplicationCommands(application) {
        this.commands({ id: 'applicationCommands' }, function() {

            this.command({
                id: 'browseSelectedPrototype',
                enabledIf: function() {
                    return application.getSelectedClass() ? true : false
                },
                whenActioned: function() {
                    const selectedClass = application.getSelectedClass()
                    Sirens.browsePrototypes(selectedClass)
                }
            })

        })
    }

    /// Actions

    setBrowsedObject(object) {
        this.setObject( object )
    }

    /// Querying

    getSelectedClass() {
        const classes = this.getChild({ id: 'classes' })

        return classes.getSelectionValue()
    }

    _getClassesChainOfObject(object) {
        const prototypes = []

        let currentPrototype = this.getObject()

        while(currentPrototype !== null && currentPrototype !== undefined) {
            prototypes.push(currentPrototype)

            currentPrototype = Object.getPrototypeOf(currentPrototype)
        }

        return prototypes.reverse()
    }
}

module.exports = Classification.define(PrototypesBrowserFlow)
