const FileChooser = require('../../src/GUI').FileChooser
const Sirens = require('../../src/Sirens')


const selectedFilename = FileChooser.openFile({
    title: 'Choose a file'
})

console.info(selectedFilename)