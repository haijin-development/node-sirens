const Classification = require('./Classification')
const StringStream = require('./StringStream')
const StringStreamProcotol = require('../protocols/StringStreamProcotol')

/*
           Class(`
              This classification is a decorator of a StringStream object that adds indentation to the lines appended to it.

              It can be instantiated as a standalone instance with:

              		// See example # 1

              		IndentedStringStream.new()


              or it can be added to an existing object with

              		// See example # 5

              		stream.behaveAs( IndentedStringStream )
           `)

           Implementation(`
              In the object oriented languages based on classes decorators are different objects from the 
              decorated objects, losing the decorated object identity.

              This classification is an example of a behavioural decorator that, in the O language, can be added to an object
              without losing or changing the identity of the decorated object and, at the same time, mantaining
              the decorator encapsulation and separation of concerns.
           `)

           Example({
              Description: `
                 Creates a IndentedStringStream.
              `,
              Code: `

                 const IndentedStringStream = require('sirens/src/o-language/classifications/IndentedStringStream')

                 const stringStream = IndentedStringStream.new()

                 stringStream.getString()

              `,
           })

           Example({
              Description: `
                 Sets the indentation level to an existing IndentedStringStream.
              `,
              Code: `
                 const IndentedStringStream = require('sirens/src/o-language/classifications/IndentedStringStream')

                 const stringStream = IndentedStringStream.new()

                 stringStream.setIndentationCount( 3 )

                 stringStream.appendLine({ string: 'One line with indentation.' })

                 stringStream.getString()
              `,
           })

           Example({
              Description: `
                 Increments and decrements the indentation to an IndentedStringStream.
              `,
              Code: `
                 const IndentedStringStream = require('sirens/src/o-language/classifications/IndentedStringStream')

                 const stringStream = IndentedStringStream.new()

                 stringStream.incrementIndentation({ by: 3 })

                 stringStream.appendLine({ string: 'One line with indentation.' })

                 stringStream.decrementIndentation({ by: 1 })
                 stringStream.appendLine({ string: 'Another line with less indentation.' })
                 stringStream.getString()
              `,
           })

           Example({
              Description: `
                 Increments and decrements the indentation to an IndentedStringStream during the 
                 evaluation of a closure.
              `,
              Code: `
                 const IndentedStringStream = require('sirens/src/o-language/classifications/IndentedStringStream')

                 const stringStream = IndentedStringStream.new()

                 stringStream.appendLine({ string: 'One line with no indentation.' })

                 stringStream.whileIncrementingIndentationDo({ by: 3 }, () => {
                     stringStream.appendLine({ string: 'A line with indentation.' })
                 })
                 stringStream.appendLine({ string: 'One more line with no indentation.' })

                 stringStream.getString()
              `,
           })

           Example({
              Description: `
                 A IndentedStringStream can be instantiated with

                 	IndentedStringStream.new()

                 but the classification can also be used to decorate any object that behaves as a StringStream.
              `,
              Code: `
                 const StringStream = require('sirens/src/o-language/classifications/StringStream')
                 const IndentedStringStream = require('sirens/src/o-language/classifications/IndentedStringStream')

                 // Create a StringStream object
                 const stringStream = StringStream.new()

                 // Add a regular line
                 stringStream.appendLine({ string: 'One line with no indentation.' })

                 // Decorate it with the IndentedStringStream behaviour
                 stringStream.behaveAs( IndentedStringStream )
                 stringStream.setIndentationCount( 3 )

                 // Add an indented line
                 stringStream.appendLine({ string: 'One line with indentation.' })

                 // Drop the IndentedStringStream behaviour
                 stringStream.dropBehaviour( IndentedStringStream )
                 stringStream.appendLine({ string: 'Another line without indentation.' })

                 // Get the stream contents
                 stringStream.getString()
              `,
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

    /*
     Method(`
        Returns the default string to use as an indentation unit when no identation char is given.
     `)
     Returns({
        Description: `
           Returns the default string to use as an indentation unit when no identation char is given.
        `,
     })
    */
    defaultIndentationChar() {
        return '   '
    }

    /// Accessing

    /*
    */
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

    /*
    */
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
