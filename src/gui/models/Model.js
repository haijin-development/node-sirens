const Classification = require('../../o-language/classifications/Classification')
const EventEmitter = require('events')

class Model extends EventEmitter {

    /// Definition

    static definition() {
        this.instanceVariables = ['_events', '_eventsCount']
    }
}

module.exports = Classification.define(Model)