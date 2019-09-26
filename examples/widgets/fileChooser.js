const Sirens = require('../../src/Sirens')
const FileChooser = require('../../src/gui/components/dialogs/FileChooser')


const selectedFilename = FileChooser.openFile({
    title: 'Choose a file'
})

console.info(selectedFilename)