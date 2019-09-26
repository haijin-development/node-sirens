const Classification = require('./Classification')
const OInstance = require('./OInstance')
const DebuggableProtocol = require('../protocols/DebuggableProtocol')
const IndentedStringStream = require('./IndentedStringStream')

/*
 * This classification adds debugging methods to an object.
 */
class Debuggable {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
        this.implements = [DebuggableProtocol]
    }

    /// Debugging

    debugString({ cr: cr, tab: tab } = { cr: undefined, tab: undefined }) {
        if( cr === undefined ) { cr = "\n" }
        if( tab === undefined ) { tab = "    " }

        let stream = IndentedStringStream.new()

        stream.setCrChar( cr )
        stream.setIndentationChar( tab )

        printValueString({ value: this, stream: stream })

        return stream.getString()
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
