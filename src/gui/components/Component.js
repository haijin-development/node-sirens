const Classification = require('../../o-language/classifications/Classification')
const ComponentBehaviour = require('./ComponentBehaviour')
const ComponentView = require('../gtk-views/ComponentView')
const ComponentRenderer = require('../componentBuilder/ComponentRenderer')

const ComponentBehaviourProtocol_Implementation = require('../protocols/ComponentBehaviourProtocol_Implementation')
const ComponentProtocol = require('../protocols/ComponentProtocol')
const ComponentProtocol_Implementation = require('../protocols/ComponentProtocol_Implementation')
const ComponentInstantiator = require('./ComponentInstantiator')

class Component {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ComponentBehaviour]
        this.implements = [
            ComponentBehaviourProtocol_Implementation,
            ComponentProtocol,
        ]
        this.expects = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.build()
    }

    defaultModel() {
        return undefined
    }

    build(props) {
        const componentsRenderer = ComponentRenderer.new({ rootComponent: this })

        this.renderWith(componentsRenderer)
    }

    createView() {
        return ComponentView.new()
    }

    synchronizeViewFromModel() {
    }

    renderWith(componentsRenderer) {
        throw Error(`The class ${this.constructor.name} must implement the method ::renderWith()`)
    }

    /// Accessing

    getMainComponent() {
        if( this.getChildComponents().length === 0 ) {
            throw Error(`The ${this.constructor.name} has no main child component.`)
        }

        return this.getChildComponents()[0].getMainComponent()
    }

    /// Opening

    open() {
        return this.getMainComponent().open()
    }
}

module.exports = Classification.define(Component)