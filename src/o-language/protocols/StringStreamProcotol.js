const Protocol = require('../classifications/Protocol')

class StringStreamProcotol {
    /// Accessing

    getString() {}

    getCrChar() {}

    setCrChar(char) {
        this.param(char) .isString()
    }

    /// Concatenating

    append({ string: string, if: condition }) {
        this.param(string) .isString()
        this.param(condition) .isUndefined() .or() .isBoolean()
    }

    prepend({ string: string, if: condition }) {
        this.param(string) .isString()
        this.param(condition) .isUndefined() .or() .isBoolean()
    }

    cr({ if: condition } = { if: true }) {
        this.param(condition) .isUndefined() .or() .isBoolean()
    }

    appendLine({ string: lineString, if: condition }) {
        this.param(lineString) .isString()
        this.param(condition) .isUndefined() .or() .isBoolean()
    }

    prependLine({ string: lineString, if: condition }) {
        this.param(lineString) .isString()
        this.param(condition) .isUndefined() .or() .isBoolean()
    }
}

module.exports = Protocol.define(StringStreamProcotol)
