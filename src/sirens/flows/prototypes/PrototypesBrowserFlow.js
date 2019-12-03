const Classification = require('../../../O').Classification
const ApplicationCommandsController = require('../ApplicationCommandsController')
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const ObjectProperty = require('../../objects/ObjectProperty')
const ClassPropertiesFlow = require('./ClassPropertiesFlow')
const Sirens = require('../../../Sirens')

class PrototypesBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    buildWith(flow) {
        const commandsController = ApplicationCommandsController.new({ application: this })

        flow.main({ id: 'propertiesBrowser' }, function(thisFlow) {

            this.setCommandsController( commandsController )

            this.defineFlowCommandsIn({ method: thisFlow.flowMethods })
            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

            this.whenObjectChanges( ({ newValue: object }) => {
                const classes = thisFlow.getChildFlow({ id: 'classes' })
                classes.setChoices( thisFlow._getClassesChainOfObject() )
                classes.setSelection( object )
            })

            this.choice({
                id: 'classes',
                choices: thisFlow._getClassesChainOfObject(),
                whenSelectionChanges: ({ newValue: aClass }) => {
                    const selectedClass = thisFlow.getChildFlow({ id: 'playground' })
                    selectedClass.setBrowsedObject( aClass )
                },
            })

            this.object({
                id: 'playground',
                definedWith: ClassPropertiesFlow.new(),
            })

            thisFlow.evaluateEventHandler({ event: 'application-flow-built', eventHandler: () => {} })
        })

    }

    flowMethods(thisFlow) {
        this.category( 'flow methods', () => {

            this.command({
                id: 'setBrowsedObject',
                whenActioned: thisFlow.setBrowsedObject.bind(thisFlow),
            })

            this.command({
                id: 'getSelectedClass',
                whenActioned: thisFlow.getSelectedClass.bind(thisFlow),
            })

        })
    }

    flowCommands(thisFlow) {
        this.category( 'flow commands', () => {
            this.command({
                id: 'browseSelectedPrototype',
                enabledIf: function() {
                    return thisFlow.getSelectedClass() ? true : false
                },
                whenActioned: function() {
                    const selectedClass = thisFlow.getSelectedClass()
                    Sirens.browsePrototypes(selectedClass)
                }
            })
        })
    }

    /// Actions

    setBrowsedObject(object) {
        this.setValue( object )
    }

    /// Querying

    getSelectedClass() {
        const classes = this.getChildFlow({ id: 'classes' })

        return classes.getSelection()
    }

    _getClassesChainOfObject(object) {
        const prototypes = []

        let currentPrototype = this.getValue()

        while(currentPrototype !== null && currentPrototype !== undefined) {
            prototypes.push(currentPrototype)

            currentPrototype = Object.getPrototypeOf(currentPrototype)
        }

        return prototypes.reverse()
    }
}

module.exports = Classification.define(PrototypesBrowserFlow)
