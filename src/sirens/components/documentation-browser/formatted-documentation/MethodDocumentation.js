const path = require('path')
const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const PlaygroundComponent = require ('../../shared/PlaygroundComponent')

const EditMethodDescriptionHeader = require('../EditMethodDescriptionHeader')

const TagsDocumentation = require ('./TagsDocumentation')

const ParamsEditionHeader = require ('./ParamsEditionHeader')
const ParamDocumentation = require('./ParamDocumentation')

const ReturnsHeader = require('./ReturnsHeader')
const ReturnsDocumentation = require('./ReturnsDocumentation')

const ImplementationNotesEditionHeader = require ('./ImplementationNotesEditionHeader')
const ImplementationNoteDocumentation = require('./ImplementationNoteDocumentation')

const ExampleDocumentation = require('./ExampleDocumentation')
const ExamplesEditionHeader = require('./ExamplesEditionHeader')

const MethodSourceCodeDocumentation = require('./MethodSourceCodeDocumentation')

class MethodDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        if( ! flow ) { return }

        const methodDocumentation = flow.getMethodDocumentation()

        if( methodDocumentation === null ) { return }

        const isInEditionMode = flow.isInEditionMode()

        let description = methodDocumentation.getDescription()

        if( description.trim() === '' ) {
            description = 'This method has no description.'
        }

        const params = methodDocumentation.getParams()

        const returns = methodDocumentation.getReturns()

        const implementationNotes = methodDocumentation.getImplementationNotes()

        const examples = methodDocumentation.getExamples()

        componentsRenderer.render( function(component) {

            this.container( { hScroll: 'never', width: 400, }, function() {

                this.verticalStack( function() {

                    this.styles({
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.component(
                        TagsDocumentation.new({
                            model: flow,
                            methodDocumentation: methodDocumentation,
                        })
                    )

                    this.verticalSeparator()

                    if( isInEditionMode ) {
                        this.component(
                            EditMethodDescriptionHeader.new({
                                model: flow,
                                editionClosure: () => {
                                    flow.editMethodDocumentationComment({
                                        parentWindow: component
                                    })
                                },
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
                                model: flow,
                            })
                        )

                        this.verticalSeparator()
                    }

                    params.forEach( (param, index) => {
                        this.verticalSeparator()

                        this.component(
                            ParamDocumentation.new({
                                model: flow,
                                index: index,
                                param: param,
                            })
                        )
                    })

                    if( isInEditionMode ) {
                        this.component(
                            ReturnsHeader.new({
                                model: flow,
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
                                model: flow,
                                createClosure: () => {
                                    flow.createMethodDocumentationImplementationNote({
                                        parentWindow: component.getProps().window,
                                    })
                                },
                            })
                        )

                        this.verticalSeparator()
                    }

                    implementationNotes.forEach( (implementationNote, index) => {

                        this.verticalSeparator()

                        this.component(
                            ImplementationNoteDocumentation.new({
                                model: flow,
                                index: index,
                                implementationNote: implementationNote,
                                editClosure: () => {
                                    flow.editMethodDocumentationImplementationNote({
                                        atIndex: index,
                                        implementationNoteText: implementationNote
                                    })
                                },
                                deleteClosure: () => {
                                    flow.deleteMethodDocumentationImplementationNote({
                                        atIndex: index,
                                    })
                                },
                            })
                        )

                    })

                    if( isInEditionMode ) {
                        this.component(
                            ExamplesEditionHeader.new({
                                model: flow,
                                addClosure: () => {
                                    flow.createMethodDocumentationExample({
                                        parentWindow: component.getProps().window,
                                    })
                                },
                            })
                        )

                        this.verticalSeparator()
                    }

                    examples.forEach( (example, index) => {

                        this.verticalSeparator()

                        this.component(
                            ExampleDocumentation.new({
                                model: flow,
                                example: example,
                                editClosure: () => {
                                    flow.editMethodDocumentationExample({
                                        parentWindow: component.getProps().window,
                                        atIndex: index,
                                        example: example,
                                    })
                                },
                                deleteClosure: () => {
                                    flow.deleteMethodDocumentationExample({ atIndex: index })
                                },
                            })
                        )

                    })

                })

            })

        })
    }
}

module.exports = Classification.define(MethodDocumentation)
