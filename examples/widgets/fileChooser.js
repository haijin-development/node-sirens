const SkinsNamespace = require('../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

const selectedFilename = namespace.FileChooser.new()
    .openFile({
        title: 'Choose a file'
    })

console.info(selectedFilename)