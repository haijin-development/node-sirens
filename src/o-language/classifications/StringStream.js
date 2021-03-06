const Classification = require('./Classification')
const StringStreamProcotol = require('../protocols/StringStreamProcotol')

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
       const StringStream = require('sirens/src/O').StringStream

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
       const StringStream = require('sirens/src/O').StringStream

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
       const StringStream = require('sirens/src/O').StringStream

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

       const StringStream = require('sirens/src/O').StringStream

       const stream = StringStream.new()

       stream .append({ string: 'First line' })

       stream .cr()

       stream .append({ string: 'Second line' })

       stream.getString()

    `,
 })
*/
class StringStream {
    /// Definition

    /*
     Method(`
        This classification definition.
     `)

     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['buffer', 'crChar']
        this.assumes = []
        this.implements = [StringStreamProcotol]
    }

    /// Initializing

    /*
     Method(`
        Initializes a new OInstance object to behave as a StringStream.

        It takes two optional arguments, the initial text and the string to use as the carriage return.
     `)

     Param({
        Name: `
           string
        `,
        Description: `
           String.
           The initial text to append to this StringStream.
        `,
     })

     Param({
        Name: `
           cr
        `,
        Description: `
           String.

           The character used as carriage return when appending a

               stringStream.cr()

           character or a new line.
        `,
     })

     Tags([
        'initializing', 'public'
     ])
    */
    initialize({ string: string, cr: cr } = { string: '', cr: undefined }) {
        this.buffer = string === undefined ? '' : string
        this.crChar = cr === undefined ? this.defaultCrChar() : cr
    }

    /*
     Method(`
        Returns the default string to use as a carriage return when no cr character is given.
     `)
     Returns({
        Description: `
           The default string to use as a carriage return when no cr character is given.
        `,
     })

     Tags([
        'constants', 'querying', 'public'
     ])
    */
    defaultCrChar() {
        return "\n"
    }

    /// Accessing

    /*
     Method(`
        Returns the buffer where the partial string is built.
     `)
     Returns({
        Description: `
           The buffer where the partial string is built.
        `,
     })

     Implementation(`
        Currently calling

        	getBuffer()

        is the same as calling

        	getString()

        method except that the use of one method or the other one is intention revealing.

        getString() is the public API to get the final string, getBuffer() is used internally during the building of the string.
     `)

     Tags([
        'implementation', 'querying', 'getters'
     ])
    */
    getBuffer() {
        return this.buffer
    }

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
       const StringStream = require('sirens/src/O').StringStream

       const stream = StringStream.new()

       stream.append({ string: 'Some' })
       stream.append({ string: ' ' })
       stream.append({ string: 'text' })

       stream.getString()
    `,
 })

 Tags([
    'querying', 'public'
 ])
 */
    getString() {
        return this.buffer
    }

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
              const StringStream = require('sirens/src/O').StringStream

              const stream = StringStream.new()

              stream.getCrChar()
           `,
        })

        Tags([
           'public', 'querying', 'getters'
        ])
    */
    getCrChar() {
        return this.crChar
    }


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
              const StringStream = require('sirens/src/O').StringStream

              const stream = StringStream.new()

              stream.setCrChar( '<br>' )

               stream.getCrChar()
           `,
        })

        Tags([
           'public', 'setters'
        ])
    */
    setCrChar(char) {
        return this.crChar = char
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
           const StringStream = require('sirens/src/O').StringStream

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
           const StringStream = require('sirens/src/O').StringStream

           const stream = StringStream.new()

           stream.append({ string: 'Some text' })

           const text = ''

           stream.append({ string: text, if: text.trim() !== '' })

           stream.getString()
        `,
     })

     Tags([
        'appending', 'public'
     ])
    */
    append({ string: string, if: boolean }) {
        if( boolean === false ) { return }

        this.buffer += string

        return this
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
           const StringStream = require('sirens/src/O').StringStream

           const stream = StringStream.new()

           stream.append({ string: 'text' })

           stream.prepend({ string: 'Some ' })

           stream.getString()
        `,
     })

     Tags([
        'appending', 'public'
     ])
    */
    prepend({ string: string, if: boolean }) {
        if( boolean === false ) { return }

        this.buffer = string + this.buffer

        return this
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
           const StringStream = require('sirens/src/O').StringStream

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
           const StringStream = require('sirens/src/O').StringStream

           const stream = StringStream.new()

           stream.append({ string: 'First line' })

           const secondLine = ''

           stream.cr({ if: secondLine.trim() !== '' })

           stream.append({ string: secondLine })

           stream.getString()
        `,
     })

     Tags([
        'appending', 'public'
     ])
    */
    cr({ if: boolean } = { if: true }) {
        if( boolean === false ) { return }

        this.append({ string: this.crChar })

        return this
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
           const StringStream = require('sirens/src/O').StringStream

           const stream = StringStream.new()

           stream.append({ string: 'First line' })
           stream.appendLine({ string: 'Second line' })

           stream.getString()
        `,
     })

     Tags([
        'appending', 'public'
     ])
    */
    appendLine({ string: lineString, if: boolean }) {
        if( boolean === false ) { return }

        this
            .cr()
            .append({ string: lineString })

        return this
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
           const StringStream = require('sirens/src/O').StringStream

           const stream = StringStream.new()

           stream.append({ string: 'First line' })
           stream.prependLine({ string: 'Second line' })

           stream.getString()
        `,
     })

     Tags([
        'appending', 'public'
     ])
    */
    prependLine({ string: lineString, if: boolean }) {
        if( boolean === false ) { return }

        this
            .prepend({ string: this.crChar })
            .prepend({ string: lineString })

        return this
    }

    /*
     Method(`
        Appends all the lines in the given string.

        Returns this object.
     `)

     Param({
        Name: `
           string
        `,
        Description: `
           String.
           A string to append all its lines to this StringStream object.
        `,
     })

     Returns({
        Description: `
           StringStream.
           This object.
        `,
     })

     Example({
        Description: `
           Appends all the lines in a string to a StringStream object.

           To the example more clear firt set the cr char to '<br>'.
        `,
        Code: `
           const StringStream = require('sirens/src/O').StringStream

           const stream = StringStream.new()

           stream.setCrChar('<br>')

           stream.appendLinesIn({ string: "First line\nSecond line\nThird line" })

           stream.getString()
        `,
     })

     Tags([
        'appending', 'public'
     ])
    */
    appendLinesIn({ string: string }) {
        const lines = string.split( "\n" )

        lines.forEach( (line) => {

            if( line.trim() === '' ) {
                this.cr()
            } else {
                this.appendLine({ string: line })
            }
        })

        return this
    }

    /// Iterating

    /*
     Method(`
        Evaluates the given eachClosure for each item of the given collection, and it bewteen two consecutive items evaluates
                the inBetweenClosure.

                This is a covenience method similar to String.join() to append separators like ',' or '
        ' between words or lines without the need
                to create an intermediate array of strings to join.
     `)

     Param({
        Name: `
           collection
        `,
        Description: `
           Array.
           The items to iterate.
        `,
     })

     Param({
        Name: `
           eachClosure
        `,
        Description: `
           Function.
           A function to evaluate on each item.

           The function has the signature

           	function(item) {
           		// ..
           	}

           and its return value is ignored.

           To append a string to the stream do

           	function(item) {
           		const itemString = item.toString()

           		stream.append({ string: itemString })
           	}

           The reason to require an explicit call to the append() method is to give the developer the possibility not to append anything with
           a conditional within the closure.
        `,
     })

     Param({
        Name: `
           inBetweenClosure
        `,
        Description: `
           Function.
           A function to evaluate between two consecutive elements.

           In this function it is possible to append a separator between consecutive items, such as ',', '-' or '\n'.

           The signature of the function is

           	function({ leftItem: leftItem, rightItem: rightItem, leftIndex: leftIndex, rightIndex: rightIndex }) {
           		// ...
           	}


           but unless you do need the parameters they can just be ignored like in any other function in javascript for the more simple

           	function() {
           		// ...
           	}
        `,
     })

     Example({
        Description: `
           Appends the items in the array [ 1, 2, 3 ] as strings separated by the character '_'.
        `,
        Code: `
           const StringStream = require('sirens/src/O').StringStream

           const items = [ 1, 2, 3 ]

           const stream = StringStream.new()

           stream.forEach({
           	in: items,
           	do: (item) => { stream.append({ string: item.toString() }) },
                   inBetweenDo: () => { stream.append({ string: '_' }) },
           })

           stream.getString()
        `,
     })

     Tags([
        'iterating', 'public'
     ])
    */
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

        return this
    }
}

module.exports = Classification.define(StringStream)