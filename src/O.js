const path = require('path')
const fs = require('fs')

const O = {
    protocols: {},
}


function requireClassification({
    namespace: namespace, classificationName: classificationName, path: filePath
}) {
    if( namespace !== undefined ) {
        if( O[namespace][classificationName] !== undefined ) {
            throw new Error(`${namespace}.${classificationName} already defined.`)
        }

        O[namespace][classificationName] = require(filePath)
    } else {
        if( O[classificationName] !== undefined ) {
            throw new Error(`${classificationName} already defined.`)
        }

        O[classificationName] = require(filePath)
    }
}

function addClassificationsInFolder({ path: folderPath, namespace: namespace }) {
    const folderContents = fs.readdirSync( folderPath, { withFileTypes: true } )

    folderContents.forEach( (eachPath) => {
        const fullPath = path.join( folderPath, eachPath.name )

        if( eachPath.isDirectory() ) {
            child = addClassificationsInFolder({ path: fullPath, namespace: namespace })
        } else {
            const classificationName = path.basename( eachPath.name, '.js' )

            requireClassification({
                namespace: namespace,
                path: fullPath,
                classificationName: classificationName,
            })
        }
    })
}

const classificationsFolder = path.resolve( __dirname + '/o-language/classifications' )
const protocolsFolder = path.resolve( __dirname +  '/o-language/protocols' )

addClassificationsInFolder({ path: classificationsFolder })
addClassificationsInFolder({ path: protocolsFolder, namespace: 'protocols' })

module.exports = O