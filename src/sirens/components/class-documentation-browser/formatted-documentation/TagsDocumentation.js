const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

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
        const flow = this.getProps().model

        const method = this.getProps().method

        const isInEditionMode = method != null && flow.isInEditionMode()

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
                            onClicked: () => {
                                flow.editMethodTags({ parentWindow: component })
                            },
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
}

module.exports = Classification.define(TagsDocumentation)
