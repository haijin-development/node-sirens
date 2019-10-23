const Protocol = require('../classifications/Protocol')

/*
 Class(`
    A StringStream object is used to concatenate strings.

    It has several differences with appending strings using the '+' operator:

    - a StringStream object can be passed by reference as a parameter
    - a StringStream has several covenience methods like appending a carriage return, appending a line, appending indentation, etc.
    - a StringStream can be used with polymorphism on its methods, allowing to transparently modify its behaviour
    - a StringStream could be implemented efficiently with a low level library
 `)

 Example({
    Description: `
       Appends a string to a StringStream object.
    `,
    Code: `
       const StringStream = require('sirens/src/o-language/classifications/StringStream')

       const stream = StringStream.new()

       stream
       	.append({ string: 'Some' })
       	.append({ string: ' ' })
       	.append({ string: 'text' })

       stream.getString()
    `,
 })

 Example({
    Description: `
       Prepends a string to a StringStream object.
    `,
    Code: `
       const StringStream = require('sirens/src/o-language/classifications/StringStream')

       const stream = StringStream.new()

       stream
       	.append({ string: 'text' })
       	.prepend({ string: 'Some ' })

       stream.getString()
    `,
 })

 Example({
    Description: `
       Appends a line to a StringStream object.
    `,
    Code: `
       const StringStream = require('sirens/src/o-language/classifications/StringStream')

       const stream = StringStream.new()

       stream
       	.append({ string: 'First line' })
       	.appendLine({ string: 'Second line ' })
       	.appendLine({ string: 'Third line ' })

       stream.getString()
    `,
 })

 Example({
    Description: `
       Appends a carriage return at the end of the buffer.
    `,
    Code: `

       const StringStream = require('sirens/src/o-language/classifications/StringStream')

       const stream = StringStream.new()

       stream .append({ string: 'First line' })

       stream .cr()

       stream .append({ string: 'Second line' })

       stream.getString()

    `,
 })
*/
class StringStreamProcotol {
    /// Accessing

    /*
 Method(`
    Returns the generated string of this StringStream object.

    Usually you would call this method after finishing appending text to this StringStream to get the final string.
 `)
 Returns({
    Description: `
       String.
       The string generated in this StringStream.
    `,
 })

 Example({
    Description: `
       Gets the generated string after appending text to a StringStream.
    `,
    Code: `

       const StringStream = require('sirens/src/o-language/classifications/StringStream')

       const stream = StringStream.new()

       stream.append({ string: 'Some' })
       stream.append({ string: ' ' })
       stream.append({ string: 'text' })

       stream.getString()

    `,
 })
*/
getString() {}

    /*
 Method(`
    Returns the character used as carriage return when appending a

    		stringStream.cr()

    character.

    It can be set with the method

    		const crChar = "<br>"

    		stringStream.setCrChar( crChar )
 `)
 Returns({
    Description: `
       String.
       The string currently used to append a carriage return when using the methods

       		stringStream.cr()
       		stringStream.appendLine()
       		stringStream.prependLine()
    `,
 })

 Example({
    Description: `
       Gets the current carriage return string.
    `,
    Code: `

       const StringStream = require('sirens/src/o-language/classifications/StringStream')

       const stream = StringStream.new()

       stream.getCrChar()

    `,
 })
*/
getCrChar() {}

    /*
     Method(`
        Sets the character used as carriage return when appending a

        		stringStream.cr()

        character.
     `)

     Param({
        Name: `
           char
        `,
        Description: `
           String.
           The string to be used as a carriage return when calling the methods

           		stringStream.cr()
           		stringStream.appendLine()
           		stringStream.prependLine()
        `,
     })

     Example({
        Description: `
           Sets the carriage return to '<br>'
        `,
        Code: `

           const StringStream = require('sirens/src/o-language/classifications/StringStream')

           const stream = StringStream.new()

           stream.setCrChar( '<br>' )

           stream.getCrChar()

        `,
     })
    */
    setCrChar(char) {
        this.param(char) .isString()
    }

    /// Concatenating

    /*
     Method(`
        Appends a string to the end of the buffer of this StringStream object.

        Does not append any carriage return nor new line, just the given string.

        Returns this same StringStream object.
     `)

     Param({
        Name: `
           string
        `,
        Description: `
           String.
           The string to append at the end of the current buffer.
        `,
     })

     Param({
        Name: `
           condition
        `,
        Description: `
           Optional.
           Boolean.
           An optional boolean that, if false, will make not to append the given string.

           Can be used to coveniently append conditional strings during the building of a complex string.
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
           Appends text to a StringStream object.
        `,
        Code: `
           const StringStream = require('sirens/src/o-language/classifications/StringStream')

           const stream = StringStream.new()

           stream.append({ string: 'Some' })
           stream.append({ string: ' ' })
           stream.append({ string: 'text' })

           stream.getString()
        `,
     })

     Example({
        Description: `
           Appends text to a StringStream object only if a given condition is true.
        `,
        Code: `
           const StringStream = require('sirens/src/o-language/classifications/StringStream')

           const stream = StringStream.new()

           stream.append({ string: 'Some text' })

           const text = ''

           stream.append({ string: text, if: text.trim() !== '' })

           stream.getString()
        `,
     })
    */
    append({ string: string, if: condition }) {
        this.param(string) .isString()
        this.param(condition) .isUndefined() .or() .isBoolean()
    }

    /*
     Method(`
        Prepends a string at the begining of the buffer of this StringStream object.

        Does not add any carriage return nor new line, just the given string.

        Returns this same StringStream object.
     `)

     Param({
        Name: `
           string
        `,
        Description: `
           String.
           The string to prepend at the begining of the current buffer.
        `,
     })

     Param({
        Name: `
           condition
        `,
        Description: `
           Optional.
           Boolean.
           An optional boolean that, if false, will make not to prepend the given string.

           Can be used to coveniently prepend conditional strings during the building of a complex string.
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
           Prepends text to the beginning of a StringStream object.
        `,
        Code: `
           const StringStream = require('sirens/src/o-language/classifications/StringStream')

           const stream = StringStream.new()

           stream.append({ string: 'text' })

           stream.prepend({ string: 'Some ' })

           stream.getString()
        `,
     })
    */
    prepend({ string: string, if: condition }) {
        this.param(string) .isString()
        this.param(condition) .isUndefined() .or() .isBoolean()
    }

    /*
     Method(`
        Appends a carriage return to the end of the buffer.

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

     Returns({
        Description: `
           StringStream.
           This StringStream object.
        `,
     })

     Example({
        Description: `
           Appends a carriage return to a StringStream object.
        `,
        Code: `
           const StringStream = require('sirens/src/o-language/classifications/StringStream')

           const stream = StringStream.new()

           stream.append({ string: 'First line' })

           stream.cr()

           stream.append({ string: 'Second line' })

           stream.getString()
        `,
     })

     Example({
        Description: `
           Appends a carriage return to a StringStream object only if the a condition is true.
        `,
        Code: `
           const StringStream = require('sirens/src/o-language/classifications/StringStream')

           const stream = StringStream.new()

           stream.append({ string: 'First line' })

           const secondLine = ''

           stream.cr({ if: secondLine.trim() !== '' })

           stream.append({ string: secondLine })

           stream.getString()
        `,
     })
    */
    cr({ if: condition } = { if: true }) {
        this.param(condition) .isUndefined() .or() .isBoolean()
    }

    /*
     Method(`
        Appends a carriage return and the given string at the end of the buffer.

        The carriage return is append **before** the given string, and no cr is appended after the given string.

        Returns this same StringStream object.
     `)

     Param({
        Name: `
           lineString
        `,
        Description: `
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
           Appends a line to a StringStream object.
        `,
        Code: `
           const StringStream = require('sirens/src/o-language/classifications/StringStream')

           const stream = StringStream.new()

           stream.append({ string: 'First line' })
           stream.appendLine({ string: 'Second line' })

           stream.getString()
        `,
     })
    */
    appendLine({ string: lineString, if: condition }) {
        this.param(lineString) .isString()
        this.param(condition) .isUndefined() .or() .isBoolean()
    }

    /*
     Method(`
        Prepends a line and a carriage at the begining of the buffer.

        The carriage return is append after the given string.

        Returns this same StringStream object.
     `)

     Param({
        Name: `
           lineString
        `,
        Description: `
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
           Prepends a line to a StringStream object.
        `,
        Code: `
           const StringStream = require('sirens/src/o-language/classifications/StringStream')

           const stream = StringStream.new()

           stream.append({ string: 'First line' })
           stream.prependLine({ string: 'Second line' })

           stream.getString()
        `,
     })
    */
    prependLine({ string: lineString, if: condition }) {
        this.param(lineString) .isString()
        this.param(condition) .isUndefined() .or() .isBoolean()
    }
}

module.exports = Protocol.define(StringStreamProcotol)
