const Classification = require('./Classification')

/*
 Class(`
    The O language tries to add the bare minimum behaviour to objects.

    Instead of assuming a default behaviour for all objects the O language tries to make it easy, simple and clear for the top level 
    application to extend the behaviour of objects according to the application needs and requirements.

    One way for the application to extend the behaviour of all the instantiated objects during the application is through the use of this
    ExtendedInstantiator.

    ExtendedInstantiator is a regular classification that can be added to any Classification object to make all objects instantiated by
    that classification to adquire the specified extended behaviour.

    With the use of this ExtendedInstantiator it is possible and simple to add behaviours like Debuggable or ParamsChecker to
    all the objects instantiated by a particular classification, and its entirely up to the top level application to configure which behaviours 
    should be added.

    This ExtendedInstantiator classification is used by the ExtendedClassification classification to extend the behaviour of all the
    objects in an application.
 `)

 Example({
    Description: `
       Adds the Debuggable and ParamsChecked behaviour to all the objects behaving as Circle.
    `,
    Code: `

       const Classification = require('sirens/src/o-language/classifications/Classification')
       const ExtendedInstantiator = require('sirens/src/o-language/classifications/ExtendedInstantiator')
       const ParamsChecker = require('sirens/src/o-language/classifications/ParamsChecker')
       const Debuggable = require('sirens/src/o-language/classifications/Debuggable')

       class Circle {
       	static definition() {
               	this.instanceVariables = ['radius']
       	}

       	initialize({ radius: radius }) {
       		this.radius = radius
       	}

       	getRadius() {
       		return this.radius
       	}

       	setRadius(radius) {
       		this.radius = radius
       	}
       }

       Circle = Classification.define(Circle)
       // Try commenting this lines or setting an empty array as extended behaviour to get an error when calling
       // circle.debugString()
       Circle.behaveAs( ExtendedInstantiator )

       Circle.setExtendedBehaviours([
       	Debuggable,
       	ParamsChecker,
       ])

       const circle = Circle.new({ radius: 10 })

       circle.debugString()

    `,
 })
*/
class ExtendedInstantiator {
    
    /// Definition

    /*
     Method(`
        The classification definition.
     `)
    */
    static definition() {
        this.instanceVariables = ['extendedBehaviours']
        this.assumes = []
        this.implements = []
    }

    /*
     Method(`
        Defines an array of classifications that a single classifications will attach to the instances it creates.

        Usually the application uses this method to add debugging and validation methods for the objects of a particular classification.
     `)

     Param({
        Name: `
           extendedBehaviours
        `,
        Description: `
           Array of Classification.
           An array of classification objects that will be attached to the objects instantiated by this classification from this moment.
        `,
     })

     Example({
        Description: `
           Adds the Debuggable behaviour to all the objects behaving as Circle.
        `,
        Code: `

           const Classification = require('sirens/src/o-language/classifications/Classification')
           const ExtendedInstantiator = require('sirens/src/o-language/classifications/ExtendedInstantiator')
           const Debuggable = require('sirens/src/o-language/classifications/Debuggable')

           class Circle {
           	static definition() {
                   	this.instanceVariables = ['radius']
           	}

           	initialize({ radius: radius }) {
           		this.radius = radius
           	}

           	getRadius() {
           		return this.radius
           	}

           	setRadius(radius) {
           		this.radius = radius
           	}
           }

           Circle = Classification.define(Circle)
           // Try commenting this lines or setting an empty array as extended behaviour to get an error when calling
           // circle.debugString()
           Circle.behaveAs( ExtendedInstantiator )

           Circle.setExtendedBehaviours([
           	Debuggable,
           ])

           const circle = Circle.new({ radius: 10 })

           circle.debugString()

        `,
     })
    */
    setExtendedBehaviours( extendedBehaviours ) {
        this.extendedBehaviours = extendedBehaviours
    }

    /*
     Method(`
        Gets the array of classifications that this classification attaches to the instances it creates.
     `)
     Returns({
        Description: `
           Array of Classification.
           An array of classification objects that this classification attaches to the instances it creates.
        `,
     })
    */
    getExtendedBehaviours() {
        return this.extendedBehaviours
    }

    /*
     Method(`
        Private.
        Overrides the

        	Classification.new(...params)

        method to add the extended behaviour to the created instances.
     `)
    */
    new(...params) {
        const extendedBehaviours = this.getExtendedBehaviours()

        const newInstance = this.previousClassificationDo( () => {
            return this.new( ...params )
        })

        extendedBehaviours.forEach( (classification) => {
            newInstance.behaveAs( classification )
        })

        return newInstance
    }
    
}

module.exports = Classification.define(ExtendedInstantiator)
