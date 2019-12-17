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

Assertion.addMethod('haveAsCommandsControllerA', function (
    expectedClassification, failedExpectationMessage, negFailedExpectationMessage
) {
    var flow = this._obj;

    const commandsController = flow.getCommandsController()

    if( failedExpectationMessage === undefined ) {
        failedExpectationMessage = "expected the flow #{this} to have a controller #{exp}, got #{act}"
    }

    if( negFailedExpectationMessage === undefined ) {
        negFailedExpectationMessage = "expected the flow #{this} not to have a controller #{exp}, got #{act}"
    }

    new Assertion( commandsController ) .to
        .behaveAs( expectedClassification, failedExpectationMessage, negFailedExpectationMessage )

})

Assertion.addMethod('haveAsCommandsControllerAn', function (
    expectedClassification, failedExpectationMessage, negFailedExpectationMessage
) {
    new Assertion( this._obj ).to
        .haveAsCommandsControllerA(expectedClassification, failedExpectationMessage, negFailedExpectationMessage)
})


/////////////////////////////
// haveFlowChildren
/////////////////////////////

Assertion.addMethod('toBeSuchThat', function (flowExpectationClosure) {
    var flow = this._obj;

    flowExpectationClosure( flow )
})

Assertion.addMethod('haveChildFlows', function (
    expectedChildFlowIds, failedExpectationMessage, negFailedExpectationMessage
) {
    var flow = this._obj;

    const ids = []

     flow.allChildFlowsDo( (childFlow) => {
        ids.push( childFlow.getIdPath() )
     })

     expectedChildFlowIds.sort()
     ids.sort()

    if( failedExpectationMessage === undefined ) {
        failedExpectationMessage = 'expected flow #{this} to have children with ids #{exp}, got #{act}'
    }

    if( negFailedExpectationMessage === undefined ) {
        negFailedExpectationMessage = 'expected flow #{this} to not have children with ids #{exp}, got #{act}'
    }

    new Assertion( ids, failedExpectationMessage, negFailedExpectationMessage ).to
        .eql(expectedChildFlowIds)
})


Assertion.addMethod('toHaveValue', function (
    expectedValue, failedExpectationMessage, negFailedExpectationMessage
) {
    var flow = this._obj;

    const value = flow.getValue()

    if( failedExpectationMessage === undefined ) {
        failedExpectationMessage = 'expected flow #{this} to have the value #{exp}, got #{act}'
    }

    if( negFailedExpectationMessage === undefined ) {
        negFailedExpectationMessage = 'expected flow #{this} to not have the value #{exp}, got #{act}'
    }

    this.assert(
        value === expectedValue,
        failedExpectationMessage,
        negFailedExpectationMessage,
    )
})

Assertion.addMethod('toHaveAValueSuchThat', function (valueExpectationClosure) {
    var flow = this._obj;

    const value = flow.getValue()

    valueExpectationClosure( value )
})

Assertion.addMethod('toHaveObject', function (
    expectedObject, failedExpectationMessage, negFailedExpectationMessage
) {
    var flow = this._obj;

    const object = flow.getObject()

    if( failedExpectationMessage === undefined ) {
        failedExpectationMessage = 'expected flow #{this} to have the object #{exp}, got #{act}'
    }

    if( negFailedExpectationMessage === undefined ) {
        negFailedExpectationMessage = 'expected flow #{this} to not have the object #{exp}, got #{act}'
    }

    this.assert(
        object === expectedObject,
        failedExpectationMessage,
        negFailedExpectationMessage,
    )
})

Assertion.addMethod('toHaveAnObjectSuchThat', function (valueExpectationClosure) {
    var flow = this._obj;

    const object = flow.getObject()

    valueExpectationClosure( object )
})


Assertion.addMethod('toHaveChoices', function (
    expectedChoices, failedExpectationMessage, negFailedExpectationMessage
) {
    var flow = this._obj;

    const choices = flow.getChoices()

    if( failedExpectationMessage === undefined ) {
        failedExpectationMessage = 'expected flow #{this} to have the choices #{exp}, got #{act}'
    }

    if( negFailedExpectationMessage === undefined ) {
        negFailedExpectationMessage = 'expected flow #{this} to not have the choices #{exp}, got #{act}'
    }

    new Assertion( choices ) .to .eql(
        expectedChoices,
        failedExpectationMessage,
        negFailedExpectationMessage
    )
})

Assertion.addMethod('toHaveChoicesSuchThat', function (choicesExpectationClosure) {
    var flow = this._obj;

    const choices = flow.getChoices()

    choicesExpectationClosure( choices )
})

Assertion.addMethod('withEachChoiceSuchThat', function (eachChoiceExpectationClosure) {
    var flow = this._obj;

    const choices = flow.getChoices()

    for( const eachChoice of choices ) {
        eachRootExpectationClosure( eachChoice )
    }
})

Assertion.addMethod('toHaveRoots', function (
    expectedRoots, failedExpectationMessage, negFailedExpectationMessage
) {
    var flow = this._obj;

    const roots = flow.getRoots()

    if( failedExpectationMessage === undefined ) {
        failedExpectationMessage = 'expected flow #{this} to have the roots #{exp}, got #{act}'
    }

    if( negFailedExpectationMessage === undefined ) {
        negFailedExpectationMessage = 'expected flow #{this} to not have the roots #{exp}, got #{act}'
    }

    new Assertion( roots ) .to .eql(
        expectedRoots,
        failedExpectationMessage,
        negFailedExpectationMessage
    )
})

Assertion.addMethod('toHaveRootsSuchThat', function (rootsExpectationClosure) {
    var flow = this._obj;

    const roots = flow.getRoots()

    rootsExpectationClosure( roots )
})

Assertion.addMethod('withEachRootSuchThat', function (eachRootExpectationClosure) {
    var flow = this._obj;

    const roots = flow.getRoots()

    for( const root of roots ) {
        eachRootExpectationClosure( root )
    }
})

Assertion.addMethod('toHaveSelection', function (
    expectedSelection, failedExpectationMessage, negFailedExpectationMessage
) {
    var flow = this._obj;

    const selection = flow.getSelection()

    if( failedExpectationMessage === undefined ) {
        failedExpectationMessage = 'expected flow #{this} to have the selection #{exp}, got #{act}'
    }

    if( negFailedExpectationMessage === undefined ) {
        negFailedExpectationMessage = 'expected flow #{this} to not have the selection #{exp}, got #{act}'
    }

    this.assert(
        selection === expectedSelection,
        failedExpectationMessage,
        negFailedExpectationMessage,
    )
})

Assertion.addMethod('toHaveASelectionSuchThat', function (selectionExpectationClosure) {
    var flow = this._obj;

    const selection = flow.getSelection()

    selectionExpectationClosure( selection )
})