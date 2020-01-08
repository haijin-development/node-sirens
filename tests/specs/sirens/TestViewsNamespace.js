const Classification = require('../../../src/O').Classification
const NamespaceFlow = require('../../../src/finger-tips/flows/NamespaceFlow')

/*
    Class(`
        During the tests of Sirens we assume no particular GUI library.

        Changing Skins.Views namespace flow by this Namespace ensures that GTK
        view are not created in any Sirens test.

        This is also an example of how to use the Namespace as a Factory pattern to
        change from the default GtkViews library to a different one.

        A different GUI library should implement a NamespaceFlow like these one capable
        of creating any View defined in the folder 

                skins/gtk-views

        See the classification

                skins/GtkViewsNamespace.js

        for an example.
    `)
*/
class TestViewsNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'TestViewsNamespace' }, function(thisFlow) {
        })
    }
}

module.exports = Classification.define(TestViewsNamespace)
