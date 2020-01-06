const Classification = require('../O').Classification
const NamespaceFlow = require('../finger-tips/flows/NamespaceFlow')

const FingerTipsNamespace = require('../finger-tips/FingerTipsNamespace')
const GtkViewsNamespace = require('./GtkViewsNamespace')

class SkinsNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        const fingerTipsNamespace = FingerTipsNamespace.new()
        const viewsNamespace = GtkViewsNamespace.new()

        flow.main({ id: 'SkinsNamespace' }, function(thisFlow) {

            this.createObjectCommandsFromFilesIn({
                folders: [
                    __dirname + '/componentBuilder',
                    __dirname + '/components',
                ],
            })

            this.namespace({ id: 'Views', from: viewsNamespace })
            this.namespace({ id: 'Models', from: fingerTipsNamespace })
        })
    }
}

module.exports = Classification.define(SkinsNamespace)
