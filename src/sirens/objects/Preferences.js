
class Preferences {
    static prioritizesTag({ tag: tag }) {
        return this.methodTags.prioritizedTags.includes( tag )
    }
}

Preferences.methodTags = {
    prioritizedTags: [ 'public', 'implementation' ],
}
module.exports = Preferences
