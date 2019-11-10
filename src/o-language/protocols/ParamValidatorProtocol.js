const Protocol = require('../classifications/Protocol')

class ParamValidatorProtocol {

    /*
     Tags([
        'public', 'setters'
     ])
    */
    setValue(value) {}


    /*
     Tags([
        'public', 'evaluating'
     ])
    */
    evaluate() {}


    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isNull() {}

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    notNull() {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isUndefined() {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    notUndefined() {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isBoolean() {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isString() {}

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    isInteger() {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isNumber() {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isInteger() {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isArray() {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isObject() {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isFunction() {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isAnyOf(values) {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    compliesWith(procotol) {}

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    isExpectedTo(closure) {}

    /*
     Tags([
        'public', 'dsl'
     ])
    */
    or() {}

}

module.exports = Protocol.define(ParamValidatorProtocol)
