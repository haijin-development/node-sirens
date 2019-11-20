const Classification = require('../../O').Classification

class PlugabbleDisplayable {
    /// Definition

    static definition() {
        this.instanceVariables = ['displayText']
    }

    /// Initializing

    setDisplayText({ text: displayText }) {
        this.displayText = displayText
    }

    getDisplayText() {
        return this.displayText
    }

    getDisplayString() {
        return this.displayText
    }
}

module.exports = Classification.define(PlugabbleDisplayable)
