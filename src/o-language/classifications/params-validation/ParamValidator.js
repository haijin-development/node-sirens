const Classification = require('../Classification')
const OInstance = require('../OInstance')
const ParamValidatorProtocol = require('../../protocols/ParamValidatorProtocol')
const Validation = require('./Validation')
const OrValidation = require('./OrValidation')

class ParamValidator {
    /// Definition

    /*
     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['valueToValidate', 'validation', 'methodInfo']
        this.assumes = []
        this.implements = [ParamValidatorProtocol]
    }

    /// Initializing

    setMethodInfo(methodInfo) {
        this.methodInfo = methodInfo
    }

    getMethodInfo() {
        return this.methodInfo
    }

    /*
     Tags([
        'setters', 'public'
     ])
    */
    setValue(value) {
        this.valueToValidate = value
    }

    /// Evaluating

    /*
     Tags([
        'evaluating', 'public'
     ])
    */
    evaluate() {
        this.validation.evaluateOn({ value: this.valueToValidate })
    }

    /// Validations

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isNull() {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            return {
                isValid: value === null,
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected a null value, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    notNull() {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            return {
                isValid: value !== null,
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected a non null value, got null.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isUndefined() {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            return {
                isValid: value === undefined,
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected an undefined value, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    notUndefined() {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            return {
                isValid: value !== undefined,
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected a non undefined value, got undefined.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isBoolean() {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            return {
                isValid: value === true || value === false,
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected a Boolean, got a ${typeof(value)}.` }
            }
        })

        return this        
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isNumber() {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            const type = typeof(value)

            return {
                isValid: type === 'number',
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected a Number, got a ${type}.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isInteger() {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            return {
                isValid: Number.isInteger(value),
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected an Integer, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isString() {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            const type = typeof(value)

            return {
                isValid: type === 'string',
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected a String, got a ${type}.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isArray({ forEachItem: closure } = {}) {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            return {
                isValid: Array.isArray(value),
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected an Array, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isObject() {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            return {
                // typeof(null) is 'object' is js
                isValid: value !== null && typeof(value) === 'object',
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected an Object, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isFunction() {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            return {
                isValid: typeof(value) === 'function',
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected a function, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isAnyOf(values) {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            return {
                isValid: values.includes(value),
                errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} expected any of [${values}] values, got ${value}.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    behavesAs(classification) {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            const isOInstance = OInstance.isOInstance( value )
            const isBehavingAs = isOInstance && value.isBehavingAs(classification)

            return {
                isValid: isBehavingAs,
                errorMessage: () => {
                    if( isOInstance ) {
                        const classificationNames = value.getClassificationNames()

                        return `Expected value to be behaving as a ${classification}, got [${classificationNames}].`
                    } else {
                        return `Expected value to be behaving as a ${classification}, got ${value}.`
                    }
                }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    compliesWith(protocol) {
        this.isExpectedTo( ({ value: value, methodInfo: methodInfo }) => {
            const isOInstance = OInstance.isOInstance( value )
            const compliesWithProtocol = isOInstance && value.compliesWith( protocol )

            return {
                isValid: compliesWithProtocol,
                errorMessage: () => {
                    if( isOInstance ) {
                        const classificationNames = value.getClassificationNames()

                        return `Expected value to comply with ${protocol.getName()}, got [${classificationNames}].`
                    } else {
                        return `Expected value to comply with ${protocol.getName()}, got ${value}.`
                    }
                }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isExpectedTo(closure) {
        const validation = this.newValidation()

        validation.setValidationClosure( closure )

        if( this.validation === undefined ) {
            this.validation = validation
        } else {
            this.validation.setRightValidation( validation )
        }

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    or() {
        const orValidation = this.newOrValidation()

        orValidation.setLeftValidation( this.validation )
        orValidation.setRightValidation( undefined )

        this.validation = orValidation

        return this
    }

    /*
     Tags([
        'creating objects', 'implementation'
     ])
    */
    newValidation() {
        const validation = Validation.new()

        validation.setMethodInfo( this.methodInfo )

        return validation
    }

    /*
     Tags([
        'implementation', 'creating objects'
     ])
    */
    newOrValidation() {
        const validation = OrValidation.new()

        validation.setMethodInfo( this.methodInfo )

        return validation
    }

}

module.exports = Classification.define(ParamValidator)
