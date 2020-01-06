const Classification = require('../../O').Classification
const OInstance = require('../../O').OInstance
const ObjectWithProps = require('../../O').ObjectWithProps
const ObjectWithNamespace = require('../../O').ObjectWithNamespace
const ComponentBehaviourProtocol = require('../protocols/ComponentBehaviourProtocol')
const ComponentBehaviourProtocol_Implementation = require('../protocols/ComponentBehaviourProtocol_Implementation')

const ValueModelProtocol = require('../../finger-tips/protocols/ValueModelProtocol')
const Announcer = require('../../finger-tips/announcements/Announcer')
const EventsSubscritions = require('./EventsSubscritions')

/*
 Class(`
    This classification adds the basic implementation behaviour to objects behaving as Components and Widgets.

    Some of methods it calls on itself are expected to be defined in other classifications.
 `)

 Example({
    Description: `
       This classification does not define all the methods it needs and requires one or
       more additional classifications to define the complete behaviour of an object.

       Concrete examples can be found in 'sirens/skins/components/'.
    `,
    Code: `



    `,
 })
*/
class ComponentBehaviour {
    /// Definition

    /*
     Method(`
        This classification definition.
     `)

     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['childComponents', 'view', 'eventsSubscriptions']
        this.assumes = [ObjectWithProps, ObjectWithNamespace]
        this.expects = [ComponentBehaviourProtocol, ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    /*
     Method(`
        Initialize this classification instance variables.
     `)

     Tags([
        'initializing', 'implementation'
     ])
    */
    afterInstantiation() {
        this.childComponents = []
        this.view = null
        this.eventsSubscriptions = EventsSubscritions.new()
    }

    getEventsSubscriptions() {
        return this.eventsSubscriptions
    }

    /*
     Method(`
        Initialize this object with the properties given in the method

        	.new( props )


        The initialization of a component object does the following initializations, in this given order:

        	// Sets the properties to the this.props instance variables.
                this.setProps( props )

        	// Other classifications may use this method to add, edit, remove or validate properties
        	// The default is to do nothing
                this.initializeProps()

        	// The component properties may be values, objects or ValueModels. For those that are value models
        	// this method hooks its changes to update the component calling this.onPropValueChanged()
                this.initializePropModels()

        	// If the current properties do not include a property named 'model' ask the component for a default model and set it
                this.initializeModel()

        	// All components have a View of its own. This method create it and initializes it
                this.initializeView()

        	// In this method the component calls one or more methods to hook changes in its model and its view to keep
        	// them in sync. The default is to call this.subscribeToModelEvents
                this.initializeEvents()
     `)

     Tags([
        'implementation', 'initializing'
     ])
    */
    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.setProps( props )
    }

    /*
     Method(`
        Assembles this object with the proper initializations.

        The initialization of a component object does the following initializations, in this given order:

            // Other classifications may use this method to add, edit, remove or validate properties
            // The default is to do nothing
                this.initializeProps()

            // The component properties may be values, objects or ValueModels. For those that are value models
            // this method hooks its changes to update the component calling this.onPropValueChanged()
                this.initializePropModels()

            // If the current properties do not include a property named 'model' ask the component for a default model and set it
                this.initializeModel()

            // All components have a View of its own. This method create it and initializes it
                this.initializeView()

            // In this method the component calls one or more methods to hook changes in its model and its view to keep
            // them in sync. The default is to call this.subscribeToModelEvents
                this.initializeEvents()

        The assemblance of the components to its collaborators, events and resuorces is
        deferred and different from the initializtion of the Component object:

            const component = AComponent.new()

            component.assemble()

        Including complex logic and objects creation in the initialization of an object
        is a discouraged pattern.

        Splitting the initialization of a component in two steps, initialize and assemble,
        first it creates the Component blue print, an object almost ready to be used,

            const component = AComponent.new()

        but without adquiring any resource such a Views and event hooks, and then it
        assembles the component

            component.assemble()

        to be fully initialized.

        This allows to tweak the Component object before it is assembled, something that
        some users of the Component may want to do, and to defer the expensive initialization
        of the Component like adquiring file handles and hooking up events until they
        are actually used.
     `)

     Tags([
        'implementation', 'initializing'
     ])
    */
    assemble() {
        if( this.view !== null ) {
            throw new Error(`The method .assemble() was already called.`)
        }

        this.initializeProps()

        this.initializePropModels()

        this.initializeModel()

        this.initializeView()

        this.initializeEvents()
    }

    /*
     Method(`
        Other classifications may use this method to add, edit, remove or validate properties.

        The default implementation does nothing.
     `)

     Tags([
        'implementation', 'initializing'
     ])
    */
    initializeProps() {
    }

    /*
     Method(`
        The component properties may be values, objects or ValueModels.

        For those that are value models this method hooks its changes to update the component calling 

        	this.onPropValueChanged()
     `)

     Tags([
        'implementation', 'initializing'
     ])
    */
    initializePropModels() {
        const subscriptions = this.eventsSubscriptions

        this.propsAndValuesDo( (prop, value) => {
            const isValueModel =
                prop !== 'model' &&
                OInstance.isOInstance( value ) &&
                value.compliesWith( ValueModelProtocol )

            if( isValueModel ) {
                const propModel = value

                propModel.onValueChanged({
                    with: this,
                    do: ({ newValue: newValue, oldValue: oldValue }) => {
                        this.onPropValueChanged({ propName: prop, newValue: newValue, oldValue: oldValue })
                    },
                })

                subscriptions.addSubscriptionTo(propModel)
            }
        })
    }

    /*
     Method(`
        If the current properties do not include a property named 'model' ask the component for a default model calling the method

        	this.defaultModel()

        and set it as the component model.
     `)

     Tags([
        'implementation', 'initializing'
     ])
    */
    initializeModel() {
        const model = this.getModel()

        if( model !== undefined ) {
            this.eventsSubscriptions.addSubscriptionTo(model)
            return
        }

        const defaultModel = this.defaultModel()

        this.setModel( defaultModel )
    }

    /*
     Method(`
        All components have a View. This method creates it, initializes it and synchronizes it with the component and its model.

        This method calls

        	this.createView()

        to get a new instance of the component view.
     `)

     Tags([
        'implementation', 'initializing'
     ])
    */
    initializeView() {
        this.view = this.createView()

        this.applyViewProps({ props: this.getProps() })

        this.synchronizeViewFromModel()
    }

    /*
     Method(`
        In this method the component calls one or more methods to hook changes in its model and its view to keep them in sync.

        The default implementation is to call
        	this.subscribeToModelEvents()
     `)

     Tags([
        'implementation', 'initializing'
     ])
    */
    initializeEvents() {
        this.subscribeToModelEvents()
    }

    /*
     Method(`
        Applies the given properties to the view calling the method

        	this.applyViewProp({ prop: propName, value: value })

        for each property in the given propsToApply.
     `)

     Param({
        Name: `
           propsToApply
        `,
        Description: `
           Object.

           Object with the form

           	{
           		prop1Name: prop1Value,
           		...
           	}
        `,
     })

     Tags([
        'synchronizing', 'implementation'
     ])
    */
    applyViewProps({ props: propsToApply }) {
        for( const propName in propsToApply ) {
            const value = propsToApply[propName]

            this.applyViewProp({ prop: propName, value: value })
        }
    }

    /*
     Method(`
        If this component view accepts a style name propName call the setter of that view style.

        For example if this component is called with



        	this.applyViewProp({ prop: 'title', value: 'A text' })

        and its view accepts a 'title' property this method will call

        	this.view.setTitle( value ).



        If the view does not accept the property named prop this method does nothing.
     `)

     Tags([
        'synchronizing', 'implementation'
     ])
    */
    applyViewProp({ prop: propName, value: propValue }) {
        if( ! this.view.acceptsStyle({ name: propName }) ) { return }

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

    /*
     Method(`
        This method is called whenever a component property that is a ValueModelBeahviour changes.

        Its default implementation is to update the component view calling

        	this.applyViewProp({ prop: propName, value: newValue })
     `)

     Tags([
        'implementation', 'synchronizing', 'model events'
     ])
    */
    onPropValueChanged({ propName: propName, newValue: newValue, oldValue: oldValue }) {
        this.applyViewProp({ prop: propName, value: newValue })
    }

    /// Accessing

    /*
     Method(`
        Returns this component children.
     `)
     Returns({
        Description: `
           Array of ComponentBehaviour.
           An array with this component children.
        `,
     })

     Tags([
        'child components', 'public', 'querying', 'accessing'
     ])
    */
    getChildComponents() {
        return this.childComponents
    }

    /*
     Method(`
        Returns this component index-th child.
     `)

     Param({
        Name: `
           index
        `,
        Description: `
           The index of the component child to retrieve.
        `,
     })

     Returns({
        Description: `
           ComponentBehaviour.
           This component child at the index-th position.
        `,
     })

     Tags([
        'child components', 'querying', 'public'
     ])
    */
    getChildComponentAt({ index: index }) {
        return this.childComponents[index]
    }

    /*
     Method(`
        Returns this component model.
        May be undefined.
     `)
     Returns({
        Description: `
           object.
           This component model.
        `,
     })

     Implementation(`
        The component model is kept as a regular property named 'model' but this implementation may change in the future.
     `)

     Tags([
        'public', 'querying'
     ])
    */
    getModel() {
        return this.getProps().model
    }

    /*
     Method(`
        Sets this component model.
     `)

     Implementation(`
        The component model is kept as a regular property named 'model' but this implementation may change in the future.
     `)

     Tags([
        'public', 'setting'
     ])
    */
    setModel(model) {
        const currentModel = this.getModel()

        if( currentModel !== undefined ) {
            this.eventsSubscriptions.dropSubscription({ announcer: announcer, listener: listener })
        }

        this.getProps().model = model

        if( model != undefined && model != null ) {
            this.eventsSubscriptions.addSubscriptionTo(model)
        }
    }

    /*
     Method(`
        Returns this component view.

        All components own a single view, even if the component does not have a visual representation.

        The view is the binding between the Components layer and a graphics user interface library like GTK+.
     `)
     Returns({
        Description: `
           View.
           This component view.
        `,
     })

     Tags([
        'getters', 'querying', 'public'
     ])
    */
    getView() {
        return this.view
    }

    /*
     Method(`
        Merges the given newProps to the current component props and applies them calling

        	this.applyViewProps({ props: newProps })
     `)

     Param({
        Name: `
           newProps
        `,
        Description: `
           Object.
           Object with the form

           	{
           		prop1Name: prop1Value,
           		...
           	}
        `,
     })

     Tags([
        'public', 'settings props'
     ])
    */
    mergeProps(newProps) {
        this.previousClassificationDo( () => {
            this.mergeProps( newProps )
        })

        this.applyViewProps({ props: newProps })
    }

    /*
     Method(`
        Returns this component property named 'id'.

        If the component does not have a property named 'id' defined returns undefined.

        This method is a convenience method to use instead of

        	this.getProps().id
     `)
     Returns({
        Description: `
           object.
           Returns the value of this component prop named 'id'.
           May be undefined.
        `,
     })

     Tags([
        'getting props', 'public', 'querying'
     ])
    */
    getId() {
        return this.getProps().id
    }

    /*
     Method(`
        Returns this component child whose id equals the given childComponentId.
        Returns undefined if no child does.
     `)

     Param({
        Name: `
           childComponentId
        `,
        Description: `
           The id to look for.
        `,
     })

     Returns({
        Description: `
           ComponentBehaviour.
           The first child whose id equals the given childComponentId or undefined if no child does.
        `,
     })

     Tags([
        'child components', 'querying', 'public'
     ])
    */
    getChildComponent({ id: childComponentId, ifNone: absentClosure }) {
        if( absentClosure === undefined ) {
            absentClosure = function({ id: childComponentId }) {
                throw new Error(`Could find any child component with id: '${childComponentId}'`)
            }
        }

        const length = this.childComponents.length

        for (let i = 0; i < length; i++) {
            const childComponent = this.childComponents[i]

            if( childComponentId == childComponent.getProps().id ) {
                return childComponent
            }

            const found = childComponent.getChildComponent({ id: childComponentId, ifNone: null })

            if(found !== null) {
                return found
            }
        }

        if( typeof( absentClosure ) !== 'function' ) { return absentClosure }

        return absentClosure({ id: childComponentId })
    }

    getOnlyChildComponent() {
        if( this.childComponents.length !== 1 ) {
            throw new Error(`The component was expected to have exactly one child`)
        }

        return this.childComponents[0]
    }

    /// Child components

    /*
     Method(`
        Adds a component as a child of this component, wiring their Views accordingly.
     `)

     Param({
        Name: `
           childComponent
        `,
        Description: `
           ComponentBehaviour.
           The child component to add to this component.
        `,
     })

     Tags([
        'adding', 'child components', 'public'
     ])
    */
    addChildComponent(childComponent) {
        this.childComponents.push(childComponent)

        this.view.addChildView( childComponent.getView() )
    }

    /*
     Method(`
        Adds all the given components as a children of this component, wiring their Views accordingly.
     `)

     Param({
        Name: `
           childComponents
        `,
        Description: `
           Array.
           Array of ComponentBehaviour to add to this component as children.
        `,
     })

     Tags([
        'adding', 'child components', 'public'
     ])
    */
    addAllChildrenComponents(childComponents) {
        childComponents.forEach( (eachComponent) => {
            this.addChildComponent(eachComponent)
        })
    }

    /*
     Method(`
        Removes a child component, updateing their Views accordingly.
     `)

     Param({
        Name: `
           childComponent
        `,
        Description: `
           The childComponent to remove from this component.
        `,
     })

     Tags([
        'child components', 'removing', 'public'
     ])
    */
    removeChildComponent(childComponent) {
        this.view.removeChildView( childComponent.getView() )

        this.childComponents = this.childComponents.filter( (eachComponent) => {
            return eachComponent !== childComponent
        })

        childComponent.releaseComponent()
    }

    /*
     Method(`
        Removes all this component children.
     `)

     Tags([
        'child components', 'removing', 'public'
     ])
    */
    removeAllChildrenComponents() {
        this.childComponents.forEach( (eachComponent) => {
            this.removeChildComponent(eachComponent)
        })
    }

    /*
     Method(`
        Components can be Widgets with a visual representation or Components with no logic but no visual representation.

        This method iterates through its children looking for the ones that have a visual representation to evaluate the given closure
        on them.
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           Function.
           A closure to evaluate on the children that are Widgets.
        `,
     })

     Tags([
        'child components', 'iterating', 'implementation'
     ])
    */
    concreteComponentsDo(closure) {
        this.getChildComponents().forEach( (childComponent) => {
            childComponent.concreteComponentsDo(closure)
        })
    }

    /// Events

    /*
     Method(`
        Each component classification can use this method to hook the events triggered by its model to keep its view in sync with it.

        If this component does not have a model this method does nothing.

        The default implementation is to do nothing.
     `)

     Tags([
        'events', 'implementation', 'initializing'
     ])
    */
    subscribeToModelEvents() {
    }

    // Releasing

    releaseComponent() {
        this.unsubscribeFromModel()
        this.unsubscribeFromPropModels()
        this.releaseChildComponents()
        this.releaseView()
        this.releaseProps()
    }

    unsubscribeFromModel() {
    }

    unsubscribeFromPropModels() {
        this.eventsSubscriptions.dropAllAnnouncementsFor({ listener: this })
    }

    releaseChildComponents() {
        this.getChildComponents().forEach( (childComponent) => {
            childComponent.releaseComponent()
        })

        this.childComponents = []
    }

    releaseView() {
        this.view.releaseView()

        this.view = null
    }

    releaseProps() {
        this.clearAllProps()
    }
}

module.exports = Classification.define(ComponentBehaviour)