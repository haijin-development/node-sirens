const Classification = require('./Classification')
const StringStream = require('./StringStream')
const StringStreamProcotol = require('../protocols/StringStreamProcotol')

/*
           Class(`
              This classification is a decorator of a StringStream object that adds indentation to the lines appended to it.

              It can be instantiated as a standalone instance with:

              		// See example # 1

              		const IndentedStringStream = require('sirens/src/O').IndentedStringStream

              		IndentedStringStream.new()



              or it can be added to an existing object with

              		// See example # 5

              		stream.behaveAs( IndentedStringStream )
           `)

           Implementation(`
              In the object oriented languages based on classes decorators are different objects from the 
              decorated objects, losing the decorated object identity.

              This classification is an example of a behavioural decorator that, in the O language, can be added to an object
              without losing or changing the identity of the decorated object and, at the same time, to mantain
              the decorator encapsulation and separation of concerns.
           `)

           Example({
              Description: `
                 Creates a IndentedStringStream.
              `,
              Code: `
                 const IndentedStringStream = require('sirens/src/O').IndentedStringStream

                 const stringStream = IndentedStringStream.new()

                 stringStream.getString()
              `,
           })

           Example({
              Description: `
                 Sets the indentation level to an existing IndentedStringStream.
              `,
              Code: `
                 const IndentedStringStream = require('sirens/src/O').IndentedStringStream

                 const stringStream = IndentedStringStream.new()

                 stringStream.setIndentationLevel( 3 )

                 stringStream.appendLine({ string: 'One line with indentation.' })

                 stringStream.getString()
              `,
           })

           Example({
              Description: `
                 Increments and decrements the indentation to an IndentedStringStream.
              `,
              Code: `
                 const IndentedStringStream = require('sirens/src/O').IndentedStringStream

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
                 const IndentedStringStream = require('sirens/src/O').IndentedStringStream

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
                 const StringStream = require('sirens/src/O').StringStream
                 const IndentedStringStream = require('sirens/src/O').IndentedStringStream

                 // Create a StringStream object
                 const stringStream = StringStream.new()

                 // Add a regular line
                 stringStream.appendLine({ string: 'One line with no indentation.' })

                 // Decorate it with the IndentedStringStream behaviour
                 stringStream.behaveAs( IndentedStringStream )
                 stringStream.setIndentationLevel( 3 )

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

    /*
     Method(`
        The classification definition.
     `)

     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['indentationCount', 'indentationChar', 'indentation']
        this.assumes = []
        this.expects = [StringStreamProcotol]
    }

    /// Initializing

    /*
     Method(`
        Initializes the instantiated classification right after it is attached to this object.
     `)

     Tags([
        'initializing', 'implementation'
     ])
    */
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
           String.
           Returns the default string to use as an indentation unit when no identation char is given.
        `,
     })

     Example({
        Description: `
           Gets the default indentation char of this StringStream object.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()

           stream.defaultIndentationChar()
        `,
     })

     Tags([
        'constants', 'querying', 'implementation'
     ])
    */
    defaultIndentationChar() {
        return '   '
    }

    /// Accessing

    /*
Method(`
   Returns the indentation level of the lines appended to the stream.

   The indentation string will be

   	stream.getIndentationChar().repeast( stream.getIndentationLevel() )

   that is

   	 stream.getIndentationLevel() times stream.getIndentationChar()
`)
Returns({
   Description: `
      String.
      The indentation level of the lines appended to the stream.
   `,
})

Example({
   Description: `
      Gets the indentation level of this StringStream object.
   `,
   Code: `
      const IndentedStringStream = require('sirens/src/O').IndentedStringStream

      const stream = IndentedStringStream.new()

      stream.getIndentationLevel()
   `,
})

Tags([
   'getters', 'querying', 'public'
])
*/
    getIndentationLevel() {
        return this.indentationCount
    }

    /*
     Method(`
        Sets the indentation level of the lines appended to the stream to the given integer.

        Returns this same StringStream.
     `)

     Param({
        Name: `
           n
        `,
        Description: `
           Integer >= 0.
           The identation level that this StringStream will use to append new lines.
        `,
     })

     Returns({
        Description: `
           StringStream.
           This same StringStream.
        `,
     })

     Example({
        Description: `
           Sets the indentation level to 3 and appends a line.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()

           stream.setIndentationLevel(3)

           stream.appendLine({ string: 'New line' })

           stream.getString()
        `,
     })

     Tags([
        'indentation', 'setters', 'public'
     ])
    */
    setIndentationLevel(n) {
        this.indentationCount = n

        this.indentation = this.indentationChar.repeat( this.indentationCount )

        return this
    }

    /*
     Method(`
        Returns the string used as indentation unit in the indented lines.

        It usually is a tab or a space, but in some cases may be a different string like the HTML encoded space '&nbsp;'
     `)
     Returns({
        Description: `
           String.
           The string used as indentation unit in the indented lines.
        `,
     })

     Example({
        Description: `
           Gets the indentation char used by a StringStream object.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()

           stream.getIndentationChar()
        `,
     })

     Tags([
        'getters', 'querying', 'public'
     ])
    */
    getIndentationChar() {
        return this.indentationChar
    }

    /*
     Method(`
        Sets the indentation string to use in the appended lines.

        Returns this same StringStream.
     `)

     Param({
        Name: `
           char
        `,
        Description: `
           String.
           The string to use as indentation char in the indented lines.
        `,
     })

     Returns({
        Description: `
           StringStream.
           This same StringStream.
        `,
     })

     Example({
        Description: `
           Sets the indentation char to a StringStream and appends a new line with that indentation char.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()

           stream
           	.setIndentationChar( '&nbsp;' )
           	.setIndentationLevel( 2 )

           stream.appendLine({ string: 'A line' })

           stream.getString()
        `,
     })

     Tags([
        'setters', 'public'
     ])
    */
    setIndentationChar(char) {
        this.indentationChar = char

        this.indentation = this.indentationChar.repeat( this.indentationCount )

        return this
    }

    /// Indentation

    /*
Method(`
   Increments the current indentation level by the given integer, n.

   Returns this same StringStream object.
`)

Param({
   Name: `
      n
   `,
   Description: `
      Integer.
      The increment in the indentation level to add to the current indentation level.

      If n < 0 the indentation level is decreased instead.
   `,
})

Returns({
   Description: `
      StringStream.
      This same StringStream.
   `,
})

Example({
   Description: `
      Increments the indentation level by 1 and appends a new line.
   `,
   Code: `
      const IndentedStringStream = require('sirens/src/O').IndentedStringStream

      const stream = IndentedStringStream.new()

      stream
      	.incrementIndentation({ by: 1 } )
      	.appendLine({ string: 'A line' })

      stream.getString()
   `,
})

Tags([
   'indentation', 'public'
])
*/
    incrementIndentation({ by: n } = { by: 1 }) {
        this.setIndentationLevel( this.indentationCount + n )

        return this
    }

    /*
     Method(`
        Decrements the current indentation level by the given integer, n.

        Returns this same StringStream object.
     `)

     Param({
        Name: `
           n
        `,
        Description: `
           Integer.
           The decrement in the indentation level to substract from the current indentation level.

           If n < 0 the indentation level is increased instead.
        `,
     })

     Returns({
        Description: `
           StringStream.
           This same StringStream.
        `,
     })

     Example({
        Description: `
           Sets the indentation level of a StringStream to 2, decrements it by 1 and appends a new line.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()

           stream
           	.setIndentationLevel( 2 )
           	.decrementIndentation({ by: 1 } )
           	.appendLine({ string: 'A line' })

           stream.getString()
        `,
     })

     Tags([
        'indentation', 'public'
     ])
    */
    decrementIndentation({ by: n } = { by: 1 }) {
        this.incrementIndentation({ by: -n })

        return this
    }

    /*
     Method(`
        Increments the current indentation level by the given integer, n, evaluates the given closure and restores the previous
        indentation level.

        Returns the result of the closure evaluation.
     `)

     Param({
        Name: `
           n
        `,
        Description: `
           Integer.
           The increment in the indentation level to add to the current indentation level during the evaluation of the given closure.

           If n < 0 the indentation level is decreased instead.
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           The closure to evaluate after the increment of the indentation level and before restoring the previous indentation level.
        `,
     })

     Returns({
        Description: `
           Object.
           The same result that the closure returns.
        `,
     })

     Example({
        Description: `
           Appends a line during the increment of the indentation level of a StringStream.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()

           stream.append({ string:  'First line' })

           stream.whileIncrementingIndentationDo({ by: 3 }, () => {
           	stream.appendLine({ string:  'Second line' })
           } )

           stream.appendLine({ string: 'Thrid line' })

           stream.getString()
        `,
     })

     Tags([
        'indentation', 'public'
     ])
    */
    whileIncrementingIndentationDo({ by: n }, closure) {
        const currentIndentation = this.indentationCount

        this.incrementIndentation({ by: n })

        try {
            return closure()
        } finally {
            this.setIndentationLevel( currentIndentation )
        }
    }

    /// Concatenating

    /*
     Method(`
        Appends a carriage return, indentation and the given string at the end of the buffer.

        The carriage return is append **before** the indentation and the given string, and no cr is appended after the given string.

        Returns this same StringStream object.
     `)

     Param({
        Name: `
           lineString
        `,
        Description: `
           String.
           The lineString to append in the new line.
        `,
     })

     Param({
        Name: `
           condition
        `,
        Description: `
           Optional.
           Boolean.
           An optional boolean that, if false, will make not to append the new line.

           Can be used during the building of a complex string.
        `,
     })

     Returns({
        Description: `
           StringStream.
           This StringStream object.
        `,
     })

     Example({
        Description: `
           Appends an indented line to a StringStream object.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()

           stream
           	.append({ string: 'First line' })
           	.incrementIndentation({ by: 1 })
           	.appendLine({ string: 'Second line' })

           stream.getString()
        `,
     })

     Tags([
        'appending', 'public'
     ])
    */
    appendLine({ string: lineString, if: condition }) {
        lineString = this.indentation + lineString

        this.previousClassificationDo( () => {
            this.appendLine({ string: lineString, if: condition })
        })

        return this
    }

    /*
     Method(`
        Prepends a line with indentation and a carriage at the begining of the buffer.

        The carriage return is append after the given string.

        Returns this same StringStream object.
     `)

     Param({
        Name: `
           lineString
        `,
        Description: `
           String.

           The lineString to append in the new line.
        `,
     })

     Param({
        Name: `
           condition
        `,
        Description: `
           Optional.
           Boolean.
           An optional boolean that, if false, will make not to prepend the new line.

           Can be used during the building of a complex string.
        `,
     })

     Returns({
        Description: `
           StringStream.
           This StringStream object.
        `,
     })

     Example({
        Description: `
           Prepends an indented line to a StringStream object.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()

           stream
           	.append({ string: 'First line' })
           	.incrementIndentation({ by: 1 })
           	.prependLine({ string: 'Second line' })

           stream.getString()
        `,
     })

     Tags([
        'appending', 'public'
     ])
    */
    prependLine({ string: lineString, if: condition }) {
        lineString = this.indentation + lineString

        this.previousClassificationDo( () => {
            this.prependLine({ string: lineString, if: condition })
        })

        return this
    }

    /*
     Method(`
        Appends a carriage return and, optionally, appends indentation at the begining of the new line.

        Returns this same StringStream object.
     `)

     Param({
        Name: `
           condition
        `,
        Description: `
           Optional.
           Boolean.
           An optional boolean that, if false, will make not to append the carriage return.

           Can be used during the building of a complex string.
        `,
     })

     Param({
        Name: `
           indent
        `,
        Description: `
           Optional.
           Boolean.
           If true appends indentation after the carriage return.
        `,
     })

     Returns({
        Description: `
           StringStream.
           This same StringStream.
        `,
     })

     Example({
        Description: `
           Appends a carriage return with no indentation.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()
           stream.setIndentationLevel( 3 )
           stream.cr()

           stream.getString()
        `,
     })

     Example({
        Description: `
           Appends a carriage return with indentation.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()

           stream.setIndentationLevel( 3 )
           stream.cr({ indent: true })

           stream.getString()
        `,
     })

     Tags([
        'appending', 'public'
     ])
    */
    cr({ if: condition, indent: indent } = { if: true, indent: false }) {
        if( condition === undefined ) { condition = true }
        if( indent === undefined ) { indent = false }

        this.previousClassificationDo( () => {
            this.cr({ if: condition })
        })

        if( condition !== false && indent === true ) {
            this.appendIndentation()
        }

        return this
    }

    /*
     Method(`
        Appends indentation to the buffer.

        Returns this StringStream object.
     `)
     Returns({
        Description: `
           StringStream.
           This same StringStream.
        `,
     })

     Example({
        Description: `
           Appends indentation to a StringStream object.
        `,
        Code: `
           const IndentedStringStream = require('sirens/src/O').IndentedStringStream

           const stream = IndentedStringStream.new()
           stream.setIndentationLevel( 3 )
           stream.appendIndentation()

           stream.getString()
        `,
     })

     Tags([
        'appending', 'public'
     ])
    */
    appendIndentation() {
        this.append({ string: this.indentation })

        return this
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
