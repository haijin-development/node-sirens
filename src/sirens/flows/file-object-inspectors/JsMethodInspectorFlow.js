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
                    'saveSelectedMethod',
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
            'saveSelectedMethod',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    // Methods

    getFlowComponent({ parentWindow: parentWindow }) {
        return JsMethodInspectorComponent.new({
            model: this.asFlowPoint(),
            window: parentWindow,
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
                this.updateMethodPlainComment({ methodNewComment: methodNewComment })
            },
        })

        dialog.open()
    }

    updateMethodPlainComment({ methodNewComment: methodNewComment }) {
        const method = this.getMethod()

        const methodComment = method.getMethodComment()

        const methodIndentation = method.getContentsIndentation()

        methodComment.writeContents({
            commentContents: methodNewComment,
            outerIndentation: methodIndentation,
        })

        this.reloadSourceFile()
    }

    updateMethodDocumentation({ methodDocumentation: methodDocumentation }) {
        const methodCommentContents = methodDocumentation.generateCommentContents()

        this.updateMethodPlainComment({
            methodNewComment: methodCommentContents
        })
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

    /*
        Method(`
            Writes the contents of the selected method edition to the method file.
        `)
    */
    saveSelectedMethod() {
        const jsMethod = this.getMethod()
        const editedMethodSourceCode = this.getChildFlow({ id: 'methodSourceCode' }).getValue()

        jsMethod.writeContents({ methodContents: editedMethodSourceCode })

        this.reloadSourceFile()
     }
}

module.exports = Classification.define(JsMethodInspectorFlow)
