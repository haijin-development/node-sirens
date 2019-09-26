const Classification = require('./Classification')
const StringStreamProcotol = require('../protocols/StringStreamProcotol')

class StringStream {
    /// Definition

    static definition() {
        this.instanceVariables = ['buffer', 'crChar']
        this.assumes = []
        this.implements = [StringStreamProcotol]
    }

    /// Initializing

    initialize({ string: string, cr: cr } = { string: '', cr: undefined }) {
        this.buffer = string === undefined ? '' : string
        this.crChar = cr === undefined ? this.defaultCrChar() : cr
    }

    defaultCrChar() {
        return "\n"
    }

    /// Accessing

    getBuffer() {
        return this.buffer
    }

    getString() {
        return this.buffer
    }

    getCrChar() {
        return this.crChar
    }

    setCrChar(char) {
        return this.crChar = char
    }

    /// Concatenating

    append({ string: string, if: boolean }) {
        if( boolean === false ) { return }

        this.buffer += string

        return this
    }

    prepend({ string: string, if: boolean }) {
        if( boolean === false ) { return }

        this.buffer = string + this.buffer

        return this
    }

    cr({ if: boolean } = { if: true }) {
        if( boolean === false ) { return }

        this.append({ string: this.crChar })

        return this
    }

    appendLine({ string: lineString, if: boolean }) {
        if( boolean === false ) { return }

        this
            .cr()
            .append({ string: lineString })

        return this
    }

    prependLine({ string: lineString, if: boolean }) {
        if( boolean === false ) { return }

        this
            .prepend({ string: this.crChar })
            .prepend({ string: lineString })

        return this
    }
}

module.exports = Classification.define(StringStream)