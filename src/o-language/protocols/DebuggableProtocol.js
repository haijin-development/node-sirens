const Protocol = require('../classifications/Protocol')

/*
 Class(`
    A Debuggable classification adds debugging behaviour to the object it is being attached to.

    This Protocol defines the public protocol that a Debuggable classification must comply with.
 `)

 Example({
    Description: `
       Adds a Debuggable behaviour to an object, in this example a StringStream instance.
    `,
    Code: `
       const StringStream = require('sirens/src/o-language/classifications/StringStream')
       const Debuggable = require('sirens/src/o-language/classifications/Debuggable')

       const stream = StringStream.new()
       stream.append({ string: '123' })

       stream.behaveAs( Debuggable )

       stream.isBehavingAs( Debuggable )
    `,
 })

 Example({
    Description: `
       Gets a debug string on an object, in this example a StringStream instance.
    `,
    Code: `
       const StringStream = require('sirens/src/o-language/classifications/StringStream')
       const Debuggable = require('sirens/src/o-language/classifications/Debuggable')

       const stream = StringStream.new()
       stream.append({ string: '123' })

       stream.behaveAs( Debuggable )

       stream.debugString()
    `,
 })

 Example({
    Description: `
       Gets a debug string on an object, in this example a StringStream instance, specifying which string to use
       as the carriage return string and as the indentation tab string.
    `,
    Code: `

       const StringStream = require('sirens/src/o-language/classifications/StringStream')
       const Debuggable = require('sirens/src/o-language/classifications/Debuggable')

       const stream = StringStream.new()
       stream.append({ string: '123' })

       stream.behaveAs( Debuggable )

       stream.debugString({
       	cr: '<br>',
       	tab: '&nbsp;&nbsp;&nbsp;',
       })

    `,
 })
 */
class DebuggableProtocol {
    /// Debugging

    /*
     Method(`
        Returns a debug string on the object receiving this message call.
     `)

     Param({
        Name: `
           cr
        `,
        Description: `
           Optional.
           String.
           A string to use as the carriage return character in the debug string.

           It usually is the character '\\ n', but if the debug string is to be rendered on an HTML browser then '<br>' can be use.
        `,
     })

     Param({
        Name: `
           tab
        `,
        Description: `
           Optional.
           String.
           A string to use as the indentation tab character in the debug string.

           It usually is the character "	" or a space, but if the debug string is to be rendered on an HTML browser then '&nbsp;' can be use.
        `,
     })

     Returns({
        Description: `
           String.
           A debug string on the object receiving this message call.
        `,
     })

     Example({
        Description: `
           Gets a debug sting on an object, in this example a StringStream instance.
        `,
        Code: `
           const StringStream = require('sirens/src/o-language/classifications/StringStream')
           const Debuggable = require('sirens/src/o-language/classifications/Debuggable')

           const stream = StringStream.new()
           stream.append({ string: '123' })

           stream.behaveAs( Debuggable )

           stream.debugString()
        `,
     })

     Example({
        Description: `
           Gets a debug sting on an object, in this example a StringStream instance, specifying which strings to use as
           its carriage return and as its indentation string.

           In this example the debug string uses '<br>' as its carriage return and '&nbsp;' as its identation string, suitable to display
           on an HTML browser.
        `,
        Code: `
           const StringStream = require('sirens/src/o-language/classifications/StringStream')
           const Debuggable = require('sirens/src/o-language/classifications/Debuggable')

           const stream = StringStream.new()
           stream.append({ string: '123' })

           stream.behaveAs( Debuggable )

           stream.debugString({
           	cr: '<br>',
           	tab: '&nbsp;&nbsp;&nbsp;',
           })
        `,
     })
    */
    debugString({ cr: cr, tab: tab } = { cr: undefined, tab: undefined }) {
        this.param(cr) .isString() .or() .isUndefined()
        this.param(tab) .isString() .or() .isUndefined()
    }
}

module.exports = Protocol.define(DebuggableProtocol)
