const Classification = require('../O').Classification
const NamespaceFlow = require('../finger-tips/flows/NamespaceFlow')

class NullViewsNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'NullViewsNamespace' }, function(thisFlow) {
        })
    }

    withGUIDo(closure) {
        console.info('Trying to use a Skins.View before defining its namespace.')
    }

    setGlobalStyles({ cssFilePath: cssFilePath }) {
    }
}

module.exports = Classification.define(NullViewsNamespace)
