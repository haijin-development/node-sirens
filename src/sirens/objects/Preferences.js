const OInstanceObjectProperty = require('./OInstanceObjectProperty')
const DocumentationDsl = require('./documentation/documentationDsl/DocumentationDsl')

class Preferences {
    static prioritizesTag({ tag: tag }) {
        return this.prioritizedTags.includes( tag )
    }
}

Preferences.browseDocumentation = true

Preferences.objectPropertiesInspectorPlugins = [
    OInstanceObjectProperty
]

Preferences.prioritizedTags = [
    'public', 'implementation'
]

Preferences.documentationDefaultFormat = DocumentationDsl

Preferences.documentationFormats = [
    DocumentationDsl,
]

module.exports = Preferences
