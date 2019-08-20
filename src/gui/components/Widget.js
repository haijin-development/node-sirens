const ComponentBehaviour = require('./ComponentBehaviour')

class Widget extends ComponentBehaviour {
    /// Initializing

    constructor(...params) {
        super(...params)

        this.updatingModel = false
    }

    /// Accessing

    getMainComponent() {
        return this
    }

    /// Updating

    duringModelUpdate(block) {
        const wasUpdatingModel = this.updatingModel

        this.updatingModel = true

        try {
            block()
        } finally {
            this.updatingModel = wasUpdatingModel
        }
    }
}

module.exports = Widget