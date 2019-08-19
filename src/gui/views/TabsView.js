const OInstance = require('../../o-language/classifications/OInstance')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class TabsView {
    /// Instantiating

    static new() {
        return OInstance.new().yourself( (tabs) => {
            tabs
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
        this.mainHandle = new Gtk.NotebookView()
    }

    /// Styles

    setTabLabelAt({index: index, text: text}) {
        const pageHandle = this.mainHandle.getChildren()[index]

        this.mainHandle.setTabLabelText(pageHandle, text)
    }

    tabLabelAt({index: index}) {
        const pageHandle = this.mainHandle.getChildren()[index]

        return this.mainHandle.getTabLabelText(pageHandle)
    }

    /// Events

    subscribeToGUISignals(props) {
    }
}

module.exports = TabsView