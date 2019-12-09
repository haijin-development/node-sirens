const Assertion = require('chai').Assertion

Assertion.addMethod('behaveAs', function (expectedClassification) {
    var targetObject = this._obj;

    this.assert(
        targetObject.isBehavingAs( expectedClassification ),
        "expected #{this} to behave as #{exp}",
        "expected #{this} to not behave as #{exp}",
        expectedClassification,
        targetObject
    )
})