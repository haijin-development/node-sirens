const Classification = require('../../O').Classification
const ComponentBehaviour = require('./ComponentBehaviour')
const ComponentView = require('../gtk-views/ComponentView')
const ComponentRenderer = require('../componentBuilder/ComponentRenderer')

const ComponentProtocol = require('../protocols/ComponentProtocol')
const ComponentBehaviourProtocol_Implementation = require('../protocols/ComponentBehaviourProtocol_Implementation')

const ComponentProtocol_Implementation = require('../protocols/ComponentProtocol_Implementation')
const ComponentInstantiator = require('./ComponentInstantiator')

/*
 Class(`

    A Component object groups widgets and sub-components.

    Grouping widgets in Components brings the following advantages:

    	- it keeps related widgets and sub-components in a single place
    	- it isolates the logic related to those widgets from the rest of the application
    	- it allows to resuse the Component with ease and simplicity in any part of the application
    	- it assigns a meaningful and descriptive name to the Component

    A Component can be configured and parametrized when it is created through its properties.



    To make a Component a top level component, such as a Window or Dialog, make the Component itself to behave as a
    ComponentInstantiator:

    	static definition() {
    		...
    		this.classificationBehaviours = [ComponentInstantiator]
    	}

    and then open it with

    	CustomComponent.open()

    See the first example for more details.

 `)

 Implementation(`
    It is not mandatory but recomended to make all components to declare the implementation of the protocol

    		const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')

    The declaration allows to validate that the Component implements all the methods expected from a Component implementation.
 `)

 Example({
    Description: `
       Defines a top level component with a Window.
    `,
    Code: `
       const Classification = require('sirens/src/O').Classification
       const Component = require('sirens/src/skins/components/Component')
       const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')
       const ComponentInstantiator = require('sirens/src/skins/components/ComponentInstantiator')

       class CustomComponent {
       	/// Definition

       	static definition() {
       		this.instanceVariables = []
       		this.assumes = [Component]
       		this.implements = [ComponentProtocol_Implementation]
       		this.classificationBehaviours = [ComponentInstantiator]
       	}

       	/// Building

       	renderWith(componentsRenderer) {
       		componentsRenderer.render(function (component) {
       			this.window( function() {

       				this.styles({
       					width: 100,
       					height: 100,
       				})

       				this.checkBox({ label: 'A checkbox' })
       			})
       		})
       	}

       }

       CustomComponent = Classification.define(CustomComponent)

       CustomComponent.open()
    `,
 })
*/
class Component {
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
        this.instanceVariables = []
        this.assumes = [ComponentBehaviour]
        this.implements = [ComponentBehaviourProtocol_Implementation, ComponentProtocol]
        this.expects = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /*
     Method(`
        Initializes a Component object with the props given in the

        		.new(props)

        method.
     `)

     Example({
        Description: `
           Creates a new Component object with given properties and gets them.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const Component = require('sirens/src/skins/components/Component')
           const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')

           class CustomComponent {
           	/// Definition

           	static definition() {
           		this.instanceVariables = []
           		this.assumes = [Component]
           		this.implements = [ComponentProtocol_Implementation]
           		this.classificationBehaviours = []
           	}

           	/// Building

           	renderWith(componentsRenderer) {
           		componentsRenderer.render(function (component) {
           			this.checkBox({ label: 'A checkbox' })
           		})
           	}

           }

           CustomComponent = Classification.define(CustomComponent)

           // Create a CustomComponent object with some props

           const component = CustomComponent.new({
           	title: 'A title',
           	color: 'blue',
           	onClicked: () => {},
           })

           component.getProps()
        `,
     })

     Tags([
        'initializing', 'public'
     ])
    */
    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.reRenderWhen()

        this.build()
    }

    /*
     Method(`
        This method is a hook method called when the Component is initialized.

        This method is the recomended place to call

        	const valueModel = this.getAValueModel()

        	this.reRenderOnValueChangedOf( valueModel )


        that will trigger a call to

        	this.reRender()

        when the valueModel changes.


        reRenderOnValueChangedOf() can be called on more than one model.
     `)

     Example({
        Description: `
           Creates a Component and hooks a reRender of the component to 2 ValueModels.

           Every time any of those ValueModels changes the component is rendered again.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const Component = require('sirens/src/skins/components/Component')
           const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')
           const ComponentInstantiator = require('sirens/src/skins/components/ComponentInstantiator')
           const ValueModel = require('sirens/src/finger-tips/models/ValueModel')
           // Create a model external to the Component
           const model1 = ValueModel.new({ value: 'Text 1' })
           this.model1 = model1

           // Create a model external to the CustomComponent
           const model2 = ValueModel.new({ value: 'Text 2' })
           this.model2 = model2

           // Create a custom component that renders the contents of the models

           class CustomComponent {
           	/// Definition

           	static definition() {
           		this.instanceVariables = []
           		this.assumes = [Component]
           		this.implements = [ComponentProtocol_Implementation]
           	}
           	reRenderWhen() {
           		this.reRenderOnValueChangeOf( model1 )

           		this.reRenderOnValueChangeOf( model2 )
           	}

           	/// Building

           	renderWith(componentsRenderer) {
           		const text1 = model1.getValue()
           		const text2 = model2.getValue()

           		componentsRenderer.render(function (component) {
           			this.verticalStack( function() {
           				this.label({ text: text1 })
           				this.label({ text: text2 })
           			})
           		})
           	}

           }

           CustomComponent = Classification.define(CustomComponent)

           // Create a top level Window that contains the custom component


           class Window {
           	/// Definition

           	static definition() {
           		this.instanceVariables = []
           		this.assumes = [Component]
           		this.implements = [ComponentProtocol_Implementation]
           		this.classificationBehaviours = [ComponentInstantiator]
           	}
           	/// Building

           	renderWith(componentsRenderer) {
           		componentsRenderer.render(function (component) {
           			this.window( function() {
           				this.component(
           					CustomComponent.new()
           				)
           			})
           		})
           	}

           }

           Window = Classification.define(Window)

           Window.open()




           // Evaluate the line below to trigger a reRender of the component
           this.model1.setValue( 'Different text 1' )

           // Evaluate the line below to trigger a reRender of the component
           this.model2.setValue( 'Different text 2' )
        `,
     })

     Tags([
        'events', 'initializing', 'rendering', 'implementation'
     ])
    */
    reRenderWhen() {
    }

    /*
     Method(`
        Other Component classifications may override this method to return a custom model.

        By default this method returns undefined.
     `)
     Returns({
        Description: `
           object.

           Other Component classifications may override this method to return a custom model.

           By default this method returns undefined.
        `,
     })

     Example({
        Description: `
           Defines a CustomComponent with a default model.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const Component = require('sirens/src/skins/components/Component')
           const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')
           const ComponentInstantiator = require('sirens/src/skins/components/ComponentInstantiator')
           const ValueModel = require('sirens/src/finger-tips/models/ValueModel')

           class Window {
           	/// Definition

           	static definition() {
           		this.instanceVariables = []
           		this.assumes = [Component]
           		this.implements = [ComponentProtocol_Implementation]
           		this.classificationBehaviours = [ComponentInstantiator]
           	}
           	defaultModel() {
           		return ValueModel.new({ value: 'Text 1' })
           	}
           	/// Building

           	renderWith(componentsRenderer) {
           		const model = this.getModel()

           		componentsRenderer.render(function (component) {
           			this.window( function() {
           				this.verticalStack( function() {
           					this.text({ model: model })
           				})
           			})
           		})
           	}

           }

           Window = Classification.define(Window)

           Window.open()
        `,
     })

     Tags([
        'creating objects', 'implementation', 'querying'
     ])
    */
    defaultModel() {
        return undefined
    }

    /*
     Method(`
        Calling this method with a ValueModelBehaviour will make this Component to listen to changes on the ValueModelBehaviour and
        call

        	this.reRender()

        on a change.

        Th recomended place to call this method is the hook method

        	Component.reRenderOn(){
        		const valueModel = this.getAValueModel()

        		this.reRenderOnValueChangedOf( valueModel )
        	}

        reRenderOnValueChangedOf() can be called on more than one model.
     `)

     Param({
        Name: `
           valueModel
        `,
        Description: `
           ValueModelBehaviour.

           An object behaving as a ValueModelBehaviour to listen for changes.

           When the ValueModelBehaviour changes the component will call its method

           	this.reRender()
        `,
     })

     Example({
        Description: `
           See the example on the method

           	Component.reRenderWhen()
        `,
        Code: `

        `,
     })

     Tags([
        'implementation', 'rendering', 'events'
     ])
    */
    reRenderOnValueChangeOf(valueModel) {
        valueModel.onValueChanged({
          with: this,
          do: () => { this.reRender() },
        })

        this.getEventsSubscriptions().addSubscriptionTo( valueModel )
    }

    /*
     Method(`
        Creates a ComponentRenderer on this Component and calls

        	this.renderWith(componentsRenderer)

        This method is called during the initialize() method of the Component.

        If you need to rebuild the Component call the method

        	reRender()
     `)

     Tags([
        'rendering', 'implementation'
     ])
    */
    build() {
        const componentsRenderer = ComponentRenderer.new({ rootComponent: this })

        this.renderWith(componentsRenderer)
    }

    /*
     Method(`
        This method is a hook method called during this Component initialization.

        It creates and returns a ComponentView.

        Unlike WidgetViews that usually have a visual representation a ComponentView does not have a visual representation but
        it holds this child Views.
     `)

     Tags([
        'creating objects', 'implementation'
     ])
    */
    createView() {
        return ComponentView.new()
    }

    /*
     Method(`
        This method is a hook method called during this Component initialization.

        The default implementation is to do nothing since an abstract component does not have a default model.
     `)

     Tags([
        'synchronizing', 'implementation'
     ])
    */
    synchronizeViewFromModel() {
    }

    /// Rendering

    /*
Method(`
   This method is a hook method called during the build() method.

   Other classifications can (and usually do) override this method to render its contents using the given componentsRenderer.

   Typically this method looks like the following source code

   	renderWith(componentsRenderer) {

   		componentsRenderer.render(function (component) {

   			// add widgets here

   		})

   	}


   The evaluation of the closure passed to the 

   	componentsRenderer.render(closure)

   call is bound to the componentsRenderer, not to the Component, meaning that within the render closure 'this' points
   to the componentsRenderer. For that reason the component being rendered is passed as a parameter to the closure:

   	renderWith(componentsRenderer) {

   		componentsRenderer.render( function (component) {

   			// this points to componentsRenderer
   			// the variable component points to the Component object being rendered

   		})

   	}
`)

Param({
   Name: `
      componentsRenderer
   `,
   Description: `
      ComponentRenderer.
      The ComponentRenderer object to build this Component styles and children through its component builder DSL.

   `,
})

Tags([
   'rendering', 'implementation'
])
*/
    renderWith(componentsRenderer) {
        throw Error(`The class ${this.constructor.name} must implement the method ::renderWith()`)
    }

    /*
     Method(`
        Removes all the children in this Component and builds the component again, calling the

        	this.renderWith(componentsRenderer)

        method.

        This method is public and can be called to force a re rendering.

        It is also possible to hook a re render on the change of one or more ValueModels, see the method

        	Component.reRenderWhen()

        for more details.
     `)

     Tags([
        'rendering', 'public'
     ])
    */
    reRender() {
        this.removeAllChildrenComponents()

        this.build()
    }


    /// Accessing

    /*
     Method(`
        If the component has exactly one child compoent it returns that child.

        Otherwise it throws an error.

        This method is used in some parts of the implementation to reach the first Widget with a visible representation since Components
        do not have one.
     `)

     Param({
        Name: `
           ComponentBeahviour
        `,
        Description: `
           If the Component has exactly one child returns that child.

           Otherwise it raises an error.
        `,
     })

     Tags([
        'querying', 'implementation'
     ])
    */
    getMainComponent() {
        if( this.getChildComponents().length === 0 ) {
            throw Error(`The ${this.constructor.name} has no main child component.`)
        }

        return this.getChildComponents()[0].getMainComponent()
    }

    /// Opening

    /*
     Method(`
        Opens this Component main component to make it visible to the user.

        This method is usually called on top level components like Windows to make them visible.
     `)

     Example({
        Description: `
           See the example in this classification description.
        `,
        Code: `

        `,
     })

     Tags([
        'opening', 'public'
     ])
    */
    open() {
        return this.getMainComponent().open()
    }
}

module.exports = Classification.define(Component)