class PropertyModel {
    /// Initializing

    constructor({key: key, value: value}) {
        this.key = key
        this.value = value
    }

    /// Accessing

    getKey() {
        return this.key
    }

    getValue() {
        return this.value
    }

    /// Asking

    isFunction() {
        return typeof this.value == 'function'
    }

    /// Displaying

    displayString() {
        if(this.isFunction()) {
            return this.value.toString()
        } else {
            try {
                return JSON.stringify(this.value)
            } catch(error) {
                return this.value.toString()
            }
        }
    }
}

module.exports = PropertyModel
