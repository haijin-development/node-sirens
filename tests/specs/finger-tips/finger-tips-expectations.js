const Assertion = require('chai').Assertion

Assertion.addMethod('withId', function (flowId) {
    let flow = this._obj

    const ids = flowId.split('.').slice( 1 )

    if( ids.length !== 0 ) {
        flow = flow.getChildFlow({ id: ids.join('.') })
    } 

    return new Assertion( flow )
})

/////////////////////////////
// haveAsCommandsControllerA
/////////////////////////////

Assertion.addMethod('haveAsCommandsControllerA', function (expectedClassification) {
    var flow = this._obj;

    const commandsController = flow.getCommandsController()

    this.assert(
        commandsController.isBehavingAs( expectedClassification ),
        "expected #{this} to behave as #{exp}",
        "expected #{this} to not behave as #{exp}",
        expectedClassification,
        commandsController
    )
})

Assertion.addMethod('haveAsCommandsControllerAn', function (expectedClassification) {
    new Assertion( this._obj ).to .haveAsCommandsControllerA(expectedClassification)
})


/////////////////////////////
// haveFlowChildren
/////////////////////////////

Assertion.addMethod('haveChildFlows', function (expectedChildFlowIds) {
    var flow = this._obj;

    const ids = []

     flow.allChildFlowsDo( (childFlow) => {
        ids.push( childFlow.getIdPath() )
     })

     expectedChildFlowIds.sort()
     ids.sort()

    new Assertion( ids, 'expected flow #{this} to have children with ids #{exp}' ).to
        .have .members(expectedChildFlowIds)
})


Assertion.addMethod('toHaveAValueSuchThat', function (valueExpectationClosure) {
    var flow = this._obj;

    const value = flow.getValue()

    valueExpectationClosure( value )
})

Assertion.addMethod('toHaveAnObjectSuchThat', function (valueExpectationClosure) {
    var flow = this._obj;

    const object = flow.getObject()

    valueExpectationClosure( object )
})


Assertion.addMethod('toHaveRootsSuchThat', function (rootsExpectationClosure) {
    var flow = this._obj;

    const roots = flow.getRoots()

    for( const root of roots ) {
        rootsExpectationClosure( root )
    }
})