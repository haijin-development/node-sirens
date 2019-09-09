const MessageDispatcher = require('../implementation/MessageDispatcher')

const OInstance = MessageDispatcher.getOInstanceClassification()

OInstance.isOInstance = function(object) {
    if( object === undefined ) { return false }
    if( object === null ) { return false }

    return object.impl !== undefined
}

module.exports = OInstance