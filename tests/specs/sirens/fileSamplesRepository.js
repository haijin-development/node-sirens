const FilesRepository = require('../../FilesRepository')

const fileSamplesRepository = new FilesRepository({
    baseSourceFolder: __dirname + '/../../samples',
    tmpFolderPath: __dirname + '/../../tmp-files-repository',
})

module.exports = fileSamplesRepository