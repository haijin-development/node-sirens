const Classification = require('../../O').Classification
const EventEmitter = require('events')

class Model extends EventEmitter {

    /// Definition

    static definition() {
        this.instanceVariables = ['_events', '_eventsCount']
    }
}

module.exports = Classification.define(Model)