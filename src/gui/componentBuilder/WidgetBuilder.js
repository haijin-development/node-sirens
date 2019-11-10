const Classification = require('../../o-language/classifications/Classification')
const ObjectWithProps = require('../../o-language/classifications/ObjectWithProps')
const AntiComponent = require('./AntiComponent')

/*
 Class(`
    A WidgetBuilder object is used to build a Widget component using the components builder DSL.

    It allows to define the properties of an object.
 `)

 Example({
    Description: `
       Sets the properties to a Window.
    `,
    Code: `

       const ContainerWidgetBuilder = require('sirens/src/gui/componentBuilder/ContainerWidgetBuilder')
       const Window = require('sirens/src/gui/components/containers/Window')

       const builder = ContainerWidgetBuilder.new()

       builder.build( function() {
       	this.styles({
       		width: 100,
       		height: 100,
       	})
       })

       const window = Window.new( builder.getProps() )

       window

    `,
 })
*/
class WidgetBuilder {
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
        this.assumes = [ObjectWithProps]
    }

    /// Initializing

    /*
     Method(`
        Initializes this WidgetBuilder and sets its initial properties with the given props.
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
           Add the example description here ...
        `,
        Code: `
           const WidgetBuilder = require('sirens/src/gui/componentBuilder/WidgetBuilder')

           const initialProps = {
           	title: 'A window',
           	width: 100,
           	height: 100,
           }

           const builder = WidgetBuilder.new( initialProps )

           builder.getProps()
        `,
     })

     Tags([
        'initializing', 'public'
     ])
    */
    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.setProps( props )
    }

    /// Setting props

    /*
     Method(`
        A convenience method, more intention revealing, to set the property

        	{
        		model: object,
        	}
     `)

     Example({
        Description: `
           Sets the model using the method model()
        `,
        Code: `
           const WidgetBuilder = require('sirens/src/gui/componentBuilder/WidgetBuilder')
           const ValueModel = require('sirens/src/gui/models/ValueModel')

           const model = ValueModel.new({ value: '' })

           const builder = WidgetBuilder.new()

           builder.build( function() {
           	this.model( model )
           })

           builder.getProps()
        `,
     })

     Tags([
        'props', 'public', 'dsl'
     ])
    */
    model(model) {
        this.mergeProps({ model: model })
    }

    /*
     Method(`
        Sets the given properties.
     `)

     Example({
        Description: `
           Add the example description here ...
        `,
        Code: `
           const WidgetBuilder = require('sirens/src/gui/componentBuilder/WidgetBuilder')

           const builder = WidgetBuilder.new()

           builder.build( function() {
           	this.styles({
           		width: 100,
           		height: 100,
           	})
           })

           builder.getProps()
        `,
     })

     Tags([
        'props', 'public', 'dsl'
     ])
    */
    styles(props) {
        this.mergeProps(props)
    }

    /*
     Method(`
        A convenience method, more intention revealing, to set properties that are event handler closures.

        It is exactly the same as calling

        	this.styles()
     `)

     Example({
        Description: `
           Add the example description here ...
        `,
        Code: `
           const WidgetBuilder = require('sirens/src/gui/componentBuilder/WidgetBuilder')

           const builder = WidgetBuilder.new()

           builder.build( function() {
           	this.handlers({
           		onClicked: () => { console.info('clicked') },
           	})
           })

           builder.getProps()
        `,
     })

     Tags([
        'props', 'public', 'dsl'
     ])
    */
    handlers(props) {
        this.mergeProps(props)
    }

    /*
     Method(`
        Covenience method to define the property

        	{
        		populatePopupMenuBlock: closure
        	}

        It is use to set a closure to build a popup Menu.

        This method does not build the popup menu, it only sets a closure in a well known property to do it.

        It is up to each component to decide when and how to call the closure set in this property to populate a popup menu.
     `)

     Example({
        Description: `
           Add the example description here ...
        `,
        Code: `
           const WidgetBuilder = require('sirens/src/gui/componentBuilder/WidgetBuilder')

           const builder = WidgetBuilder.new()

           builder.build( function() {
           	this.popupMenu( function() {
           		this.item({
           			label: 'Open file',
           			action: () => { component.openFile() },
           		})
           	})
           })

           builder.getProps()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    popupMenu(populatePopupMenuBlock) {
        this.mergeProps({ populatePopupMenuBlock: populatePopupMenuBlock })
    }

    /// Building

    /*
     Method(`
        Evaluates the given closure, binding the variable 'this' to this object.

        If any extra arguments are given passes them to the closure.

        If the closure is undefined does nothing.
     `)

     Tags([
        'building', 'evaluating', 'public'
     ])
    */
    build(closure, ...params) {
        if( closure === undefined ) { return }

        this.bindYourself(closure, ...params)
    }

    /*
     Method(`
        Disables the components after the .skip() method.
     `)

     Example({
        Description: `
           Add the example description here ...
        `,
        Code: `
           const ContainerWidgetBuilder = require('sirens/src/gui/componentBuilder/ContainerWidgetBuilder')
           const Window = require('sirens/src/gui/components/containers/Window')

           const builder = ContainerWidgetBuilder.new()

           builder.build( function() {
           	this.label({ text: 'Label 1' })

           	this.skip().label({ text: 'Label 2' })
           })

           builder.getChildComponents()
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    skip() {
        return AntiComponent.new()
    }

    /*
     Method(`
        Returns an array of [props, closure].

        If the arguments props is undefined creates an empty object {} to return as the first parameter.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           An object of properties, a closure or undefined.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           A closure or undefined.
        `,
     })

     Returns({
        Description: `
           The array [props, closure].


           If the given parameters are

           	(props, closure)

           returns that.

           If the given parameters are

           	(props, undefined)

           returns that.

           If the given parameters are

           	(undefined, closure)

           returns [{}, closure].
        `,
     })

     Example({
        Description: `
           Normalizes the given [props, closure]
        `,
        Code: `
           const WidgetBuilder = require('sirens/src/gui/componentBuilder/WidgetBuilder')

           const builder = WidgetBuilder.new()

           builder.normalizeArguments({ title: 'Title' }, function() {})
        `,
     })

     Example({
        Description: `
           Normalizes the parameters (undefined, closure)
        `,
        Code: `
           const WidgetBuilder = require('sirens/src/gui/componentBuilder/WidgetBuilder')

           const builder = WidgetBuilder.new()

           builder.normalizeArguments( function() {} )
        `,
     })

     Tags([
        'normalizing parameters', 'implementation'
     ])
    */
    normalizeArguments(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        return [props, closure]
    }
}

module.exports = Classification.define(WidgetBuilder)