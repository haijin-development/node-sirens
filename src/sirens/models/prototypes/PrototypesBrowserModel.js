const Classification = require('../../../O').Classification
const ModelObject = require('../../../Skins').ModelObject
const ObjectProperty = require('../../objects/ObjectProperty')
const ClassPropertiesModel = require('./ClassPropertiesModel')

class PrototypesBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ModelObject]
    }

    buildWith(modelBuilder) {
        modelBuilder.build( function(appModel) {

            this.whenObjectChanges( ({ newValue: object }) => {
                const classes = appModel.getChild({ id: 'classes' })
                classes.setChoices( appModel._getClassesChainOfObject() )
                classes.setSelectionValue( object )
            })

            this.choice({
                id: 'classes',
                choices: appModel._getClassesChainOfObject(),
                whenSelectionChanges: ({ newValue: aClass }) => {
                    const selectedClass = appModel.getChild({ id: 'selectedClass' })
                    selectedClass.setBrowsedObject( aClass )
                },
            })

            this.object({
                id: 'selectedClass',
                definedWith: ClassPropertiesModel.new(),
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

module.exports = Classification.define(PrototypesBrowserModel)
