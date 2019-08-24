const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class TabsView extends Classification {
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