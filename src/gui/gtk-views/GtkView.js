const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const Sirens = require('../../Sirens')
const MenuView = require('./MenuView')
const GtkViewProtocol_Implementation = require('../protocols/GtkViewProtocol_Implementation')

Sirens.initialize()

class GtkView {
    /// Definition

    static definition() {
        this.instanceVariables = ['childViews', 'viewCustomAttributes', 'parentHandleOwnerView']
        this.expects = [GtkViewProtocol_Implementation]
    }

    /// Styles

    acceptedStyles() {
        return [
            'width', 'height',
            'backgroundColor', 'foregroundColor',
            'populatePopupMenuBlock',
            'viewCustomAttributes'
        ]
    }

    /// Initializing

    afterInstantiation() {
        this.childViews = []
        this.viewCustomAttributes = []
    }

    addChildView(childView) {
        this.childViews.push(childView)

        if( this.isComponentView() ) {
            const parentHandleOwnerView = this.getParentHandleOwnerView()

            childView.setParentHandleOwnerView( parentHandleOwnerView )
        } else {
            childView.setParentHandleOwnerView( this )
        }

        childView.connectToParentHandleOwnerView()
    }

    removeChildView(childView) {
        const viewsCount = this.childViews.length

        this.childViews = this.childViews.filter( (eachView) => {
            return eachView !== childView
        })

        if( viewsCount !== this.childViews.length + 1 ) {
            throw new Error(`Trying to remove a view that is not a child view.`)
        }

        childView.disconnectFromParentHandleOwnerView()
    }

    /// Asking

    isComponentView() {
        return false
    }

    /// Accessing

    getChildViews() {
        return this.childViews
    }

    getChildrenCount() {
        return this.childViews.length
    }

    setParentHandleOwnerView(view) {
        this.parentHandleOwnerView = view
    }

    getParentHandleOwnerView() {
        return this.parentHandleOwnerView
    }

    /// Styles

    setWidth(value) {
        const sizeRequest = this.getMainHandle().getSizeRequest()

        sizeRequest.width = value

        this.getMainHandle().setSizeRequest(sizeRequest.width, sizeRequest.height)
    }

    getWidth(value) {
        return this.getMainHandle().getSizeRequest().width
    }

    setHeight(value) {
        const sizeRequest = this.getMainHandle().getSizeRequest()

        sizeRequest.height = value

        this.getMainHandle().setSizeRequest(sizeRequest.width, sizeRequest.height)
    }

    getHeight(value) {
        return this.getMainHandle().getSizeRequest().height
    }

    /// View custom attributes

    setViewCustomAttributes(value) {
        this.viewCustomAttributes = value
    }

    getViewCustomAttributes() {
        return this.viewCustomAttributes
    }

    getViewCustomAttribute({ at: attributeName, ifAbsent: absentValue }) {
        const value = this.viewCustomAttributes[attributeName]

        return value !== undefined ? value : absentValue
    }

    /// Handles

    /*
        Returns the only Gtk.Widget handle of this Gtk.View.
        If this views has more than one child returns an error.
        If this Gtk.View is a ComponentView returns the Gtk handle of its child component.
    */
    getOnlyChildViewMainHandle() {
        return this.getMainHandle()
    }
}

module.exports = Classification.define(GtkView)