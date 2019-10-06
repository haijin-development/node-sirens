const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const ClassMethodsDocumentation = require('./ClassMethodsDocumentation')
const ClassUnformattedComment = require('./ClassUnformattedComment')
const ClassFormattedComment = require('./ClassFormattedComment')

class DocumentationBrowserBody {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    reRenderWhen() {
        const showUnformattedCommentsModel = this.getModel().getShowUnformattedCommentsModel()

        this.reRenderOnValueChangeOf( showUnformattedCommentsModel )
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {

            this.tabs({ aligment: 'top', id: 'tabs' }, function() {

                this.tabPage({ label: 'Class comment' }, function() {

                    if( model.showsUnformattedComments() ) {

                        this.component(
                            ClassUnformattedComment.new({
                                model: model
                            })
                        )

                    } else {

                        this.component(
                            ClassFormattedComment.new({
                                model: model
                            })
                        )

                    }

                })

                this.tabPage({ label: 'Class methods' }, function() {

                    this.component(
                        ClassMethodsDocumentation.new({
                            model: model
                        })
                    )

                })

            })

        })
    }
}

module.exports = Classification.define(DocumentationBrowserBody)
