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

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

            this.whenObjectChanges( ({ newValue: textualContent }) => {

                const text = textualContent ? textualContent : ''

                this.getChildFlow({ id: 'text' }).setValue( textualContent )

             })

            this.value({ id: 'text' })

        })
    }

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {

            this.statelessCommands({
                definedInFlow: thisFlow,
                withMethods: [
                    'getText',
                ],
            })

        })

    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.getText',
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
