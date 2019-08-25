const Classification = require('../../o-language/classifications/Classification')
const ValueModel = require('../models/ValueModel')

const ComponentBehaviour = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = ['props', 'components', 'view']
    }

    /// Initializing

    afterInstantiation() {
        this.props = {}
        this.components = []
        this.view = null
    }

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.props = props

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

        this.applyViewProps()

        this.synchronizeViewFromModel()
    }

    initializeEvents() {
        this.subscribeToModelEvents()
    }

    createView() {
        throw Error(`The class ${this.constructor.name} must implement the method ::createView()`)
    }

    applyViewProps() {
        const acceptedStyles = this.view.acceptedStyles()

        acceptedStyles.forEach( (style) => {
            if( this.props[style] === undefined ) {
                return
            }

            this.applyViewProp( style, this.props[style] )
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

    defaultModel() {
        return ValueModel.new({ new: '' })
    }

    getComponents() {
        return this.components
    }

    getModel() {
        return this.props.model
    }

    setModel(model) {
        this.props.model = model
    }

    getMainComponent() {
        throw Error(`The class ${this.constructor.name} must implement the method ::.getMainComponent`)
    }

    getView() {
        return this.view
    }

    getId() {
        return this.props.id
    }

    getProps() {
        return this.props
    }

    setProps(props) {
        this.props = Object.assign(this.props, props)

        this.applyViewProps(props)
    }

    getChildComponent({id: childComponentId}) {
        const length = this.components.length

        for (let i = 0; i < length; i++) {
            const childComponent = this.components[i]

            if(childComponentId == childComponent.getProps().id) {
                return childComponent
            }

            const found = childComponent.getChildComponent({id: childComponentId})

            if(found !== null) {
                return found
            }
        }

        return null
    }

    /// Asking

    isTopMostComponent() {
        return false
    }

    /// Sub-components

    addComponent(component) {
        this.components.push(component)

        this.view.addView( component.getView() )
    }

    addAllComponents(components) {
        components.forEach( (eachComponent) => {
            this.addComponent(eachComponent)
        })
    }

    /// Events

    subscribeToModelEvents() {
        const model = this.getModel()

        if( model && model.isBehavingAs(ValueModel) ) {
            model.on('value-changed', this.onValueChanged.bind(this))
        }
    }

    onValueChanged() {
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        throw Error(`The class ${this.constructor.name} must implement the method ::synchronizeViewFromModel()`)
    }

})

module.exports = ComponentBehaviour