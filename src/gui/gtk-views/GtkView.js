const Gtk = require('node-gtk').require('Gtk', '3.0')
const Gdk = require('node-gtk').require('Gdk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const Sirens = require('../../Sirens')
const MenuView = require('./MenuView')
const GtkViewProtocol_Implementation = require('../protocols/GtkViewProtocol_Implementation')

Sirens.initialize()

class GtkView {
    /// Definition

    static definition() {
        this.instanceVariables = ['childViews', 'viewAttributes', 'parentHandleOwnerView']
        this.expects = [GtkViewProtocol_Implementation]
    }

    /// Styles

    acceptedStyles() {
        return [
            'width', 'height',
            'alignHorizontal', 'alignVertical',
            'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
            'marginHorizontal', 'marginVertical',
            'populatePopupMenuBlock',
            'viewAttributes',
            'css',
        ]
    }

    /// Initializing

    afterInstantiation() {
        this.childViews = []
        this.viewAttributes = []
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

    acceptsStyle({ name: styleName }) {
        const acceptedStyles = this.acceptedStyles()

        return acceptedStyles.includes( styleName )
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

    getIndexOfChildView(childView) {
        return this.childViews.indexOf( childView )
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

    setAlignHorizontal(alignment) {
        let align

        switch( alignment ) {
            case 'begining':
                align = Gtk.Align.START
                break

            case 'end':
                align = Gtk.Align.END
                break

            case 'center':
                align = Gtk.Align.CENTER
                break

            case 'baseline':
                align = Gtk.Align.BASELINE
                break

            case 'fill':
                align = Gtk.Align.FILL
                break

            default:
                throw new Error(`Uknown align value: '${alignment}'.`)
                break
        }

        this.getMainHandle().setHalign(align)

        return this
    }

    setAlignVertical(alignment) {
        let align

        switch( alignment ) {
            case 'begining':
                align = Gtk.Align.START
                break

            case 'end':
                align = Gtk.Align.END
                break

            case 'center':
                align = Gtk.Align.CENTER
                break

            case 'baseline':
                align = Gtk.Align.BASELINE
                break

            case 'fill':
                align = Gtk.Align.FILL
                break

            default:
                throw new Error(`Uknown align value: '${alignment}'.`)
                break
        }

        this.getMainHandle().setValign(align)

        return this
    }

    setMarginLeft(margin) {
        this.getMainHandle().setMarginLeft(margin)
    }

    setMarginRight(margin) {
        this.getMainHandle().setMarginRight(margin)
    }

    setMarginTop(margin) {
        this.getMainHandle().setMarginTop(margin)
    }

    setMarginBottom(margin) {
        this.getMainHandle().setMarginBottom(margin)
    }

    setMarginHorizontal(margin) {
        this.getMainHandle().setMarginLeft(margin)
        this.getMainHandle().setMarginRight(margin)
    }

    setMarginVertical(margin) {
        this.getMainHandle().setMarginTop(margin)
        this.getMainHandle().setMarginBottom(margin)
    }

    setCss(cssClasses) {
        if( typeof(cssClasses) === 'string' ) {
            cssClasses = cssClasses.trim().split( ' ' )
        }

        const styleContext = this.getMainHandle().getStyleContext()

        cssClasses.forEach( (cssClass) => {
            styleContext.addClass( cssClass.trim() )
        })
    }

    /// View custom attributes

    setViewAttributes(value) {
        this.viewAttributes = value
    }

    getviewAttributes() {
        return this.viewAttributes
    }

    getViewAttribute({ at: attributeName, ifAbsent: absentValue }) {
        const value = this.viewAttributes[attributeName]

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