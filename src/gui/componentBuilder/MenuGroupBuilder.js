const Classification = require('../../o-language/classifications/Classification')
const WidgetBuilder = require('./WidgetBuilder')
const MenuItem = require('../components/menus/MenuItem')
const MenuItemSeparator = require('../components/menus/MenuItemSeparator')
const MenuGroup = require('../components/menus/MenuGroup')

class MenuGroupBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['menuItems']
        this.assumes = [WidgetBuilder]
    }

    /// Initializing

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.menuItems = []
    }

    /// Accessing

    getMenuItems() {
        return this.menuItems
    }

    /// Buidling

    createFromClosure(closure) {
        this.build(closure)

        const label = this.getProps().label

        const menuGroup = MenuGroup.new({
            label: label
        })

        menuGroup.addAllChildrenComponents( this.menuItems )

        return menuGroup
    }

    item({label: label, enabled: enabled, action: action}) {
        const menuItem = MenuItem.new({
            label: label,
            enabled: enabled,
            action: action
        })

        this.menuItems.push( menuItem )
    }

    separator() {
        const menuItemSeparator = MenuItemSeparator.new()

        this.menuItems.push( menuItemSeparator )
    }
}

module.exports = Classification.define(MenuGroupBuilder)