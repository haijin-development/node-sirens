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


Assertion.addMethod('haveFileContentsSuchThat', function (contentsClosure) {
    var filePath = this._obj;

    const fileContents = fs.readFileSync(filePath).toString()

    contentsClosure(fileContents)
})