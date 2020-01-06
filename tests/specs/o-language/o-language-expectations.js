const Assertion = require('chai').Assertion
const assert = require('chai').assert
const OInstance = require('../../../src/O').OInstance
const FilePath = require('../../../src/O').FilePath

// Classifications

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

Assertion.addProperty('oInstance', function () {
    var object = this._obj;

    this.assert(
        OInstance.isOInstance( object ),
        'Expected the object #{act} to be an OInstance',
        'Expected the object #{act} not to be an OInstance',
    )
})

// Files

Assertion.addProperty('withFileContents', function () {
    var filePath = this._obj;

    const fileContents = FilePath.new({ path: filePath }).readFileContents()

    return new Assertion( fileContents )
})

// Arrays

Assertion.addProperty('count', function () {
    var array = this._obj;

    return new Assertion( array.length )
})

Assertion.addMethod('atIndex', function (index) {
    var array = this._obj;

    return new Assertion( array[index] )
})

Assertion.addMethod('eachSuchThat', function (eachItemExpectationClosure) {
    var items = this._obj;

    for( const eachItem of items ) {
        eachItemExpectationClosure( eachItem )
    }
})

// Exceptions

Assertion.addMethod('raise', function ({
    error: errorType, withMessage: expectedMessage, suchThat: errorExpectationClosure
}) {
    var closure = this._obj;

    let catchedError = null

    try {
        const result = closure()
    } catch( error ) {
        catchedError = error
    }

    if( catchedError === null ) {
        const errorName = errorType.name

        const error = ['a', 'e', 'i', 'o', 'u'].includes( errorName[0].toLowerCase() ) ?
            'an ' + errorName
            :
            'a ' + errorName 

        assert.fail(`Expected the closure to throw ${error} but nothing was thrown.`)
    }

    if( ! catchedError instanceof( errorType ) ) {
        throw error
    }

    if( errorExpectationClosure !== undefined ) {
        errorExpectationClosure(catchedError)
    }

    if( expectedMessage !== undefined && expectedMessage !== catchedError.message ) {
        assert.fail(
            `Expected the error to have the message '${expectedMessage}', got '${catchedError.message}'`
        )
    }
})


// Generic

Assertion.addProperty('haveReceived', function () {
    return this
})

Assertion.addMethod('suchThat', function (expectationClosure) {
    var targetObject = this._obj;

    expectationClosure(targetObject)
})