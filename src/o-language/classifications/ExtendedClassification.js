const Classification = require('./Classification')
const ExtendedInstantiator = require('./ExtendedInstantiator')

/*
 Class(`
    The O language tries to add the bare minimum behaviour to objects.

    Instead of assuming a default behaviour for all objects the O language tries to make it easy, simple and clear for the top level 
    application to extend the behaviour of objects according to the application needs and requirements.

    One way for the application to extend the behaviour of all the instantiated objects during the application is through the use of this
    ExtendedClassification.

    ExtendedClassification is a regular classification that can be added to the Classification objects to make all objects instantiated to
    adquire the specified behaviour.

    With the use of this ExtendedClassification it is possible and simple to add behaviours like Debuggable or ParamsChecker to
    all the objects instantiated, and its entirely up to the top level application to configure which behaviours should be added.

    As an example, this ExtendedClassification is used before running the tests to add extra debugging and validation methods to
    the objects.
 `)

 Example({
    Description: `
       Adds the Debuggable and ParamsChecked behaviour to all objects created in the application.
    `,
    Code: `

       const Classification = require('sirens/src/o-language/classifications/Classification')
       const ExtendedClassification = require('sirens/src/o-language/classifications/ExtendedClassification')
       const ParamsChecker = require('sirens/src/o-language/classifications/ParamsChecker')
       const Debuggable = require('sirens/src/o-language/classifications/Debuggable')
       // Try commenting this lines or setting an empty array as extended behaviour to get an error when calling
       // circle.debugString()
       
       Classification.behaveAs( ExtendedClassification )

       Classification.setExtendedBehaviours([
       	Debuggable,
       	ParamsChecker,
       ])
       

       // The ExtendedClassification behaviour must be attached to the Classification object
       // before defining other classifications.

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

       const circle = Circle.new({ radius: 10 })

       circle.debugString()

    `,
 })
*/
class ExtendedClassification
{

    /// Definition

    /*
     Method(`
        The classification definition.
     `)

     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['extendedBehaviours']
        this.assumes = []
        this.implements = []
    }

    /*
     Method(`
        Defines an array of classifications that all classifications defined from this moment will attach to the instances they create.

        If this is called before requiring any other classification, the top level application can add extended behaviour to all the objects
        instantiated during the application run.

        Usually the application uses this method to add debugging and validation methods.
     `)

     Param({
        Name: `
           extendedBehaviours
        `,
        Description: `
           Array of Classification.
           An array of classification objects that will be attached to all instances created by the classifications defined from that moment.
        `,
     })

     Example({
        Description: `
           Adds the Debuggable behaviour to all the objects.
        `,
        Code: `
           const Classification = require('sirens/src/o-language/classifications/Classification')
           const ExtendedClassification = require('sirens/src/o-language/classifications/ExtendedClassification')
           const Debuggable = require('sirens/src/o-language/classifications/Debuggable')

           Classification.behaveAs( ExtendedClassification )

           Classification.setExtendedBehaviours([
           	Debuggable,
           ])


           // The ExtendedClassification behaviour must be attached to the Classification object
           // before defining other classifications.

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

           const circle = Circle.new({ radius: 10 })

           circle.debugString()
        `,
     })

     Tags([
        'setters', 'public'
     ])
    */
    setExtendedBehaviours( extendedBehaviours ) {
        this.extendedBehaviours = extendedBehaviours
    }

    /*
     Method(`
        Gets the array of classifications that all classifications defined from this moment will attach to the instances they create.
     `)
     Returns({
        Description: `
           Array of Classification.
           An array of classification objects that will be attached to all instances created by the classifications defined from that moment.
        `,
     })

     Tags([
        'public', 'querying', 'getters'
     ])
    */
    getExtendedBehaviours() {
        return this.extendedBehaviours
    }

    /*
     Method(`
        Overrides the

        	Classification.define(classificationDefinintion)

        to make the new classification being defined behave as an ExtendedInstantiator with the given extended classifications.
     `)

     Tags([
        'public', 'creating classifications'
     ])
    */
    define(classificationDefinition) {
        const newClassificationInstance = this.previousClassificationDo( () => {
            return this.define( classificationDefinition )
        })

        const extendedBehaviours = this.extendedBehaviours

        newClassificationInstance.behaveAs( ExtendedInstantiator )

        newClassificationInstance.setExtendedBehaviours( extendedBehaviours )

        return newClassificationInstance
    }
    
}

module.exports = Classification.define(ExtendedClassification)
