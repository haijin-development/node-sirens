const Classification = require('./Classification')

/*
 Class(`
    This classification adds dynamic properties to any object.

    In javascript any object can add any property at any time as long as the object allows it to.

    In the O language the properties do not belong to an object but to a pair (object, classification) and all the instance
    variables of a classification are private, so it is not possible to dynamically add new properties to an object like in javascript
    (actually  it is possible, just like in javascript, but that pattern is discouraged).

    This classification allows any object to store dynamic properties not declared in advance through getters and setters.
 `)

 Implementation(`
    The use of this pattern not recomended.

    Dynamic properties not declared in a single, well known point in the source code are difficult to initialize,
    to track when their values change, to debug and to document.

    In some cases the dynamic properties are needed or convenient though, like when the object wraps an external
    interface or API or when it has a large number of optional properties.
 `)

 Example({
    Description: `
       Sets and gets a property value.
    `,
    Code: `
       const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

       const object = ObjectWithProps.new()

       object.setProp({
       	key: 'color',
       	value: 'blue',
       })

       object.getProp({ key: 'color' })
    `,
 })

 Example({
    Description: `
       Removes a property.
    `,
    Code: `
       const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

       const object = ObjectWithProps.new()

       object.setProp({
       	key: 'color',
       	value: 'blue',
       })

       object.removeProp({ key: 'color' })

       object.getProp({ key: 'color' })
    `,
 })

 Example({
    Description: `
       Merges and gets properties at once.
    `,
    Code: `
       const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

       const object = ObjectWithProps.new()

       object.mergeProps({
       	color: 'blue',
       	x: 10,
       	y: 10,
       })

       object.getProps()
    `,
 })

 Example({
    Description: `
       Iterates the defined properties.
    `,
    Code: `
       const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

       const object = ObjectWithProps.new()

       object.mergeProps({
       	color: 'blue',
       	x: 10,
       	y: 10,
       })

       object.propsAndValuesDo( (propName, value ) => {
       	console.info(  'Prop name: ' + propName + ' value: ' + value )
       })
    `,
 })

 Example({
    Description: `
       Gets a property value or a default value if the property is not defined.
    `,
    Code: `
       const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

       const object = ObjectWithProps.new()

       object.getProp({ key: 'color', defaultValue: 'blue' })
    `,
 })

 Example({
    Description: `
       Gets a property value or evaluates a closure if the property is not defined.
    `,
    Code: `
       const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

       const object = ObjectWithProps.new()

       object.getProp({
       	 key: 'color',
       	ifUndefined: ({ key: key, owner: owner }) => { console.info( "Undefined prop " + key ) },
        })
    `,
 })
*/
class ObjectWithProps {
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
        this.instanceVariables = ['props']
    }

    /// Initializing

    /*
     Method(`
        Initializes this classification after it is instantiated on this object.
     `)

     Tags([
        'initializing', 'implementation'
     ])
    */
    afterInstantiation() {
        this.props = {}
    }

    /// Asking

    /*
     Method(`
        Answers whether this object has the given property defined or not.
     `)

     Param({
        Name: `
           propName
        `,
        Description: `
           String.
           The name of the prop to query for its presence.
        `,
     })

     Returns({
        Description: `
           True if the given property is defined in this object.
           False if the given property is not defined in this object.
        `,
     })

     Example({
        Description: `
           Queries an object for a defined property named 'color' and for an undefined property named 'x'.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.mergeProps({
           	color: 'blue',
           })

           object.hasProp({ key: 'x' })

           object.hasProp({ key: 'color' })
        `,
     })

     Tags([
        'asking', 'public'
     ])
    */
    hasProp({ key: propName }) {
        return this.props[propName] !== undefined
    }

    /// Reading

    /*
     Method(`
        Returns an object with all the properties defined in this object and their values.
     `)
     Returns({
        Description: `
           Object.
           An object with the properties and values defined in this object.
        `,
     })

     Example({
        Description: `
           Gets all the properties defined in an object.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.mergeProps({
           	color: 'blue',
           	x: 10,
           	y: 10,
           })

           object.getProps()
        `,
     })

     Tags([
        'getters', 'querying', 'public'
     ])
    */
    getProps() {
        return this.props
    }

    /*
     Method(`
        Gets the value of the given property.

        If the property is not defined returns undefined.

        If the property is not defined but an optional defaultValue is given returns the defaultValue.

        If the property is not defined but an optional absentClosure is given returns the result of the evaluation of the If the absentClosure.
     `)

     Param({
        Name: `
           key
        `,
        Description: `
           String.
           The name of the property to get its value.
        `,
     })

     Param({
        Name: `
           absentClosure
        `,
        Description: `
           Optional.
           Function.
           An optional closure to evaluate if the property is not defined.
        `,
     })

     Param({
        Name: `
           defaultValue
        `,
        Description: `
           Optional.
           object.
           An optional value to return if the property is not defined.
        `,
     })

     Returns({
        Description: `
           object.
           The value of the given property if the property is defined.

           If the property is undefined returns undefined unless an optional defaultValue of absentClosure are given.
        `,
     })

     Example({
        Description: `
           Gets a defined property value.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.mergeProps({
           	color: 'blue',
           })

           object.getProp({ key: 'color' })
        `,
     })

     Example({
        Description: `
           Gets an undefined property value.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.getProp({ key: 'color' })
        `,
     })

     Example({
        Description: `
           Gets a given default value.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.getProp({ key: 'color', defaultValue: 'blue' })
        `,
     })

     Example({
        Description: `
           Gets the evaluation of an absentClosure.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.getProp({
           	 key: 'color',
           	ifUndefined: ({ key: key, owner: owner }) => { throw new Error( "Undefined prop " + key ) },
            })
        `,
     })

     Tags([
        'querying', 'public'
     ])
    */
    getProp({ key: key, ifUndefined: absentClosure, defaultValue: defaultValue }) {
        const value = this.props[key]

        if( value === undefined ) {
            if( absentClosure !== undefined  ) {
                return absentClosure({ key: key, owner: this })
            }

            if( defaultValue !== undefined  ) {
                return defaultValue
            }
        }

        return value
    }

    /// Writing

    /*
     Method(`
        Removes all the props defined in this object.
     `)
     Returns({
        Description: `
           object.
           This object.
        `,
     })

     Example({
        Description: `
           Defines and removes all the properties of an object.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.mergeProps({
           	color: 'blue',
           	x: 10,
           	y: 10,
           })

           object.clearAllProps()

           object.getProps()
        `,
     })

     Tags([
        'removing', 'public'
     ])
    */
    clearAllProps() {
        this.setProps( {} )

        return this
    }

    /*
     Method(`
        Sets the value of a property on this object.

        Sometimes it may be more convenient to use the method object.mergeProps() instead.
     `)

     Param({
        Name: `
           key
        `,
        Description: `
           String.
           The name of the property to set.
        `,
     })

     Param({
        Name: `
           value
        `,
        Description: `
           object.
           The value of the property to set.
        `,
     })

     Returns({
        Description: `
           object.
           This object.
        `,
     })

     Example({
        Description: `
           Sets the value of a property named 'color' to the string 'blue'.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.setProp({
           	key: 'color',
           	value: 'blue',
           })

           object.getProps()
        `,
     })

     Tags([
        'adding', 'public'
     ])
    */
    setProp({ key: key, value: value }) {
        const newProp = {}

        newProp[key] = value

        return this.mergeProps(newProp)
    }

    /*
     Method(`
        Overrides the current properties on this object and sets the new ones.

        This method should be rarely used and it is not recommended.

        If you want to preserve the current properties of this object use mergeProps() instead.
     `)

     Param({
        Name: `
           newProps
        `,
        Description: `
           Object.
           The new props to set to this object.
        `,
     })

     Returns({
        Description: `
           object.
           This object.
        `,
     })

     Example({
        Description: `
           Overrides the properties of an object.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.setProps({
           	color: 'blue',
           })

           object.setProps({
           	x: 10,
           	y: 10,
           })

           object.getProps()
        `,
     })

     Tags([
        'adding', 'setters', 'public'
     ])
    */
    setProps(newProps) {
        this.props = newProps

        return this
    }

    /*
     Method(`
        Merges the given props with the current props of this object.
     `)

     Param({
        Name: `
           additionalProps
        `,
        Description: `
           The properties names and values to merge to the properties of this object.
        `,
     })

     Returns({
        Description: `
           object.
           This object.
        `,
     })

     Example({
        Description: `
           Merges properties into an object.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.mergeProps({
           	color: 'blue',
           })

           object.mergeProps({
           	x: 10,
           	y: 10,
           })

           object.getProps()
        `,
     })

     Tags([
        'adding', 'public'
     ])
    */
    mergeProps(additionalProps) {
        const newProps = Object.assign(this.props, additionalProps)

        return this.setProps(newProps)
    }

    /*
     Method(`
        Removes the given property from the object.
     `)

     Param({
        Name: `
           key
        `,
        Description: `
           The name of the property to remove from this object.
        `,
     })

     Returns({
        Description: `
           object.
           This object.
        `,
     })

     Implementation(`
        This method does not set the property value to undefined, it does actually remove the property with the javascript operator delete.
     `)

     Example({
        Description: `
           Removes a property from an object.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.mergeProps({
           	color: 'blue',
           	x: 10,
           	y: 10,
           })

           object.removeProp({ key: 'color' })

           object.getProps()
        `,
     })

     Tags([
        'removing', 'public'
     ])
    */
    removeProp({ key: key }) {
        delete this.props[key]

        return this
    }

    /// Iterating

    /*
     Method(`
        Iterates the properties defined in this object.

        The iteration closure has the following signature:

        	function(propName, value) {
        		// ...
        	}
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           A function to apply to every property defined in this object.

           It has the following signature:

           	closure = function(propName, value) {
           		// ...
           	}


           The order in which the properties are iterated is not guaranteed and you should not assume any particular order.
        `,
     })

     Returns({
        Description: `
           object.
           This object.
        `,
     })

     Example({
        Description: `
           Defines properties on an object and iterates them.
        `,
        Code: `
           const ObjectWithProps = require('sirens/src/o-language/classifications/ObjectWithProps')

           const object = ObjectWithProps.new()

           object.mergeProps({
           	color: 'blue',
           	x: 10,
           	y: 10,
           })

           object.propsAndValuesDo( (propName, value ) => {
           	console.info(  'Prop name: ' + propName + ' value: ' + value )
           })
        `,
     })

     Tags([
        'iterating', 'public'
     ])
    */
    propsAndValuesDo(closure) {
        const props = this.props

        for( const propName in props ) {
            const value = props[ propName ]

            closure(propName, value)
        }

        return this
    }
}

module.exports = Classification.define(ObjectWithProps)