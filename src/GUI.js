const path = require('path')
const fs = require('fs')

const GUI = {
    protocols: {},
}

function requireClassification({
    namespace: namespace, classificationName: classificationName, path: filePath
}) {
    if( namespace !== undefined ) {
        if( GUI[namespace][classificationName] !== undefined ) {
            throw new Error(`${namespace}.${classificationName} already defined.`)
        }

        GUI[namespace][classificationName] = require(filePath)
    } else {
        if( GUI[classificationName] !== undefined ) {
            throw new Error(`${classificationName} already defined.`)
        }

        GUI[classificationName] = require(filePath)
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

addClassificationsInFolder({ path: __dirname +  '/gui/models' })
addClassificationsInFolder({ path: __dirname +  '/gui/protocols' })
addClassificationsInFolder({ path: __dirname +  '/gui/components/dialogs' })

GUI.Component = require('./gui/components/Component')
GUI.ComponentBehaviour = require('./gui/components/ComponentBehaviour')
GUI.ComponentInstantiator = require('./gui/components/ComponentInstantiator')
GUI.ComponentsList = require('./gui/components/ComponentsList')
GUI.Widget = require('./gui/components/Widget')
GUI.GtkIcons = require('./gui/gtk-views/constants/GtkIcons')

module.exports = GUI