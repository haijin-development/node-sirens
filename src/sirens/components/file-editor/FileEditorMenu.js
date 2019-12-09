const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

const FileEditorMenuBar = require('./FileEditorMenuBar')
const FileEditorToolBar = require('./FileEditorToolBar')

class FileEditorMenu {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const props = this.getProps()

        componentsRenderer.render(function (component) {

            this.verticalStack( function() {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.component(
                    FileEditorMenuBar.new( props )
                )

                this.component(
                    FileEditorToolBar.new( props )
                )

            })

        })
    }
}

module.exports = Classification.define(FileEditorMenu)
