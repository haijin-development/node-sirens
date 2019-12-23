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
        const commandsController = ApplicationCommandsController.new({ mainFlow: this })

        this.setCommandsController( commandsController )

        flow.main({ id: 'propertiesBrowser' }, function(thisFlow) {

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
        })
    }

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {
            this.command({
                id: 'browseSelectedPrototype',
                enabledIf: function() {
                    return thisFlow.hasAClassSelected()
                },
                whenActioned: thisFlow.browseSelectedPrototype.bind(thisFlow)
            })

            this.statelessCommands({
                definedInFlow: thisFlow,
                withMethods: [
                    'setBrowsedObject',
                    'getSelectedClass',
                    'hasAClassSelected',
                ],
            })

        })
    }

    /// Actions

    browseSelectedPrototype() {
        const selectedClass = this.getSelectedClass()

        Sirens.browsePrototypes(selectedClass)
    }

    hasAClassSelected() {
        return this.getSelectedClass() ? true : false
    }

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
