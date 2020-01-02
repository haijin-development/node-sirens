const path = require('path')
const fs = require('fs')

function requireClassification({
    object: object,
    namespace: namespace, classificationName: classificationName, path: filePath
}) {
    if( namespace !== undefined ) {
        if( object[namespace][classificationName] !== undefined ) {
            throw new Error(`${namespace}.${classificationName} already defined.`)
        }

        object[namespace][classificationName] = require(filePath)
    } else {
        if( object[classificationName] !== undefined ) {
            throw new Error(`${classificationName} already defined.`)
        }

        object[classificationName] = require(filePath)
    }
}

function addClassificationsInFolder({ path: folderPath, namespace: namespace, object: object }) {
    const folderContents = fs.readdirSync( folderPath, { withFileTypes: true } )

    folderContents.forEach( (eachPath) => {
        const fullPath = path.join( folderPath, eachPath.name )

        if( eachPath.isDirectory() ) {
            child = addClassificationsInFolder({ path: fullPath, namespace: namespace, object: object })
        } else {
            const classificationName = path.basename( eachPath.name, '.js' )

            requireClassification({
                object: object,
                namespace: namespace,
                path: fullPath,
                classificationName: classificationName,
            })
        }
    })
}

module.exports = {addClassificationsInFolder}