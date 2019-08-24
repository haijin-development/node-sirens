const MessageDispatcher = require('../implementation/MessageDispatcher')

/*
 * Temporary implementation of a Classification object.
 */
class Classification {

    /*
     * Returns a new O instance with this OInstance classification instantiated in it.
     */
    static createObject() {
        return MessageDispatcher.createObject()
    }

    /*
     * Returns a new O instance with this OInstance classification instantiated in it.
     */
    static new(...props) {
        return this.createObject().yourself( (object) => {
            object
                .behaveAs(this)
                .initialize(...props)
        })
    }

}

module.exports = Classification