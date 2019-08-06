const ValueModel = require('../models/ValueModel')

class AbstractComponent {
    static open(props = {}) {
        return this.openOn(props)
    }

    static openOn(props) {
        const component = new this(props)

        if( component.isTopMostComponent() ) {
            component.getMainComponent().open()

            return component
        }

        const Window = require('./containers/Window')

        const window = new Window()

        window.addComponent(component)

        window.open()

        return component
    }

    /// Initializing

    constructor(props = {}) {
        this.props = {}
        this.components = []
        this.view = null

        this.build(props)
    }

    initializeProps(props) {
        this.props = props
    }

    initializeModel(props) {
        if( this.props.model === undefined ) {
            this.props.model = this.defaultModel()
        }
    }

    initializeView(props) {
        this.view = this.createView()

        this.applyViewProps(props)

        this.synchronizeViewFromModel()
    }

    initializeEvents(props) {
        this.subscribeToModelEvents()
    }

    build(props) {
        this.initializeProps(props)

        this.initializeModel(props)

        this.initializeView(props)

        this.initializeEvents(props)
    }

    createView() {
        throw Error(`The class ${this.constructor.name} must implement the method ::createView()`)
    }

    applyViewProps(props) {
        const acceptedStyles = this.view.constructor.acceptedStyles()

        acceptedStyles.forEach( (style) => {
            if(props[style] === undefined) {
                return
            }

            this.applyViewProp(style, props[style])
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
        return new ValueModel({value: ''})
    }

    getModel() {
        return this.props.model
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

    setProps(props) {
        this.props = Object.assign(this.props, props)

        this.applyViewProps(props)
    }

    getChildComponent({id: childComponentId}) {
        const length = this.components.length

        for (let i = 0; i < length; i++) {
            const childComponent = this.components[i]

            if(childComponentId == childComponent.props.id) {
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

        this.view.addView(component.view)
    }

    addAllComponents(components) {
        components.forEach( (eachComponent) => {
            this.addComponent(eachComponent)
        })
    }

    /// Events

    subscribeToModelEvents() {
        const model = this.getModel()

        if(model && model.constructor.name == 'ValueModel') {
            model.on('value-changed', this.onValueChanged.bind(this))
        }
    }

    onValueChanged() {
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        throw Error(`The class ${this.constructor.name} must implement the method ::synchronizeViewFromModel()`)
    }

}

module.exports = AbstractComponent