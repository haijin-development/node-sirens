const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const ComponentsList = require('../../../gui/components/ComponentsList')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ListModelComponentProtocol_Implementation = require('../../../gui/protocols/ListModelComponentProtocol_Implementation')
const SingleClassMenu = require('./SingleClassMenu')
const FileFooterComponent = require('./FileFooterComponent')
const Sirens = require('../../../Sirens')
const Resource = require('../../objects/Resource')

class ClassesComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ComponentsList]
        this.implements = [
            ComponentProtocol_Implementation,
            ListModelComponentProtocol_Implementation
        ]
    }

    /// Actions

    openDocumentationBrowser(classEditionModel) {
        const classDefinition = classEditionModel.getClassDefinition()

        const selectedMethodName = classEditionModel.getSelectedMethodName()

        Sirens.browseClassDocumentation({
            classDefinition: classDefinition,
            methodName: selectedMethodName,
        })
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const footerModel = this.getProps().footerModel

        const items = this.getModel().getList()

        componentsRenderer.render( function(component) {

            this.tabs({ aligment: 'left', id: 'tabs' }, function() {

                items.forEach( (item, index) => {
                    component.renderItem({ item: item, index: index, renderer: this })
                })

                this.tabPage({ label: 'Footer', fixedPosition: -1 }, function() {

                    this.component(
                        FileFooterComponent.new({
                            model: footerModel,
                        })
                    )
                })

            })

        })
    }

    renderItem({ item: classEditionModel, index: index, renderer: renderer }) {
        const className = classEditionModel.getClassName()

        const component = this

        renderer.bindYourself( function() {

            this.tabPage({ label: 'Header' }, function() {
                this.text({
                    model: classEditionModel.getHeaderSourceCodeModel(),
                    viewAttributes: { splitProportion: 1.0 / 2 },
                })
            })

            this.tabPage({ label: className }, function() {

                this.verticalStack( function() {

                    this.verticalSplitter( function() {

                        this.model( classEditionModel.getSelectedMethodSourceCodeModel() )

                        this.listChoice( function() {

                            this.model( classEditionModel.getClassMethodsModel() )

                            this.styles({
                                viewAttributes: { splitProportion: 1.0 / 2 },
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

                        this.text({
                            model: classEditionModel.getSelectedMethodSourceCodeModel(),
                            viewAttributes: { splitProportion: 1.0 / 2 },
                        })

                    })

                    this.component(
                        SingleClassMenu.new({
                            openDocumentationBrowser: () => {
                                component.openDocumentationBrowser(classEditionModel)
                            }
                        })
                    )

                })

            })

        })
    }
}

module.exports = Classification.define(ClassesComponent)
