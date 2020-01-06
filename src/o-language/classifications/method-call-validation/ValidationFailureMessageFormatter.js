const Classification = require('../Classification')
const AssertionCompiler = require('../assertions/AssertionCompiler')
const {FailedAssertionError} = require('../Errors')

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
    formatFailureMessageFor({ methodInfo: methodInfo, validationFailure: validationFailure }) {
        const assertionId = validationFailure.getFailedValidationId()

        const formatterClosure = this.getFormatterClosureFor({
            validationFailure: validationFailure
        })

        const validatedValue = validationFailure.getValidatedValue()

        const validationData = validationFailure.getValidationData()

        return formatterClosure({
            methodInfo: methodInfo,
            validatedValue: validatedValue,
            validationData: validationData,
        })
    }

    getFormatterClosureFor({ validationFailure: validationFailure }) {
        const assertionId = validationFailure.getFailedValidationId()

        if( this.formattersMap.has( assertionId ) ) {
            return this.formattersMap.get( assertionId )
        }

        throw new OLanguageError(`Unkown validation id '${assertionId}'`)
    }

    getMethodInfoString({ methodInfo: methodInfo }) {
        return `${methodInfo.protocolName}.${methodInfo.methodName}`
    }


    formatIsNull({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected a null value, got ${validatedValue}.`
    }

    formatIsNotNull({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected a non null value, got null.`
    }

    formatIsUndefined({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected an undefined value, got ${validatedValue}.`
    }

    formatIsNotUndefined({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected a non undefined value, got undefined.`
    }

    formatIsBoolean({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected a Boolean, got ${validatedValue}.`
    }

    formatIsNumber({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected a Number, got ${validatedValue}.`
    }

    formatIsInteger({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected an Integer, got ${validatedValue}.`
    }

    formatIsString({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected a String, got ${validatedValue}.`
    }

    formatIsArray({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected an Array, got ${validatedValue}.`
    }

    formatIsObject({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected an Object, got ${validatedValue}.`
    }

    formatIsFunction({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        return `Method ${methodInfoString} expected a Function, got ${validatedValue}.`
    }

    formatBehavesAs({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        const classification = validationData.classification

        return `Method ${methodInfoString} expected value to be behaving as a ${classification.getName()}, got ${validatedValue}.`
    }

    formatCompliesWith({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        const protocol = validationData.protocol

        return `Method ${methodInfoString} expected value to comply with ${protocol.getName()}, got ${validatedValue}.`
    }

    formatOr({
        methodInfo: methodInfo, validatedValue: validatedValue, validationData: validationData
    }) {
        const methodInfoString = this.getMethodInfoString({ methodInfo: methodInfo })

        const protocol = validationData.protocol

        return `Method AProtocol.method validation failed for all the terms in the .or() expression.`
    }
}

module.exports = Classification.define(ValidationFailureMessageFormatter)
