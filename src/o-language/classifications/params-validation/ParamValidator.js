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
        this.instanceVariables = ['valueToValidate', 'validation']
        this.assumes = []
        this.implements = [ParamValidatorProtocol]
    }

    /// Initializing

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
        this.isExpectedTo( (value) => {
            return {
                isValid: value === null,
                errorMessage: () => { return `Expected a null value, got a ${typeof(value)}.` }
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
        this.isExpectedTo( (value) => {
            return {
                isValid: value !== null,
                errorMessage: () => { return `Expected a non null value, got null.` }
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
        this.isExpectedTo( (value) => {
            return {
                isValid: value === undefined,
                errorMessage: () => { return `Expected an undefined value, got a ${typeof(value)}.` }
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
        this.isExpectedTo( (value) => {
            return {
                isValid: value !== undefined,
                errorMessage: () => { return `Expected a non undefined value, got undefined.` }
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
        this.isExpectedTo( (value) => {
            return {
                isValid: value === true || value === false,
                errorMessage: () => { return `Expected a Boolean, got a ${typeof(value)}.` }
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
        this.isExpectedTo( (value) => {
            const type = typeof(value)

            return {
                isValid: type === 'number',
                errorMessage: () => { return `Expected a Number, got a ${type}.` }
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
        this.isExpectedTo( (value) => {
            return {
                isValid: Number.isInteger(value),
                errorMessage: () => { return `Expected an Integer, got a ${typeof(value)}.` }
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
        this.isExpectedTo( (value) => {
            const type = typeof(value)

            return {
                isValid: type === 'string',
                errorMessage: () => { return `Expected a String, got a ${type}.` }
            }
        })

        return this
    }

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isArray() {
        this.isExpectedTo( (value) => {
            return {
                isValid: Array.isArray(value),
                errorMessage: () => { return `Expected an Array, got a ${typeof(value)}.` }
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
        this.isExpectedTo( (value) => {
            return {
                // typeof(null) is 'object' is js
                isValid: value !== null && typeof(value) === 'object',
                errorMessage: () => { return `Expected an Object, got a ${typeof(value)}.` }
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
        this.isExpectedTo( (value) => {
            return {
                isValid: typeof(value) === 'function',
                errorMessage: () => { return `Expected a function, got a ${typeof(value)}.` }
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
        this.isExpectedTo( (value) => {
            return {
                isValid: values.includes(value),
                errorMessage: () => { return `Expected any of [${values}] values, got ${value}.` }
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
        return Validation.new()
    }

    /*
     Tags([
        'implementation', 'creating objects'
     ])
    */
    newOrValidation() {
        return OrValidation.new()
    }

}

module.exports = Classification.define(ParamValidator)
