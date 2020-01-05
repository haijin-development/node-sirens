const Classification = require('../O').Classification
const NamespaceFlow = require('../finger-tips/flows/NamespaceFlow')

class GtkViewsNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'GtkViewsNamespace' }, function(thisFlow) {

            this.createObjectCommandsFromFilesIn({
                folders: [
                    __dirname + '/gtk-views',
                ],
            })

        })
    }
}

module.exports = Classification.define(GtkViewsNamespace)
