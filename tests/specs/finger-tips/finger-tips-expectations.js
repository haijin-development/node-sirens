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


Assertion.addMethod('toHaveValue', function (expectedValue) {
    var flow = this._obj;

    const value = flow.getValue()

    new Assertion( value ) .to .equal( expectedValue )
})

Assertion.addMethod('toHaveAValueSuchThat', function (valueExpectationClosure) {
    var flow = this._obj;

    const value = flow.getValue()

    valueExpectationClosure( value )
})

Assertion.addMethod('toHaveObject', function (expectedObject) {
    var flow = this._obj;

    const object = flow.getObject()

    new Assertion( object ) .to .equal( expectedObject )
})

Assertion.addMethod('toHaveAnObjectSuchThat', function (valueExpectationClosure) {
    var flow = this._obj;

    const object = flow.getObject()

    valueExpectationClosure( object )
})


Assertion.addMethod('toHaveChoices', function (expectedChoices) {
    var flow = this._obj;

    const choices = flow.getChoices()

    new Assertion( choices ) .to .eql( expectedChoices )
})

Assertion.addMethod('toHaveRoots', function (expectedRoots) {
    var flow = this._obj;

    const roots = flow.getRoots()

    new Assertion( roots ) .to .eql( expectedRoots )
})

Assertion.addMethod('toHaveRootsSuchThat', function (eachRootExpectationClosure) {
    var flow = this._obj;

    const roots = flow.getRoots()

    for( const root of roots ) {
        eachRootExpectationClosure( root )
    }
})

Assertion.addMethod('toHaveSelection', function (expectedSelection) {
    var flow = this._obj;

    const selection = flow.getSelection()

    new Assertion( selection ) .to .eql( expectedSelection )
})

Assertion.addMethod('toHaveASelectionSuchThat', function (selectionExpectationClosure) {
    var flow = this._obj;

    const selection = flow.getSelection()

    selectionExpectationClosure( selection )
})