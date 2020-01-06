const Classification = require('../../O').Classification

/*
 Class(`
    A NodeFlowBuilder defines and implements the DSL to build a NodeFlow.

    This classification does not have the protocol to build complex flows by itself but
    more specific classifications should be added depending on the wanted type of Flow, like NamespaceFlowBuilder,
    FlowBuilder, StatefulFlowBuilder, etc.
 `)
*/
class NodeFlowBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['rootFlow']
    }

    /*
        Method(`
            Initializes the builder on the given rootFlow, meaning that the flows the
            builder creates will be added as children of the given rootFlow.
        `)
    */
    initialize({ flow: rootFlow }) {
        this.rootFlow = rootFlow
    }

    getRootFlow() {
        return this.rootFlow
    }

    /// Evaluating

    /*
        Method(`
            Evaluates the given closure passing along the given params: (or the
            single param:) as its parameters.

            The params are optional, if neither a param: nor a params: argument is
            given the closure will receive no parameters.

            This method changes the binding of the given closure to this builder object,
            meaning that within the closure body 'this' will refer to this builder object
            and not to the object in the outer scope of the closure body.

            See the implementation note for more details.
        `)

        Implementation(`
            Changing the binding of 'this' pseudovariable in a closure is discouraged.

            However in this case, and is some other cases of DSL implementations,
            the alternatives are using global symbols or forcing a explicit require(...)
            of each building block a builder uses, like most of the testing frameworks do.

            In the tests frameworks that design decision works pretty well because
            tests are usually run in a different context than the application and, for
            example, using global symbols like 'describe' and 'it' rarely collide with
            other global names.

            In the case of this DSL the design decision is to change the binding of the
            given closure for the possibilities it offers to the developer, like dynamically
            overriding the building methods and adding new ones, over the confusing
            semantics of the binding change.
        `)
    */
    evaluate({ closure: closure, with: param, withAll: params }) {
        if( param !== undefined ) { params = [param] }
        if( params === undefined ) { params = [] }

        closure.call( this, ...params )
    }

    /// Building

    /*
        Method(`
            Sets the given commandsController to the rootFlow.
        `)
    */
    setCommandsController(commandsController) {
        this.rootFlow.setCommandsController( commandsController )
    }

    /*
        Method(`
            Set the id of the rootFlow and builds the rootFlow from the given closure.

            The closure is optional.
        `)
    */
    main({ id: id }, closure) {
        if( id === undefined ) { throw new Error(`The main flow id must be defined.`) }

        this.rootFlow.setId({ id: id, idPath: id })

        if( closure != undefined ) {
            this.evaluate({ closure: closure, with: this.rootFlow })
        }
    }
}

module.exports = Classification.define(NodeFlowBuilder)