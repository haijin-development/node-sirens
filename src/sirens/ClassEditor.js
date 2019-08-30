const Classification = require('../../src/o-language/classifications/Classification')
const ComponentClassification = require('../gui/components/ComponentClassification')
const Component = require('../gui/components/Component')
const Sirens = require('../Sirens')
const ClassEditorModel = require('./models/ClassEditorModel')

class ClassEditor {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
    }

    /// Initializing

    /**
     * Returns a new ObjectBrowserModel.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        return ClassEditorModel.new()
    }

    /// Building

    renderWith(builder) {
        const browserModel = this.getModel()

        builder.render( function(component) {
            this.window( function() {
                this.styles({
                    title: 'Class editor',
                    width: 400,
                    height: 400,
                })
            })
        })
    }
}

module.exports = Classification.define(ClassEditor)
                    .behaveAs(ComponentClassification)