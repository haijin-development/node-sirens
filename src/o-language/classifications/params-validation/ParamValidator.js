const Classification = require('../Classification')
const OInstance = require('../OInstance')
const ParamValidatorProtocol = require('../../protocols/ParamValidatorProtocol')
const Validation = require('./Validation')
const OrValidation = require('./OrValidation')

class ParamValidator {
    /// Definition

    static definition() {
        this.instanceVariables = ['valueToValidate', 'validation']
        this.assumes = []
        this.implements = [ParamValidatorProtocol]
    }

    /// Initializing

    setValue(value) {
        this.valueToValidate = value
    }

    /// Evaluating

    evaluate() {
        this.validation.evaluateOn({ value: this.valueToValidate })
    }

    /// Validations

    isNull() {
        this.isExpectedTo( (value) => {
            return {
                isValid: value === null,
                errorMessage: () => { return `Expected a null value, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    notNull() {
        this.isExpectedTo( (value) => {
            return {
                isValid: value !== null,
                errorMessage: () => { return `Expected a non null value, got null.` }
            }
        })

        return this
    }

    isUndefined() {
        this.isExpectedTo( (value) => {
            return {
                isValid: value === undefined,
                errorMessage: () => { return `Expected an undefined value, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    notUndefined() {
        this.isExpectedTo( (value) => {
            return {
                isValid: value !== undefined,
                errorMessage: () => { return `Expected a non undefined value, got undefined.` }
            }
        })

        return this
    }

    isBoolean() {
        this.isExpectedTo( (value) => {
            return {
                isValid: value === true || value === false,
                errorMessage: () => { return `Expected a Boolean, got a ${typeof(value)}.` }
            }
        })

        return this        
    }

    isNumber() {
        this.isExpectedTo( (value) => {
            const type = typeof(value)

            return {
                isValid: type === 'number',
                errorMessage: () => { return `Expected a Number, got a ${type}.` }
            }
        })

        return this
    }

    isInteger() {
        this.isExpectedTo( (value) => {
            return {
                isValid: Number.isInteger(value),
                errorMessage: () => { return `Expected an Integer, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    isString() {
        this.isExpectedTo( (value) => {
            const type = typeof(value)

            return {
                isValid: type === 'string',
                errorMessage: () => { return `Expected a String, got a ${type}.` }
            }
        })

        return this
    }

    isArray() {
        this.isExpectedTo( (value) => {
            return {
                isValid: Array.isArray(value),
                errorMessage: () => { return `Expected an Array, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    isObject() {
        this.isExpectedTo( (value) => {
            return {
                // typeof(null) is 'object' is js
                isValid: value !== null && typeof(value) === 'object',
                errorMessage: () => { return `Expected an Object, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    isFunction() {
        this.isExpectedTo( (value) => {
            return {
                isValid: typeof(value) === 'function',
                errorMessage: () => { return `Expected a function, got a ${typeof(value)}.` }
            }
        })

        return this
    }

    isAnyOf(values) {
        this.isExpectedTo( (value) => {
            return {
                isValid: values.includes(value),
                errorMessage: () => { return `Expected any of [${values}] values, got ${value}.` }
            }
        })

        return this
    }

    compliesWith(protocol) {
        this.isExpectedTo( (value) => {
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

    isExpectedTo(closure) {
        this.validation = this.newValidation()

        this.validation.setValidationClosure( closure )

        return this
    }

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

    or() {
        const orValidation = this.newOrValidation()

        orValidation.setLeftValidation( this.validation )
        orValidation.setRightValidation( undefined )

        this.validation = orValidation

        return this
    }

    newValidation() {
        return Validation.new()
    }

    newOrValidation() {
        return OrValidation.new()
    }

}

module.exports = Classification.define(ParamValidator)
