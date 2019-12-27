const Classification = require('./Classification')
const {ProtocolError} = require('./Errors')

/*
 Class(`
    A Protocol is a regular classification but it is not intended to be attached to objects but to define the specification, or protocol,
    that other classifications must comply with.

    In its most simple form a Protocol declares the methods that other classifications should define.

    The body of these protocol methods can be empty or can specify conditions on the parameters and objects during the method
    call, like the expected type of its parameters or the invariant that the object owning the method should comply with before and
    after the method activation.


    A classification is not limited to have only one protocol defining its expected behaviour.

    It can specify one public protocol defining the public methods that any object behaving as that classification should comply with and
    it can specify an implementation protocol that other classifications must comply with to use its implementation.

    The first public protocol can be used by the users of the objects behaving as the classification while the second implementation
    protocol can be used by other classification implementing the first classification.


    If a classification implements a protocol it can declare it in its definition:

           class Circle {
    	       	static definition() {
            	       	this.instanceVariables = ['radius']
                   		this.implements = [ CircleProtocol ]
           		}

    		// ...
           }

          Circle = Classification.define(Circle)

    and the

    	Classification.define()

    method will do some validations that it actually implements the declared protocol.
 `)

 Example({
    Description: `
       Defines a CircleProtocol.
    `,
    Code: `
       const Protocol = require('sirens/src/O').Protocol

       class CircleProtocol {
           getRadius() {}

           setRadius(radius) {}

           drawOn({ canvas: canvas }) {}
       }

       CircleProtocol = Protocol.define(CircleProtocol)
    `,
 })
*/
class Protocol {
    /*
     Method(`
        Validates that this Protocol is implement by the given classification.

        If it is not raises an error or evaluates the optional given closure.
     `)

     Param({
        Name: `
           classification
        `,
        Description: `
           Classification.
           A Classification object to validate that it implements all the methods declared in this Protocol.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           Optional.
           Function.
           A function to evaluate if the given classification does not comply with this Protocol.

           If no closure is given the default behaviour is to raise an error.
        `,
     })

     Returns({
        Description: `
           Boolean.
           True if this Protocol is implemented by the given classification.
        `,
     })

     Example({
        Description: `
           A Circle classification validates that it implements the CircleProtocol and succeeds.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const Protocol = require('sirens/src/O').Protocol

           // Define the CircleProtocol

           class CircleProtocol {
               	drawOn({ canvas: canvas }) {}
           }

           CircleProtocol = Protocol.define(CircleProtocol)




           // Define the Circle classification

           class Circle {
               	drawOn({ canvas: canvas }) {
           		// ...
           	}
           }

           Circle = Classification.define(Circle)

           CircleProtocol.isImplementedBy({ classification: Circle })
        `,
     })

     Example({
        Description: `
           A Circle classification validates that it implements the CircleProtocol and fails.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const Protocol = require('sirens/src/O').Protocol

           // Define the CircleProtocol

           class CircleProtocol {
               	drawOn({ canvas: canvas }) {}
           }

           CircleProtocol = Protocol.define(CircleProtocol)

           // Define the Circle classification

           class Circle {
           }

           Circle = Classification.define(Circle)

           CircleProtocol.isImplementedBy({ classification: Circle })
        `,
     })

     Tags([
        'asking', 'public'
     ])
    */
    isImplementedBy({ classification: classification, ifNot: closure }) {
        if( closure === undefined ) {
            closure = (methodName) => {
                throw new ProtocolError(`${classification.getName()} classification must implement the method ${this.getName()}.${methodName} to comply with the protocol implementation.`)                
            }
        }

        const assumptionsChain = classification.getAssumptionsChain()

        return this.isImplementedByAll({
            classifications: assumptionsChain,
            ifNot: closure,
        })
    }

    /*
     Method(`
        In many cases a Protocol is not implemented by a single Classification but between many different classifications.

        This method validates that this Protocol is implement by all of the given classifications.

        If it is not raises an error or evaluates the optional given closure.
     `)

     Param({
        Name: `
           classifications
        `,
        Description: `
           Array of Classification.
           An array with all the Classifications objects to validate that they implement this Protocol.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           Optional.
           Function.
           A function to evaluate if the given classifications do not comply with this Protocol.

           If no closure is given the default behaviour is to raise an error.
        `,
     })

     Returns({
        Description: `
           Boolean.
           True if this Protocol is implemented by the all of given classifications.
        `,
     })

     Example({
        Description: `
           A CircleProtocol validates that it is implemented by the Shape and Circle classifications and succeeds.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const Protocol = require('sirens/src/O').Protocol

           // Define the CircleProtocol

           class CircleProtocol {
               	drawOn({ canvas: canvas }) {}
               	setPosition({ x: x, y: y }) {}
           }

           CircleProtocol = Protocol.define(CircleProtocol)

           // Define the Shape classification

           class Shape {
               	setPosition({ x: x, y: y }) {
           		// ..
           	}
           }

           Shape = Classification.define(Shape)

           // Define the Circle classification

           class Circle {
               	drawOn({ canvas: canvas }) {
           		// ...
           	}
           }

           Circle = Classification.define(Circle)

           CircleProtocol.isImplementedByAll({ classifications: [Shape, Circle] })
        `,
     })

     Example({
        Description: `
           A CircleProtocol validates that it is implemented by the Circle classifications and fails.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const Protocol = require('sirens/src/O').Protocol

           // Define the CircleProtocol

           class CircleProtocol {
               	drawOn({ canvas: canvas }) {}
               	setPosition({ x: x, y: y }) {}
           }

           CircleProtocol = Protocol.define(CircleProtocol)

           // Define the Circle classification

           class Circle {
               	drawOn({ canvas: canvas }) {
           		// ...
           	}
           }

           Circle = Classification.define(Circle)

           CircleProtocol.isImplementedByAll({ classifications: [Circle] })
        `,
     })

     Tags([
        'asking', 'public'
     ])
    */
    isImplementedByAll({ classifications: classifications, ifNot: closure }) {
        if( closure === undefined ) {
            closure = (methodName) => {
                throw new ProtocolError(`Must implement the method ${this.getName()}.${methodName} to comply with the protocol implementation.`)
            }
        }

        let protocolMethods = []

        this.getAssumptionsChain().forEach( (protocol) => {
            protocolMethods = protocolMethods.concat( protocol.getDefinedMethodNames() )
        })

        for(const eachMethod of protocolMethods) {
            const implementsMethod = classifications.some( (classification) => {
                return classification.definesMethod( eachMethod )
            })

            if( ! implementsMethod ) {
                return closure(eachMethod)
            }
        }

        return true
    }
}

module.exports = Classification.define(Protocol)
