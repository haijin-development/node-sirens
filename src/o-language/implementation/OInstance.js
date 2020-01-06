let MessageDispatcherInstance

function setMessageDispatcher(messageDispatcher) {
    MessageDispatcherInstance = messageDispatcher
}

/*
 Class(`

    OInstance is the only classification that is attach by default to all objects.

    OInstance classification has the bare minimum behaviour to allow the object to adquire and drop other behaviours.

 `)
*/
class OInstance {

    /*
     Method(`
        This Classification definition.
     `)

     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
    }

    /// Initializing

    /*
     Method(`
        This method does nothing but serves as a null implementation for constructors.
     `)

     Example({
        Description: `
           Defines a Circle classification that calls initialize on its previous classification.

           If OInstance would have not defined an

           	initialize()

           hook method, Circle classification would need to change its implementation depending on whether its previous
           classification is OInstance or a different one.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification

           class Circle {
           	static definition() {
           		this.instanceVariables = ['radius']
           	}

           	initialize({ radius: radius }) {
           		this.radius = radius

           		this.previousClassificationDo( () => {
           			this.initialize()
           		})
           	}
           }

           Circle = Classification.define(Circle)



           Circle.new({ radius: 10 })
        `,
     })

     Tags([
        'initializing', 'public'
     ])
     */
    initialize() {
    }

    /// Asking

    /*
     Method(`
        Returns true if this object is behaving as the given classification, false otherwise.

        This method would be the equivalent of isKindOf in the classic object oriented paradigm.
     `)

     Param({
        Name: `
           classification
        `,
        Description: `
           The Classification to check if it has been attached to it.
        `,
     })

     Returns({
        Description: `
           Boolean.
           True if this object is behaving as the given Classification, false if it is not.
        `,
     })

     Example({
        Description: `
           Asks it an object is behaving as a Circle and as a Square.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification

           class Circle {
           }

           Circle = Classification.define(Circle)

           class Square {
           }

           Square = Classification.define(Square)


           const circle = Circle.new()

           circle.isBehavingAs(Circle)

           circle.isBehavingAs(Square)
        `,
     })

     Tags([
        'asking', 'object behaviours', 'public'
     ])
     */
    isBehavingAs(classification) {
        return MessageDispatcherInstance.objectIsBehavingAs({
            object: this, 
            classificationObject: classification,
        })
    }

    /*
     Method(`
        Returns true if the receiver understands the given message, false otherwise.

        An object responds to a message if any of its current classifications does.
     `)

     Param({
        Name: `
           message
        `,
        Description: `
           The name of the message to ask if the object responds to.
        `,
     })

     Returns({
        Description: `
           Boolean.
           True if this object responds to the given message, false if it is not.
        `,
     })

     Example({
        Description: `
           Asks if an object responds to the messages 'getColor' and 'getPosition'.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification

           class Circle {
           	getColor() {
           		// ...
           	}
           }

           Circle = Classification.define(Circle)

           const circle = Circle.new()

           circle.respondsTo( 'getColor' )

           circle.respondsTo( 'getPosition' )
        `,
     })

     Tags([
        'asking', 'object methods', 'public'
     ])
     */
    respondsTo(message) {
        return MessageDispatcherInstance.objectRespondsTo({
            object: this,
            message: message,
        })
    }

    /*
     Method(`
        Returns true if this object complies with the given protocol.

        To comply with the given protocol means that at least one classification attached to this object declares that implements
        the given protocol.
     `)

     Example({
        Description: `
           Asks if an object complies with the CircleProtocol and with the SquareProtocol.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const Protocol = require('sirens/src/O').Protocol

           class CircleProtocol {
           	getRadius() {}
           }

           CircleProtocol = Protocol.define(CircleProtocol)

           class SquareProtocol {
           	getLength() {}
           }

           SquareProtocol = Protocol.define(SquareProtocol)



           class Circle {
           	static definition() {
           		this.instanceVariables = ['radius']
           		this.implements = [CircleProtocol]
           	}

           	getRadius() {
           		return this.radius
           	}
           }

           Circle = Classification.define(Circle)

           const circle = Circle.new()

           circle.compliesWith(CircleProtocol)

           circle.compliesWith(SquareProtocol)
        `,
     })

     Tags([
        'asking', 'implemented protocols', 'public'
     ])
    */
    compliesWith(protocol) {
        const objectClassifications = this.classifications()

        return objectClassifications.some( (classification) => {
            return classification.compliesWith({ protocol: protocol })
        })
    }

    /// Behaviours

    /*
     Method(`
        Makes this object to adquire the behaviour defined in the given classification.

        If the instance already behaves as the given classification this method does nothing.

        This behaviour can be dropped from this instance by calling

        	object.dropBehaviour(classification)
     `)

     Param({
        Name: `
           classification
        `,
        Description: `
           A Classification.
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
           Makes an object to start behaving as a Circle.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const OInstance = require('sirens/src/O').OInstance

           class Circle {
           	static definition() {
           		this.instanceVariables = ['radius']
           	}

           	setRadius(radius) {
           		this.radius = radius
           	}
           	getRadius() {
           		return this.radius
           	}
           }

           Circle = Classification.define(Circle)

           const object = OInstance.new()
           // Try commenting this line to get an error when treating the object as a Circle
           object.behaveAs(Circle)
           object.setRadius( 10 )

           object.getRadius()
        `,
     })

     Example({
        Description: `
           Adds the Circle behaviour to an object that already had it.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const OInstance = require('sirens/src/O').OInstance

           class Circle {
           	static definition() {
           		this.instanceVariables = ['radius']
           	}

           	setRadius(radius) {
           		this.radius = radius
           	}
           	getRadius() {
           		return this.radius
           	}
           }

           Circle = Classification.define(Circle)

           const object = OInstance.new()

           object.behaveAs(Circle)
           object.setRadius( 10 )

           // Does nothing and preserves the current state of the object.
           object.behaveAs(Circle)
           object.getRadius()
        `,
     })

     Tags([
        'object behaviours', 'public'
     ])
     */
    behaveAs(classification) {
        const isBehavingAs = MessageDispatcherInstance.objectIsBehavingAs({
            object: this, 
            classificationObject: classification,
        })

        if( isBehavingAs ) { return this }

        const getRecursiveAssumptions = classification.getRecursiveAssumptions()

        getRecursiveAssumptions.forEach( (eachClassification) => {
            this.behaveAs( eachClassification )
        })

        // This is to avoid the method lookup during this.pushBehaviour
        MessageDispatcherInstance.objectPushBehaviour({
            object: this,
            classificationObject: classification,
        })

        if( classification.definesMethod( 'afterInstantiation' ) ) {
            this.afterInstantiation()
        }        

        return this
    }

    /*
     Method(`
        Makes this object to behave as all the classifications in the given classificationsArray.
     `)

     Param({
        Name: `
           classificationsArray
        `,
        Description: `
           Array of Classification.
           An array of Classification objects.
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
           Makes an object to start behaving as a Circle and as a Positionable.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const OInstance = require('sirens/src/O').OInstance

           class Circle {
           	static definition() {
              		this.instanceVariables = ['radius']
           	}

           	setRadius(radius) {
              		this.radius = radius
            	}

           	getRadius() {
              		return this.radius
            	}
           }

           Circle = Classification.define(Circle)

           class Positionable {
           	static definition() {
              		this.instanceVariables = ['x', 'y']
           	}

           	setPosition({ x: x, y: y}) {
              		this.x = x
           		this.y = y
            	}

           	getPosition() {
              		return {
           			x: this.x,
           			y: this.y,
           		}
            	}
           }




           Positionable = Classification.define(Positionable)




           const object = OInstance.new()
           // Try commenting this line to get an error when treating
           // the object as a Circle or as a Positionable
           object.behaveAsAll([ Circle, Positionable ])

           object.setRadius( 10 )
           object.setRadius({ x: 1, y: 1 })

           object.getRadius()
        `,
     })

     Tags([
        'object behaviours', 'public'
     ])
     */
    behaveAsAll(classificationsArray) {
      classificationsArray.forEach( (classification) => {
        this.behaveAs( classification )
      })

      return this
    }

    /*
        Method(`
           Unlike

           	OInstance.behaveAs(classification)

           that is an idempotent operation, this method makes this object to instantiate and push the given
           classification on top of its instantiated classifications even if it already behaves as that classification.

           The reasons and uses for this method will be clear in the future.
        `)

        Param({
           Name: `
              classification
           `,
           Description: `
              A Classification.
           `,
        })

        Tags([
           'object behaviours', 'implementation'
        ])
     */
    pushBehaviour(classification) {
        MessageDispatcherInstance.objectPushBehaviour({
            object: this,
            classificationObject: classification,
        })

        return this
    }

    /*
     Method(`
        Makes this object to stop behaving as the given classification.

        An object that drops a classification is exactly the same as if it had not previously had that classification 
        and there is no way to distinguish boths scenarios.
     `)

     Param({
        Name: `
           classification
        `,
        Description: `
           A Classification.
        `,
     })

     Example({
        Description: `
           Add the example description here ...
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const OInstance = require('sirens/src/O').OInstance

           class Circle {
           	static definition() {
           		this.instanceVariables = ['radius']
           	}

           	setRadius(radius) {
           		this.radius = radius
           	}
           	getRadius() {
           		return this.radius
           	}
           }

           Circle = Classification.define(Circle)

           const object = OInstance.new()

           object.behaveAs(Circle)
           object.setRadius(10)

           object.dropBehaviour(Circle)

           object.getRadius()
        `,
     })

     Tags([
        'object behaviours', 'public'
     ])
     */
    dropBehaviour(classification) {
        MessageDispatcherInstance.objectDropBehaviour({
            object: this,
            classificationObject: classification,
        })

        return this
    }

    /// Evaluating

    /*
     Method(`
        This method is intended to be called from within another method in the same classification.

        It evaluates the given closure starting the method lookup in the previous classification to the one active in the
        method that called previousClassificationDo().
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           Function.

           The function that is evaluated with the method lookup starting on the previous classification to the one that is calling this method.

           It expects the following signature

           	function() {
           		// ...
           	}
        `,
     })

     Example({
        Description: `
           A Circle classification overrides the method displayString() from the Shape classification and calls it using

           	previousClassificationDo( () => {
           		...
           	})
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification

           class Shape {
           	displayString() {
           		return 'A Shape'
           	}
           }

           Shape = Classification.define(Shape)

           class Circle {
           	static definition() {
           		this.assumes = [Shape]
           	}

           	displayString() {
           		return this.previousClassificationDo( () => {
           			return this.displayString() + ' and a Circle'
           		})
           	}
           }

           Circle = Classification.define(Circle)

           const circle = Circle.new()
           circle.displayString()
        `,
     })

     Tags([
        'implementation', 'object behaviours', 'evaluating'
     ])
     */
    previousClassificationDo(closure) {
        return MessageDispatcherInstance.duringPreviousClassificationDo({
            object: this,
            closure: closure,
        })
    }

    /*
     Method(`
        Instantiates the given classification to this object, evaluates the closure and drops the instantiated classification.

        This method is useful to make an object to adquire a behaviour only during the evaluation of a given code.
     `)

     Param({
        Name: `
           classification
        `,
        Description: `
           Classification.
           The classification to make this object to behave like during the evaluation of the given closure.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           Function.
           A function to evaluate while this object is behaving as the given classification.
        `,
     })

     Example({
        Description: `
           Adds the Debuggable classification during the evaluation of a debug method.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const OInstance = require('sirens/src/O').OInstance
           const Debuggable = require('sirens/src/O').Debuggable

           const object  = OInstance.new()
           object.duringClassificationDo( Debuggable, () => {
           	const debugString = object.debugString()

           	console.info(debugString)
           	return debugString
           })
        `,
     })

     Tags([
        'object behaviours', 'public', 'evaluating'
     ])
     */
    duringClassificationDo(classification, closure) {
        this.behaveAs(classification)

        try {
            return closure.call(this)
        } finally {
            this.dropBehaviour(classification)
        }
    }

    /*
     Method(`
        Iterates on all of the instance variables names and values of a classification instantiated in this object.
     `)

     Param({
        Name: `
           classification
        `,
        Description: `
           Classification.
           The classification to iterate its instance variables instantiated in this object.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           Function.
           A function to apply to each instance variable of this classification instantiated in this object.

           It expects the following signature:

           	function(name, value) {
           	}
        `,
     })

     Example({
        Description: `
           Add the example description here ...
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification

           class Circle {
           	static definition() {
           		this.instanceVariables = ['radius']
           	}

           	initialize({ radius: radius }) {
           		this.radius = radius
           	}
           }

           Circle = Classification.define(Circle)



           const circle = Circle.new({ radius: 10 })

           circle.classificationInstanceVariablesDo( Circle, (name, value) => {
           	console.info( name + ': ' + value.toString() )
           })
        `,
     })

     Tags([
        'instance variables', 'public', 'iterating'
     ])
    */
    classificationInstanceVariablesDo(classification, closure) {
        MessageDispatcherInstance.classificationInstanceVariablesDo({
            object: this,
            classificationObject: classification,
            closure: closure,
        })

        return this
    }

    getClassificationNamed({ name: classificationName }) {
      return this.classifications().find( (eachClassification) => {
        return eachClassification.getName() === classificationName
      })
    }

    getClassificationInstanceVariableValue({
      classification: classification, instanceVariableName: instanceVariableName,
    }) {
        const value = MessageDispatcherInstance.classificationGetInstanceVariableValue({
            object: this,
            classificationObject: classification,
            instanceVariableName: instanceVariableName,
        })

        return value
    }

    /*
     Method(`
        Evaluates the given closure starting the method lookup on the given classification.

        This method is similar to

        	previousClassificationDo()

        but this method is public.
     `)

     Example({
        Description: `
           Creates a Circle and calls its method

           		circle.displayString()

           but starting at the Shape classification, not Circle.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification

           class Shape {
           	displayString() {
           		return 'A Shape'
           	}
           }

           Shape = Classification.define(Shape)

           class Circle {
           	static definition() {
           		this.assumes = [Shape]
           	}

           	displayString() {
           		return this.previousClassificationDo( () => {
           			return this.displayString() + ' and a Circle'
           		})
           	}
           }

           Circle = Classification.define(Circle)

           const circle = Circle.new()

           // Compare the regular method call
           circle.displayString()
           // with the same method call but starting the method lookup on the Shape classification
           circle.withClassificationDo( Shape, () => {
           	return circle.displayString()
           })
        `,
     })

     Tags([
        'object behaviours', 'public', 'evaluating'
     ])
     */
    withClassificationDo(classification, closure) {
        return MessageDispatcherInstance.withClassificationDo({
            object: this,
            classificationObject: classification,
            closure: closure,
        })
    }

    /*
      Method(`
        Sets the given value to the property of object with no classification.

        In some circumstances the developer might want to set a property value to the
        object itself instead of to any Classification. A reason could be that the
        object handles some dynamic properties on a per instance basis.

        In Javascript that is accomplished doing

          this.xyz = value

        In the scope of a Classification method that won't work because 'this' points to
        that Classification lookup table:

          setXyz(value) {
            this.xyz = value
          }

        sets the value to the Classification instance variable named 'xyz'.

        Using

          setXyz(value) {
            this.setUnclassifiedProperty({
              name: 'xyz',
              value: value,
            })
          }

        adds the unclassified property 'xyz' to the object.

        The property can later be read with

          object.xyz
      `)
    */
    setUnclassifiedProperty({ name: propertyName, value: value }) {
        return MessageDispatcherInstance.setUnclassifiedProperty({
          object: this,
          name: propertyName,
          value: value
        })
    }

    /*
     Method(`
        Evaluates the given closure binding

        	this

        to this object during the evaluation and returns this object.

        It's similar to calling

        	closure.call( object, params )

        	return object

        in plain javascript.
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           Function.
           A function to evaluate with this object bound to the pseudovariable this.

           Its expected signature is the following

           	function() {
           		...
           	}

           The return value is ignored.

           This method will not bind 'this' to the object with an arrow function:

           	() => {
           		///...
           	}

           The reason is that in javascript arrow functions are bound to the context where they are defined and that binding can not
           be changed.
        `,
     })

     Param({
        Name: `
           ...params
        `,
        Description: `
           Array.
           The arguments to pass along to the closure evaluation.
        `,
     })

     Returns({
        Description: `
           object.
           Returns this object.
        `,
     })

     Example({
        Description: `
           Calls bindYourself on an object.
        `,
        Code: `
           const OInstance = require('sirens/src/O').OInstance

           const object = OInstance.new()

           object.bindYourself( function() {
           	console.info( this.isBehavingAs(OInstance) )
           })
        `,
     })

     Tags([
        'public', 'evaluating'
     ])
    */
    bindYourself(closure, ...params) {
        closure.call(this, ...params)

        return this
    }

    /*
     Method(`
        This method is a special proxy method that is called for every object (if defined) before every method activation.

        It receives as its arguments the method, parameters and classifications of the method to activate.

        It allows to perform some metaprogramming like logging method calls, invoke remote calls or validate parameters.

        It is a simple implementation of what is sometimes called aspect programming.

        This method also allows to change the parameters, cancel the method activation or call a different method instead.
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
           The array with the method arguments.
        `,
     })

     Param({
        Name: `
           classification
        `,
        Description: `
           Classification.
           The classification that owns the method to activate.
        `,
     })

     Returns({
        Description: `
           To cancel the method call return

           {
           	callMethod: null,
           }

           To change the method called return

           {
           	callMethod: 'someOtherMethod',
           }

           To change the arguments of the method call return

           {
           	callParams: [ 1, 2, 3 ],
           }

           The last two can also be combined

           {
           	callMethod: 'someOtherMethod',
           	callParams: [ 1, 2, 3 ],
           }


           Any other return value is ignored and will make the method call to be activated as usual.
        `,
     })

     Implementation(`
        Although beforeMethod is defined in the OInstance classification, if no other classification attached to this object defines

        	beforeMethod(...)

        or

        	afterMethod(...)

        then the OInstance.beforeMethod(...) is not activated.

        It is an optimization to avoid one more method activation on every method call.

        The method

        	OInstance.beforeMethod(...)

        is defined here mainly for documentation purposes but actually it is never called.
     `)

     Example({
        Description: `
           Creates a Proxy that cancels the activation of the method appendLine of a StringStream object.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const StringStream = require('sirens/src/O').StringStream

           class Proxy {
           	beforeMethod({ methodName: methodName, params: params, classification: classification }) {
           		if( methodName === 'appendLine' ) {
           			        return {
                       				callMethod: null,
                   			}
           		}
           	}
           }

           Proxy = Classification.define(Proxy)



           const stream = StringStream.new()

           // Try not adding the Proxy behaviour to see the regular behaviour of the StringStream object.
           stream.behaveAs(Proxy)

           stream.append({ string: 'Text' })
           stream.appendLine({ string: 'A line' })

           stream.getString()
        `,
     })

     Example({
        Description: `
           Creates a Proxy that changes the parameters of the method call.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const StringStream = require('sirens/src/O').StringStream

           class Proxy {
           	beforeMethod({ methodName: methodName, params: params, classification: classification }) {
           		if( methodName === 'appendLine' ) {
           				const stringParam = params[0].string
           				const newParam = stringParam + ' plus an addition'

           			        return {
                       				callParams: [{ string: newParam }],
                   			}
           		}
           	}
           }

           Proxy = Classification.define(Proxy)

           const stream = StringStream.new()

           // Try not adding the Proxy behaviour to see the regular behaviour of the StringStream object.
           stream.behaveAs(Proxy)

           stream.append({ string: 'Text' })
           stream.appendLine({ string: 'A line' })

           stream.getString()
        `,
     })

     Example({
        Description: `
           Creates a Proxy that changes the method called on a StringStream object.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const StringStream = require('sirens/src/O').StringStream

           class Proxy {
           	beforeMethod({ methodName: methodName, params: params, classification: classification }) {
           		if( methodName === 'appendLine' ) {
           				const stringParam = params[0].string
           				const newParam = ' ' + stringParam + ' plus an addition'

           			        return {
           					callMethod: 'append',
                       				callParams: [{ string: newParam }],
                   			}
           		}
           	}
           }

           Proxy = Classification.define(Proxy)

           const stream = StringStream.new()

           // Try not adding the Proxy behaviour to see the regular behaviour of the StringStream object.
           stream.behaveAs(Proxy)

           stream.append({ string: 'Text' })
           stream.appendLine({ string: 'A line' })

           stream.getString()
        `,
     })

     Example({
        Description: `
           Creates a Proxy that logs all the method calls on a StringStream object.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const StringStream = require('sirens/src/O').StringStream

           class Proxy {
           	beforeMethod({ methodName: methodName, params: params, classification: classification }) {
           		console.info( methodName )
           	}
           }

           Proxy = Classification.define(Proxy)

           const stream = StringStream.new()

           // Try not adding the Proxy behaviour to see the regular behaviour of the StringStream object.
           stream.behaveAs(Proxy)

           stream.append({ string: 'Text' })
           stream.appendLine({ string: 'A line' })

           stream.getString()
        `,
     })

     Tags([
        'proxy methods', 'implementation'
     ])
    */
    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
    }

    /*
     Method(`
        This method is a special proxy method that is called for every object (if defined) after every method activation.

        It receives as its arguments the method, parameters, method result and classifications of the method activated.

        It allows to perform some metaprogramming like logging or validate method results.

        It is a simple implementation of what is sometimes called aspect programming.

        This method also allows to change the method result.
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
           The array with the method arguments.
        `,
     })

     Param({
        Name: `
           classification
        `,
        Description: `
           Classification.
           The classification that owns the method to activate.
        `,
     })

     Param({
        Name: `
           result
        `,
        Description: `
           object.
           The result of the activated method.
        `,
     })

     Returns({
        Description: `
           To change the result of the method called return

           {
           	callResult: 'someOtherResult',
           }

           Any other return value is ignored.
        `,
     })

     Implementation(`
        Although afterMethod is defined in the OInstance classification, if no other classification attached to this object defines

        	beforeMethod(...)

        or

        	afterMethod(...)

        then the OInstance.afterMethod(...) is not activated.

        It is an optimization to avoid one more method activation on every method call.

        The method

        	OInstance.afterMethod(...)

        is defined here mainly for documentation purposes but actually it is never called.
     `)

     Example({
        Description: `
           Creates a Proxy that changes the result of the method StringStream.appendLine
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const StringStream = require('sirens/src/O').StringStream

           class Proxy {
           	afterMethod({ methodName: methodName, params: params, result: result, classification: classification }) {
           		if( methodName === 'appendLine' ) {
           			        return {
                       				callResult: 123,
                   			}
           		}
           	}
           }

           Proxy = Classification.define(Proxy)

           const stream = StringStream.new()

           // Try not adding the Proxy behaviour to see the regular result of the StringStream.appendLine().
           stream.behaveAs(Proxy)

           stream.append({ string: 'Text' })

           stream.appendLine({ string: 'A line' })
        `,
     })

     Example({
        Description: `
           Creates a Proxy that logs all the results of all the method calls of a StringStream object.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification
           const StringStream = require('sirens/src/O').StringStream

           class Proxy {
           	afterMethod({ methodName: methodName, params: params, result: result, classification: classification }) {
           		console.info( methodName + ' returned ' + result.toString() )
           	}
           }

           Proxy = Classification.define(Proxy)

           const stream = StringStream.new()

           // Try not adding the Proxy behaviour to see the regular behaviour of the StringStream object.
           stream.behaveAs(Proxy)

           stream.append({ string: 'Text' })
           stream.appendLine({ string: 'A line' })

           stream.getString()
        `,
     })

     Tags([
        'proxy methods', 'implementation'
     ])
    */
    afterMethod({ methodName: methodName, params: params, result: result, classification: classification }) {
    }

    /// Querying

    /*
     Method(`
        Evaluates the given closure with this object as its parameters and returns this object.

        The difference with

        	object.bindYourself()

        is that this method does not change the binding of the closure.
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           Function.
           A function to evaluate with this object as its only parameter.

           The expected signature of the function is the following:

           	function(object) {
           		/// ...
           	}

           Unlike

           	object.bindYourself()

           in this case it is possible to use arrow functions too

           	(object) => {
           		/// ...
           	}
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
           Uses the method yourself instead of writing

           const stream =  StringStream.new()
           stream.setCrChar('<br>')
        `,
        Code: `
           const StringStream = require('sirens/src/O').StringStream

           StringStream.new().yourself( (stream) => {
           	stream.setCrChar('<br>')
           })
        `,
     })

     Tags([
        'public', 'evaluating'
     ])
     */
    yourself(closure) {
        closure(this)

        return this
    }

    /*
     Method(`
        Returns an array with all the classifications attached to this object.
     `)
     Returns({
        Description: `
           Array of Classification.
           An array with all the classifications attached to this object.
        `,
     })

     Example({
        Description: `
           Gets all the classifications attached to an object.
        `,
        Code: `
           const StringStream = require('sirens/src/O').StringStream

           const stream = StringStream.new()

           stream.classifications()
        `,
     })

     Tags([
        'object behaviours', 'public', 'querying'
     ])
     */
    classifications() {
        return MessageDispatcherInstance.objectGetClassifications({
            object: this
        })
    }

    /*
     Method(`
        Returns an array with all the names of the classifications attached to this object.
     `)
     Returns({
        Description: `
           Array of Classification.
           An array with all the classifications attached to this object.
        `,
     })

     Example({
        Description: `
           Gets all the names of the classifications attached to an object.
        `,
        Code: `
           const StringStream = require('sirens/src/O').StringStream

           const stream = StringStream.new()

           stream.getClassificationNames()
        `,
     })

     Tags([
        'object behaviours', 'public', 'querying'
     ])
    */
    getClassificationNames() {
        return this.classifications().map( (classification) => {
            return classification.getName()
        })
    }

    /*
     Method(`
        Gets the classification active in the method that called thisClassification().
     `)
     Returns({
        Description: `
           Classification.
           The classification that owns the active method.
        `,
     })

     Example({
        Description: `
           Gets the current active classification in the active method.
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification

           class Shape {
           	displayString() {
           		return 'A Shape'
           	}
           }

           Shape = Classification.define(Shape)

           class Circle {
           	static definition() {
           		this.assumes = [Shape]
           	}

           	getThisClassificationName() {
           		return this.thisClassification().getName()
           	}
           }

           Circle = Classification.define(Circle)

           const circle = Circle.new()

           circle.getThisClassificationName()
        `,
     })

     Tags([
        'object behaviours', 'implementation'
     ])
     */
    thisClassification() {
        return MessageDispatcherInstance.objectGetThisClassification({
            object: this
        })
    }

    /*
     Method(`
        Returns the classification previous to the active classification in the method that called previousClassification().
     `)
     Returns({
        Description: `
           Classification.
           The classification previous to the classification that owns the active method.
        `,
     })

     Example({
        Description: `
           Gets the classification previous to thisClassification().
        `,
        Code: `
           const Classification = require('sirens/src/O').Classification

           class Shape {
           	displayString() {
           		return 'A Shape'
           	}
           }

           Shape = Classification.define(Shape)

           class Circle {
           	static definition() {
           		this.assumes = [Shape]
           	}

           	getPreviousClassificationName() {
           		return this.previousClassification().getName()
           	}
           }

           Circle = Classification.define(Circle)

           const circle = Circle.new()

           circle.getPreviousClassificationName()
        `,
     })

     Tags([
        'object behaviours', 'implementation'
     ])
     */
    previousClassification() {
        return MessageDispatcherInstance.getPreviousClassificationOfObject({
            object: this
        })
    }
}

module.exports = {OInstance, setMessageDispatcher}