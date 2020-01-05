const Classification = require('../O').Classification
const NamespaceFlow = require('./flows/NamespaceFlow')

class FingerTipsNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'FingerTipsNamespace' }, function(thisFlow) {

            this.createObjectCommandsFromFilesIn({
                folders: [
                    __dirname + '/announcements',
                    __dirname + '/flow-builders',
                    __dirname + '/flows',
                    __dirname + '/models',
                    __dirname + '/stateful-flows',
                ]
            })
        })
    }
}

module.exports = Classification.define(FingerTipsNamespace)
