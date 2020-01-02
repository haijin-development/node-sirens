const Classification = require('../../O').Classification
const WidgetBuilder = require('./WidgetBuilder')


/*
    Class(`
        This object is used to build a container widget using the builder DSL.

        A container widget can have one or more children.

        This ContainerWidgetBuilder defines the DSL methods to create and add these children.

        The usage of a ContainerWidgetBuilder typically consists in instantiating it, calling its

            containerWidgetBuilder.build()

        getting the defined props and children and setting them to the container widget.
    `)

    Example({
        Description: `
            Builds a Window using a ContainerWidgetBuilder object.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')
           const Window = require('sirens/src/skins/components/containers/Window')

           const builder = ContainerWidgetBuilder.new({ title: 'A window' })

            builder.build( function() {
                this.styles({
           	        width: 100,
                    height: 100,
           	    })

       	        this.checkBox({ label: 'A checkbox' })
            })

            const window = Window.new( builder.getProps() )

            window.addAllChildrenComponents( builder.getChildComponents() )
        `,
    })
*/
class ContainerWidgetBuilder {
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
        this.instanceVariables = ['childComponents']
        this.assumes = [WidgetBuilder]
    }

    /// Initializing

    /*
        Method(`
            Initializes this ContainerWidgetBuilder and sets its initial properties with the given props.
        `)

        Param({
            Name: `
                props
            `,
            Description: `
                object.
                An object of the form

               	{
           		   propName: propValue,
           		   ...
           	    }
            `,
        })

        Example({
            Description: `
                Creates a ContainerWidgetBuilder and initializes it with some properties.
            `,
            Code: `
                const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

                const initialContainerProps = {
           	        title: 'A window',
           	        width: 100,
           	        height: 100,
                }

               const builder = ContainerWidgetBuilder.new( initialContainerProps )

               builder.getProps()
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

        this.childComponents = []
    }

    /// Accessing

    /*
        Method(`
            Returns the components created during the call of the

        	   builder.build( function() {
        		  // ...
        	   })

            method.

            Typically these components are added to a parent container component.
     `)
        Returns({
            Description: `
                Array of ComponentBehaviour.
                An array with the built components.
            `,
        })

        Example({
            Description: `
                Builds 3 components using a ContainerWidgetBuilder object and gets them.
            `,
            Code: `
                const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

                const builder = ContainerWidgetBuilder.new()

                builder.build( function() {
           	        this.label({ label: 'A label' })
           	        this.checkBox({ label: 'A checkbox' })
           	        this.text()
                })

                builder.getChildComponents()
            `,
        })

        Tags([
            'getters', 'querying', 'public'
        ])
    */
    getChildComponents() {
        return this.childComponents
    }

    /*
        Method(`
            Returns the last components created during the call of the

        	   builder.build( function() {
        		  // ...
        	   })

            method.
        `)

        Returns({
            Description: `
                ComponentBehaviour.
                The last component build or undefined.
            `,
        })

        Example({
            Description: `
                Builds 3 components using a ContainerWidgetBuilder object and gets the last one.
            `,
            Code: `
                const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

                const builder = ContainerWidgetBuilder.new()

                builder.build( function() {
           	        this.label({ label: 'A label' })
           	        this.checkBox({ label: 'A checkbox' })
           	        this.text()
                })

                builder.getLastChildComponent()
            `,
        })

        Tags([
            'querying', 'implementation'
        ])
    */
    getLastChildComponent() {
        return this.childComponents[ this.childComponents.length - 1 ]
    }

    /// Building

    /*
        Method(`
            Adds the given component to the array of built components.

            The given component is expected to behave as a Component.

            A Component groups one or more sub-components or widgets but it does not have a visual representation of its own.

            Components are used to
        	   - group sub-components and widgets that are logically related
        	   - define the behaviour and interaction between those sub-components
        	   - allow to reuse and share that grouping and common behaviour from other components on top of this component
        `)

        Param({
            Name: `
                component
            `,
            Description: `
                A Component object.
                The given Component is already created, this method just adds it to its list of built components.
            `,
        })

        Example({
            Description: `
                Adds a custom component.
            `,
            Code: `
                const Classification = require('sirens/src/O').Classification
                const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')
                const Component = require('sirens/src/skins/components/Component')
                const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')

                // Create a custom component that groups other sub-components

                class CustomForm {
           	        /// Definition

           	        static definition() {
                   		this.instanceVariables = []
                   		this.assumes = [Component]
                   		this.implements = [ComponentProtocol_Implementation]
                   		this.classificationBehaviours = []
                   	}

                   	/// Building

           	        renderWith(componentsRenderer) {
           		       const label = this.getProps().labelText

                   		componentsRenderer.render(function (component) {
                   			this.label({ text: label })
                   			this.text()
                   		})
                    }
                }

                CustomForm = Classification.define(CustomForm)



                // Createa ContainerWidgetBuilder

                const builder = ContainerWidgetBuilder.new({ title: 'A window' })
                // Add the custom component to the builder

                builder.build( function() {
               	    this.component(
           		       CustomForm.new({
           		   	  labelText: 'Text: '
           	    	   })
               	    )
                })
    
                // Ask for the built components
                builder.getChildComponents()
            `,
        })

        Tags([
            'dsl', 'public'
        ])
    */
    component(component) {
        if( component === undefined ) {
            throw new Error(`The component can not be undefined.`)
        }

        // Since the given component might have been built without a namespace
        // ensure it uses this builder namespace
        component.setNamespace( this.namespace() )

        component.assemble()

        this.childComponents.push(component)
    }

    /*
        Method(`
            Adds a Window component to the array of built components.

            The window is expected to be the top most component, otherwise the behaviour is undefined.

            The first parameter can be an object with the window props:

            	this.window({ width: 100, height: 100, }, function(){

            	})

            The props can also be defined with the methods

        		styles(props)
        		model(model)
        		handlers(props)

            within the window closure:

                this.window( function(component) {
        	       this.styles({
                        width: 100,
                        height: 100,
                    })

            		this.model( aModel )

            		this.handlers({
            			onClosed: component.onClosed.bind(component),
        	       })
        	   })

            this.styles() and this.handlers() methods do the same, they just have intention revealing names to add different kind of properties.
        `)

        Param({
            Name: `
                props
            `,
            Description: `
                Optional.
                Object.
                An optional object defining one or more of the following styles for the window

                [
           	        // Common properties

                   	'width',
                   	'height',
                   	'alignHorizontal',
                   	'alignVertical',
                   	'marginLeft',
                   	'marginRight',
                   	'marginTop',
                   	'marginBottom',
                   	'marginHorizontal',
                   	'marginVertical',
                   	'populatePopupMenuBlock',
                   	'viewAttributes',

                    // Window properties

           	        'title',
                ]

            Each of these styles can be a value or a ValueModelBehaviour.
            `,
        })

        Param({
            Name: `
                closure
            `,
            Description: `
                An optional closure to evaluate and set additional properties and child components calling any of ContainerWidgetBuilder methods
                in it.
            `,
        })

        Example({
            Description: `
                Builds a Window.
            `,
            Code: `
                const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

                const builder = ContainerWidgetBuilder.new()

                builder.build( function() {

               	    this.window( function() {

                        this.styles({
                            title: 'A window',
                            width: 100,
                            height: 100,
           		       })
           	        })
                })

                builder.getChildComponents()
            `,
        })

        Tags([
            'dsl', 'public'
        ])
    */
    window(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ContainerWidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const window = this.namespace().Window.new( builder.getProps() )

        window.assemble()

        window.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(window)
    }

    /*
     Method(`
        Adds a Dialog component to the array of built components.

        The dialog is expected to be the top most component, otherwise the behaviour is undefined.

        The first parameter can be an object with the dialog props:




        	this.dialog({ width: 100, height: 100, }, function(){

        	})




        The props can also be defined with the methods

        		styles(props)
        		model(model)
        		handlers(props)

        within the dialog closure:

        	this.dialog( function(component) {
        		this.styles({
        			width: 100,
        			height: 100,
        		})

        		this.model( aModel )

        		this.handlers({
        			onClosed: component.onClosed.bind(component),
        		})
        	})

        this.styles() and this.handlers() methods do the same, they just have intention revealing names to add different kind of properties.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the dialog

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and child components calling any of ContainerWidgetBuilder methods
           in it.
        `,
     })

     Example({
        Description: `
           Builds a dialog.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.dialog( function() {

           		this.styles({
           			title: 'A window',
           			width: 100,
           			height: 100,
           		})

           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    dialog(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ContainerWidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const window = this.namespace().Dialog.new( builder.getProps() )

        window.assemble()

        window.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(window)
    }

    /*
     Method(`
        Adds a Container component to the array of built components.

        A Container is usefull if you want to have a fixed sized but scrollable container of other components.

        If is also usefull used within a verticalSplitter or an horizontalSplitter to avoid resizing the contained children.


        The first parameter can be an object with the dialog props:



        	this.container({ vScroll: 'always', hScroll: 'never', }, function(){

        	})



        The props can also be defined with the methods

        		styles(props)
        		model(model)
        		handlers(props)

        within the container closure:

        	this.container( function(component) {
        		this.styles({
        			hScroll: 'never',
        			vScroll: 'always',
        		})

        		this.model( aModel )
        	})

        this.styles() and this.handlers() methods do the same, they just have intention revealing names to add different kind of properties.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the container

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	// Container properties

           	hScroll: { 'auto', 'always', 'never' },
           	vScroll: { 'auto', 'always', 'never' },
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and child components calling any of ContainerWidgetBuilder methods
           in it.
        `,
     })

     Example({
        Description: `
           Builds a container
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.container( function() {

           		this.styles({
           			hScroll: 'never',
           			vScroll: 'auto',
           		})

           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    container(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ContainerWidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const container = this.namespace().Container.new( builder.getProps() )

        container.assemble()

        container.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(container)
    }

    /*
     Method(`
        Adds a vertical Stack component to the array of built components.

        A vertical Stack stacks its children one below the other.

        Its children can be components of any kind.

        Each child can define optional 'stackSize', 'stackPadding' properties to specify how should it fill the space in the stack:

        	this.verticalStack( function(component) {
        		this.label({
        			text: 'A label',
        			viewAttributes: {
        				stackSize: 'filled', // 'filled' or 'fixed' or 'spread',
        				stackPadding: 0,
        			},
        		})
        	})

        stackSize: 'filled' means that if there is extra vertical space in the verticalStack the child will be resized to fill that space.
        stackSize: 'fixed' means that the child height will be defined only by its own contents.
        stackSize: 'spread' means that the child height will be defined by its own contents but if there is extra space it will filled with blank
        space instead of stacking one child below the oher one.

        The 'stackPadding' is an integer defining a number of pixels to leave blank above and below each child. It defaults to 0.

        Each child can also define a 'stackAlign' property to define whether that child should be stacked from the top or the bottom of the
        verticalStack:

        	this.verticalStack( function(component) {
        		this.label({
        			text: 'A label',
        			viewAttributes: {
        				stackAlign: 'end', // 'begining' or 'end',
        			},
        		})
        	})


        The first parameter of the method verticalStack() can be an object with the dialog props:

        	this.container({ width: 100, height: 100, }, function() {

        	})



        The props can also be defined with the methods

        		styles(props)
        		model(model)
        		handlers(props)

        within the container closure.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the verticalStack

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and child components calling any of ContainerWidgetBuilder methods
           in it.
        `,
     })

     Example({
        Description: `
           Builds a verticalStack with two labels.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.verticalStack( function() {
           		this.label({
           			text: 'Label 2',
           			viewAttributes: {
           				stackSize: 'fixed',
           				stackAlign: 'end',
           			},
           		})

           		this.label({
           			text: 'Label 1',
           			viewAttributes: {
           				stackSize: 'filled',
           			},
           		})
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    verticalStack(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ContainerWidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( builder.getProps(), { orientation: 'vertical' })

        const stack = this.namespace().Stack.new( props )

        stack.assemble()

        stack.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(stack)
    }

    /*
     Method(`
        Adds an horizontal Stack component to the array of built components.

        Aa horizontal Stack stacks its children one next to the other.

        Its children can be components of any kind.

        Each child can define optional 'stackSize' and 'stackPadding' properties to specify how should it fill the space in the stack:

        	this.horizontalStack( function(component) {
        		this.label({
        			text: 'A label',
        			viewAttributes: {
        				stackSize: 'filled', // 'filled' or 'fixed' or 'spread',
        				stackPadding: 0,
        			},
        		})
        	})

        stackSize: 'filled' means that if there is extra horizontal space in the horizontalStack the child will be resized to fill that space.
        stackSize: 'fixed' means that the child width will be defined only by its own contents.
        stackSize: 'spread' means that the child width will be defined by its own contents but if there is extra space it will filled with blank
        space instead of stacking one child next to the oher one.

        The 'stackPadding' is an integer defining a number of pixels to leave blank at the left and right of each child. It defaults to 0.

        Each child can also define a 'stackAlign' property to define whether that child should be stacked from the left of the right of the
        horizontalStack:

        	this.horizontalStack( function(component) {
        		this.label({
        			text: 'A label',
        			viewAttributes: {
        				stackAlign: 'end', // 'begining' or 'end',
        			},
        		})
        	})



        The first parameter of the method horizontalStack() can be an object with the dialog props:

        	this.container({ width: 100, height: 100, }, function() {

        	})




        The props can also be defined with the methods

        		styles(props)
        		model(model)
        		handlers(props)

        within the container closure.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the horizontalStack

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and child components calling any of ContainerWidgetBuilder methods
           in it.
        `,
     })

     Example({
        Description: `
           Builds an horizontalStack with two labels.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.horizontalStack( function() {
           		this.label({
           			text: 'Label 2',
           			viewAttributes: {
           				stackSize: 'fixed',
           				stackAlign: 'end',
           			},
           		})

           		this.label({
           			text: 'Label 1',
           			viewAttributes: {
           				stackSize: 'filled',
           			},
           		})
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    horizontalStack(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ContainerWidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( builder.getProps(), { orientation: 'horizontal' })

        const stack = this.namespace().Stack.new( props )

        stack.assemble()

        stack.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(stack)
    }

    /*
     Method(`
        Adds a vertical Spliiter component to the array of built components.

        A vertical Spliiter stacks its children one below the other and separates them with a handle that allows to resize the proportion
        that each child occupies.

        Its children can be components of any kind.

        Each child must define a 'splitProportion' property to specify the initial proportion for that child:

        	this.verticalSplitter( function(component) {
        		this.label({
        			text: 'A label',
        			viewAttributes: {
        				splitProportion: 1.0/3,
        			},
        		})

        		this.text({
        			viewAttributes: {
        				splitProportion: 2.0/3,
        			},
        		})
        	})

        The value of the splitProportion is expected to be a float and it is mandatory.

        The first parameter of the method verticalSplitter() can be an object with the dialog props:

        	this.container({ width: 100, }, function() {

        	})




        The props can also be defined with the methods

        		styles(props)
        		model(model)
        		handlers(props)

        within the container closure.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the verticalSplitter

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and child components calling any of ContainerWidgetBuilder methods
           in it.
        `,
     })

     Example({
        Description: `
           Builds a verticalSplitter with 2 labels.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.verticalSplitter( function() {
           		this.label({
           			text: 'Label 1',
           			viewAttributes: {
           				splitProportion: 1.0/2,
           			},
           		})

           		this.label({
           			text: 'Label 2',
           			viewAttributes: {
           				splitProportion: 1.0/2,
           			},
           		})
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    verticalSplitter(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ContainerWidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( builder.getProps(), { orientation: 'vertical' })

        const splitter = this.namespace().Splitter.new( props )

        splitter.assemble()

        splitter.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(splitter)
    }

    /*
     Method(`
        Adds an horizonal Spliiter component to the array of built components.

        An horizonal Spliiter stacks its children one next to the other and separates them with a handle that allows to resize the proportion
        that each child occupies.

        Its children can be components of any kind.

        Each child must define a 'splitProportion' property to specify the initial proportion for that child:

        	this.horizonalSplitter( function(component) {
        		this.label({
        			text: 'A label',
        			viewAttributes: {
        				splitProportion: 1.0/3,
        			},
        		})

        		this.text({
        			viewAttributes: {
        				splitProportion: 2.0/3,
        			},
        		})
        	})

        The value of the splitProportion is expected to be a float and it is mandatory.

        The first parameter of the method horizonalSplitter() can be an object with the dialog props:

        	this.container({ width: 100, }, function() {

        	})



        The props can also be defined with the methods

        		styles(props)
        		model(model)
        		handlers(props)

        within the container closure.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the horizontalSplitter

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and child components calling any of ContainerWidgetBuilder methods
           in it.
        `,
     })

     Example({
        Description: `
           Builds an horizontalSplitter with 2 labels.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.horizontalSplitter( function() {
           		this.label({
           			text: 'Label 1',
           			viewAttributes: {
           				splitProportion: 1.0/2,
           			},
           		})

           		this.label({
           			text: 'Label 2',
           			viewAttributes: {
           				splitProportion: 1.0/2,
           			},
           		})
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    horizontalSplitter(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ContainerWidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( builder.getProps(), { orientation: 'horizontal' })

        const splitter = this.namespace().Splitter.new( props )

        splitter.assemble()

        splitter.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(splitter)
    }

    /*
     Method(`
        Adds a Tabs component to the array of built components.

        A Tabs component is a container with selectable, labeled tabs.

        Each labeled tab is associated to a tab page contained in the Tabs component.

        When a tab is selected its corresponding tab page is shows.

        All the child components of a Tabs component are expected to be tab pages.

        Otherwise the behaviour is undefined.

        Tabs component can specify the location of the tabs labels through its property

        	{
        		aligment: 'top', 'bottom', 'left', 'right',
        	}


        The first parameter of the method tabs() can be an object with the tabs container props:

        	this.container({ aligment: 'top' }, function() {

        	})




        The props can also be defined with the methods

        		styles(props)
        		model(model)
        		handlers(props)

        within the container closure.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the tabs component

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	// Tabs properties

           	'alignment': String: 'top' | 'bottom' | 'right' | 'left'
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and child TabPage components in it.
        `,
     })

     Example({
        Description: `
           Builds a tabs component with 2 pages.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.tabs( function() {
           		this.tabPage({ label: 'Tab page 1' }, function() {
           			this.label({
           				text: 'Page 1'
           			})
           		})

           		this.tabPage({ label: 'Tab page 2' }, function() {
           			this.label({
           				text: 'Page 2'
           			})
           		})
           	})
           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    tabs(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ContainerWidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const tabs = this.namespace().Tabs.new( props )

        tabs.assemble()

        tabs.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(tabs)
    }

    /*
     Method(`
        Adds a TabPage component to the array of built components.

        A TabPage is a container component child of a Tabs component.

        It accepts a label property with the tab text for the page.

        Each tab page is associated to a tab label on its Tabs container component.

        When a tab is selected its corresponding tab page is shows.

        A TabPage component can specify its label through the 'label' property


        The first parameter of the method tabPage() can be an object with the tabPage props:

        	this.container({ label: 'Tab 1' }, function() {

        	})


        The props can also be defined with the methods

        		styles(props)
        		model(model)
        		handlers(props)

        within the container closure.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the tabPage

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	// TabPage properties

           	'label': String,
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and child components calling any of ContainerWidgetBuilder methods
           in it.
        `,
     })

     Example({
        Description: `
           Builds a tabPage.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.tabPage({ label: 'A tab label' }, function() {
           		this.label({
           			text: 'A tab page'
           		})
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    tabPage(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ContainerWidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const tabPage = this.namespace().TabPage.new( props )

        tabPage.assemble()

        tabPage.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(tabPage)
    }

    /*
     Method(`
        This component adds a visual separation between its previous and next components in a verticalStack component.
     `)

     Example({
        Description: `
           Builds a verticalSeparator between two components in a verticalStack component.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.verticalStack( function() {
           		this.label({
           			text: 'Label 2',
           			viewAttributes: {
           				stackSize: 'fixed',
           				stackAlign: 'end',
           			},
           		})

           		this.verticalSeparator()

           		this.label({
           			text: 'Label 1',
           			viewAttributes: {
           				stackSize: 'filled',
           			},
           		})
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    verticalSeparator(props) {
        const defaultProps = {
            viewAttributes: {
                stackSize: 'fixed',
            }
        }

        props = Object.assign(defaultProps, props)
        props = Object.assign(props, { orientation: 'vertical' })

        const separator = this.namespace().Separator.new(props)

        separator.assemble()

        this.childComponents.push(separator)
    }

    /*
     Method(`
        This component adds a visual separation between its previous and next components in an horizontalStack component.
     `)

     Example({
        Description: `
           Builds an horizontalSeparator between two components in an horizontalStack component.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.horizontalStack( function() {
           		this.label({
           			text: 'Label 2',
           			viewAttributes: {
           				stackSize: 'fixed',
           				stackAlign: 'end',
           			},
           		})

           		this.horizontalSeparator()

           		this.label({
           			text: 'Label 1',
           			viewAttributes: {
           				stackSize: 'filled',
           			},
           		})
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    horizontalSeparator(props) {
        const defaultProps = {
            viewAttributes: {
                stackSize: 'fixed',
            }
        }

        props = Object.assign(defaultProps, props)
        props = Object.assign(props, { orientation: 'horizontal' })

        const separator = this.namespace().Separator.new(props)

        separator.assemble()

        this.childComponents.push(separator)
    }

    /*
     Method(`
        Adds a List component to the array of built components.

        The List has a ChoiceModel as its model and shows the items in that ChoiceModel.

        For each item in the List model the List shows a row.

        Each row has 1 or more columns.

        Each column displays either text or an image, that is defined with a

        	column.getTextClosure(item)

        or

        	column.getImageClosure(item)

        function.

        No item is added or removed from the List by code. The List component updates itself on every change on its model.

        It is possible to change the entire list on the model that the List will update correctly.

        The list can have 0 or more items selected.

        Retrieveing the selected items is done through the List model.

        Setting the selected items is done through the List model or by the user interface.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the choiceList component

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	List properties

           	// false does not show column labels
           	showHeaders: Boolean,

           	// false does not allow clickable headers
           	clickableHeaders:  Boolean,

           	// show the horizontal scrollbar always, never, when it makes sense
           	hScroll: 'always', 'never', 'auto',

           	// show the horizontal scrollbar always, never, when it makes sense
           	vScroll: 'always', 'never', 'auto',

           	columns: {
           		label: String,
           		getTextClosure: (item) => { return String },
           		getImageClosure: (item) => { return filename String },
           		imageWidth: Integer,
           		imageHeight: Integer,
           	},

           	// Evaluated when the user double clicks on an item
           	onAction: () => {},
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and columns in it.
        `,
     })

     Example({
        Description: `
           Builds a ListChoice with one column.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')
           const ChoiceModel = require('sirens/src/finger-tips/models/ChoiceModel')

           const choiceModel = ChoiceModel.new()

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.listChoice( function() {
           		this.model( choiceModel )

           		this.styles({
           			showHeaders: true,
           			clickableHeaders: false,
           		})

           		this.column({
           			label: 'Column 1',
           			getTextClosure: function(item) { return item.toString() }
           		})

           	})
           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    listChoice(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ColumnsBuilder.new(props).yourself( (builder) => {
            builder.build(closure)
        })

        const choicesList = this.namespace().ChoicesList.new( builder.getProps() )

        choicesList.assemble()

        this.childComponents.push(choicesList)
    }

    /*
     Method(`
        Adds a Tree component to the array of built components.

        The Tree has a TreeChoiceModel as its model and shows the items in that TreeChoiceModel.

        For each item in the TreeChoiceModel model the Tree shows a row.

        Each row has 1 or more columns.

        Each column displays either text or an image, that is defined with a

        	column.getTextClosure(item)

        or

        	column.getImageClosure(item)

        function.

        No item is added or removed from the Tree by code. The Tree component updates itself on every change on its model.

        The list can have 0 or more items selected.

        Retrieveing the selected items is done through the TreeChoiceModel.

        Setting the selected items is done through the TreeChoiceModel or by the user interface.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the treeChoice component

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	Tree properties

           	// false does not show column labels
           	showHeaders: Boolean,

           	// false does not allow clickable headers
           	clickableHeaders:  Boolean,

           	// show the horizontal scrollbar always, never, when it makes sense
           	hScroll: 'always', 'never', 'auto',

           	// show the horizontal scrollbar always, never, when it makes sense
           	vScroll: 'always', 'never', 'auto',

           	columns: {
           		label: String,
           		getTextClosure: (item) => { return String },
           		getImageClosure: (item) => { return filename String },
           		imageWidth: Integer,
           		imageHeight: Integer,
           	},

           	// Evaluated when the user double clicks on an item
           	onAction: () => {},
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and columns in it.
        `,
     })

     Example({
        Description: `
           Builds a TreeChoice with one column.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')
           const TreeChoiceModel = require('sirens/src/finger-tips/models/TreeChoiceModel')

           const treeModel = TreeChoiceModel.new({
           	getChildrenClosure: (item) => { return [] }
           })

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.treeChoice( function() {
           		this.model( treeModel )

           		this.styles({
           			showHeaders: true,
           			clickableHeaders: false,
           		})

           		this.column({
           			label: 'Column 1',
           			getTextClosure: function(item) { return item.toString() }
           		})

           	})
           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    treeChoice(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().ColumnsBuilder.new(props).yourself( (builder) => {
            builder.build(closure)
        })

        const tree = this.namespace().ChoicesTree.new( builder.getProps() )

        tree.assemble()

        this.childComponents.push(tree)
    }

    /*
     Method(`
        Adds a Label component to the array of built components.

        The displays its contents from a given text or from a given ValueModelBehaviour.

        Labels are read only and can not be edited by the user.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the label component

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	// Label properties

           	text: String,
           	model:  ValueModelBehaviour,
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties in it.
        `,
     })

     Example({
        Description: `
           Builds a Label with a fixed text.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.label({
           		text: 'A label',
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    label(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const label = this.namespace().Label.new( builder.getProps() )

        label.assemble()

        this.childComponents.push(label)
    }

    /*
     Method(`
        Adds a Text component to the array of built components.

        A Text is an editable text field.

        It uses a ValueModelBehaviour to get and update the contents it displays.

        A Text is multiline and editable by default.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the text component

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	// Text properties

           	text: String,
           	model:  ValueModelBehaviour,

           	// defaults to 'none'
           	wrapMode: String 'none' | 'char' | 'word' | 'wordChar',

           	// default to 'auto'
           	hScroll: { 'auto', 'always', 'never' },

           	// default to 'auto'
           	vScroll: { 'auto', 'always', 'never' },
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties in it.
        `,
     })

     Example({
        Description: `
           Builds a Text with an initial text, that wraps to word and has not horizontal scroll.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.text({
           		text: 'Initial text',
           		wrapMode: 'word',
           		hScroll: 'never',
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    text(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const text = this.namespace().Text.new( builder.getProps() )

        text.assemble()

        this.childComponents.push(text)
    }

    /*
     Method(`
        Adds a SingleSelectionCheckBox component to the array of built components.

        A SingleSelectionCheckBox is an editable widget with two possible states, unchecked or checked.

        It uses a ValueModelBehaviour to get and update the value (checked or unchecked) it displays.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the label component

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	// SingleSelectionCheckBox properties

           	model:  ValueModelBehaviour,

           	// Defaults to false if neither value nor model are present
           	value: Boolean,
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties in it.
        `,
     })

     Example({
        Description: `
           Builds a SingleSelectionCheckBox initially checked.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.checkbox({
              label: 'A label',
           		value: true,
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    checkBox(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const text = this.namespace().SingleSelectionCheckBox.new( builder.getProps() )

        text.assemble()

        this.childComponents.push(text)
    }

    /*
     Method(`
        Adds a MultipleSelectionCheckBox component to the array of built components.

        A MultipleSelectionCheckBox is an editable widget with two possible states, unchecked or checked,
        that depend on whether the MultipleSelectionCheckBox.item is included or not in the value of its
        model.

        Its models is a ValueModelBehaviour with a collection of items.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the label component

           [
            // Common properties

            'width',
            'height',
            'alignHorizontal',
            'alignVertical',
            'marginLeft',
            'marginRight',
            'marginTop',
            'marginBottom',
            'marginHorizontal',
            'marginVertical',
            'populatePopupMenuBlock',
            'viewAttributes',

            // MultipleSelectionCheckBox properties

            model:  ValueModelBehaviour,
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties in it.
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    multipleCheckBox(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const text = this.namespace().MultipleSelectionCheckBox.new( builder.getProps() )

        text.assemble()

        this.childComponents.push(text)
    }

    /*
     Method(`
        Adds a TextButton component to the array of built components.

        A TextButton is a clickable button with an optional text and image.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the label component

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	// TextButton properties

           	text: String,
           	image: 
           		{
           			iconName: GtkIcons.xyz,
           			size: GtkIcons.size.xyz,
           		},

           		{
           			filename: path String to image file,
           			imageWidth: Integer,
           			imageHeight: Integer,
           		},
           	onClicked: function () { ... },
           ]

           Each of these styles can be a value or a ValueModelBehaviour.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties in it.
        `,
     })

     Example({
        Description: `
           Builds a TextButton.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function(component) {

           	this.textButton({
           		text: 'A button',
           		onClicked: () => { component.onButtonClicked() },
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    textButton(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const textButton = this.namespace().TextButton.new( builder.getProps() )

        textButton.assemble()

        this.childComponents.push(textButton)
    }

    /*
     Method(`
        Adds a RadioButton component to the array of built components.

        A RadioButton is button with two possible states, unchecked or checked.

        The difference with a SingleSelectionCheckBox is that RadioButtons are grouped and whenever a
        RadioButton is checked all the buttons in its group are unchecked.

        A RadioButton model is a ChoiceModel object shared with all the other RadioButtons in its group.

        Each RadioButton requires a mandatory 'id' property that is one of the choices in the its ChoiceModel.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the radioButton component

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	// RadioButton properties

           	model:  ChoiceModel,
           	text: String,
           ]

           Each of these styles can be a value or a ValueModelBehaviour, except for its model property.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties in it.
        `,
     })

     Example({
        Description: `
           Builds tree RadioButtons grouped.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')
           const ChoiceModel = require('sirens/src/finger-tips/models/ChoiceModel')

           const choiceModel = ChoiceModel.new({
           	choices: [ 'a', 'b', 'c' ],
           	selection: 'a',
           })

           const builder = ContainerWidgetBuilder.new()


           // The ids must match the items in the choiceModel

           builder.build( function(component) {

           	this.radioButton({
           		id: 'a',
           		model: choiceModel,
           		text: 'Option 1',
           	})

           	this.radioButton({
           		id: 'b',
           		model: choiceModel,
           		text: 'Option 2',
           	})
           	this.radioButton({
           		id: 'c',
           		model: choiceModel,
           		text: 'Option 3',
           	})
           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    radioButton(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const radioButton = this.namespace().RadioButton.new( builder.getProps() )

        radioButton.assemble()

        this.childComponents.push(radioButton)
    }

    /*
     Method(`
        Adds a MenuBar component to the array of built components.

        A MenuBar usually is on top of a Window or Dialog but actually it can be placed in any sub-component as well.

        A MenuBar direct children are expected to be menuGroups, otherwise its behaviour is undefined.

        See MenuGroupBuilder classification for more details.
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and menu items in it.
        `,
     })

     Example({
        Description: `
           Builds a menuBar.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function(component) {

           	this.menuBar( function() {
           		this.menuGroup({ label: 'File' }, function() {
           			this.item({
           				label: 'Open file...',
           				enabled: true,
           				action: () => { component.openFile() },
           			})

           			this.skip().separator()

           			this.item({
           				label: 'Open file in a new window...',
           				enabled: true,
           				action: () => { component.openFileInNewWindow() },
           			})
           		})
           	})
           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    menuBar(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const menuBar = this.namespace().MenuBuilder.new(props).createFromClosure( closure )

        this.childComponents.push(menuBar)
    }

    /*
     Method(`
        Adds a ToolBar component to the array of built components.

        A ToolBar usually is on top of a Window or Dialog but actually it can be placed in any sub-component as well.

        ToolBar direct children are expected to be button, toggleButtons or separators.

        See ToolBarBuilder classification for more details.
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties and ToolBarMenu items in it.
        `,
     })

     Example({
        Description: `
           Builds a toolBar.
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')
           const GtkIcons = require('sirens/src/skins/gtk-views/constants/GtkIcons')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function(component) {

           	this.toolBar( function() {

           		this.button({
           			label: 'Open file...',
           			image: {
           				iconName: GtkIcons.open,
           				size: GtkIcons.size._24x24,
           			},
           			tooltip: 'Opens a file',
           			enabled: true,
           			action: () => { component.openFile() },
           		})

           		this.separator()

           		this.button({
           			label: 'Save file',
           			image: {
           				iconName: GtkIcons.save,
           				size: GtkIcons.size._24x24,
           			},
           			tooltip: 'Saves the file',
           			enabled: true,
           			action: () => { component.createFile() },
           		})

           	})
           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    toolBar(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const toolBar = this.namespace().ToolBarBuilder.new(props).createFromClosure(closure)

        this.childComponents.push(toolBar)
    }

    /*
     Method(`
        Adds an Image component to the array of built components.

        A Image is a fixed size, read only image displayed as a sub-component.

        It can be a stock image or a custom image from a file.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           Optional.
           Object.
           An optional object defining one or more of the following styles for the label component

           [
           	// Common properties

           	'width',
           	'height',
           	'alignHorizontal',
           	'alignVertical',
           	'marginLeft',
           	'marginRight',
           	'marginTop',
           	'marginBottom',
           	'marginHorizontal',
           	'marginVertical',
           	'populatePopupMenuBlock',
           	'viewAttributes',

           	// Image properties

           	// Either

           	filename: path String to an image file,
           	width: Integer,
           	height: Integer,

           	// or

           	iconName: GtkIcons.xyz,
           	size: GtkIcons.size.xyz,

           ]
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate and set additional properties in it.
        `,
     })

     Example({
        Description: `
           Add the example description here ...
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/skins/componentBuilder/ContainerWidgetBuilder')
           const GtkIcons = require('sirens/src/skins/gtk-views/constants/GtkIcons')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {

           	this.image({
           		iconName: GtkIcons.open,
           		size: GtkIcons.size._48x48,
           	})

           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    image(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.namespace().WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const image = this.namespace().Image.new( builder.getProps() )

        image.assemble()

        this.childComponents.push(image)
    }
}

module.exports = Classification.define(ContainerWidgetBuilder)