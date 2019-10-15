const Classification = require('../../o-language/classifications/Classification')
const WidgetBuilder = require('./WidgetBuilder')
const ToolBar = require('../components/menus/ToolBar')
const ToolButton = require('../components/menus/ToolButton')
const ToogleToolButton = require('../components/menus/ToogleToolButton')
const ToolBarSeparator = require('../components/menus/ToolBarSeparator')

class ToolBarBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['toolBarItems']
        this.assumes = [WidgetBuilder]
    }

    /// Initializing

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.toolBarItems = []
    }

    /// Buidling

    createFromClosure(closure) {
        this.build(closure)

        const toolBar = ToolBar.new( this.getProps() )

        toolBar.addAllChildrenComponents( this.toolBarItems )

        return toolBar
    }

    button({ label: label, icon: icon, tooltip: tooltip, enabled: enabled, action: action }) {
        const menuItem = ToolButton.new({
            label: label,
            icon: icon,
            tooltip: tooltip,
            enabled: enabled,
            action: action,
        })

        this.toolBarItems.push(menuItem)
    }

    toggleButton({ model: model, label: label, icon: icon, tooltip: tooltip, enabled: enabled }) {
        const menuItem = ToogleToolButton.new({
            model: model,
            label: label,
            icon: icon,
            tooltip: tooltip,
            enabled: enabled,
        })

        this.toolBarItems.push(menuItem)
    }

    separator() {
        const separator = ToolBarSeparator.new()

        this.toolBarItems.push(separator)
    }
}

module.exports = Classification.define(ToolBarBuilder)