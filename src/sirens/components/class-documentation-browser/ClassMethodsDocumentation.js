const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')

const Resource = require('../../objects/Resource')
const MethodUnformattedComment = require('./unformatted-documentation/MethodUnformattedComment')
const MethodFormattedComment = require('./formatted-documentation/MethodFormattedComment')

class ClassMethodsDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const showsUnformattedComments = model.showsUnformattedComments()

        const methodTags = model.getAllMethodsTags().sort()

        const selectedTagsModel = model.getSelectedTagsModel()

        componentsRenderer.render(function (component) {

            this.horizontalSplitter( function() {

                this.container({ viewAttributes: { splitProportion: 2.0/3.0 }, hasSrollBars: false, }, function() {

                    if( showsUnformattedComments ) {

                        this.component(
                            MethodUnformattedComment.new({
                                model: model,
                            })
                        )

                    } else {

                        this.component(
                            MethodFormattedComment.new({
                                model: model,
                            })
                        )

                    }

                })

                this.verticalStack({ viewAttributes: { splitProportion: 1.0 / 3.0 }, showHeaders: false, }, function() {

                    this.listChoice({ viewAttributes: { splitProportion: 1.0/2.0 }}, function() {
                        this.model( model.getClassMethodsModel() )

                        this.column({
                            getImageClosure: function(functionDefinition) { return Resource.image.method },
                            imageWidth: 24,
                            imageHeight: 24,
                        })

                        this.column({
                            label: 'Methods',
                            getTextClosure: function(functionDefinition) { return functionDefinition.getFunctionSignatureString() },
                        })
                    })

                    this.verticalSeparator()

                    this.label({
                        text: 'Tags',
                        viewAttributes: { stackSize: 'fixed' },
                    })

                    this.verticalSeparator()

                    this.container( function() {

                        this.verticalStack({ viewAttributes: { splitProportion: 1.0/2.0 }}, function() {

                            methodTags.forEach( (tag) => {
                                this.multipleCheckBox({
                                    model: selectedTagsModel,
                                    item: tag,
                                    label: tag,
                                    viewAttributes: { stackSize: 'fixed' },
                                })
                            })

                        })

                    })

                })

            })
        })
    }
}

module.exports = Classification.define(ClassMethodsDocumentation)
