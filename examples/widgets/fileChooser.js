const SkinsNamespace = require('../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

namespace.useGtkViews()

const selectedFilename = namespace.FileChooser.new()
    .openFile({
        title: 'Choose a file'
    })

console.info(selectedFilename)