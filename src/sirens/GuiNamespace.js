const Classification = require('../O').Classification
const NamespaceFlow = require('../finger-tips/flows/NamespaceFlow')

class GuiNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = ['skinsNamespace']
        this.assumes = [NamespaceFlow]
    }

    initialize({ id: id, idPath: idPath, skinsNamespace: skinsNamespace }) {
        this.skinsNamespace = skinsNamespace

        this.previousClassificationDo( () => {
            this.initialize({ id: id, idPath: idPath })
        })
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'GuiNamespace' }, function(thisFlow) {

            const skinsNamespace = thisFlow.getSkinsNamespace()

            this.createObjectCommandsFromFilesIn({
                folders: [
                    __dirname + '/components/documentation-browser/edition',
                ],
                inNamespace: skinsNamespace,
            })
        })
    }

    getSkinsNamespace() {
        return this.skinsNamespace
    }
}

module.exports = Classification.define(GuiNamespace)
