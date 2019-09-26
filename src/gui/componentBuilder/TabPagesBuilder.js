const Classification = require('../../o-language/classifications/Classification')

class TabPagesBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    tabPage({ label: tabLabel, fixedPosition: tabFixedPosition }, closure) {
        this.bindYourself(closure)

        this.getLastChildComponent()
            .mergeProps({
                viewCustomAttributes: {
                    tabLabel: tabLabel,
                    tabFixedPosition: tabFixedPosition,
                }
            })
    }
}

module.exports = Classification.define(TabPagesBuilder)