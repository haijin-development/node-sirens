const Classification = require('../../O').Classification
const ValueModelProtocol_Implementation = require('../protocols/ValueModelProtocol_Implementation')
const ValueModelBehaviour = require('./ValueModelBehaviour')
const FlowBuilder = require('../FlowBuilder')

class _FlowModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['object', 'childModels']
        this.assumes = [ValueModelBehaviour]
        this.implements = [ValueModelProtocol_Implementation]
    }

    /// Initializing

    afterInstantiation() {
        this.childModels = {}
    }

    initialize({ object: object, build: buildsChildModels } = { object: undefined }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.object = object

        if( buildsChildModels !== false ) {
            this.build()
        }
    }

    /// Accessing

    getObject() {
        return this.object
    }

    setObject(object) {
        this.setValue(object)
    }

    getChildModelIds() {
        return Object.keys( this.childModels )
    }

    getChildModels() {
        return Object.values( this.childModels )
    }

    /// Building

    clearChildModels() {
        this.childModels = {}
    }

    addChildModel({ id: childId, model: childModel }) {
        this.childModels[ childId ] = childModel
    }

    build(closure) {
        const modelObjectBuilder = FlowBuilder.new({ rootModel: this })

        if( closure !== undefined ) {

            modelObjectBuilder.main( closure )

        } else {

            this.buildWith(modelObjectBuilder)

        }

        return this
    }

    buildWith(modelBuilder) {
        throw Error(`The class ${this.constructor.name} must implement the method ::buildWith()`)
    }

    /// Querying

    getActionHandler({ id: commandId }) {
        return this.getChild({ id: commandId }).getActionHandler()
    }

    getChild({ id: childId }) {
        const child = this.findChild({ id: childId })


        if( child === undefined ) {
            throw new Error(`Child model with id '${childId}' not found.`)
        }

        return child
    }

    findChild({ id: childId }) {
        const child = this.findDirectChild({ id: childId })

        if( child !== undefined ) {
            return child
        }

        const children = Object.values( this.childModels )

        for( const eachChild of children ) {
            if( ! eachChild.respondsTo('findChild') ) {
                continue
            }

            const child = eachChild.findChild({ id: childId })

            if( child !== undefined ) {
                return child
            }
        }

        return undefined
    }

    findDirectChild({ id: childId }) {
        return this.childModels[ childId ]
    }

    /// Reading

    doGetValue() {
        return this.object
    }

    /// Writing

    doSetValue(object) {
        this.object = object
    }
}

FlowModel = Classification.define(_FlowModel)

module.exports = FlowModel