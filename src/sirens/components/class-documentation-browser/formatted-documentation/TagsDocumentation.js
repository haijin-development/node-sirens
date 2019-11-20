const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const EditTagsDialog = require ('../edition/EditTagsDialog')

const GtkIcons = require('../../../../Skins').GtkIcons
const Resource = require('../../../objects/Resource')
const Preferences = require('../../../objects/Preferences')

class TagsDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getProps().model

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'editMethodTags',
            enabledIf: () => { return true },
            whenActioned: this.editMethodTags.bind(this),
        })

        const method = this.getProps().method

        const isInEditionMode = method != null && model.isInEditionMode()

        let tags = []

        if( method !== null ) {
            const methodDocumentation = method.getDocumentation()

            const allTags = methodDocumentation.getTagsSortedAlphabetically()

            const prioritizedTags = []

            const unprioritizedTags = allTags.filter( (tag) => {
                const prioritizesTag = Preferences.prioritizesTag({ tag: tag })

                if( prioritizesTag === true ) {
                    prioritizedTags.push( tag )
                }

                return prioritizesTag === false
            })

            tags = prioritizedTags.concat( unprioritizedTags )
        }

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.horizontalStack( function() {

                    this.image({
                        filename: Resource.image.tag,
                        width: 24,
                        height: 24,
                        viewAttributes: {
                            stackSize: 'fixed',
                            stackPadding: 10,
                        },
                    })

                    this.horizontalStack( function() {
                        tags.forEach( (tag) => {
                            this.label({
                                text: tag,
                                css: [ 'tag-label', tag ],
                                viewAttributes: {
                                    stackSize: 'fixed',
                                    stackPadding: 6,
                                },
                            })
                        })
                    })

                    if( isInEditionMode ) {

                        // To center the button keeping its size
                        this.label({
                            viewAttributes: {
                                stackSize: 'filled',
                            },
                        })

                        this.textButton({
                            text: 'Edit method tags ...',
                            image: {
                                iconName: GtkIcons.edit,
                                size: GtkIcons.size._16x16,
                            },
                            onClicked: model.getActionHandler({ id: 'editMethodTags' }),
                            viewAttributes: {
                                stackSize: 'fixed',
                            },
                        })

                        // To center the button keeping its size
                        this.label({
                            viewAttributes: {
                                stackSize: 'filled',
                            },
                        })
                    }

                })
            })

        })
    }

    /// Commands

    editMethodTags() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = model.getChild({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        const tags = documentation.getTags()

        const dialog = EditTagsDialog.new({
            className: className,
            method: method,
            tags: tags,
            window: this.getProps().window,
            onUpdateTags: model.getActionHandler({ id: 'updateMethodDocumentationTags' }),
            acceptButtonLabel: 'Update method tags',
        })

        dialog.open()
    }
}

module.exports = Classification.define(TagsDocumentation)
