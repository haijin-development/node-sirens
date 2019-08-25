const Classification = require('../../o-language/classifications/Classification')
const EventEmitter = require('events')

const Model = Classification.define( class extends EventEmitter {

    /// Definition

    static definition() {
        this.instanceVariables = ['_events', '_eventsCount']
    }
})

module.exports = Model