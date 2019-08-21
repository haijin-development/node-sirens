const Classification = require('../../o-language/classifications/Classification')
const EventEmitter = require('events')

class Model extends EventEmitter {

    /// Instantiating

    static new() {
       return OInstance.new()
                .behaveAs(this)
     }

    /// Definition

    static definition() {
        this.instanceVariables = ['_events', '_eventsCount']
    }
}

module.exports = Model