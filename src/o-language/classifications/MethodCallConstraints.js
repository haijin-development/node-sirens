const Classification = require('./Classification')
const MethodCallConstraintsValidator = require('./method-call-validation/MethodCallConstraintsValidator')

/*
 Class(`
    This classification implements a behavioural proxy to validate the parameters on each method call of its instances, according
    to the Protocols the instaces implements.

    MethodCallConstraints implements just one method,

    	beforeMethod(...)


    that is a proxy method called before each method activation.

    In the beforeMethod it asks for all the protocols implemented by the instance and for those protocols that implement the
    method being called it validates the parameters as declared in the protocol.

    If the validation fails it raises an error.

    If the validation succeds it continues with the regular method call.

    The validation of the parameters defined in the Protocols usually are type checkings of the arguments but it is not limited
    to type checking and can also include complex logic.
 `)

 Example({
    Description: `
       Validates a valid method call on an object behaving as a Circle.
    `,
    Code: `
       const Classification = require('sirens/src/O').Classification
       const Protocol = require('sirens/src/O').Protocol
       const MethodCallConstraints = require('sirens/src/O').MethodCallConstraints

       // Define the CircleProtocol
       class CircleProtocol {
              	getRadius() {}

       	// Define that the radius must be a number
              	setRadius(radius) {
       		this.param(radius) .isNumber()
       	}
       }

       CircleProtocol = Protocol.define(CircleProtocol)

       // Define the Circle classification and declare that it implements the CircleProtocol
       class Circle {
       	static definition() {
               	this.instanceVariables = ['radius']
       		this.implements = [CircleProtocol]
       	}

              	getRadius() {
              		return this.radius
              	}

              	setRadius(radius) {
              		this.radius = radius
       	}
       }

       Circle = Classification.define(Circle)

       // Create a Circle object
       const circle = Circle.new()
       // Make this instance to validate the params of the method calls it receives

       circle.behaveAs(MethodCallConstraints)

       // Set a valid radius
       circle.setRadius( 10 )

       circle.getRadius()
    `,
 })

 Example({
    Description: `
       Validates an invalid method call on an object behaving as a Circle.
    `,
    Code: `

       const Classification = require('sirens/src/O').Classification
       const Protocol = require('sirens/src/O').Protocol
       const MethodCallConstraints = require('sirens/src/O').MethodCallConstraints

       // Define the CircleProtocol
       class CircleProtocol {
              	getRadius() {}

       	// Define that the radius must be a number
              	setRadius(radius) {
       		this.param(radius) .isNumber()
       	}
       }

       CircleProtocol = Protocol.define(CircleProtocol)

       // Define the Circle classification and declare that it implements the CircleProtocol
       class Circle {
       	static definition() {
               	this.instanceVariables = ['radius']
       		this.implements = [CircleProtocol]
       	}

              	getRadius() {
              		return this.radius
              	}

              	setRadius(radius) {
              		this.radius = radius
       	}
       }

       Circle = Classification.define(Circle)

       // Create a Circle object
       const circle = Circle.new()

       // Make this instance to validate the params of the method calls it receives.
       // Also try commenting the line below to avoid doing any validation on the circle.
       circle.behaveAs(MethodCallConstraints)

       // Set an valid radius.
       // Also try setting a string, null, a function or any object other than a numeric value.
       circle.setRadius( undefined )

       circle.getRadius()

    `,
 })
*/
class MethodCallConstraints {
    /// Definition

    /*
     Method(`
        The definition of this classification.
     `)

     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    /*
     Method(`
        Proxy method that is called before the actual method activation.

        In this proxy method the MethodCallConstraints classification does the following:

        	- Asks for all the protocols implemented by this instance
        	- For each of those protocols
        		- If the protocol declares the method being activated, validates it


              - If the validation fails raises an error.

        If the validation succeds continues with the regular method activation.
     `)

     Param({
        Name: `
           methodName
        `,
        Description: `
           String.
           The name of the method to activate.
        `,
     })

     Param({
        Name: `
           params
        `,
        Description: `
           Array.
           Array with all the arguments to pass to the method to activate.
        `,
     })

     Param({
        Name: `
           classification
        `,
        Description: `
           The Classification where it is defined the method to activate.
        `,
     })

     Returns({
        Description: `
           Undefined or raises an error.

           Returning undefined from the method proxy

           	beforeMethod

           makes the method to activate as usual.


           If the validation of the method protocol fails it raises an error.
        `,
     })

     Tags([
        'proxy methods', 'implementation'
     ])
    */
    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        if( classification === undefined ) { return }

        const protocols = new Set()

        classification.getImplementedProtocols().forEach( (protocol) => {
            protocol.getAssumptionsChain().forEach( (protocol) => {
                protocols.add( protocol )
            }) 
        })

        classification.getExpectedProtocols().forEach( (protocol) => {
            protocol.getAssumptionsChain().forEach( (protocol) => {
                protocols.add( protocol )
            }) 
        })

        protocols.forEach( (protocol) => {

            const protocolDefinesMethod = protocol.definesMethod( methodName )

            if( ! protocolDefinesMethod ) { return }

            // Instantiate the protocol
            const protocolInstance = protocol.new()

            // A protocol declaration should not assume any other classification to not polute
            // the protocol it defines.
            // The protocol may also be used for documentation purposes, to perform other validations
            // different than the ones this MethodCallConstraints does or to do static type inference.
            // Instead of making the protocol to assume the MethodCallConstraintsValidator behaviour
            // add it dynamically to this created instance only.
            protocolInstance.behaveAs( MethodCallConstraintsValidator )

            protocolInstance.setMethodInfo({
                protocolName: protocol.getName(),
                classificationName: classification.getName(),
                methodName: methodName,
            })

            // Evaluate the method of the protocol that validates the method in the classification.
            // It would look like
            //      append({ string: string, if: condition }) {
            //          param(string) .string()
            //          param(condition) .undefined() .or() .boolean()
            //      }
            protocolInstance[ methodName ]( ...params )

            protocolInstance.evaluateParametersValidations()
        })
    }
}

module.exports = Classification.define(MethodCallConstraints)
