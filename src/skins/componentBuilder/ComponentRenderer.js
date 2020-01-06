const Classification = require('../../O').Classification
const ContainerWidgetBuilder = require('./ContainerWidgetBuilder')
const ComponentRendererProtocol = require('../protocols/ComponentRendererProtocol')

/*
 Class(`
    This object is used to build a Component object using the component builder DSL.

    Even though it is possible to build Components without using the component builder DSL using the DSL is the
    recomended way.

    This classification assumes a ContainerWidgetBuilder classification and adds the method

    	componentRederer.render(closure)

    to it, accepting a rootComponent to add the built components.



    This object is used internally by the Component classification to build itself in the method

    		component.build()


    The method component.build() instantiates a ComponentRenderer and passes it as a parameter to the method

    		component.renderWith(componentsRenderer)

 `)
*/
class ComponentRenderer {
    /// Definition

    /*
     Method(`
        This classification definintion.
     `)

     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['rootComponent']
        this.assumes = [ContainerWidgetBuilder]
        this.implements = [ComponentRendererProtocol]
    }

    /// Accessing

    /*
     Method(`
        Initializes this object on the given rootComponent.

        This object will build and add child components using the component builder DSL to the given rootComponent.
     `)

     Param({
        Name: `
           rootComponent
        `,
        Description: `
           ComponentBehaviour.
           An object behaving as a ComponentBehaviour.

           This ComponentRenderer will build other components evaluating the component builder DSL and then will add the created
           componentsto rootComponent as their children.
        `,
     })

     Example({
        Description: `

        `,
        Code: `
           See the method


           	Component.build()
        `,
     })

     Tags([
        'initializing', 'public'
     ])
    */
    initialize({ rootComponent: rootComponent } = {}) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.rootComponent = rootComponent
    }

    /// Building

    /*
     Method(`
        Evaluates the given closure to build child components and adds them as children of the root Component.

        The component builder DSL is defined mainly in the classifications

        	WidgetBuilder

        and

        	ContainerWidgetBuilder


        The closure expects the following signature


        	function(rootComponent) {
        		// ...
        	}


        and the 'this' pseudovariable is bound to this object.

        This method does not work with arrow functions

        	(rootComponent) => {
        		// ..
        	}

        for that reason.
     `)

     Tags([
        'rendering', 'public'
     ])
    */
    render(closure) {
        this.build(closure, this.rootComponent)

        const childComponents = this.getChildComponents()

        if( this.rootComponent === undefined ) {
            return childComponents[0]
        }

        this.rootComponent.addAllChildrenComponents( childComponents )

        return this.rootComponent
    }
}

module.exports = Classification.define(ComponentRenderer)