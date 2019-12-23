
class Preferences {
    static prioritizesTag({ tag: tag }) {
        return this.methodTags.prioritizedTags.includes( tag )
    }
}

Preferences.methodTags = {
    prioritizedTags: [ 'public', 'implementation' ],
}

Preferences.cssFile = __dirname + '/../../resources/css/sirens.css'

module.exports = Preferences
