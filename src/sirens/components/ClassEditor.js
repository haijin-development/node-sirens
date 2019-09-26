const Classification = require('../../o-language/classifications/Classification')
const ComponentInstantiator = require('../../gui/components/ComponentInstantiator')
const Component = require('../../gui/components/Component')
const ClassEditorModel = require('../models/ClassEditorModel')
const ClassEditorMenuBar = require('./class-editor/ClassEditorMenuBar')
const ClassesComponent = require('./class-editor/ClassesComponent')
const ComponentProtocol_Implementation = require('../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../gui/protocols/ComponentProtocol')
const FileChooser = require('../../gui/components/dialogs/FileChooser')

class ClassEditor {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
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

    /// Actions

    openFile() {
        const filename = FileChooser.openFile({
            title: 'Choose a file',
            window: this
        })

        if( filename !== null ) {
            this.getModel().openFile({ filename: filename })

            this.showFirstTabPage()
        }
    }

    saveFile() {
        const tabsComponent = this.getChildComponent({ id: 'tabs' })

        const selectedPageComponent = tabsComponent.getSelectedPageComponent()

        const selectedPageModel = selectedPageComponent.getModel()

        this.getModel().saveFile({ selectedPageModel: selectedPageModel })
    }

    showFirstTabPage() {
        const tabsComponent = this.getChildComponent({ id: 'tabs' })

        tabsComponent.showTabPageAt({ index: 0 })
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    title: 'Class editor',
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {
                    this.label({
                        model: model.getSourceFilenameModel(),
                        viewCustomAttributes: {
                            packExpand: false,
                        }
                    })

                    this.component(
                        ClassEditorMenuBar.new({
                            model: model,
                            openFile: component.openFile.bind(component),
                            saveFile: component.saveFile.bind(component),
                        })
                    )

                    this.tabs({ aligment: 'left', id: 'tabs' }, function() {


                        this.component(
                            ClassesComponent.new({
                                model: model.getClassesDefinitionsModel(),
                            })
                        )

                        this.tabPage({ label: 'Footer', fixedPosition: -1 }, function() {
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

module.exports = Classification.define(ClassEditor)