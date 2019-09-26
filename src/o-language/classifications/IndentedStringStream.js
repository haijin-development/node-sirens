const Classification = require('./Classification')
const StringStream = require('./StringStream')
const StringStreamProcotol = require('../protocols/StringStreamProcotol')

/*
    class(`
        This classification adds indentation to the lines appended to a StringStream.

        This classification is a decorator of a StringStream behaviour.

        In the object oriented languages based on classes decorators are different objects from the 
        decorated objects, losing the decorated object identity.

        This classification is an example of how in the O language decorators can be added to an object
        without losing or changing the identity of the decorated object and, at the same time, mantain
        the encapsulation and separation of concerns of the decoractor.
    `)

    example({
        description: `
            Adds indentation to an existing StringStream.
        `,
        code: `
            stringStream.behaveAs(IndentedStringStream)

            stringStream.appendLine({ string: 'Text' })
        `,
    })

    example({
        description: `
            Sets the indentation to an existing StringStream.
        `,
        code: `
            stringStream.behaveAs(IndentedStringStream)

            stringStream.setIndentationCount(3)

            stringStream.appendLine({ string: 'Text' })
        `,
    })

    example({
        description: `
            Increments and decrements the indentation to an existing StringStream.
        `,
        code: `
            stringStream.behaveAs(IndentedStringStream)

            stringStream.incrementIndentation({ by: 1 })

            stringStream.appendLine({ string: 'Text' })

            stringStream.decrementIndentation({ by: 1 })
        `,
    })

    example({
        description: `
            Increments and decrements the indentation to an existing StringStream during the 
            evaluation of a closure.
        `,
        code: `
            stringStream.behaveAs(IndentedStringStream)

            stringStream.incrementIndentation({ by: 1 })

            stringStream.whileIncrementingIndentationDo({ by: 1 }, () => {
                stringStream.appendLine({ string: 'Text' })
            })
        `,
    })

    example({
        description: `
            Creates a StringStream behaving as a IndentedStringStream.
        `,
        code: `
            const stringStream = IndentedStringStream.new()
        `,
        seeAlso: [
            'IndentedStringStream.new'
        ],
    })
*/
class IndentedStringStream {
    /// Definition

    static definition() {
        this.instanceVariables = ['indentationCount', 'indentationChar', 'indentation']
        this.assumes = []
        this.expects = [StringStreamProcotol]
    }

    /// Initializing

    afterInstantiation() {
        this.indentationCount = 0
        this.indentationChar = this.defaultIndentationChar()

        this.indentation = ''
    }

    defaultIndentationChar() {
        return '   '
    }

    /// Accessing

    getIndentationCount() {
        return this.indentationCount
    }

    setIndentationCount(n) {
        this.indentationCount = n

        this.indentation = this.indentationChar.repeat( this.indentationCount )

        return this
    }

    getIndentationChar() {
        return this.indentationChar
    }

    setIndentationChar(char) {
        this.indentationChar = char

        this.indentation = this.indentationChar.repeat( this.indentationCount )

        return this
    }

    /// Indentation

    incrementIndentation({ by: n } = { by: 1 }) {
        this.setIndentationCount( this.indentationCount + n )
    }

    decrementIndentation({ by: n } = { by: 1 }) {
        this.incrementIndentation({ by: -n })
    }

    whileIncrementingIndentationDo({ by: n }, closure) {
        const currentIndentation = this.indentationCount

        this.incrementIndentation({ by: n })

        try {
            closure()
        } finally {
            this.setIndentationCount( currentIndentation )
        }
    }

    /// Concatenating

    appendLine({ string: lineString, if: boolean }) {
        lineString = this.indentation + lineString

        this.previousClassificationDo( () => {
            this.appendLine({ string: lineString, if: boolean })
        })

        return this
    }

    prependLine({ string: lineString, if: boolean }) {
        lineString = this.indentation + lineString

        this.previousClassificationDo( () => {
            this.prependLine({ string: lineString, if: boolean })
        })

        return this
    }

    cr({ if: boolean, indent: indent } = { if: true, indent: false }) {
        this.previousClassificationDo( () => {
            this.cr({ if: boolean })
        })

        if( boolean !== false && indent === true ) {
            this.appendIndentation()
        }

        return this
    }

    appendIndentation() {
        this.append({ string: this.indentation })
    }
}

IndentedStringStream = Classification.define(IndentedStringStream)

/*
 * Define a new method instead of assuming a StringStream because that would impose a hard
 * dependency from IndentedStringStream to a behaviour implementation.
 * This allows both
 *      - any object to behave like IndentedStringStream and not just a StringStream object.
 *      - to create a default concrete implementation of IndentedStringStream based on the concrete
 *         StringStream classification 
 *
 * Once the O language supports interfaces the IndentedStringStream assumption will be on an interface,
 * not on a concrete implementation.
 */
IndentedStringStream.new = function(...params) {
    return StringStream.new( ...params )
            .behaveAs(this)
}

module.exports = IndentedStringStream
