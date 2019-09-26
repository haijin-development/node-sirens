const Classification = require('../../o-language/classifications/Classification')
const ObjectWithProps = require('../../o-language/classifications/ObjectWithProps')
const ValueModelBehaviour = require('../models/ValueModelBehaviour')
const ValueModel = require('../models/ValueModel')
const ComponentBehaviourProtocol_Implementation = require('../protocols/ComponentBehaviourProtocol_Implementation')

class ComponentBehaviour {
    /// Definition

    static definition() {
        this.instanceVariables = ['childComponents', 'view']
        this.assumes = [ObjectWithProps]
        this.expects = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    afterInstantiation() {
        this.childComponents = []
        this.view = null
    }

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.setProps( props )

        this.initializeProps()

        this.initializeModel()

        this.initializeView()

        this.initializeEvents()
    }

    initializeProps() {
    }

    initializeModel() {
        if( this.getModel() !== undefined ) { return }

        this.setModel( this.defaultModel() )
    }

    initializeView() {
        this.view = this.createView()

        this.applyViewProps({ props: this.getProps() })

        this.synchronizeViewFromModel()
    }

    initializeEvents() {
        this.subscribeToModelEvents()
    }

    applyViewProps({ props: propsToApply }) {
        const acceptedStyles = this.view.acceptedStyles()

        acceptedStyles.forEach( (style) => {
            const propValue = propsToApply[style]

            if( propValue !== undefined ) {
                this.applyViewProp( style, propValue )
            }
        })
    }

    applyViewProp(propName, propValue) {
        const setter = 'set' + propName.charAt(0).toUpperCase() + propName.slice(1)

        if(this.view[setter] === undefined) {
            throw new Error(
                `The class ${this.view.constructor.name} must implement the method ::${setter}()`
            )
        }

        this.view[setter](propValue)
    }

    /// Accessing

    getChildComponents() {
        return this.childComponents
    }

    getChildComponentAt({ index: index }) {
        return this.childComponents[index]
    }

    getModel() {
        return this.getProps().model
    }

    setModel(model) {
        this.getProps().model = model
    }

    getView() {
        return this.view
    }

    mergeProps(newProps) {
        this.previousClassificationDo( () => {
            this.mergeProps( newProps )
        })

        this.applyViewProps({ props: newProps })
    }

    getId() {
        return this.getProps().id
    }

    getChildComponent({ id: childComponentId }) {
        const length = this.childComponents.length

        for (let i = 0; i < length; i++) {
            const childComponent = this.childComponents[i]

            if( childComponentId == childComponent.getProps().id ) {
                return childComponent
            }

            const found = childComponent.getChildComponent({ id: childComponentId })

            if(found !== null) {
                return found
            }
        }

        return null
    }

    /// Child components

    addChildComponent(childComponent) {
        this.childComponents.push(childComponent)

        this.view.addChildView( childComponent.getView() )
    }

    addAllChildrenComponents(childComponents) {
        childComponents.forEach( (eachComponent) => {
            this.addChildComponent(eachComponent)
        })
    }

    removeChildComponent(childComponent) {
        this.view.removeChildView( childComponent.getView() )

        this.childComponents = this.childComponents.filter( (eachComponent) => {
            return eachComponent !== childComponent
        })
    }

    removeAllChildrenComponents() {
        this.childComponents.forEach( (eachComponent) => {
            this.removeChildComponent(eachComponent)
        })
    }

    concreteComponentsDo(closure) {
        this.getChildComponents().forEach( (childComponent) => {
            childComponent.concreteComponentsDo(closure)
        })
    }

    /// Events

    subscribeToModelEvents() {
    }
}

module.exports = Classification.define(ComponentBehaviour)