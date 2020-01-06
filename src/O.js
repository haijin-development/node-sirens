const FolderPath = require('./o-language/classifications/paths/FolderPath')

const O = {
    protocols: {},
}

const classificationsFolder = __dirname + '/o-language/classifications'
const protocolsFolder = __dirname +  '/o-language/protocols'

FolderPath.new({ path: classificationsFolder }).allFilesDo( (filePath) => {
    const classificationName = filePath.getFileName({ withExtension: false })
    const filePathString = filePath.getPath()

    O[ classificationName ] = require( filePathString )
})

FolderPath.new({ path: protocolsFolder }).allFilesDo( (filePath) => {
    const protocolName = filePath.getFileName({ withExtension: false })
    const filePathString = filePath.getPath()

    O.protocols[ protocolName ] = require( filePathString )
})

module.exports = O