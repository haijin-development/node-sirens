const ComponentInstantiator = require('../gui/components/ComponentInstantiator')
const Component = require('../gui/components/Component')
const ClassEditorModel = require('./models/ClassEditorModel')
const ClassEditorMenuBar = require('./components/ClassEditorMenuBar')

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
        const model = this.getModel()

        builder.render( function(component) {
            this.window( function() {
                this.styles({
                    title: 'Class editor',
                    width: 400,
                    height: 400,
                })

                this.verticalStack( function() {
                    this.component(
                        ClassEditorMenuBar.new({ model: model, parentComponent: component })
                    )
                })
            })
        })
    }
}

module.exports = ComponentInstantiator.define(ClassEditor)