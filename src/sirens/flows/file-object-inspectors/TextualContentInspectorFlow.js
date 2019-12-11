const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const Sirens = require('../../../Sirens')
const TextualContentComponent = require('../../components/file-object-inspectors/TextualContentComponent')

class TextualContentInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {
        })
    }

    getFlowComponent() {
        return TextualContentComponent.new({
            model: this.asFlowPoint(),
        })
    }
}

module.exports = Classification.define(TextualContentInspectorFlow)
