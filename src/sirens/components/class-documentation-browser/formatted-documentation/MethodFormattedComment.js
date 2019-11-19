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

    editMethodComment() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditMethodCommentDialog.new({
            className: className,
            method: method,
            window: this.getProps().window,
            onUpdateMethodComment: this.updateMethodComment.bind(this),
            unformatted: false,
        })

        dialog.open()
    }

    updateMethodComment({ methodNewDescription: methodNewDescription }) {
        const model = this.getModel()

        const method = this.getCurrentMethod()

        const documentation = method.getDocumentation()

        documentation.setDescription( methodNewDescription )

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    addNewImplementationNote() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: 'Add the new implementation note here ...',
            window: this.getProps().window,
            onUpdateImplementationNote: this.addImplementationNote.bind(this),
            acceptButtonLabel: `Add implementation note`,
            title: `${className}.${method.getFunctionSignatureString()}`,
            subtitle: `You are editing an implementation note of the method ${className}.${method.getName()}.`,
        })

        dialog.open()
    }

    addImplementationNote({ implementationNoteText: implementationNoteText }) {
        const model = this.getModel()

        const method = this.getCurrentMethod()

        const documentation = method.getDocumentation()

        documentation.addImplementationNote( implementationNoteText )

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    deleteImplementationNote({ atIndex: index }) {
        const model = this.getModel()

        const method = this.getCurrentMethod()

        const documentation = method.getDocumentation()

        documentation.deleteImplementationNoteAt({ index: index })

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }


    editImplementationNoteAt({ index: index, implementationNoteText: implementationNoteText }) {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: implementationNoteText,
            window: this.getProps().window,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                this.updateImplementationNoteAt({
                    index: index,
                    implementationNoteText: implementationNoteText,
                })
            },
            acceptButtonLabel: `Update implementation note`,
            title: `${className}.${method.getFunctionSignatureString()}`,
            subtitle: `You are editing an implementation note of the method ${className}.${method.getName()}.`,
        })

        dialog.open()
    }

    updateImplementationNoteAt({ index: index, implementationNoteText: implementationNoteText }) {
        const model = this.getModel()

        const method = this.getCurrentMethod()

        const documentation = method.getDocumentation()

        documentation.updateImplementationNoteAt({
            index: index,
            implementationNoteText: implementationNoteText,
        })

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    addNewExample() {
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
            onUpdateExample: this.addExample.bind(this),
            acceptButtonLabel: `Add example`,
            title: `${className}.${method.getFunctionSignatureString()}`,
            subtitle: `You are editing an example of the method ${className}.${method.getName()}.`,
        })

        dialog.open()
    }

    addExample({ example: example }) {
        const model = this.getModel()

        const method = this.getCurrentMethod()

        const documentation = method.getDocumentation()

        documentation.addExample( example )

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    editExampleAt({ index: index, example: example }) {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditExampleDialog.new({
            className: className,
            example: example,
            window: this.getProps().window,
            onUpdateExample: ({ example: example }) => {
                this.updateExampleAt({
                    index: index,
                    example: example,
                })
            },
            acceptButtonLabel: `Update example`,
            title: `${className}.${method.getFunctionSignatureString()}`,
            subtitle: `You are editing an example of the method ${className}.${method.getName()}.`,
        })

        dialog.open()
    }

    updateExampleAt({ index: index, example: example }) {
        const model = this.getModel()

        const method = this.getCurrentMethod()

        const documentation = method.getDocumentation()

        documentation.updateExampleAt({
            index: index,
            example: example,
        })

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    deleteExample({ atIndex: index }) {
        const model = this.getModel()

        const method = this.getCurrentMethod()

        const documentation = method.getDocumentation()

        documentation.deleteExampleAt({ index: index })

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

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

        const method = this.getCurrentMethod()

        const isInEditionMode = method != null && model.isInEditionMode()

        const editionClosure = isInEditionMode ?
            this.editMethodComment.bind(this) : undefined

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
                                editionClosure: editionClosure,
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
                                addNewImplementationNote: component.addNewImplementationNote.bind(component),
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
                                deleteImplementationNote: component.deleteImplementationNote.bind(component),
                                editImplementationNote: ({ atIndex: index }) => {
                                    component.editImplementationNoteAt({
                                        index: index,
                                        implementationNoteText: implementationNote,
                                    })
                                },
                            })
                        )

                    })

                    if( isInEditionMode ) {
                        this.component(
                            ExamplesEditionHeader.new({
                                model: model,
                                addNewExample: component.addNewExample.bind(component),
                            })
                        )

                        this.verticalSeparator()
                    }

                    examples.forEach( (example) => {

                        this.verticalSeparator()

                        this.component(
                            ExampleDocumentation.new({
                                model: model,
                                example: example,
                                deleteExample: component.deleteExample.bind(component),
                                editExample: ({ atIndex: index }) => {
                                    component.editExampleAt({
                                        index: index,
                                        example: example,
                                    })
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

    getCurrentMethod() {
        return this.getModel().getChild({ id: 'selectedMethod' }).getValue()
    }

    getCurrentMethodDocumentation() {
        return this.getModel().getChild({ id: 'selectedMethodDocumentation' }).getValue()
    }
}

module.exports = Classification.define(MethodFormattedComment)
