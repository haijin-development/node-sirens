const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')
const ObjectProperty = require('../../objects/ObjectProperty')
const ClassPropertiesFlow = require('./ClassPropertiesFlow')

class PrototypesBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainFlow']
        this.assumes = [ValueFlow]
    }

    initialize({ mainFlow: mainFlow }) {
        this.mainFlow = mainFlow

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    bubbleUpCommandToMainFlow({ commandName: commandName, params: params }) {
        return this.mainFlow.executeCommand({
            id: commandName,
            withAll: params,
        })
    }

    buildWith(flow) {
        flow.main({ id: 'propertiesBrowser' }, function(thisFlow) {

            this.command({
                id: 'browseSelectedPrototype',
                enabledIf: function() {
                    return thisFlow.hasAClassSelected()
                },
                whenActioned: thisFlow.browseSelectedPrototype.bind(thisFlow)
            })

            this.defineMethodsAsCommands({
                methods: [
                    'setBrowsedObject',
                    'getSelectedClass',
                    'hasAClassSelected',
                ],
            })

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



            this.acceptedBubbledUps({
                defaultHandler: function({ commandName: commandName, params: params }) {
                    return thisFlow.bubbleUpCommandToMainFlow({
                        commandName: commandName,
                        params: params
                    })
                }
            })
        })
    }

    /// Actions

    browseSelectedPrototype() {
        const selectedClass = this.getSelectedClass()

        require('../../../Sirens').browsePrototypes(selectedClass)
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
