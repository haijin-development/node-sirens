const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const Resource = require('../../objects/Resource')
const MethodUnformattedComment = require('./unformatted-documentation/MethodUnformattedComment')
const MethodFormattedComment = require('./formatted-documentation/MethodFormattedComment')

class ClassMethodsDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const showsUnformattedComments = model.showsUnformattedComments()

        componentsRenderer.render(function (component) {

            this.horizontalSplitter( function() {

                this.container( function() {

                    this.styles({
                        viewAttributes: { splitProportion: 2.0/3.0 },
                        hScroll: 'never',
                        vScroll: 'never'
                    })

                    if( showsUnformattedComments ) {

                        this.component(
                            MethodUnformattedComment.new({
                                model: model,
                                viewAttributes: { splitProportion: 2.0 / 3 },
                            })
                        )

                    } else {

                        this.component(
                            MethodFormattedComment.new({
                                model: model,
                                viewAttributes: { splitProportion: 2.0 / 3 },
                            })
                        )

                    }

                })

                this.listChoice( function() {

                    this.model( model.getClassMethodsModel() )

                    this.styles({
                        viewAttributes: { splitProportion: 1.0 / 3 },
                        showHeaders: false,
                    })

                    this.column({
                        label: '',
                        getImageClosure: function(functionDefinition) { return Resource.image.method },
                        imageWidth: 24,
                        imageHeight: 24,
                    })

                    this.column({
                        getTextClosure: function(functionDefinition) { return functionDefinition.getFunctionSignatureString() },
                    })
                })

            })
        })
    }
}

module.exports = Classification.define(ClassMethodsDocumentation)
