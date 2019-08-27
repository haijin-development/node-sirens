const Classification = require('./Classification')

/*
 * This classification adds debugging methods to an object.
 */
class Debuggable {

    /// Definition

    static definition() {
        this.cName = 'Debuggable'
        this.instanceVariables = []
        this.assumptions = []
    }

    /// Debugging

    debugString({ cr: cr, tab: tab } = { cr: undefined, tab: undefined }) {
        return debugString({ object: this, cr: cr, tab: tab, indentation: 0 })
    }

}

function debugString({ object: object, cr: cr, tab: tab, indentation: i }) {
    if( cr === undefined ) { cr = "\n" }
    if( tab === undefined ) { tab = "    " }

    let string = ''

    object.classifications().forEach( (eachClassification) => {

        string += nestedIndentation({ tab: tab, i: i })
        string += eachClassification.getName() + " {"
        string += cr

        object.classificationInstanceVariablesDo( eachClassification, (name, value) => {
            string += nestedIndentation({ tab: tab, i: i + 1 })

            string += name + ": " +
                valueDebugString({ object: value, cr: cr, tab: tab, indentation: i + 1 })

            string += cr
        })

        string += nestedIndentation({ tab: tab, i: i })
        string += "}"
        string += cr

    })

    return string
}

function valueDebugString({ object: object, cr: cr, tab: tab, indentation: i }) {
    if(object === undefined) {
        return 'undefined'
    }

    if(object === null) {
        return 'null'
    }

    if( object.impl === undefined ) {
        return object.toString()
    }

    return cr + debugString({
        object: object,
        cr: cr,
        tab: tab,
        indentation: i + 1
    })
}

function nestedIndentation({ tab: tab, i: i }) {
    return tab.repeat(i)
}


module.exports = Classification.define(Debuggable)
