const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

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
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
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

    getSelectedPageView() {
        const selectedPageIndex = this.getSelectedPageIndex()

        let selectedPage
        let index = 0

        this.getChildViews().forEach( (childView) => {
            childView.concreteViewsDo( (childView) => {
                if( index === selectedPageIndex ) {
                    selectedPage = childView
                }

                index += 1
            })
        })

        return selectedPage
    }

    /// Actions

    showTabPageAt({ index: index }) {
        this.notebook.setCurrentPage( index )
    }

    /// Events

    directChildViewAdd(childView) {
        this.previousClassificationDo( () => {
            this.directChildViewAdd(childView)
        })

        let tabPageIndex = this.notebook.getChildren().length - 1

        const tabLabel = childView.getViewCustomAttribute({ at: 'tabLabel' })

        this.setTabLabelAt({
            index: tabPageIndex,
            text: tabLabel
        })

        this.getChildViews().forEach( (childView) => {
            childView.concreteViewsDo( (childView) => {
                this.ensureFixedPosition(childView)
            })
        })
    }

    subscribeToGUISignals(props) {
    }

    ensureFixedPosition(childView) {
        let tabFixedPosition = childView.getViewCustomAttribute({ at: 'tabFixedPosition' })

        if( tabFixedPosition === undefined ) { return }

        if( tabFixedPosition < 0 ) {
            tabFixedPosition = this.notebook.getChildren().length + tabFixedPosition
        }

        this.notebook.reorderChild( childView.getMainHandle(), tabFixedPosition )
    }
}

module.exports = Classification.define(TabsView)
