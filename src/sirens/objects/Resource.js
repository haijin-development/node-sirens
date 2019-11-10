const path = require('path')
const Classification = require('../../o-language/classifications/Classification')

const resourcesFolder = path.resolve( __dirname + '/../../../resources' )
const iconsFolder = resourcesFolder + '/icons/'

const Resource = {
    image: {
        array: iconsFolder + 'array.png',
        class: iconsFolder + 'class.png',
        false: iconsFolder + 'false.png',
        file: iconsFolder + 'file.png',
        folder: iconsFolder + 'folder.png',
        function: iconsFolder + 'function.png',
        haiku: iconsFolder + 'haiku.png',
        method: iconsFolder + 'method.png',
        null: iconsFolder + 'null.png',
        number: iconsFolder + 'number.png',
        object: iconsFolder + 'object.png',
        param: iconsFolder + 'param.png',
        prototype: iconsFolder + 'prototype.png',
        returns: iconsFolder + 'returns.png',
        string: iconsFolder + 'string.png',
        tag: iconsFolder + 'tag.png',
        true: iconsFolder + 'true.png',
        undefined: iconsFolder + 'undefined.png',
    }
}

module.exports = Resource
