const ClassificationDefinition = require('./classification-definition')

let MessageDispatcherInstance

function setMessageDispatcher(messageDispatcher) {
    MessageDispatcherInstance = messageDispatcher
}

/*
 Class(`
    Classifications are O language objects too. As such, their behaviour is defined by one or more classifications.

    The behaviour of objects behaving as classifications is defined by this Classification.

    
 `)
 */
class Classification {

    /// Definition

    /*
     Method(`
        This Classification definition.
     `)
    */
    static definition() {
        this.instanceVariables = ['classificationDefinition']
    }

    /// Creating classifications

    /*
 Method(`
    Creates a new Classification from the given classificationDefinition.

    The classificationDefinition is a regular javascript class that may define an optional static method called

        static definition()


    The definition method of classificationDefinition may have any or all of the following properties:

        class Circle {
                /// Definition

            static definition() {
                    this.instanceVariables = [ 'radius' ]
                    this.assumes = [ Shape ]
                    this.implements = [ ShapeProtocol ]
                    this.expects = []
                    this.classificationBehaviours = [ ShapeBuilder ]
            }
        }

    Each property is explained below.

    # this.instanceVariables = [ 'radius' ]

    Is an array with the instance variables of the pair (object, classification).

    In the o language an object does not have instance variables of its own.

    When a classification is instantiated on the object a new set of the classification instance variables
    is assigned for the object.

    When the classification is detached from the object those instance variables are discarded.

    # this.assumes = [ Shape ]

    Defining a classification assumptions is the same as attaching those assumptions on each object that starts behaving as 
    the main classification.

    For instance, in the given Shape example doing

    const circle = Circle.new()

    is the same as doing

    const circle = OInstance.new()
    circle.behaveAs(Shape)
    circle.behaveAs(Circle)


    A classification can have any number of assumptions and the nested assumptions are attached to the target object recursively.

    In a sense a classification assumptions defines a loose inheritance relationship between classifications, except that this
    relationship is dynamic instead of static.

    # this.implements = [ ShapeProtocol ]

    A classification implementations declares that the classificationDefinition must comply with all of the given protocols.

    The compliance of the classificationDefinition with all of these protocols is checked when the classification is created by
    calling the method


            const newClassification = Classification.define(newClassificationDefinition)


    Declaring the protocols a classification implements has two important purposes:

    - it documents what protocols or interfaces the classification complies with.
    - it allows to programmatically check that the classification does implement the expected protocol and raises an error if
    it does not.

    # this.expects = []

    A classification expectations declares that an object that is behaving as that classification should comply with the all the protocols
    declared as expectations.

    It is similar to this.implements with the difference that the compliance to the protocol is not checked (and can not be checked )
    at the moment of the classification definition.

    Here's an example:


        class ShapeProtocol {
            drawOn({ canvas: canvas }) {}
        }

        const ShapeProtocol = Protocol.define(ShapeProtocol)


        class Shape {
                /// Definition

            static definition() {
                    this.instanceVariables = [ ]
                    this.implements = []
                    this.expects = [ShapeProtocol]
                    this.classificationBehaviours = []
            }
        }

        const Shape = Classification.define(Shape)

        class Circle {
                /// Definition

            static definition() {
                    this.instanceVariables = ['radius' ]
                    this.implements = [ShapeProtocol]
                    this.expects = []
                    this.classificationBehaviours = [ ShapeBuilder ]
            }

            drawOn({ canvas: canvas }) {
                // ...
            }
        }

        const Circle = Classification.define(Circle)


    The Circle classification declares that it implements the ShapeProtocol

        this.implements = [ShapeProtocol]

    and that compliance is checked when the Circle classification is defined

        const Circle = Classification.define(Circle)


    The Shape classification declares that it expects the ShapeProtocol

                    this.expects = [ShapeProtocol]

    but the compliance can not be checked at its definition time

        const Shape = Classification.define(Shape)

    since the ShapeProtocol expects the method

            drawOn({ canvas: canvas }) {}

    and that method can not be implemented by the Shape classification.

    # this.classificationBehaviours = [ ShapeBuilder ]

    In the O language classifications are regular objects. As such they can dynamically adquire and drop behaviours defined by other 
    classifications.

    Suppose we would want to create Circle and Squares instances with the following method:

        const circle = Circle.atPosition({ x: 10, y: 20 })
        const circle = Square.atPosition({ x: 10, y: 20 })


    One possible way to do that would be to define a new ShapeBuilder classification with the method atPosition({ x: x, y: y })

        class ShapeBuilder {
            atPosition({ x: x, y: y }) {
                const shapeInstance = this.new()

                shapeInstance.setPosition({ x: x, y: y })

                return shapeInstance
            }
        }

        const ShapeBuilder = Classification.define(ShapeBuilder)


    and attach the ShapeBuilder classification to both Circle and Square classifications

        const Circle = Classification.define(Circle)
        Circle.behaveAs(ShapeBuilder)

        const Square = Classification.define(Square)
        Square.behaveAs(ShapeBuilder)


    Another way is to declare the classification instance behaviour in the classification definitions with

        class Circle {
            static definition() {
                    this.classificationBehaviours = [ ShapeBuilder ]
            }
        }

        const Circle = Classification.define(Circle)

        class Square {
            static definition() {
                    this.classificationBehaviours = [ ShapeBuilder ]
            }
        }

        const Square = Classification.define(Square)

    This last method has the advantage of documenting the classification instance behaviour in the classification definition instead
    of having to search for it in the source code.
 `)

 Param({
    Name: `
       classificationDefinition
    `,
    Description: `
       A regular javascript class.
    `,
 })

 Returns({
    Description: `
       A new OInstance object that behaves as a Classification instance.
    `,
 })

 Example({
    Description: `
       Creates a Circle classification.
    `,
    Code: `
       const Classification = require('sirens/src/o-language/classifications/Classification')

       class Circle {
        static definition() {
                this.instanceVariables = ['radius']
            }

        getRadius() {
            return this.radius
        }

        setRadius(radius) {
            this.radius = radius
        }
       }

       Circle = Classification.define(Circle)

       Circle.new()
    `,
 })

 Example({
    Description: `
       Creates a Circle classification that assumes a Shape behaviour.

       That is, the Circle instances will also behave as Shape instances.
    `,
    Code: `

       const Classification = require('sirens/src/o-language/classifications/Classification')

       class Shape {
        static definition() {
                this.instanceVariables = ['x', 'y']
            }

        getPosition() {
            return {
                x: this.x,
                y: this.y,
            }
        }

        setPosition({ x: x, y: y }) {
            this.x = x
            this.y = y
        }
       }

       Shape = Classification.define(Shape)



       class Circle {
        static definition() {
                this.instanceVariables = ['radius']
                this.assumes = [ Shape ]
        }

        getRadius() {
            return this.radius
        }

        setRadius(radius) {
            this.radius = radius
        }
       }

       Circle = Classification.define(Circle)

       const circle = Circle.new()
       circle.setPosition({ x: 1, y: 1 })
       circle.setRadius( 10 )

       circle.getPosition()

    `,
 })

 Example({
    Description: `
       Creates a Circle classification that complies with the CircleProtocol
    `,
    Code: `
       const Classification = require('sirens/src/o-language/classifications/Classification')
       const Protocol = require('sirens/src/o-language/classifications/Protocol')

       class CircleProtocol {
        getRadius() {}

        setRadius(radius) {}

        drawOn({ canvas: canvas }) {}
       }

       CircleProtocol = Protocol.define(CircleProtocol)



       class Circle {
        static definition() {
                this.instanceVariables = ['radius']
                this.implements = [ CircleProtocol ]
        }

        getRadius() {
            return this.radius
        }

        setRadius(radius) {
            this.radius = radius
        }
        drawOn({ canvas: canvas }) {
            // ...
        }
       }
       // Try deleting the method drawOn({ canvas: canvas }) from the Circle definition
       // and the definition below will fail because Circle will not comply the with the
       // full CircleProtocol
       Circle = Classification.define(Circle)
    `,
 })

 Example({
    Description: `
       Creates a Shape classification that expects its instances to comply with the ShapeProtocol.

       The Shape classification itself does not implement all of the ShapeProtocol because its an abstract classification.

       For the moment the protocol expectations of a class is used only as a documentation. In the future it may also be validated.
    `,
    Code: `
       const Classification = require('sirens/src/o-language/classifications/Classification')
       const Protocol = require('sirens/src/o-language/classifications/Protocol')

       class ShapeProtocol {
        drawOn({ canvas: canvas }) {}
       }

       ShapeProtocol = Protocol.define(ShapeProtocol)

       class Shape {
        static definition() {
                this.instanceVariables = []
                this.expects = [ ShapeProtocol ]
        }
       }

       Shape = Classification.define(Shape)
    `,
 })

 Example({
    Description: `
       Creates a CircleBuilder to define additional methods on the Circle classification itself, not in the objects behaving a Circles.
    `,
    Code: `
       const Classification = require('sirens/src/o-language/classifications/Classification')

       class CircleBuilder {
        atPosition({ x: x, y: y }) {
            const circle = this.new()

            circle.setX( x )
            circle.setY( y )

            return circle
        }
       }

       CircleBuilder = Classification.define(CircleBuilder)

       class Circle {
        static definition() {
                    this.instanceVariables = [ 'x', 'y' ]
                    this.classificationBehaviours = [ CircleBuilder ]
        }

        getX() {
            return this.x
        }

        setX(x) {
            this.x = x
        }

        getY() {
            return this.y
        }

        setY(y) {
            this.y = y
        }
       }

       Circle = Classification.define(Circle)

       const circle = Circle.atPosition({ x: 1, y: 1 })

       circle.getX()
       circle.getY()
    `,
 })
*/
    define(classificationDefinition) {
        const Classification = MessageDispatcherInstance.getClassificationClassification()

        const classificationInstance = this.createObject()

        classificationInstance.behaveAs( Classification )

        classificationInstance.setClassificationDefinition(classificationDefinition)

        classificationInstance.behaveAs( this )

        classificationInstance.getClassificationBehaviours().forEach( (classification) => {
            classificationInstance.behaveAs(classification)
        })

        classificationInstance.getImplementedProtocols().forEach( (implementation) => {
            classificationInstance.implements({ protocol: implementation })
        })

        return classificationInstance
    }

    /*
 Method(`
    Creates a new OInstance object whose only behaviour is OInstance.
 `)
 Returns({
    Description: `
       A new OInstance object whose only behaviour is OInstance.
    `,
 })

 Implementation(`
    If you want to instantiate an object with the bare minimum behaviour use this method.

    You may want such an object to implement a proxy object, for example.
 `)

 Example({
    Description: `
       Creates a new OInstance object.
    `,
    Code: `
       const Classification = require('sirens/src/o-language/classifications/Classification')
       const OInstance = require('sirens/src/o-language/classifications/OInstance')

       const object = Classification.createObject()
       object.isBehavingAs( OInstance )
    `,
 })
*/
    createObject() {
        return MessageDispatcherInstance.createObject()
    }

    /*
 Method(`
    Creates a new object, attachs this classification to it and calls the method initialize(...props) on that created instance.

    Calling this method is the same as doing


        const object = Circle.createObject()

        object.behaveAs( Circle )

        object.initialize()
 `)

 Param({
    Name: `
       ...props
    `,
    Description: `
       Any list of arguments.

       All of the arguments will pass along as they are to the

            initialize(...params)

       method of this classification, if one is defined.
    `,
 })

 Returns({
    Description: `
       A new OInstance object behaving as this classification and initialized with the given arguments.
    `,
 })

 Example({
    Description: `
       Creates a new instance of the classification Circle, initialized with the given radius
    `,
    Code: `
       const Classification = require('sirens/src/o-language/classifications/Classification')

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

       const  circle = Circle.new({ radius: 10 })
       circle.getRadius()
    `,
 })
*/
    new(...props) {
        const newInstance = this.createObject()

        newInstance.behaveAs(this)

        newInstance.initialize( ...props )

        return newInstance
    }

    /// Accessing

    /*
 Method(`
    Returns the name of the classification.
 `)
 Returns({
    Description: `
       A string with the name of this classification.

       The name of the classification is the name of the constructor function passed in

            const AClassification = Classification.define( aClass )

       Thefore the classification will have a name only if the constructor function does.


       For example, this classification does not have a name:

        const AClassification = Classification.define(
            class {
                // ...
            }
        )
    `,
 })

 Example({
    Description: `
       Gets the name of the Circle classification.
    `,
    Code: `

       const Classification = require('sirens/src/o-language/classifications/Classification')

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

       Circle.getName()

    `,
 })
*/
    getName() {
        return MessageDispatcherInstance.classificationGetName({
            classificationObject: this,
        })
    }

    /*
 Method(`
    Returns the classification definition from which this classification was defined.

    The classification definition is where the classification method lookup searches for methods to activate when an object receives
    a message.

    That is, the classification definition is a regular javascript class that has the methods that an object behaving as that classification
    can respond to.
 `)
 Returns({
    Description: `
       The classification definition from which this classifiction was defined.

       The classification definition is a regular javascript class.
    `,
 })

 Example({
    Description: `
       Gets the classification definition of the Circle classification.
    `,
    Code: `
       const Classification = require('sirens/src/o-language/classifications/Classification')

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

       Circle.getClassificationDefinition()
    `,
 })
*/
    getClassificationDefinition() {
        return this.classificationDefinition
    }

    /*
     Method(`
        Private.

        This method makes sure that this Classification definintion has the following properties:

        [
        	instanceVariables,
            	assumes,
            	implements,
            	classificationBehaviours,
            	expects,
        ]

        All of these properties are optional.
        If any of them is missing it creates a default definition.
     `)
    */
    initializeClassificationDefinition(classificationDefinition) {
        MessageDispatcherInstance.classificationDefinitionInitialize({
            classificationDefinition: classificationDefinition,
        })
    }

    /*
 Method(`
    Sets the classification definition from which this classification is defined.

    The classification definition is where the classification method lookup searches for methods to activate when an object receives
    a message.

    That is, the classification definition is a regular javascript class that has the methods that an object behaving as that classification
    can respond to.
 `)

 Implementation(`
    Although it is possible to change the classification definition of a classification after it has been defined by calling this method,
    at the moment it is not recomended to do so.

    The instances behaving as that classification will not be updated with the new classification definition, making instances of the
    same classification to behave differently to the same method call.

    On the other hand, it is possible to use this method to dynamically define classifications on the fly during the execution of a program.
 `)

 Example({
    Description: `
       Dynamically sets the definition of a classification.
    `,
    Code: `
       const Classification = require('sirens/src/o-language/classifications/Classification')

       const classificationObject = Classification.define( class {} )
       classificationObject.setClassificationDefinition( class DynamicClassificationDefinintion {
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
       })
       classificationObject.getClassificationDefinition()
    `,
 })
*/
    setClassificationDefinition(classificationDefinition) {
        this.initializeClassificationDefinition( classificationDefinition )

        this.classificationDefinition = classificationDefinition
    }

    /*
 Method(`
    Returns the names of the methods defined in this classification.
 `)
 Returns({
    Description: `
       Array.
       An array containing all the names of the methods defined in this classification.
    `,
 })

 Example({
    Description: `
       Returns all the method names defined in the Circle classification.
    `,
    Code: `
       const Classification = require('sirens/src/o-language/classifications/Classification')

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

       Circle.getDefinedMethodNames()
    `,
 })
*/
    getDefinedMethodNames() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetDefinedMethodNames({
            classificationDefinition: classificationDefinition,
        })
    }

    /*
     Method(`
        Returns whether this classification defines a method with the given name.
     `)

     Param({
        Name: `
           methodName
        `,
        Description: `
           String.
           The name of the method the classification is asked if it defines it or not.
        `,
     })

     Returns({
        Description: `
           Boolean.
           True if this classification defines the method with the given name.
           False if this classification does not define the method with the given name.
        `,
     })

     Example({
        Description: `
           Asks if the Circle classification defines the methods 'getPosition' and 'getRadius'.
        `,
        Code: `
           const Classification = require('sirens/src/o-language/classifications/Classification')

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

           // Returns false
           Circle.definesMethod( 'getPosition' )

           // Returns true
           Circle.definesMethod( 'getRadius' )
        `,
     })
    */
    definesMethod(methodName) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationDefinesMethod({
            classificationDefinition: classificationDefinition,
            methodName: methodName,
        })
    }

    /*
 Method(`
    Returns the names of the instances variables in this classification.
 `)
 Returns({
    Description: `
       Array.
       An array containing all the names of the instances variables defined in this classification.
    `,
 })

 Example({
    Description: `
       Returns the names of all the instance variables defined in the Circle classification.
    `,
    Code: `

       const Classification = require('sirens/src/o-language/classifications/Classification')

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

       Circle.getDefinedInstanceVariables()

    `,
 })
*/
    getDefinedInstanceVariables() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetDefinedInstanceVariables({
            classificationDefinition: classificationDefinition,
        })
    }

    /*
     Method(`
        Sets the names of the instances variables in this classification.

        This method can be used to dynamically define classifications with instance variables defined programatically.
     `)

     Param({
        Name: `
           instanceVariables
        `,
        Description: `
           Array.
           An array containing all the names of the instances variables defined in this classification.
        `,
     })

     Implementation(`
        This method can be used to dynamically define the instance variables of a classification during its definition.

        However changing the instance variables of a classification after the classification has been instantiated in at least an object
        is currently not recommended since the instantiated objects will not know about the change on the classification definition

        This behaviour may change in the future to make instantiated objects of a classification aware of the changes on its classifications
        definition.
     `)

     Example({
        Description: `
           Dynamically adds instance variables to a classification.
        `,
        Code: `

           const Classification = require('sirens/src/o-language/classifications/Classification')

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



           // Add more instance variables to the existing classification
           Circle.setDefinedInstanceVariables([
            'radius', 'color', 'border'
           ])

           Circle.getDefinedInstanceVariables()

        `,
     })
    */
    setDefinedInstanceVariables(instanceVariables) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationSetDefinedInstanceVariables({
            classificationDefinition: classificationDefinition,
            instanceVariables: instanceVariables,
        })
    }

    /*
     Method(`
        Returns whether this classification defines an instance variable with the given name.
     `)

     Param({
        Name: `
           name
        `,
        Description: `
           String.
           The name of the instance variable the classification is asked if it defines it or not.
        `,
     })

     Example({
        Description: `
           Asks if the Circle classification defines the instance variables named 'radius' and 'color'.
        `,
        Code: `

           const Classification = require('sirens/src/o-language/classifications/Classification')

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

           Circle.definesInstanceVariable( 'color' )

           Circle.definesInstanceVariable( 'radius' )
        `,
     })
    */
    definesInstanceVariable(name) {
        return this.getDefinedInstanceVariables().includes( name ) 
    }

    /*
 Method(`
    Returns the classifications assumed by this  classification.

    Please refer to the ClassificationProtocol description documentation for a detailed description about a classification assumptions.
 `)
 Returns({
    Description: `
       Array.
       An array containing all the classifications assumed by this classification.
    `,
 })

 Example({
    Description: `
       Returns the classifications assumed by the Circle classification.
    `,
    Code: `
       const Classification = require('sirens/src/o-language/classifications/Classification')

       class Shape {
        static definition() {
                this.instanceVariables = ['x', 'y']
            }

        getX() {
            return this.x
        }

        setX(x) {
            this.x = x
        }
        getY() {
            return this.y
        }

        setY(y) {
            this.y = y
        }
       }

       Shape = Classification.define(Shape)

       class Circle {
        static definition() {
                this.instanceVariables = ['radius']
            this.assumes = [ Shape ]
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

       circle.isBehavingAs( Shape )

       circle.setX(1)

       circle.getX()
    `,
 })
*/
    getAssumptions() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetAssumptions({
            classificationDefinition: classificationDefinition,
        })
    }

    /*
 Method(`
    Dynamically sets the classifications assumed by this  classification.

    Please refer to the ClassificationProtocol description documentation for a detailed description about a classification assumptions.
 `)

 Param({
    Name: `
       assumptions
    `,
    Description: `
       Array.
       An array containing all the classifications assumed by this classification.
    `,
 })

 Example({
    Description: `
       Sets the assumptions to the Circle classification.
    `,
    Code: `

       const Classification = require('sirens/src/o-language/classifications/Classification')

       class Shape {
        static definition() {
                this.instanceVariables = ['x', 'y']
            }

        getX() {
            return this.x
        }

        setX(x) {
            this.x = x
        }
        getY() {
            return this.y
        }

        setY(y) {
            this.y = y
        }
       }

       Shape = Classification.define(Shape)

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
       // Try commenting this line to get an error in the code below
       Circle.setAssumptions([ Shape ])

       const circle = Circle.new({ radius: 10 })

       circle.isBehavingAs( Shape )

       circle.setX(1)

       circle.getX()

    `,
 })
*/
    setAssumptions(otherClassifications) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationSetAssumptions({
            classificationDefinition: classificationDefinition,
            assumptions: otherClassifications,
        })

        return this
    }

    /*
 Method(`
    Returns the classifications assumed by this  classification and, recursively, the classifications assumed by this classifications
    assumptions.

    Please refer to the ClassificationProtocol description documentation for a detailed description about a classification assumptions.
 `)
 Returns({
    Description: `
       Array.
       An array with the classifications assumed by this  classification and, recursively, the classifications assumed by this classifications
       assumptions.

       The order in the array is the same as the recursive assumptions are attached to an object.
    `,
 })

 Example({
    Description: `
       Gets the recursive assumptions of the Circle classification.
    `,
    Code: `

       const Classification = require('sirens/src/o-language/classifications/Classification')

       class Shape {
        static definition() {
                this.instanceVariables = ['x', 'y']
            }

        getX() {
            return this.x
        }

        setX(x) {
            this.x = x
        }
        getY() {
            return this.y
        }

        setY(y) {
            this.y = y
        }
       }

       Shape = Classification.define(Shape)

       class Circle {
        static definition() {
                this.instanceVariables = ['radius']
            this.assumes = [ Shape ]
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

       Circle.getRecursiveAssumptions()
    `,
 })
*/
    getRecursiveAssumptions() {
        let allAssumptions = []

        const directAssumptions = this.getAssumptions()

        directAssumptions.forEach( (directAssumption) => {
            const assumptions = directAssumption.getRecursiveAssumptions()

            assumptions.forEach( (eachClassification) => {
                if( ! allAssumptions.includes( eachClassification ) ) {
                    allAssumptions.push( eachClassification )
                }
            })

            if( ! allAssumptions.includes( directAssumption ) ) {
                allAssumptions.push( directAssumption )
            }
        })

        return allAssumptions
    }

    /*
 Method(`
    It is the same as getRecursiveAssumptions but is also includes this classification as its first element.
 `)
 Returns({
    Description: `
       Array.
       An array with the classifications assumed by this  classification and, recursively, the classifications assumed by this classifications
       assumptions plus this classification as its first element.

       The order in the array is the same as the recursive assumptions are attached to an object.
    `,
 })

 Example({
    Description: `
       Gets the assumptions chain of the Circle classification.
    `,
    Code: `

       const Classification = require('sirens/src/o-language/classifications/Classification')

       class Shape {
        static definition() {
                this.instanceVariables = ['x', 'y']
            }

        getX() {
            return this.x
        }

        setX(x) {
            this.x = x
        }
        getY() {
            return this.y
        }

        setY(y) {
            this.y = y
        }
       }

       Shape = Classification.define(Shape)

       class Circle {
        static definition() {
                this.instanceVariables = ['radius']
            this.assumes = [ Shape ]
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

       Circle.getAssumptionsChain()

    `,
 })
*/
    getAssumptionsChain() {
        return this.getRecursiveAssumptions()
                    .concat( [this] )
    }

    /*
     Method(`
        Returns the classificationBehaviours of this Classification.

        The classificationBehaviours are the declared behaviours of this Classification object, not is the instances it creates.

        They are similar to the class side methods, or static methods, of the languages based on clases, except that in the
        O language the methods of a classification object can be defined in different other classifications.
     `)
     Returns({
        Description: `
           Array of Classifications.
           Returns the classificationBehaviours of this Classification.
        `,
     })
    */
    getClassificationBehaviours() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetClassificationBehaviours({
            classificationDefinition: classificationDefinition,
        })
    }

    /*
     Method(`
        Sets the classificationBehaviours of this Classification.

        The classificationBehaviours are the declared behaviours of this Classification object, not is the instances it creates.

        They are similar to the class side methods, or static methods, of the languages based on clases, except that in the
        O language the methods of a classification object can be defined in different other classifications.
     `)

     Param({
        Name: `
           otherClassifications
        `,
        Description: `
           Array of Classifications.
           The classificationBehaviours of this Classification.
        `,
     })
    */
    setClassificationBehaviours(otherClassifications) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationSetClassificationBehaviours({
            classificationDefinition: classificationDefinition,
            classificationBehaviours: otherClassifications,
        })
    }

    /*
     Method(`
        Returns an array with the protocols this classification declares to implement.
     `)
     Returns({
        Description: `
           Array of Protocol.
           An array with the Protocols this classification declares to implement.
        `,
     })
    */
    getImplementedProtocols() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetImplementedClassifications({
            classificationDefinition: classificationDefinition,
        })
    }

    /*
     Method(`
        Sets the array with the protocols this classifications declares to implement.
     `)

     Param({
        Name: `
           protocols
        `,
        Description: `
           The protocols this classifications declares to implement.
        `,
     })
    */
    setImplementedProtocols(protocols) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationSetImplementedClassifications({
            classificationDefinition: classificationDefinition,
            protocols: protocols,
        })
    }

    /*
     Method(`
        Returns an array with the protocols this classification expects to implement.
     `)
     Returns({
        Description: `
           Array of Protocol.
           An array with the Protocols this classification expects to implement.
        `,
     })
    */
    getExpectedProtocols() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetExpectedClassifications({
            classificationDefinition: classificationDefinition,
        })
    }

    /*
     Method(`
        Sets an array with the protocols this classifications expects to implement.
     `)

     Param({
        Name: `
           protocols
        `,
        Description: `
           The protocols this classification expects to implement.
        `,
     })
    */
    setExpectedProtocols(protocols) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationSetExpectedClassifications({
            classificationDefinition: classificationDefinition,
            protocols: protocols,
        })
    }

    /*
 Method(`
    Validates that this classification implements the given protocol.

    If it does not raises an error.
 `)

 Param({
    Name: `
       protocol
    `,
    Description: `
       Protocol.

       A Protocol instance to validate its implementation on this classification.
    `,
 })

 Example({
    Description: `
       Validates that the Circle classification implements the CircleProtocol.
    `,
    Code: `

       const Protocol = require('sirens/src/o-language/classifications/Protocol')
       const Classification = require('sirens/src/o-language/classifications/Classification')

       class CircleProtocol {
        getRadius() {}

        setRadius(radius) {}
       }

       CircleProtocol = Protocol.define(CircleProtocol)

       class Circle {
        static definition() {
                this.instanceVariables = ['radius']
            }

        initialize({ radius: radius }) {
            this.radius = radius
        }

        // Try deleting any of these methods to make the protocol validation to fail.

        getRadius() {
            return this.radius
        }

        setRadius(radius) {
            this.radius = radius
        }
       }

       Circle = Classification.define(Circle)

       Circle.implements({ protocol: CircleProtocol })

    `,
 })
*/
    implements({ protocol: protocol }) {
        protocol.isImplementedBy({
            classification: this
        })

        return this
    }

    /*
     Method(`
        Validates that this classification complies with the given protocol.

        If it does not raises an error.


        The difference between implements({ procotol: protocol }) and compliesWith({ procotol: protocol }) is that implements
        does the actual validation that this Classifications defines each method declared in the protocol while compliesWith
        only checks that this Classification declares that it implements a protocol.

        compliesWith is used during the validation of parameters to quickly validate that an object implements a protocol.
     `)
    */
    compliesWith({ protocol: protocol }) {
        const implementedProtocols = this.getImplementedProtocols()

        return implementedProtocols.some( (implementedProtocol) => {

            const recursiveImplementedProtocols = implementedProtocol.getAssumptionsChain()

            return recursiveImplementedProtocols.some( (implementedProtocol) => {
                return protocol === implementedProtocol
            })
        })
    }
}

module.exports = {Classification, setMessageDispatcher}