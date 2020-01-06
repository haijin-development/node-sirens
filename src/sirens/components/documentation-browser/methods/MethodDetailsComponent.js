const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const Resource = require('../../../objects/Resource')
const DocumentationExample = require('../../../objects/documentation/sections/DocumentationExample')
const DocumentationParam = require('../../../objects/documentation/sections/DocumentationParam')
const DocumentationReturnValue = require('../../../objects/documentation/sections/DocumentationReturnValue')
const DocumentationImplementationNote = require('../../../objects/documentation/sections/DocumentationImplementationNote')
const ValueFlowContainerComponent = require('../../shared/ValueFlowContainerComponent')

class MethodDetailsComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const documentationIndexFlow = flow.getFlowPoint({ id: 'documentationIndex' })

        const selectedDocumentationItemFlow =
            flow.getSelectedDocumentationItemFlowPoint()

        const isInEditionMode = flow.isInEditionMode()

        componentsRenderer.render( function(component) {

            this.label({
                text: 'Details',
                css: [ 'title-1', ],
                viewAttributes: { stackSize: 'fixed' },
            })

            this.container( function() {

                this.styles({
                    hasScrollBars: false,
                    css: [ 'documentation-index', ],
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.treeChoice( function() {
                    this.model( documentationIndexFlow )

                    this.styles({
                        vScroll: 'always',
                        showHeaders: false,
                        clickableHeaders: false,
                    })

                    this.column({
                        label: '',
                        getImageClosure: function(documentSection) {
                            return component.iconFor({ documentSection: documentSection })
                        },
                        imageWidth: 16,
                        imageHeight: 16,
                    })

                    this.column({
                        label: '',
                        getTextClosure: function(documentSection) {
                            return component.displayTextFor({ documentSection: documentSection })
                        },
                    })

                    if( isInEditionMode === true ) {
                        this.popupMenu( function() {
                            component.populatePopupMenu({
                                menu: this,
                                documentationIndexFlow: documentationIndexFlow,
                            })
                        })
                    }

                })

            })

            this.container( function() {

                this.styles({
                    hasScrollBars: false,
                    css: [ 'documentation-section', ],
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.component(
                    ValueFlowContainerComponent.new({
                        model: selectedDocumentationItemFlow,
                        getFlowComponentClosure: function() {
                            return flow.getSelectedDocumentationItemComponent()
                        },
                    })
                )

            })
        })
    }

    displayTextFor({ documentSection: documentSection }) {
        if( documentSection.isBehavingAs( DocumentationExample ) ) {
            const description = documentSection.getDescription().replace(/[\r\n]+/mg, '')

            const maxLength = 90

            return description.length <= maxLength ?
                description
                :
                description.slice( 0, maxLength - 3 ) + '...'
        }

        if( documentSection.isBehavingAs( DocumentationParam ) ) {
            const note = documentSection.getName()

            const maxLength = 90

            return note.length <= maxLength ?
                note
                :
                note.slice( 0, maxLength - 3 ) + '...'
        }

        if( documentSection.isBehavingAs( DocumentationReturnValue ) ) {
            return 'Return value'
        }

        if( documentSection.isBehavingAs( DocumentationImplementationNote ) ) {
            const note = documentSection.getText().replace(/[\r\n]+/mg, '')

            const maxLength = 90

            return note.length <= maxLength ?
                note
                :
                note.slice( 0, maxLength - 3 ) + '...'
        }

        return documentSection.getLabel()
    }

    iconFor({ documentSection: documentSection }) {
        if( documentSection.isBehavingAs( DocumentationImplementationNote ) ) {
            return Resource.image.implementationNote
        }

        if( documentSection.isBehavingAs( DocumentationParam ) ) {
            return Resource.image.param
        }

        if( documentSection.isBehavingAs( DocumentationReturnValue ) ) {
            return Resource.image.returnValue
        }

        if( documentSection.isBehavingAs( DocumentationExample ) ) {
            return Resource.image.haiku
        }

        switch( documentSection.getLabel() ) {
            case 'Implementation notes':
                return Resource.image.implementationNote
                break
            case 'Parameters':
                return Resource.image.param
                break
            case 'Return value':
                return Resource.image.returnValue
                break
            case 'Examples':
                return Resource.image.haiku
                break
            default:
                return null
        }
    }

    populatePopupMenu({ menu: menu, documentationIndexFlow: documentationIndexFlow }) {
        const treeSelection = documentationIndexFlow.getSelectionValue()

        const flow = this.getModel()

        if( treeSelection.isBehavingAs(DocumentationImplementationNote) ) {
            const implementationNote = treeSelection

            menu.item({
                label: 'Edit implementation note...',
                action: () => {
                    flow.editMethodDocumentationImplementationNote({
                        parentWindow: this.getProps().window,
                        implementationNote: implementationNote,
                    })
                },
            })

            menu.item({
                label: 'Delete implementation note',
                action: () => {
                    flow.deleteMethodDocumentationImplementationNote({
                        implementationNote: implementationNote,
                    })
                },
            })
        }

        if( treeSelection.isBehavingAs(DocumentationReturnValue) ) {
            const implementationNote = treeSelection

            menu.item({
                label: 'Edit the return value...',
                action: () => {
                    flow.editMethodDocumentationReturnValue({
                        parentWindow: this.getProps().window,
                    })
                },
            })
        }

        if( treeSelection.isBehavingAs(DocumentationParam) ) {
            const param = treeSelection

            menu.item({
                label: 'Edit param...',
                action: () => {
                    flow.editMethodDocumentationParam({
                        parentWindow: this.getProps().window,
                        param: param,
                    })
                },
            })

            menu.item({
                label: 'Delete param',
                action: () => {
                    flow.deleteMethodDocumentationParam({
                        param: param,
                    })
                },
            })
        }

        if( treeSelection.isBehavingAs(DocumentationExample) ) {
            const example = treeSelection

            menu.item({
                label: 'Edit implementation note...',
                action: () => {
                    flow.editMethodDocumentationExample({
                        parentWindow: this.getProps().window,
                        example: example,
                    })
                },
            })

            menu.item({
                label: 'Delete implementation note',
                action: () => {
                    flow.deleteMethodDocumentationExample({
                        example: example,
                    })
                },
            })
        }

        if( treeSelection.respondsTo('getLabel') ) {
            switch( treeSelection.getLabel() ) {
                case 'Implementation notes':
                    menu.item({
                        label: 'Add a new implementation note...',
                        action: () => {
                            flow.createMethodDocumentationImplementationNote({
                                parentWindow: this.getProps().window,
                            })
                        },
                    })
                    break
                case 'Parameters':
                    menu.item({
                        label: 'Add a new parameter...',
                        action: () => {
                            flow.createMethodDocumentationParam({
                                parentWindow: this.getProps().window,
                            })
                        },
                    })
                    break
                case 'Examples':
                    menu.item({
                        label: 'Add a new example...',
                        action: () => {
                            flow.createMethodDocumentationExample({
                                parentWindow: this.getProps().window,
                            })
                        },
                    })
                    break
                default:
                    return            
            }
        }
    }
}

module.exports = Classification.define(MethodDetailsComponent)
