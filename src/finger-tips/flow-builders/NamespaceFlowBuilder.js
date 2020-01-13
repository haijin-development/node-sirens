const Classification = require('../../O').Classification
const NodeFlowBuilder = require('./NodeFlowBuilder')
const OInstance = require('../../O').OInstance
const CreateObjectCommand = require('../commands/CreateObjectCommand')
const NamespaceFlow = require('../flows/NamespaceFlow')
const FolderPath = require('../../O').FolderPath

/*
 Class(`
    A NamespaceFlowBuilder defines a DSL to build a NamespaceFlow.

    A NamespaceFlow is a Flow to define a particular type of command
    called CreateObjectCommand that is called with

            aCommand.new(...)

    and returns an object.

    A NamespaceFlow can replace the use of class names, which is a global, static symbol,

            SomeObject.new(...)

    or

            new SomeObject(...)

    with a call to a NamespaceFlow command:

            namespace.SomeObject.new()

    The sintax is similar and fluent but it uses a Command which allows to
    override it, trace it, nest it with child namespaces and the rest of
    the things that can be done with a Flow. 
 `)
*/
class NamespaceFlowBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['rootFlow']
        this.assumes = [NodeFlowBuilder]
    }

    /*
        Method(`
            A CreateObjectCommand is used to create objects using the given
            createObjectClosure.

            Using a CreateObjectCommand

                const createAClassificationCommand = CreateObjectCommand.new({
                    id: 'AClassification',
                    actionHandlerClosure: () => { AClassification.new() }
                })
    
                createObjectCommand.new()

            instead of calling the method

                    AClassification.new()

            allows the ascedant nodes to override and customize the creation of the 
            object just like with any other Command in the Flow tree.

            To make a fluent DSL this method also creates an unclassified object property
            on the main flow named with the given objectCreatorName.

            This allows the use

                mainFlow.AClassification.new(...)

            and if the mainFlow is renamed to 'namespace' then

                namespace.AClassification.new(...)

            which allows to use Flows to implement namespaces to create
            objects with a fluent idiom.

            These namespaces can be nested and overriden by the main flow just like
            any other Command in the Flow tree, for example


                application.FingerTips.Models.ValueModel.new(...)
                application.Compilers.JsCompiler.new(...)
                application.HtmlComponents.ListComponent.new(...)
        `)

        Tags([
            'dsl'
        ])
    */
    createObject({
        id: objectCreatorName, with: createObjectClosure, inNamespace: namespace,
    }) {
        if( objectCreatorName === undefined ) { throw new Error(`The id must be defined.`) }

        const thisFlow = this.getRootFlow()

        const createObjectCommand = CreateObjectCommand.new({
            id: objectCreatorName,
            actionHandlerClosure: function(...props) {
                const newObject = createObjectClosure(...props)

                if( OInstance.isOInstance( newObject ) && newObject.respondsTo('setNamespace') )
                {
                    if( namespace === undefined ) {
                        namespace = thisFlow
                    }

                    newObject.setNamespace( namespace )
                }

                return newObject
            },
        })

        this.getRootFlow().addChildFlow({
            id: objectCreatorName,
            flow: createObjectCommand,
        })

        this.getRootFlow().defineNamespaceAccessor({
            accessor: objectCreatorName,
            value: createObjectCommand,
        })
    }

    createSingletonObject({
        id: objectCreatorName, singletonCreator: singletonCreatorClosure, inNamespace: namespace
    }) {
        if( objectCreatorName === undefined ) { throw new Error(`The id must be defined.`) }

        const thisFlow = this.getRootFlow()

        const createObjectCommand = CreateObjectCommand.new({
            id: objectCreatorName,
            actionHandlerClosure: null,
        })

        createObjectCommand.setActionHandlerClosure( function(...props) {
            const singleton = this.getSingleton()

            if( singleton !== undefined ) { return singleton }

            const newObject = singletonCreatorClosure(...props)

            if( OInstance.isOInstance( newObject ) && newObject.respondsTo('setNamespace') )
            {
                if( namespace === undefined ) {
                    namespace = thisFlow
                }

                newObject.setNamespace( namespace )
            }
        
            this.setSingleton( newObject )

            return newObject

        }.bind(createObjectCommand) )

        this.getRootFlow().addChildFlow({
            id: objectCreatorName,
            flow: createObjectCommand,
        })

        this.getRootFlow().defineNamespaceAccessor({
            accessor: objectCreatorName,
            value: createObjectCommand,
        })
    }

    /*
        Method(`
            A group is just a category to gather related commands.
            Defining object creators within a .group() does not change the NamespaceFlow.
        `)

        Tags([
            'dsl'
        ])
    */
    group({ id: groupId }, closure) {
        closure.call(this)
    }

    /*
        Method(`
            Creates a new NamespaceFlow as a child of the main flow.

            The nested NamespaceFlow can be created from two different forms:

            - using another NamespaceFlow object:

                    this.namespace({
                        id: 'Components',
                        from: ApplicationComponentsFlow.new(),
                    })

            or

            - using a closure:

                    this.namespace({ id: 'Components' }, function() {
                        this.createObject( ... )

                        this.createObject( ... )

                        this.createObject( ... )
                    })
        `)

        Tags([
            'dsl'
        ])
    */
    namespace({ id: nestedNamespaceId, from: anotherNamespaceFlow }, closure) {
        if( nestedNamespaceId === undefined ) { throw new Error(`The id must be defined.`) }

        if( closure !== undefined ) {
            anotherNamespaceFlow = NamespaceFlow.new()

            anotherNamespaceFlow.build( closure )
        }

        this.getRootFlow().addChildNamespaceFlow({
            id: nestedNamespaceId,
            namespaceFlow: anotherNamespaceFlow
        })
    }

    /*
        Method(`
            Takes a method defined in the Flow class and converts it to a flow Command.

            Conceptually the method is replaced with a CreateObjectCommand object

                Flow.method = CreateObjectCommand.new({
                    id: methodName,
                    actionHandler: Flow.method,
                })

            and can still be called like a regular method

                    flow.someMethod(...params)

            but internally the method call does something along the lines of

                    flow.executeCommand({
                        id: 'someMethod',
                        withAll: params,
                    })

            The replacement implementation is not that straight forward and has its
            complexity (although it is possible that the current implementation could
            be rewriten to simplify it) but comes with the following advantages:

            - The flow method is defined like any other method, making the command
              definition transparent to the developer and to the development tools
              like IDEs.

            - The flow method can be overriden like any other flow Command by a parent
              flow. In a CreateObjectCommand an override can be used to implement a Factory
              or a Depedency Injection pattern since the main application can replace
              the creation of an object with a custom class definition without using
              globals.

            - The flow method can be called using the bubbling up mechanism from
              a child flow. This is useful to access objects with a fluent declaration
              like if they were in the global scope but without breaking the
              encapsulation of the parent flow nor exposing the object in a global scope.
              For example:

                        MainNamespace
                            ModelsNamespace
                            ComponentsNamespace

              Using global symbols it is posibble to write

                    class AComponent {
                        aMethod() {
                            SomeModel.new() // SomeModel is a global symbol
                        }
                    }

              Writing

                SomeModel.new()

              has many advantages: it is a readable, expressive and declarative
              statement.

              With the use of the bubbling up mechanism it possible to accomplish
              almost the same without the use of a global symbol even if ModelsNamespace
              and ComponentsNamespace are independent from each other:

                    class AComponent {
                        aMethod() {
                            // modelNamespace object request is bubbled up and resolved in the MainNamespace
                            const modelsNamespace = this.bubbleUp({ command: 'modelsNamespace' })

                            modelsNamespace.SomeModel.new()
                        }
                    }

            - The flow method goes through the CommandsController during its execution.

            On the other hand, making an explicit call to define which methods should
            be converted to Commands instead of converting all methods in the flow class
            or statically tagging the method allows the developer to dynamically choose
            which methods to become Commands and which ones not based on the current
            state of the flow.
            The same method can become a Command in some conditions and stay as an
            implementation method in others.
        `)

        Tags([
            'dsl'
        ])
    */
    createObjectCommandsFromMethods({ methods: methods, inNamespace: namespace }) {
        for( const eachMethod of methods ) {
            this.createObjectCommandFromMethod({
                method: eachMethod,
                inNamespace: namespace
            })
        }
    }

    createObjectCommandFromMethod({ method: methodName, inNamespace: namespace }) {
        if( namespace === undefined ) { namespace = this.getRootFlow() }

        const targetFlow = this.getRootFlow()

        const method = targetFlow[methodName]

        this.createObject({
            id: methodName,
            with: method.bind(targetFlow),
            inNamespace: namespace,
        })

    }

    /*
        Method(`
            Reads the contents of the given folders and for each javascript file
            creates a CreateObjectCommand with the default export of the file.
        `)

        Implementation(`
            Experimental.
        `)
    */
    createObjectCommandsFromFilesIn({ folders: folders, inNamespace: namespace }) {
        if( namespace === undefined ) { namespace = this.getRootFlow() }

        for( const folder of folders ) {
            const folderPath = FolderPath.new({ path: folder })

            folderPath.allFilesDo( (eachFilePath) => {
                const classificationName = eachFilePath.getFileName({ withExtension: false })
                const classification = require( eachFilePath.getPath() )

                this.createObject({
                    id: classificationName,
                    with: function(...params) { return classification.new(...params) },
                    inNamespace: namespace,
                })
            })
        }
    }
}

module.exports = Classification.define(NamespaceFlowBuilder)