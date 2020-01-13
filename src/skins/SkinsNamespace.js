const Classification = require('../O').Classification
const NamespaceFlow = require('../finger-tips/flows/NamespaceFlow')

const FingerTipsNamespace = require('../finger-tips/FingerTipsNamespace')

class SkinsNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        const fingerTipsNamespace = FingerTipsNamespace.new()

        flow.main({ id: 'SkinsNamespace' }, function(thisFlow) {

            this.createObjectCommandsFromFilesIn({
                folders: [
                    __dirname + '/componentBuilder',
                    __dirname + '/components',
                ],
            })

            this.namespace({ id: 'Models', from: fingerTipsNamespace })
        })

        this.useNoViews()
    }

    // Namespaces

    viewsNamespace() {
        return this.getChildFlow({ id: 'Views' })
    }

    withGUIDo(closure) {
        const viewsNamespace = this.viewsNamespace()

        viewsNamespace.withGUIDo( closure )
    }

    useNoViews() {
        const NullViewsNamespace = require('./NullViewsNamespace')

        const nullViewsNamespace = NullViewsNamespace.new()

        this.removeChildFlow({ id: 'Views' })

        this.addChildNamespaceFlow({
            id: 'Views',
            namespaceFlow: nullViewsNamespace
        })
    }

    useGtkViews() {
        // only load GtkViewsNamespace on demand to avoid requiring its files
        const GtkViewsNamespace = require('./GtkViewsNamespace')

        const gtkViewsNamespace = GtkViewsNamespace.new()

        this.removeChildFlow({ id: 'Views' })

        this.addChildNamespaceFlow({
            id: 'Views',
            namespaceFlow: gtkViewsNamespace
        })
    }
}

module.exports = Classification.define(SkinsNamespace)
