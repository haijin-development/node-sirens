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

Assertion.addProperty('withCommandsController', function () {
    var flow = this._obj;

    const commandsController = flow.getCommandsController()

    return new Assertion( commandsController )
})

Assertion.addProperty('commandsController', function () {
    return this.withCommandsController
})

Assertion.addMethod('aBubbledCommandsCountOf', function (expectedCount) {
    var commandsController = this._obj;

    const receivedCommandsCount = commandsController.receivedCommandsCount()

    this.assert(
        receivedCommandsCount === expectedCount,
        'Expected the commandsController to have received #{exp} commands bubbled, but received #{act}',
        'Expected the commandsController to not have received #{exp} commands bubbled, but received #{act}',
    )
})

Assertion.addMethod('aBubbledCommandAt', function (commandIndex) {
    var commandsController = this._obj;

    const index = commandIndex.index

    const receivedCommand = commandsController.receivedCommandAt({ index: index })

    return new Assertion( receivedCommand )
})

/////////////////////////////
// haveFlowChildren
/////////////////////////////

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

Assertion.addMethod('childFlow', function ({ id: childFlowId }) {
    var flow = this._obj;

    const childFlow = flow.getChildFlow({ id: childFlowId })

    return new Assertion( childFlow )
})


Assertion.addProperty('withValue', function (expectedValue) {
    var flow = this._obj;

    const value = flow.getValue()

    return new Assertion( value )
})

Assertion.addMethod('haveValue', function (expectedValue) {
    this.withValue .to .equal( expectedValue )
})

Assertion.addProperty('withObject', function (expectedValue) {
    var flow = this._obj;

    const object = flow.getObject()

    return new Assertion( object )
})


Assertion.addMethod('haveObject', function (expectedObject) {
    this.withObject .to .equal( expectedObject )
})

Assertion.addProperty('withChoices', function () {
    var flow = this._obj;

    const choices = flow.getChoices()

    return new Assertion( choices )
})

Assertion.addMethod('haveChoices', function (expectedChoices) {
    this.withChoices .to .eql( expectedChoices )
})

Assertion.addProperty('withRoots', function () {
    var flow = this._obj;

    const roots = flow.getRoots()

    return new Assertion( roots )
})

Assertion.addMethod('haveRoots', function (expectedRoots) {
    this.withRoots .to .eql( expectedRoots )
})

Assertion.addProperty('withSelection', function () {
    var flow = this._obj;

    const selection = flow.getSelection()

    return new Assertion( selection )
})

Assertion.addMethod('haveSelection', function (expectedSelection) {
    this.withSelection .to .eql( expectedSelection )
})