const OInstanceObjectProperty = require('./OInstanceObjectProperty')

class Preferences {
    static tagColor({ tag: tagName }) {
        if( Preferences.tags[tagName] === undefined ) {
            return Preferences.tags.default.color
        }

        return Preferences.tags[tagName].color
    }
}

Preferences.browseDocumentation = true
Preferences.objectPropertiesInspectorPlugins = [ OInstanceObjectProperty ]
Preferences.tags = {
    public:  { color: '#000080', },
    private: { color: 'red', },
    default: { color: '#e7e774', },
}


module.exports = Preferences
