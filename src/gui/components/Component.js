const Classification = require('../../o-language/classifications/Classification')
const ComponentBehaviour = require('./ComponentBehaviour')
const ComponentView = require('../views/ComponentView')
const ComponentRenderer = require('../componentBuilder/ComponentRenderer')

const Component = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [ComponentBehaviour]
    }

    /// Initializing

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.build()
    }

    build(props) {
        const builder = ComponentRenderer.new({ rootComponent: this })

        this.renderWith(builder)
    }

    createView() {
        return ComponentView.new()
    }

    synchronizeViewFromModel() {
    }

    renderWith(builder) {
        throw Error(`The class ${this.constructor.name} must implement the method ::renderWith()`)
    }

    /// Accessing

    getMainComponent() {
        if( this.getComponents().length === 0 ) {
            throw Error(`The ${this.constructor.name} has no main child component.`)
        }

        return this.getComponents()[0].getMainComponent()
    }

    /// Asking

    isTopMostComponent() {
        return this.getMainComponent().isTopMostComponent()
    }
})

module.exports = Component