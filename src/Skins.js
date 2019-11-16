const path = require('path')
const fs = require('fs')

const Skins = {
    protocols: {},
}

function requireClassification({
    namespace: namespace, classificationName: classificationName, path: filePath
}) {
    if( namespace !== undefined ) {
        if( Skins[namespace][classificationName] !== undefined ) {
            throw new Error(`${namespace}.${classificationName} already defined.`)
        }

        Skins[namespace][classificationName] = require(filePath)
    } else {
        if( Skins[classificationName] !== undefined ) {
            throw new Error(`${classificationName} already defined.`)
        }

        Skins[classificationName] = require(filePath)
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

addClassificationsInFolder({ path: __dirname +  '/finger-tips/models' })
addClassificationsInFolder({ path: __dirname +  '/skins/protocols' })
addClassificationsInFolder({ path: __dirname +  '/skins/components/dialogs' })

Skins.Component = require('./skins/components/Component')
Skins.ComponentBehaviour = require('./skins/components/ComponentBehaviour')
Skins.ComponentInstantiator = require('./skins/components/ComponentInstantiator')
Skins.ComponentsList = require('./skins/components/ComponentsList')
Skins.Widget = require('./skins/components/Widget')
Skins.GtkIcons = require('./skins/gtk-views/constants/GtkIcons')

module.exports = Skins