const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkPositions = require('./constants/GtkPositions')
const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class TabsView {
    /// Definition

    static definition() {
        this.instanceVariables = ['notebook', 'tabLabels', 'onTabPageChanged']
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

    initialize(props) {
        this.onTabPageChanged = props.onTabPageChanged

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.notebook = new Gtk.Notebook()

        this.tabLabels = []
    }

    /// Accessing

    getMainHandle() {
        return this.notebook
    }

    /// Styles

    setTabLabelAt({index: index, text: text}) {
        this.tabLabels[index] = text

        const pageHandle = this.notebook.getChildren()[index]

        this.notebook.setTabLabelText(pageHandle, text)
    }

    getTabLabelAt({index: index}) {
        const pageHandle = this.notebook.getChildren()[index]

        return this.notebook.getTabLabelText(pageHandle)
    }

    setAligment(aligment) {
        const tabPos = GtkPositions[ aligment ]

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

        const tabLabel = this.tabLabels[ tabPageIndex ]

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
        const eventsSubscriptor = this.getEventsSubscriptor()

        eventsSubscriptor.on({
            event: 'switch-page',
            from: this.notebook,
            do: this.handleSwitchPage,
            with: this,
        })
    }

    ensureFixedPosition(childView) {
        let tabFixedPosition = childView.getViewAttribute({ at: 'tabFixedPosition' })

        if( tabFixedPosition === undefined ) { return }

        if( tabFixedPosition < 0 ) {
            tabFixedPosition = this.notebook.getChildren().length + tabFixedPosition
        }

        this.notebook.reorderChild( childView.getMainHandle(), tabFixedPosition )
    }

    /// Child views

    addChildView(childView) {
        this.tabLabels.push( childView.getLabel() )

        this.previousClassificationDo( () => {
            this.addChildView( childView )
        })
    }

    removeChildView(childView) {
        const index = this.getIndexOfChildView( childView )

        if( index < 0 ) {
            throw new Error(`TabsView childView not found.`)
        }

        this.tabLabels = this.tabLabels.splice( index, 1 )

        this.previousClassificationDo( () => {
            this.removeChildView( childView )
        })
    }

    /// Events

    handleSwitchPage(newTabPageHandle, newTabPageIndex) {
        if( this.onTabPageChanged === undefined ) { return }

        this.onTabPageChanged({ tabPageIndex: newTabPageIndex })
    }

    releaseHandles() {
        this.previousClassificationDo( () => {
            this.releaseHandles()
        })

        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })
    }
}

module.exports = Classification.define(TabsView)
