const path = require('path')
const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const PlaygroundComponent = require ('../../shared/PlaygroundComponent')

const MethodCommentHeader = require ('../MethodCommentHeader')
const EditMethodDescriptionHeader = require('../EditMethodDescriptionHeader')
const EditMethodCommentDialog = require('../edition/EditMethodCommentDialog')

const TagsDocumentation = require ('./TagsDocumentation')

const ParamsEditionHeader = require ('./ParamsEditionHeader')
const ParamDocumentation = require('./ParamDocumentation')

const ReturnsHeader = require('./ReturnsHeader')
const ReturnsDocumentation = require('./ReturnsDocumentation')

const ImplementationNotesEditionHeader = require ('./ImplementationNotesEditionHeader')
const ImplementationNoteDocumentation = require('./ImplementationNoteDocumentation')
const EditImplementationNoteDialog = require('../edition/EditImplementationNoteDialog')

const ExampleDocumentation = require('./ExampleDocumentation')
const ExamplesEditionHeader = require('./ExamplesEditionHeader')
const EditExampleDialog = require('../edition/EditExampleDialog')

const MethodSourceCodeDocumentation = require('./MethodSourceCodeDocumentation')

class MethodFormattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Actions

    updateMethodDocumentation({ documentation: documentation }) {
        const methodCommentContents = documentation.generateCommentContents({
                methodDocumentation: documentation,
            })

        const model = this.getModel()

        const method = this.getCurrentMethod()

        const methodComment = method.getComment()

        methodComment.writeFormattedContents({ commentContents: methodCommentContents })

        model.reloadClassDefinition()
    }

    /// Building

    reRenderWhen() {
        const model = this.getModel()

        const selectedMethodModel = model.getChild({ id: 'selectedMethod' })

        this.reRenderOnValueChangeOf( selectedMethodModel )
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'editMethodDocumentationComment',
            enabledIf: function() {
                return model.isInEditionMode() && model.getBrowsedClass()
            },
            whenActioned: this.editMethodDocumentationComment.bind(this),
        })

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'createMethodDocumentationImplementationNote',
            enabledIf: () => { model.isInEditionMode() && model.getBrowsedClass() },
            whenActioned: this.createMethodDocumentationImplementationNote.bind(this),
        })

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'editMethodDocumentationImplementationNote',
            enabledIf: () => { model.isInEditionMode() && model.getBrowsedClass() },
            whenActioned: this.editMethodDocumentationImplementationNote.bind(this),
        })

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'createMethodDocumentationExample',
            enabledIf: () => { model.isInEditionMode() && model.getBrowsedClass() },
            whenActioned: this.createMethodDocumentationExample.bind(this),
        })

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'editMethodDocumentationExample',
            enabledIf: () => { model.isInEditionMode() && model.getBrowsedClass() },
            whenActioned: this.editMethodDocumentationExample.bind(this),
        })

        const method = this.getCurrentMethod()

        const isInEditionMode = method != null && model.isInEditionMode()

        const documentation = this.getCurrentMethodDocumentation()

        if( documentation === null ) { return }

        let description = documentation.getDescription()

        if( description.trim() === '' ) {
            description = 'This method has no description.'
        }

        const params = documentation.getParams()

        const returns = documentation.getReturns()

        const implementationNotes = documentation.getImplementationNotes()

        const examples = documentation.getExamples()

        componentsRenderer.render( function(component) {

            this.container( { hScroll: 'never', width: 400, }, function() {

                this.verticalStack( function() {

                    this.styles({
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.component(
                        MethodCommentHeader.new({
                            method: method,
                        })
                    )

                    this.verticalSeparator()

                    this.component(
                        TagsDocumentation.new({
                            model: model,
                            method: method,
                        })
                    )

                    this.verticalSeparator()

                    if( isInEditionMode ) {
                        this.component(
                            EditMethodDescriptionHeader.new({
                                model: model,
                                method: method,
                                editionClosure: model.getActionHandler({ id: 'editMethodDocumentationComment' }),
                            })
                        )

                        this.verticalSeparator()
                    }

                    this.verticalSeparator()

                    this.component(
                        PlaygroundComponent.new({
                            id: 'playground',
                            text: "\n" + description + "\n",
                            hScroll: 'never',
                            vScroll: 'never',
                            viewAttributes: {
                                stackSize: 'fixed',
                            },
                        })
                    )


                    this.verticalSeparator()

                    if( isInEditionMode ) {
                        this.component(
                            ParamsEditionHeader.new({
                                model: model,
                                method: method,
                            })
                        )

                        this.verticalSeparator()
                    }

                    params.forEach( (param, index) => {
                        this.verticalSeparator()

                        this.component(
                            ParamDocumentation.new({
                                model: model,
                                index: index,
                                param: param,
                            })
                        )
                    })

                    if( isInEditionMode ) {
                        this.component(
                            ReturnsHeader.new({
                                model: model,
                            })
                        )

                        this.verticalSeparator()
                    }

                    if( returns !== undefined ) {
                        this.verticalSeparator()

                        this.component(
                            ReturnsDocumentation.new({
                                returns: returns,
                            })
                        )
                    }

                    if( isInEditionMode ) {
                        this.component(
                            ImplementationNotesEditionHeader.new({
                                model: model,
                                createClosure: model.getActionHandler({ id: 'createMethodDocumentationImplementationNote' }),
                            })
                        )

                        this.verticalSeparator()
                    }

                    implementationNotes.forEach( (implementationNote, index) => {

                        this.verticalSeparator()

                        this.component(
                            ImplementationNoteDocumentation.new({
                                model: model,
                                index: index,
                                implementationNote: implementationNote,
                                editClosure: () => {
                                    const handler = model.getActionHandler({ id: 'editMethodDocumentationImplementationNote' })
                                    handler({ atIndex: index, implementationNoteText: implementationNote })
                                },
                                deleteClosure: () => {
                                    const handler = model.getActionHandler({ id: 'deleteMethodDocumentationImplementationNote' })
                                    handler({ atIndex: index })
                                },
                            })
                        )

                    })

                    if( isInEditionMode ) {
                        this.component(
                            ExamplesEditionHeader.new({
                                model: model,
                                addClosure: model.getActionHandler({ id: 'createMethodDocumentationExample' }),
                            })
                        )

                        this.verticalSeparator()
                    }

                    examples.forEach( (example, index) => {

                        this.verticalSeparator()

                        this.component(
                            ExampleDocumentation.new({
                                model: model,
                                example: example,
                                editClosure: () => {
                                    const handler = model.getActionHandler({ id: 'editMethodDocumentationExample' })
                                    handler({ atIndex: index, example: example })
                                },
                                deleteClosure: () => {
                                    const handler = model.getActionHandler({ id: 'deleteMethodDocumentationExample' })
                                    handler({ atIndex: index })
                                },
                            })
                        )

                    })

                    this.verticalSeparator()

                    this.component(
                        MethodSourceCodeDocumentation.new({
                            method: method,
                        })
                    )
                })

            })

        })
    }

    editMethodDocumentationComment() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = model.getChild({ id: 'selectedMethod' }).getValue()

        const dialog = EditMethodCommentDialog.new({
            className: className,
            method: method,
            window: this.getProps().window,
            onUpdateMethodComment: model.getActionHandler({ id: 'updateMethodDocumentationComment' }),
            unformatted: false,
        })

        dialog.open()
    }

    createMethodDocumentationImplementationNote() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: 'Add the new implementation note here ...',
            window: this.getProps().window,
            onUpdateImplementationNote: model.getActionHandler({ id: 'addMethodDocumentationImplementationNote' }),
            acceptButtonLabel: `Add implementation note`,
            title: `${className}.${method.getFunctionSignatureString()}`,
            subtitle: `You are editing an implementation note of the method ${className}.${method.getName()}.`,
        })

        dialog.open()
    }

    editMethodDocumentationImplementationNote({ atIndex: index, implementationNoteText: implementationNoteText }) {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: implementationNoteText,
            window: this.getProps().window,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                const handler = model.getActionHandler({ id: 'updateMethodDocumentationImplementationNote' })
                handler({ atIndex: index, implementationNoteText: implementationNoteText })
            },
            acceptButtonLabel: `Update implementation note`,
            title:  `${className} implementation note.`,
            subtitle: `You are editing an implementation note of the method ${className}.${method.getName()}.`,
        })

        dialog.open()
    }

    createMethodDocumentationExample() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const newExample = {
            Description: 'Add the example description here ...',
            Code: 'Add the example code here ...',
        }

        const dialog = EditExampleDialog.new({
            className: className,
            example: newExample,
            window: this.getProps().window,
            onUpdateExample: model.getActionHandler({ id: 'addMethodDocumentationExample' }),
            acceptButtonLabel: `Add example`,
            title: `${className}.${method.getFunctionSignatureString()}`,
            subtitle: `You are editing an example of the method ${className}.${method.getName()}.`,
        })

        dialog.open()
    }

    editMethodDocumentationExample({ atIndex: index, example: example }) {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditExampleDialog.new({
            className: className,
            example: example,
            window: this.getProps().window,
            onUpdateExample: ({ example: example }) => {
                const handler = model.getActionHandler({ id: 'updateMethodDocumentationExample' })
                handler({ atIndex: index, example: example })
            },
            acceptButtonLabel: `Update example`,
            title: `${className}.${method.getFunctionSignatureString()}`,
            subtitle: `You are editing an example of the method ${className}.${method.getName()}.`,
        })

        dialog.open()
    }

    getCurrentMethod() {
        return this.getModel().getChild({ id: 'selectedMethod' }).getValue()
    }

    getCurrentMethodDocumentation() {
        return this.getModel().getChild({ id: 'selectedMethodDocumentation' }).getValue()
    }
}

module.exports = Classification.define(MethodFormattedComment)
