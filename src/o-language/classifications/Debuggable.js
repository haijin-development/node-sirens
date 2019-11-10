const Classification = require('./Classification')
const OInstance = require('./OInstance')
const DebuggableProtocol = require('../protocols/DebuggableProtocol')
const IndentedStringStream = require('./IndentedStringStream')
const Sirens = require('../../Sirens')

/*
 Class(`
    A Debuggable classification adds debugging behaviour to the object it is being attached to.
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
class Debuggable {

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
        this.instanceVariables = []
        this.assumes = []
        this.implements = [DebuggableProtocol]
    }

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

           Usually it is the character ' n', but if the debug string is to be rendered on an HTML browser then '<br>' can be use.
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

           Usually it is the character " t" or a space, but if the debug string is to be rendered on an HTML browser then '&nbsp;' can be use.
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

     Tags([
        'displaying', 'public'
     ])
    */
    debugString({ cr: cr, tab: tab } = { cr: undefined, tab: undefined }) {
        if( cr === undefined ) { cr = "\n" }
        if( tab === undefined ) { tab = "    " }

        let stream = IndentedStringStream.new()

        stream.setCrChar( cr )
        stream.setIndentationChar( tab )

        printValueString({ value: this, stream: stream })

        return stream.getString()
    }

    /*
     Tags([
        'browsers', 'public'
     ])
    */
    browse() {
      Sirens.browseObject( this )
    }
}

function printValueString({ value: value, stream: stream }) {
    if(value === undefined) {
        stream.append({ string: 'undefined' })

        return
    }

    if(value === null) {
        stream.append({ string: 'null' })

        return
    }

    if( OInstance.isOInstance( value ) ) {
        printOInstanceString({ oInstance: value, stream: stream })

        return
    }

    stream.append({ string: value.toString() })
}

function printOInstanceString({ oInstance: oInstance, stream: stream }) {
    let isFirstClassification = true

    oInstance.classifications().forEach( (classification) => {
        if( ! isFirstClassification ) {
            stream.cr({ indent: true })
        }

        printClassificationInstantiationString({
            oInstance: oInstance,
            classification: classification,
            stream: stream,
            isFirstClassification: isFirstClassification
        })

        isFirstClassification = false
    })
}

function printClassificationInstantiationString({
    oInstance: oInstance,
    classification: classification,
    stream: stream,
    isFirstClassification: isFirstClassification
}) {
    const line = classification.getName() + " {"

    stream.append({ string: line })

    stream.whileIncrementingIndentationDo({ by: 1 }, () => {

        oInstance.classificationInstanceVariablesDo(classification, (name, value) => {
            const newLine = name + ': '

            stream.appendLine({ string: newLine })

            if( ! OInstance.isOInstance(value) ) {
                printValueString({ value: value, stream: stream })

                return
            }

            stream.whileIncrementingIndentationDo({ by: 1 }, () => {
                stream.cr({ indent: true })

                printValueString({ value: value, stream: stream })
            })
        })
    })

    stream.appendLine({ string: '}' })
}

module.exports = Classification.define(Debuggable)
