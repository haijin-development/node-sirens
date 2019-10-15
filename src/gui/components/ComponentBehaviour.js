const Classification = require('../../o-language/classifications/Classification')
const ComponentBehaviourProtocol = require('../protocols/ComponentBehaviourProtocol')
const ComponentBehaviourProtocol_Implementation = require('../protocols/ComponentBehaviourProtocol_Implementation')
const OInstance = require('../../o-language/classifications/OInstance')
const ObjectWithProps = require('../../o-language/classifications/ObjectWithProps')

const ValueModelProtocol = require('../protocols/ValueModelProtocol')

class ComponentBehaviour {
    /// Definition

    static definition() {
        this.instanceVariables = ['childComponents', 'view']
        this.assumes = [ObjectWithProps]
        this.expects = [ComponentBehaviourProtocol, ComponentBehaviourProtocol_Implementation]
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

        this.initializePropModels()

        this.initializeModel()

        this.initializeView()

        this.initializeEvents()
    }

    initializeProps() {
    }

    initializePropModels() {
        this.propsAndValuesDo( (prop, value) => {
            const isValueModel =
                prop !== 'model' &&
                OInstance.isOInstance( value ) &&
                value.compliesWith( ValueModelProtocol )

            if( isValueModel ) {
                const propModel = value

                propModel.onValueChanged( ({ newValue: newValue, oldValue: oldValue }) => {
                    this.onPropValueChanged({ propName: prop, newValue: newValue, oldValue: oldValue })
                })
            }
        })
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
        for( const propName in propsToApply ) {
            const value = propsToApply[propName]

            this.applyViewProp({ prop: propName, value: value })
        }
    }

    applyViewProp({ prop: propName, value: propValue }) {
        const acceptedStyles = this.view.acceptedStyles()

        if( ! acceptedStyles.includes( propName ) ) { return }

        if ( OInstance.isOInstance( propValue ) && propValue.compliesWith( ValueModelProtocol ) ) {
            propValue = propValue.getValue()
        }

        const setter = 'set' + propName.charAt(0).toUpperCase() + propName.slice(1)

        if(this.view[setter] === undefined) {
            throw new Error(
                `The class ${this.view.constructor.name} must implement the method ::${setter}()`
            )
        }

        this.view[setter](propValue)
    }

    onPropValueChanged({ propName: propName, newValue: newValue, oldValue: oldValue }) {
        this.applyViewProp({ prop: propName, value: newValue })
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