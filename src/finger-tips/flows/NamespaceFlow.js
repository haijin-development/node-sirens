const Classification = require('../../O').Classification
const FlowNode = require('./FlowNode')
const FlowWithChildren = require('./FlowWithChildren')

/*
    Class(`
        A NamespaceFlow is a regular flow that defines only commands of type
        CreateObjectCommand.

        A CreateObjectCommand responds to the message

            .new(...params)

        and returns an object.

        A NamespaceFlow is then an implementation of the Factory pattern that can be
        used as a standalone Flow or it can be attached as a child of other Flow.

        When a CreateObjectCommand is added to a NamespaceFlow it creates an accessor
        to simplify the use of the Namespace. For instance

            class CustomNamespace {
                static definition() {
                    this.assumes = [NamespaceFlow]
                }

                buildWith(flow) {
                    flow.main({ id: 'custom-namespace' }, function(thisFlow) {
                        this.createObject({
                            id: 'CustomComponent',
                            with: function() { return CustomComponent.new() }
                        })
                    })
                }
            }
            CustomNamespace = Classification.define(CustomNamespace)

        defines the ObjectCreatorCommand called 'CustomComponent' that can be accessed with

            const namespace = CustomNamespace.new()

            namespace.CustomComponent.new()

        A NamespaceFlow can have other NamespaceFlows as its children, creating a
        tree of namespaces:

            class CustomNamespace {
                static definition() {
                    this.assumes = [NamespaceFlow]
                }

                buildWith(flow) {
                    flow.main({ id: 'custom-namespace' }, function(thisFlow) {
                        this.namespace({ id: 'Component', function() {
                            this.createObject({
                                id: 'CustomComponent',
                                with: function() { return CustomComponent.new() }
                            })    
                        }})

                        this.namespace({ id: 'Model', function() {
                            this.createObject({
                                id: 'CustomModel',
                                with: function() { return CustomModel.new() }
                            })    
                        }})
                    })
                }
            }
            CustomNamespace = Classification.define(CustomNamespace)

        defines

            const namespace = CustomNamespace.new()

            namespace.Component.CustomComponent.new()
            namespace.Model.CustomModel.new()

        It is possible to add a different NamespaceFlow object as a namespace:

            class CustomNamespace {
                static definition() {
                    this.assumes = [NamespaceFlow]
                }

                buildWith(flow) {
                    flow.main({ id: 'custom-namespace', from: ComponentsNamespace.new() })
                    flow.main({ id: 'custom-namespace', from: ModelsNamespace.new() })
                }
            }
            CustomNamespace = Classification.define(CustomNamespace)

            const namespace = CustomNamespace.new()

            namespace.Component.CustomComponent.new()
            namespace.Model.CustomModel.new()


        The execution of the object creation commands goes through the CommandsController
        of the flow just like any other Command would, and the CreateObjectCommands can
        be overriden as well.


        There is one more thing about NamespaceFlows that's worth to mentioning.
        
        This implementation of namespaces is based on objects instead of files
        or classes, meaning that each single object holds a reference to a namespace.

        In that sense it accomplishes a role of a Service Provider pattern and
        is an implementation of a dynamic Depedency Injection.

        When a CreateObjectCommand creates a new object it sets the namespace to
        the object created (if the object created can hold a namespace), propagating the
        namespace and allowing the created object to use the Factory implementation as
        well.

        Therefore setting the main namespace to the top most object (the application) it
        makes the Namespace tree available to all the objects in the program without using
        global variables or even a global namespace (like the name of a class).
    `)
*/
class NamespaceFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FlowNode, FlowWithChildren]
    }

    /*
        Method(`
            Returns a NamespaceFlowBuilder to build this NamespaceFlow using a DSL.
        `)
    */
    newFlowBuilder() {
        const NamespaceFlowBuilder = require('../flow-builders/NamespaceFlowBuilder')
        return NamespaceFlowBuilder.new({ flow: this })
    }
}

module.exports = Classification.define(NamespaceFlow)