const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')
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

            this.defineMethodsAsCommands({
                methods: [
                    'getText',
                ],
            })

            this.whenObjectChanges( ({ newValue: textualContent }) => {

                const text = textualContent ? textualContent : ''

                this.getChildFlow({ id: 'text' }).setValue( textualContent )

             })

            this.value({ id: 'text' })

        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'getText',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    // Methods

    getFlowComponent() {
        return TextualContentComponent.new({
            model: this.asFlowPoint(),
        })
    }

    setInspectedObject(...params) {
        this.setValue(...params)
    }

    getText() {
        const textualContent = this.getValue()

        return textualContent ? textualContent.getContents() : ''
    }

    setShowUnformattedComments({ value: boolean }) {
    }

    setIsEditingDocumentation({ value: boolean }) {
    }
}

module.exports = Classification.define(TextualContentInspectorFlow)
