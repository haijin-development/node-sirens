const Classification = require('../../../O').Classification
const ObjectInspectorFlow = require('./ObjectInspectorFlow')
const JsMethodInspectorComponent = require('../../components/file-object-inspectors/JsMethodInspectorComponent')
const JsMethodDocumentationFlow = require('./JsMethodDocumentationFlow')
const EditMethodCommentDialog = require('../../components/documentation-browser/edition/EditMethodCommentDialog')

class JsMethodInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectInspectorFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

            this.whenObjectChanges( ({ newValue: jsMethod }) => {

                if( ! jsMethod ) {
                    this.getChildFlow({ id: 'methodSourceCode' }).setValue( '' )

                    this.getChildFlow({ id: 'methodDocumentation' })
                        .setValue( null )

                    return
                }

                const formattedSourceCode = jsMethod.getFormattedSourceCode()
                const methodDocumentation = jsMethod.getDocumentation()

                this.getChildFlow({ id: 'methodSourceCode' }).setValue( formattedSourceCode )

                this.getChildFlow({ id: 'methodDocumentation' })
                    .setValue( methodDocumentation )
             })

            this.value({ id: 'methodSourceCode' })

            this.object({
                id: 'methodDocumentation',
                definedWith: JsMethodDocumentationFlow.new()
            })

        })
    }

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {

            this.statelessCommands({
                definedInFlow: thisFlow,
                withMethods: [
                    'getMethod',
                    'getMethodSignature',
                    'isInEditionMode',
                    'showsUnformattedComments',
                    'getMethodUnformattedComment',
                    'editMethodUnformattedComment',
                    'setIsBrowsingDocumentation',
                    'isBrowsingDocumentation',
                ],
            })

        })

        this.acceptedBubbledUps({
            commands: [
                'updateMethodDocumentation'
            ]
        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.getMethod',
            'flow-commands.getMethodSignature',
            'flow-commands.isInEditionMode',
            'flow-commands.showsUnformattedComments',
            'flow-commands.getMethodUnformattedComment',
            'flow-commands.editMethodUnformattedComment',
            'flow-commands.setIsBrowsingDocumentation',
            'flow-commands.isBrowsingDocumentation',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    // Methods

    getFlowComponent() {
        return JsMethodInspectorComponent.new({
            model: this.asFlowPoint(),
        })
    }

    getMethod() {
        return this.getValue()
    }

    getMethodSignature() {
        return this.getMethod().getSignatureString()
    }

    getMethodUnformattedComment() {
        return this.getMethod().getMethodComment().getContents()
    }

    editMethodUnformattedComment({ parentWindow: parentWindow }) {
        const method = this.getMethod()

        const dialog = EditMethodCommentDialog.new({
            method: method,
            window: parentWindow,
            onUpdateMethodComment: ({ methodNewComment: methodNewComment }) => {
                this.updateMethodUnformmatedComment({ methodNewComment: methodNewComment })
            },
        })

        dialog.open()
    }

    updateMethodUnformmatedComment({ methodNewComment: methodNewComment }) {
        const method = this.getMethod()

        method.getMethodComment().writeContents({
            contents: methodNewComment
        })

        this.reloadSourceFile()
    }

    updateMethodDocumentation({ methodDocumentation: methodDocumentation }) {
        const methodCommentContents = methodDocumentation.generateCommentContents()

        const method = this.getMethod()

        const methodComment = method.getMethodComment()

        const methodIndentation = method.getContentsIndentation()

        methodComment.writeFormattedContents({
            commentContents: methodCommentContents,
            outerIndentation: methodIndentation,
        })

        this.reloadSourceFile()
    }
}

module.exports = Classification.define(JsMethodInspectorFlow)
