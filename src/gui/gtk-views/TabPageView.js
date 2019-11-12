const Classification = require('../../O').Classification
const ComponentView = require('./ComponentView')
const GtkViewProtocol_Implementation = require('../protocols/GtkViewProtocol_Implementation')

class TabPageView {
    /// Definition

    static definition() {
        this.instanceVariables = ['label']
        this.assumes = [ComponentView]
        this.implements = [GtkViewProtocol_Implementation]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat([ 'label' ])
        })
    }

    /// Accessing

    getMainHandle() {
        throw Error(`ComponentView has no main handle.`)
    }

    setLabel(label) {
        this.label = label
    }

    getLabel(label) {
        return this.label
    }
}

module.exports = Classification.define(TabPageView)
