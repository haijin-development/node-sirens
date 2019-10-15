const Protocol = require('../../o-language/classifications/Protocol')

class GtkViewProtocol_Implementation {

    /// Accessing

    /*
        A GtkView may be implemented using one or more Gtk handles.
        For example a ListView uses a Gtk.ListStore Gtk.TreeView and a Gtk.ScrolledWindow.
        This method returns the handle that must be added as a child of another Gtk container.
    */
    getMainHandle() {}

    /*
        Once a child GtkView is added to its parent GtkView the child GtkView receives this message.

        During this message the child can perform some specific management of the Gtk handles, like
        GtkRadio button does, or notify the parent GtkView with an actual Gtk widget handle to add
        itself as a child.

        This overly complex mechanism to add a child GtkView is require because the mapping from
        GtkViews to Gtk objects is not one to one.
        Tthat is, not all GtkView owns a single Gtk widget handle. Some GtkViews own many handles,
        some own none, like ComponentView.
    */
    connectToParentHandleOwnerView() {}

    /*
        Once a child GtkView is removed from its parent GtkView the child GtkView receives this message.

        During this message the child can perform some specific management of the Gtk handles, like
        GtkRadio button does, or notify the parent GtkView with an actual Gtk widget handle to add
        itself as a child.

        This overly complex mechanism to add a child GtkView is require because the mapping from
        GtkViews to Gtk objects is not one to one.
        Tthat is, not all GtkView owns a single Gtk widget handle. Some GtkViews own many handles,
        some own none, like ComponentView.
    */
    disconnectFromParentHandleOwnerView() {}

    /*
        A parent GtkView that owns a Gtk container handle will receive this message when
        a child GtkView owning a Gtk widget handle is added as a child of it.

        That is, this method does the actual connection between parent and child Gtk widget handles
        ignoring the intermediate GtkComponents.

        In most cases this method will simply do

            directChildViewAdd(childView) {
                const childHandle = childView.getMainHandle()

                this.getMainHandle().add( childHandle )

                this.getMainHandle().showAll()
            }
 
        like GtkWidget does but in some particular cases it may implement more complex logic like
        GtkStackView, GtkSplitterView and GtkTabs do.

    */
    directChildViewAdd(childView) {
        this.param(childView) .compliesWith( _GtkViewProtocol_Implementation )
    }

    /*
        A parent GtkView that owns a Gtk container handle will receive this message when
        a child GtkView owning a Gtk widget handle is removed from it.

        That is, this method does the actual disconnection between parent and child Gtk widget handles
        ignoring the intermediate GtkComponents.

        In most cases this method will simply do

            directChildViewAdd(childView) {
                const childHandle = childView.getMainHandle()

                this.getMainHandle().remove( childHandle )
            }
 
        like GtkWidget does but in some particular cases it may implement more complex logic like
        GtkStackView, GtkSplitterView and GtkTabs do.

    */
    directChildViewRemove(childView) {
        this.param(childView) .compliesWith( _GtkViewProtocol_Implementation )
    }

    /*
        Iterate over this GtkView and its descendant GtkViews until the leafs that are own Gtk handles.

        This method is a convenient way for a parent GtkView to reach only its own children owning
        concrete Gtk widget handles ignoring all the intermediate ComponentViews.
    */
    concreteViewsDo(closure) {
        this.param(closure) .isFunction()
    }
}

_GtkViewProtocol_Implementation = Protocol.define(GtkViewProtocol_Implementation)

module.exports = _GtkViewProtocol_Implementation