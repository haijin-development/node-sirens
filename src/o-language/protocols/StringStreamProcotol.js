const Protocol = require('../classifications/Protocol')

class StringStreamProcotol {
    /// Accessing

    getString() {}

    getCrChar() {}

    setCrChar(char) {}

    /// Concatenating

    append({ string: string, if: boolean }) {}

    prepend({ string: string, if: boolean }) {}

    cr({ if: boolean } = { if: true }) {}

    appendLine({ string: lineString, if: boolean }) {}

    prependLine({ string: lineString, if: boolean }) {}
}

module.exports = Protocol.define(StringStreamProcotol)
