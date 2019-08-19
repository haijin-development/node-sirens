const Gtk = require('node-gtk').require('Gtk', '3.0')
const OInstance = require('../../o-language/classifications/OInstance')
const GtkWidget = require('./GtkWidget')

class LabelView {

    /// Instantiating

    static new() {
        return OInstance.new().yourself( (checkbox) => {
            checkbox
                .behaveAs(this)
                .initializeHandles()
        })
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['mainHandle']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initializeHandles() {
        this.mainHandle = new Gtk.Label()
    }

    /// Accessing

    getMainHandle() {
        return this.mainHandle
    }

    setText(text) {
        this.getMainHandle().label = text
    }

    getText() {
        return this.getMainHandle().label
    }
}

module.exports = LabelView