const Classification = require('../../O').Classification

class GtkWidgetWithContextMenu {
    /// Definition

    static definition() {
        this.instanceVariables = ['populatePopupMenuBlock']
    }

    /// Actions

    showPopupMenu() {
        const menu = this.namespace().MenuView.new()

        menu.assemble()

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

        menuView.bindYourself(this.populatePopupMenuBlock, { ownerView: this })
    }

    releaseHandles() {
        this.previousClassificationDo( () => {
            this.releaseHandles()
        })

        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })
    }
}

module.exports = Classification.define(GtkWidgetWithContextMenu)