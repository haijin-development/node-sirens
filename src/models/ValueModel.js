const EventEmitter = require('events')

class ValueModel extends EventEmitter {
    constructor({value: value} = {value: undefined}) {
        super()

        this.value = value
    }

    getValue() {
        return this.value
    }

    setValue(newValue) {
        if(this.value === newValue) {
            return
        }

        const oldValue = this.value

        this.value = newValue

        this.emit('value-changed', {oldValue: oldValue, newValue: newValue})
    }
}

module.exports = ValueModel