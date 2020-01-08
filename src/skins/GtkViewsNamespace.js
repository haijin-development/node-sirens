const Classification = require('../O').Classification
const NamespaceFlow = require('../finger-tips/flows/NamespaceFlow')
const SkinsGtk = require('./gtk-views/SkinsGtk')

class GtkViewsNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        SkinsGtk.initialize()

        flow.main({ id: 'GtkViewsNamespace' }, function(thisFlow) {

            this.createObjectCommandsFromFilesIn({
                folders: [
                    __dirname + '/gtk-views',
                ],
            })

        })
    }

    withGUIDo(closure) {
        SkinsGtk.do( closure )
    }

    setGlobalStyles({ cssFilePath: cssFilePath }) {
        SkinsGtk.setGlobalStyles({ cssFilePath: cssFilePath })
    }
}

module.exports = Classification.define(GtkViewsNamespace)
