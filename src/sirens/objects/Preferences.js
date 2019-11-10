const OInstanceObjectProperty = require('./OInstanceObjectProperty')

class Preferences {
    static prioritizesTag({ tag: tag }) {
        return this.prioritizedTags.includes( tag )
    }
}

Preferences.browseDocumentation = true
Preferences.objectPropertiesInspectorPlugins = [ OInstanceObjectProperty ]
Preferences.prioritizedTags = [
    'public', 'implementation'
]


module.exports = Preferences
