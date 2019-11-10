const Classification = require('../../o-language/classifications/Classification')

/*
    Class(`
       This classification can be attached to a component classification object to add the methods to create its
       instances and open them.

       It can also render a Component object using a custom closure instead of the one defined in the method

       	component.renderWith(...)

       This may be used to dynamically render a component.
    `)

    Example({
       Description: `
          Opens a CustomComponent with no props.

          The CustomComponent classification understands the message .open() because it has the ComponentInstantiator
          declared in its classificationBehaviours.
       `,
       Code: `

          const Classification = require('sirens/src/o-language/classifications/Classification')
          const Component = require('sirens/src/gui/components/Component')
          const ComponentProtocol_Implementation = require('sirens/src/gui/protocols/ComponentProtocol_Implementation')
          const ComponentInstantiator = require('sirens/src/gui/components/ComponentInstantiator')

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
class ComponentInstantiator {
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
        this.assumes = []
    }

    /// Instantiating

    /*
     Method(`
        Creates a new instance of this component with no props and opens it.

        Returns the component object created and opened.
     `)
     Returns({
        Description: `
           ComponentBehaviour.
           The component object created and opened.
        `,
     })

     Example({
        Description: `
           Opens a CustomComponent with no props.

           The CustomComponent classification understands the message .open() because it has the ComponentInstantiator
           declared in its classificationBehaviours.
        `,
        Code: `

           const Classification = require('sirens/src/o-language/classifications/Classification')
           const Component = require('sirens/src/gui/components/Component')
           const ComponentProtocol_Implementation = require('sirens/src/gui/protocols/ComponentProtocol_Implementation')
           const ComponentInstantiator = require('sirens/src/gui/components/ComponentInstantiator')

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

     Tags([
        'creating objects', 'public', 'opening'
     ])
    */
    open(props = {}) {
        return this.openOn(props)
    }

    /*
     Method(`
        Creates a new instance of this component with the given props and opens it.

        Returns the component object created and opened.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           object.
           A hash with the props to create the component before opening.
        `,
     })

     Example({
        Description: `
           Opens a CustomComponent with a custom prop.

           The CustomComponent classification understands the message .openOn() because it has the ComponentInstantiator
           declared in its classificationBehaviours.
        `,
        Code: `

           const Classification = require('sirens/src/o-language/classifications/Classification')
           const Component = require('sirens/src/gui/components/Component')
           const ComponentProtocol_Implementation = require('sirens/src/gui/protocols/ComponentProtocol_Implementation')
           const ComponentInstantiator = require('sirens/src/gui/components/ComponentInstantiator')

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
           		const customLabel = this.getProps().customLabel

           		componentsRenderer.render(function (component) {
           			this.window( function() {

           				this.styles({
           					width: 100,
           					height: 100,
           				})

           				this.checkBox({ label: customLabel })
           			})
           		})
           	}

           }

           CustomComponent = Classification.define(CustomComponent)

           CustomComponent.openOn({ customLabel: 'A checkbox' })

        `,
     })

     Tags([
        'creating objects', 'public', 'opening'
     ])
    */
    openOn(props) {
        return this.new(props).yourself( (component) => {
            component.getMainComponent().open()

            return component
        })
    }

    /*
     Method(`
        Creates a new instance of this component and evaluates the given closure to build it.

        Returns the component object built with the given closure.
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           Function.
           The redenring closure to build the created component with.
        `,
     })

     Example({
        Description: `
           Dynamically renders a component using the

           	ComponentInstantiator.render(...)

           method instead of the

           	component.renderWith(...)

           method.
        `,
        Code: `

           const Classification = require('sirens/src/o-language/classifications/Classification')
           const Component = require('sirens/src/gui/components/Component')
           const ComponentProtocol_Implementation = require('sirens/src/gui/protocols/ComponentProtocol_Implementation')
           const ComponentInstantiator = require('sirens/src/gui/components/ComponentInstantiator')

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
           	}

           }

           CustomComponent = Classification.define(CustomComponent)

           CustomComponent.render( function (component) {
           	this.window( function() {

           		this.styles({
           			width: 100,
           			height: 100,
           		})

           		this.checkBox({ label: 'A checkbox' })
           	})
           })

        `,
     })

     Tags([
        'public', 'rendering', 'creating objects'
     ])
    */
    render(closure) {
        const ComponentRenderer = require('../componentBuilder/ComponentRenderer')

        const componentsRenderer = ComponentRenderer.new({ rootComponent: null })

        componentsRenderer.build(closure, componentsRenderer)

        const childComponents = componentsRenderer.getChildComponents()

        return childComponents[0]
    }
}

module.exports = Classification.define(ComponentInstantiator)
