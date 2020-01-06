const Classification = require('../../../O').Classification
const ObjectInspectorFlow = require('./ObjectInspectorFlow')
const JsMethodInspectorComponent = require('../../components/file-object-inspectors/JsMethodInspectorComponent')
const JsMethodDocumentationFlow = require('./JsMethodDocumentationFlow')

class JsMethodInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectInspectorFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineMethodsAsCommands({
                methods: [
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

            this.acceptedBubbledUps({
                commands: [
                    'updateMethodDocumentation'
                ]
            })

            this.whenObjectChanges( ({ newValue: jsMethod }) => {

                if( ! jsMethod ) {
                    this.getChildFlow({ id: 'methodSourceCode' }).setValue( '' )

                    this.getChildFlow({ id: 'methodDocumentation' })
                        .setValue( null )

                    return
                }

                const formattedSourceCode = jsMethod.getFormattedSourceCode()
                const methodDocumentation = thisFlow.getDocumentationOf({ jsMethod: jsMethod })

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

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'getMethod',
            'getMethodSignature',
            'isInEditionMode',
            'showsUnformattedComments',
            'getMethodUnformattedComment',
            'editMethodUnformattedComment',
            'setIsBrowsingDocumentation',
            'isBrowsingDocumentation',
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

        const dialog = this.guiNamespace().EditMethodCommentDialog.new({
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

    guiNamespace() {
        return this.bubbleUp({
            command: 'guiNamespace',
        })
    }

    getDocumentationOf({ jsMethod: jsMethod }) {
        return this.mainNamespace().DocumentationReader.new()
            .readMethodDocumentationFrom({ jsMethod: jsMethod })
    }
}

module.exports = Classification.define(JsMethodInspectorFlow)
