const Classification = require('../../o-language/classifications/Classification')

class TabPagesBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = []
    }

    tabPage({label: tabLabel}, closure) {
        closure.call(this)

        this.getLastChildComponent()
            .setProps({
                viewCustomAttributes: {
                    tabLabel: tabLabel
                }
            })
    }
}

module.exports = Classification.define(TabPagesBuilder)