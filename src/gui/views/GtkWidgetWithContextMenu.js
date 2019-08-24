const Classification = require('../../o-language/classifications/Classification')
const MenuView = require('./MenuView')

class GtkWidgetWithContextMenu extends Classification {
    /// Definition

    static definition() {
        this.instanceVariables = ['populatePopupMenuBlock']
    }

    /// Actions

    showPopupMenu() {
        const menu = MenuView.new()

        this.populatePopupMenu({menu: menu})

        if(menu.getItemsCount() > 0) {
            menu.open()
        }
    }

    setPopulatePopupMenuBlock(block) {
        this.populatePopupMenuBlock = block
    }

    getPopulatePopupMenuBlock(block) {
        return this.populatePopupMenuBlock
    }

    populatePopupMenu({menu: menuView}) {
        if(this.populatePopupMenuBlock === undefined) { return }

        this.populatePopupMenuBlock({ menu: menuView, ownerView: this })
    }
}

module.exports = GtkWidgetWithContextMenu