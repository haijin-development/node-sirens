const Classification = require('../../O').Classification
const IndentedStringStream = require('../../O').IndentedStringStream

/*
 * A piece of continuos text of javascript (or any other similar language) source code.
 */
class SourceCodeText {
    /// Definition

    static definition() {
        this.instanceVariables = ['text', 'removeIdentation', 'indentationChar', 'indentationLevel']
        this.assumes = []
    }

    /// Initializing

    initialize({ text: text, removeIdentation: removeIdentation }) {
        if( removeIdentation === undefined ) { removeIdentation = true }

        this.text = text

        this.removeIdentation = removeIdentation

        this.indentationChar = this.detectIndentationChar()
        this.indentationLevel = this.detectIndentationLevel()
    }

    detectIndentationChar() {
        const defaultIndentationChar = ' '

        for( const line of this.getAllLinesButFirst() ) {
            // Ignore blank lines
            if( this.isBlankLine( line ) ) { continue }

            // Ignore non indented lines
            const lineIndentation = this.getLineIndentationLevel({ line: line })
            if( lineIndentation === 0 ) { continue }

            const firstChar = matches[0][0]

            return firstChar
        }

        return defaultIndentationChar
    }

    detectIndentationLevel() {
        let indentationLevel = undefined

        for( const line of this.getAllLinesButFirst() ) {
            // Ignore blank lines
            if( this.isBlankLine( line ) ) { continue }

            const lineIndentation = this.getLineIndentationLevel({ line: line })

            if( indentationLevel === undefined ) {
                indentationLevel = lineIndentation
            } else {
                indentationLevel = Math.min( indentationLevel, lineIndentation )
            }
        }

        return indentationLevel === undefined ? 0 : indentationLevel
    }

    /// Accessing

    getRemoveIndentation() {
        return this.removeIdentation
    }

    setRemoveIndentation(boolean) {
        this.removeIdentation = boolean
    }

    getOriginalText() {
        return this.text
    }

    getFormattedText() {
        if( this.removeIdentation === false ) { return this.getOriginalText() }

        return this.formatText( this.text )
    }

    getIndentationLevel() {
        return this.indentationLevel
    }

    setIndentationLevel(indentationLevel) {
        this.indentationLevel = indentationLevel
    }

    getIndentationChar() {
        return this.indentationChar
    }

    setIndentationChar(indentationChar) {
        this.indentationChar = indentationChar
    }

    /// Querying

    getLines() {
        return this.text.split( "\n" )
    }

    getAllLinesButFirst() {
        return this.getLines().slice(1)
    }

    getFirstLine() {
        return this.getLines()[0]
    }

    /// Formatting

    formatText(text) {
        const lines = text.split( "\n" )

        const firstLine = lines[0]
        const allLinesButFirst = lines.slice(1)

        const stream = IndentedStringStream.new()

        stream.append({ string: firstLine })

        allLinesButFirst.forEach( (line) => {
            line = line.slice( this.indentationLevel )

            stream.appendLine({ string: line })
        })

        return stream.getString()
    }

    unformatBackText(text) {
        const lines = text.split( "\n" )

        const firstLine = lines[0]
        const allLinesButFirst = lines.slice(1)

        const stream = IndentedStringStream.new()
        stream.setIndentationLevel( this.indentationLevel )
        stream.setIndentationChar( this.indentationChar )

        stream.append({ string: firstLine })

        allLinesButFirst.forEach( (line) => {
            if( this.isBlankLine( line ) ) {
                stream.cr()
            } else {
                stream.appendLine({ string: line })
            }
        })

        return stream.getString()
    }

    /// Utility methods

    isBlankLine(line) {
        return line.match( /^\s*$/ ) !== null
    }

    getLineIndentationLevel({ line: line }) {
        const indentation = this.indentationChar

        const regex = new RegExp(`^${indentation}*`)

        const matches = line.match(regex)

        return matches === null ? 0 : matches[0].length
    }
}

module.exports = Classification.define(SourceCodeText)
