const Classification = require('../../o-language/classifications/Classification')
const ComponentInstantiator = require('../../gui/components/ComponentInstantiator')
const Component = require('../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../gui/protocols/ComponentProtocol')
const ClassDocumentationBrowserModel = require('../models/ClassDocumentationBrowserModel')
const ClassDocumentationToolBar = require('./class-documentation-browser/ClassDocumentationToolBar')
const DocumentationBrowserBody = require('./class-documentation-browser/DocumentationBrowserBody')

class ClassDocumentationBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a new ClassDocumentationBrowserModel.
     */
    defaultModel() {
        const classDefinition = this.getProps().classDefinition

        return ClassDocumentationBrowserModel.new({
            classDefinition: classDefinition,
        })
    }

    /// Querying

    getWindowTitle() {
        const className = this.getModel().getClassName()

        return `Class ${className} documentation`
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {

                this.styles({
                    title: component.getWindowTitle(),
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function () {

                    this.component(
                        ClassDocumentationToolBar.new({
                            model: model,
                        })
                    )

                    this.component(
                        DocumentationBrowserBody.new({
                            model: model,
                        })
                    )

                })

            })
        })
    }
}

module.exports = Classification.define(ClassDocumentationBrowser)