const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

const tabPositions = {
    left: Gtk.PositionType.LEFT,
    right: Gtk.PositionType.RIGHT,
    top: Gtk.PositionType.TOP,
    bottom: Gtk.PositionType.BOTTOM,
}

class TabsView {
    /// Definition

    static definition() {
        this.instanceVariables = ['notebook']
        this.assumptions = [GtkWidget]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat(['aligment'])
        })
    }

    /// Initializing

    initializeHandles() {
        this.notebook = new Gtk.Notebook()
    }

    /// Accessing

    getMainHandle() {
        return this.notebook
    }

    /// Styles

    setTabLabelAt({index: index, text: text}) {
        const pageHandle = this.notebook.getChildren()[index]

        this.notebook.setTabLabelText(pageHandle, text)
    }

    getTabLabelAt({index: index}) {
        const pageHandle = this.notebook.getChildren()[index]

        return this.notebook.getTabLabelText(pageHandle)
    }

    setAligment(aligment) {
        const tabPos = tabPositions[ aligment ]

        this.notebook.setTabPos(tabPos)
    }

    /// Queyring

    getSelectedPageIndex() {
        return this.notebook.getCurrentPage()
    }

    /// Events

    onViewAdded(childView) {
        this.previousClassificationDo( () => {
            this.onViewAdded(childView)
        })

        const tabLabel = childView.getViewCustomAttribute({ at: 'tabLabel' })

        this.setTabLabelAt({
            index: this.getChildrenCount() - 1,
            text: tabLabel
        })
    }

    subscribeToGUISignals(props) {
    }
}

module.exports = Classification.define(TabsView)
