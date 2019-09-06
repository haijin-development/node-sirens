const path = require('path')
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
        return ClassEditorModel.new().yourself( (model) => {
            const filename = this.getProps().filename

            if( filename !== undefined ) {
                model.openFile( { filename: filename })
            }
        })
    }

    /// Icons

    getMethodIcon() {
        return path.resolve( __dirname + '/../../resources/icons/function.png' )
    }

    /// Building

    renderWith(builder) {
        const model = this.getModel()

        builder.render( function(component) {
            this.window( function() {
                this.styles({
                    title: 'Class editor',
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {
                    this.component(
                        ClassEditorMenuBar.new({ model: model, parentComponent: component })
                    )

                    this.label({
                        model: model.getClassNameModel(),
                        viewCustomAttributes: {
                            packExpand: false,
                        }
                    })


                    this.tabs({ aligment: 'left', id: 'tabs' }, function() {
                        this.tabPage({ label: 'Header' }, function() {
                            this.text({
                                model: model.getHeaderSourceCodeModel(),
                                splitProportion: 1.0 / 2,
                            })
                        })

                        this.tabPage({ label: 'Class' }, function() {

                            this.verticalSplitter( function() {

                                this.listChoice( function() {
                                    this.styles({
                                        splitProportion: 1.0 / 2
                                    })

                                    this.model( model.getClassMethodsModel() )

                                    this.column({
                                        label: '',
                                        getImageBlock: function(functionDefinition) { return component.getMethodIcon() },
                                        imageWidth: 16,
                                        imageHeight: 16,
                                    })

                                    this.column({
                                        label: 'Methods',
                                        getTextBlock: function(functionDefinition) { return functionDefinition.getFunctionName() },
                                    })
                                })

                                this.text({
                                    model: model.getSelectedMethodSourceCodeModel(),
                                    splitProportion: 1.0 / 2,
                                })

                            })
                        })

                        this.tabPage({ label: 'Footer' }, function() {
                            this.text({
                                model: model.getFooterSourceCodeModel(),
                                splitProportion: 1.0 / 2,
                            })
                        })
                    })
                })
            })
        })
    }
}

module.exports = ComponentInstantiator.define(ClassEditor)