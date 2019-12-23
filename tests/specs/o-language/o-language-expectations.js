const Assertion = require('chai').Assertion
const fs = require('fs')

Assertion.addMethod('behaveAs', function (expectedClassification, failedExpectationMessage, negFailedExpectationMessage) {
    var targetObject = this._obj;

    const assertionPassed = typeof(expectedClassification) === 'string' ?
        targetObject.getClassificationNames().includes( expectedClassification )
        :
        targetObject.isBehavingAs( expectedClassification )

    if( failedExpectationMessage === undefined ) {
        failedExpectationMessage = "expected #{this} to behave as #{exp}"
    }

    if( negFailedExpectationMessage === undefined ) {
        negFailedExpectationMessage = "expected #{this} to not behave as #{exp}"
    }

    this.assert(
        assertionPassed,
        failedExpectationMessage,
        negFailedExpectationMessage,
        expectedClassification.toString(),
        targetObject.toString()
    )
})


// Files

Assertion.addProperty('withFileContents', function () {
    var filePath = this._obj;

    const fileContents = fs.readFileSync(filePath).toString()

    return new Assertion( fileContents )
})

// Generic

Assertion.addProperty('haveReceived', function () {
    return this
})

Assertion.addMethod('beSuchThat', function (expectationClosure) {
    var targetObject = this._obj;

    expectationClosure(targetObject)
})

Assertion.addMethod('suchThat', function (expectationClosure) {
    return this.beSuchThat( expectationClosure )
})

Assertion.addMethod('eachSuchThat', function (eachItemExpectationClosure) {
    var items = this._obj;

    for( const eachItem of items ) {
        eachItemExpectationClosure( eachItem )
    }
})

