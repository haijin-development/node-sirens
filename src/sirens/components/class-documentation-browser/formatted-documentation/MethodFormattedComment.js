const path = require('path')
const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../../gui/protocols/ComponentProtocol')

const PlaygroundComponent = require ('../../shared/PlaygroundComponent')

const MethodCommentHeader = require ('../MethodCommentHeader')
const EditMethodDescriptionHeader = require('../EditMethodDescriptionHeader')
const EditMethodCommentDialog = require('../edition/EditMethodCommentDialog')

const ParamsEditionHeader = require ('./ParamsEditionHeader')
const ParamDocumentation = require('./ParamDocumentation')
const EditParamDialog = require ('../edition/EditParamDialog')

const ReturnsHeader = require('./ReturnsHeader')
const ReturnsDocumentation = require('./ReturnsDocumentation')
const EditReturnsDialog = require('../edition/EditReturnsDialog')

const ImplementationNotesEditionHeader = require ('./ImplementationNotesEditionHeader')
const ImplementationNoteDocumentation = require('./ImplementationNoteDocumentation')
const EditImplementationNoteDialog = require('../edition/EditImplementationNoteDialog')

const ExampleDocumentation = require('./ExampleDocumentation')
const ExamplesEditionHeader = require('./ExamplesEditionHeader')
const EditExampleDialog = require('../edition/EditExampleDialog')

class MethodFormattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Actions

    editMethodComment() {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const dialog = EditMethodCommentDialog.new({
            model: model,
            method: method,
            window: this.getProps().window,
            onUpdateMethodComment: this.updateMethodComment.bind(this),
            unformatted: false,
        })

        dialog.open()
    }

    updateMethodComment({ methodNewDescription: methodNewDescription }) {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const documentation = method.getDocumentation()

        documentation.setDescription( methodNewDescription )

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    addNewParam() {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const newParam = {
            Name: 'Add the name of the parameter here ...',
            Description: 'Add the parameter description ...',
        }

        const dialog = EditParamDialog.new({
            model: model,
            method: method,
            param: newParam,
            window: this.getProps().window,
            onUpdateParam: this.addParam.bind(this),
            acceptButtonLabel: `Add param`,
        })

        dialog.open()
    }

    addParam({ param: param }) {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const documentation = method.getDocumentation()

        documentation.addParam( param )

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    editParamAt({ index: index, param: param }) {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const dialog = EditParamDialog.new({
            model: model,
            method: method,
            param: param,
            window: this.getProps().window,
            onUpdateParam: ({ param: param }) => {
                this.updateParamAt({
                    index: index,
                    param: param,
                })
            },
            acceptButtonLabel: `Update param`,
        })

        dialog.open()
    }

    updateParamAt({ index: index, param: param }) {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const documentation = method.getDocumentation()

        documentation.updateParamAt({
            index: index,
            param: param,
        })

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    deleteParam({ atIndex: index }) {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const documentation = method.getDocumentation()

        documentation.deleteParamAt({ index: index })

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    editReturns() {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const documentation = method.getDocumentation()

        const dialog = EditReturnsDialog.new({
            model: model,
            method: method,
            returns: documentation.getReturns(),
            window: this.getProps().window,
            onUpdateReturns: this.updateReturns.bind(this),
            acceptButtonLabel: `Update returns`,
        })

        dialog.open()
    }

    updateReturns({ returns: returns }) {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const documentation = method.getDocumentation()

        documentation.setReturns( returns )

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    addNewImplementationNote() {
        const model = this.getModel()

        const className = model.getClassName()

        const method = model.getSelectedMethod()

        const dialog = EditImplementationNoteDialog.new({
            model: model,
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

        const method = model.getSelectedMethod()

        const documentation = method.getDocumentation()

        documentation.addImplementationNote( implementationNoteText )

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    deleteImplementationNote({ atIndex: index }) {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const documentation = method.getDocumentation()

        documentation.deleteImplementationNoteAt({ index: index })

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }


    editImplementationNoteAt({ index: index, implementationNoteText: implementationNoteText }) {
        const model = this.getModel()

        const className = model.getClassName()

        const method = model.getSelectedMethod()

        const dialog = EditImplementationNoteDialog.new({
            model: model,
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

        const method = model.getSelectedMethod()

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

        const className = model.getClassName()

        const method = model.getSelectedMethod()

        const newExample = {
            Description: 'Add the example description here ...',
            Code: 'Add the example code here ...',
        }

        const dialog = EditExampleDialog.new({
            model: model,
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

        const method = model.getSelectedMethod()

        const documentation = method.getDocumentation()

        documentation.addExample( example )

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }

    editExampleAt({ index: index, example: example }) {
        const model = this.getModel()

        const className = model.getClassName()

        const method = model.getSelectedMethod()

        const dialog = EditExampleDialog.new({
            model: model,
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

        const method = model.getSelectedMethod()

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

        const method = model.getSelectedMethod()

        const documentation = method.getDocumentation()

        documentation.deleteExampleAt({ index: index })

        this.updateMethodDocumentation({
            documentation: documentation,
        })
    }




    updateMethodDocumentation({ documentation: documentation }) {
        const methodCommentContents = documentation.generateCommentContents()

        const model = this.getModel()

        const method = model.getSelectedMethod()

        const methodComment = method.getComment()

        methodComment.writeFormattedContents({ commentContents: methodCommentContents })

        model.reload()
    }

    /// Building

    reRenderWhen() {
        const selectedMethodModel = this.getModel().getSelectedMethodModel()

        this.reRenderOnValueChangeOf( selectedMethodModel )
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const isInEditionMode = method != null && model.isInEditionMode()

        const editionClosure = isInEditionMode ?
            this.editMethodComment.bind(this) : undefined

        const documentation = model.getSelectedMethodDocumentation()

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

                    this.component(
                        MethodCommentHeader.new({
                            method: method,
                        })
                    )

                    this.component(
                        PlaygroundComponent.new({
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
                                addNewParam: component.addNewParam.bind(component),
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
                                deleteParam: component.deleteParam.bind(component),
                                editParam: ({ atIndex: index }) => {
                                    component.editParamAt({
                                        index: index,
                                        param: param,
                                    })
                                },
                            })
                        )
                    })

                    if( isInEditionMode ) {
                        this.component(
                            ReturnsHeader.new({
                                model: model,
                                editReturns: component.editReturns.bind(component),
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

                })

            })

        })
    }
}

module.exports = Classification.define(MethodFormattedComment)
