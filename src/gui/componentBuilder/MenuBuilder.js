const Classification = require('../../o-language/classifications/Classification')
const WidgetBuilder = require('./WidgetBuilder')
const MenuGroupBuilder = require('./MenuGroupBuilder')
const MenuGroup = require('../components/menus/MenuGroup')
const MenuBar = require('../components/menus/MenuBar')

class MenuBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['menuGroups']
        this.assumptions = [WidgetBuilder]
    }

    /// Initializing

    afterInstantiation() {
        this.menuGroups = []
    }

    /// Accessing

    getMenuGroups() {
        return this.menuGroups
    }

    /// Buidling

    createFromClosure(closure) {
        this.build(closure)

        const menuBar = MenuBar.new( this.getProps() )

        menuBar.addAllComponents( this.menuGroups )

        return menuBar
    }


    menuGroup(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const menuGroup = MenuGroupBuilder.new( props ).createFromClosure(closure)

        this.menuGroups.push( menuGroup )
    }
}

module.exports = Classification.define(MenuBuilder)