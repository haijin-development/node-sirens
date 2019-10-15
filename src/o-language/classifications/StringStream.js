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

    appendLinesIn({ string: string }) {
        const lines = string.split( "\n" )

        lines.forEach( (line) => {

            if( line.trim() === '' ) {
                this.cr()
            } else {
                this.appendLine({ string: line })
            }
        })
    }

    /// Iterating

    forEach({ in: collection, do: eachClosure, inBetweenDo: inBetweenClosure }) {
        const n = collection.length

        for( let i = 0; i < n; i++ ) {
            const item = collection[i]

            eachClosure( item, i )

            if( i < n - 1 ) {
                inBetweenClosure({
                    leftItem: item,
                    rightItem: collection[i + 1],
                    leftIndex: i,
                    rightIndex: i + 1
                })
            }
        }
    }
}

module.exports = Classification.define(StringStream)