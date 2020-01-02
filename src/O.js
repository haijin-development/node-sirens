const {addClassificationsInFolder} = require('./helper')

const O = {
    protocols: {},
}

const classificationsFolder = __dirname + '/o-language/classifications'
const protocolsFolder = __dirname +  '/o-language/protocols'

addClassificationsInFolder({ path: classificationsFolder, object: O })

addClassificationsInFolder({ path: protocolsFolder, namespace: 'protocols', object: O })

module.exports = O