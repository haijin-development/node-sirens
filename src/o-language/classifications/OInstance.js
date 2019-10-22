const MessageDispatcher = require('../implementation/MessageDispatcher')

// For the OInstance definintion see src/o-language/implementation/OInstance.js

const OInstance = MessageDispatcher.getOInstanceClassification()

OInstance.isOInstance = function(object) {
    if( object === undefined ) { return false }
    if( object === null ) { return false }

    return object.impl !== undefined
}

module.exports = OInstance