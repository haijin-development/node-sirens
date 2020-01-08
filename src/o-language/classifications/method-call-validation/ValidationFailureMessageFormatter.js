const Classification = require('../Classification')
const AssertionCompiler = require('../assertions/AssertionCompiler')
const {OLanguageError, FailedAssertionError} = require('../Errors')

/*
    Class(`
        This Classification has the methods to format a ValidationFailure
        to a human readable text.
    `)
*/
class ValidationFailureMessageFormatter {
    /// Definition

    /*
        Tags([
            'definition', 'implementation'
        ])
    */
    static definition() {
        this.instanceVariables = ['formattersMap']
    }

    afterInstantiation() {
        this.formattersMap = this.defaultMessagesMap()
    }

    defaultMessagesMap() {
        return new Map([
            [ 'isNull', this.formatIsNull.bind(this) ],
            [ 'isNotNull', this.formatIsNotNull.bind(this) ],
            [ 'isUndefined', this.formatIsUndefined.bind(this) ],
            [ 'isNotUndefined', this.formatIsNotUndefined.bind(this) ],
            [ 'isBoolean', this.formatIsBoolean.bind(this) ],
            [ 'isNumber', this.formatIsNumber.bind(this) ],
            [ 'isInteger', this.formatIsInteger.bind(this) ],
            [ 'isString', this.formatIsString.bind(this) ],
            [ 'isArray', this.formatIsArray.bind(this) ],
            [ 'isObject', this.formatIsObject.bind(this) ],
            [ 'isFunction', this.formatIsFunction.bind(this) ],
            [ 'behavesAs', this.formatBehavesAs.bind(this) ],
            [ 'compliesWith', this.formatCompliesWith.bind(this) ],
            [ 'or', this.formatOr.bind(this) ],
        ])
    }

    /*
        Method(`
            Returns a formatted error message for the given validationFailure.
            Internally this classifications maps the assertion type to a predefined
            closure that does the formatting.
        `)
    */
    formatFailureMessageFor({ methodCallInfo: methodCallInfo, validationFailure: validationFailure }) {
        const assertionId = validationFailure.getFailedValidationId()

        const formatterClosure = this.getFormatterClosureFor({
            validationFailure: validationFailure
        })

        const validatedValue = validationFailure.getValidatedValue()

        const validationData = validationFailure.getValidationData()

        return formatterClosure({
            methodCallInfo: methodCallInfo,
            validatedValue: validatedValue,
            validationData: validationData,
        })
    }

    getFormatterClosureFor({ validationFailure: validationFailure }) {
        const assertionId = validationFailure.getFailedValidationId()

        if( this.formattersMap.has( assertionId ) ) {
            return this.formattersMap.get( assertionId )
        }

        return function({
            methodCallInfo: methodCallInfo,
            validatedValue: validatedValue,
            validationData: validationData,
        }) {
            return `Assertion with id '${assertionId}' failed.`
        }
    }

    getMethodInfoString({ methodCallInfo: methodCallInfo }) {
        return `${methodCallInfo.protocolName}.${methodCallInfo.methodName}`
    }


    formatIsNull({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected a null value, got ${validatedValue}.`
    }

    formatIsNotNull({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected a non null value, got null.`
    }

    formatIsUndefined({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected an undefined value, got ${validatedValue}.`
    }

    formatIsNotUndefined({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected a non undefined value, got undefined.`
    }

    formatIsBoolean({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected a Boolean, got ${validatedValue}.`
    }

    formatIsNumber({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected a Number, got ${validatedValue}.`
    }

    formatIsInteger({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected an Integer, got ${validatedValue}.`
    }

    formatIsString({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected a String, got ${validatedValue}.`
    }

    formatIsArray({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected an Array, got ${validatedValue}.`
    }

    formatIsObject({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected an Object, got ${validatedValue}.`
    }

    formatIsFunction({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        return `Method ${methodCallInfoString} expected a Function, got ${validatedValue}.`
    }

    formatBehavesAs({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        const classification = validationData.classification

        return `Method ${methodCallInfoString} expected value to be behaving as a ${classification.getName()}, got ${validatedValue}.`
    }

    formatCompliesWith({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        const protocol = validationData.protocol

        return `Method ${methodCallInfoString} expected value to comply with ${protocol.getName()}, got ${validatedValue}.`
    }

    formatOr({
        methodCallInfo: methodCallInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodCallInfoString = this.getMethodInfoString({ methodCallInfo: methodCallInfo })

        const protocol = validationData.protocol

        return `Method AProtocol.method validation failed for all the terms in the .or() expression.`
    }
}

module.exports = Classification.define(ValidationFailureMessageFormatter)
