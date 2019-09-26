const Classification = require('../../o-language/classifications/Classification')
const WidgetBuilder = require('./WidgetBuilder')
const MenuGroupBuilder = require('./MenuGroupBuilder')
const MenuBar = require('../components/menus/MenuBar')

class MenuBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['menuGroups']
        this.assumes = [WidgetBuilder]
    }

    /// Initializing

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

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

        menuBar.addAllChildrenComponents( this.menuGroups )

        return menuBar
    }


    menuGroup(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const menuGroup = MenuGroupBuilder.new( props ).createFromClosure(closure)

        this.menuGroups.push( menuGroup )
    }
}

module.exports = Classification.define(MenuBuilder)