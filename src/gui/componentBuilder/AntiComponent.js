const Classification = require('../../o-language/classifications/Classification')

class AntiComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
    }

    /// Hooks

    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        return {
            callMethod: null,
        }
    }

    afterMethod({ methodName: methodName, params: params, result: result, classification: classification }) {
        return {
            callResult: this,
        }
    }
}


module.exports = Classification.define(AntiComponent)