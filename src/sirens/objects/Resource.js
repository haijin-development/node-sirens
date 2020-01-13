const Classification = require('../../O').Classification
const FolderPath = require('../../O').FolderPath

const resourcesFolder = FolderPath.new({ path: __dirname + '/../../../resources' })
const iconsFolder = resourcesFolder.append({ path: 'icons' })

const Resource = {
    image: {
        array: iconsFolder.append({ path: 'array.png' }).getPath(),
        blockComment: iconsFolder.append({ path: 'block-comment.png' }).getPath(),
        class: iconsFolder.append({ path: 'class.png' }).getPath(),
        false: iconsFolder.append({ path: 'false.png' }).getPath(),
        file: iconsFolder.append({ path: 'file.png' }).getPath(),
        folder: iconsFolder.append({ path: 'folder.png' }).getPath(),
        function: iconsFolder.append({ path: 'function.png' }).getPath(),
        haiku: iconsFolder.append({ path: 'haiku.png' }).getPath(),
        implementationNote: iconsFolder.append({ path: 'implementation-note.png' }).getPath(),
        method: iconsFolder.append({ path: 'method.png' }).getPath(),
        null: iconsFolder.append({ path: 'null.png' }).getPath(),
        number: iconsFolder.append({ path: 'number.png' }).getPath(),
        object: iconsFolder.append({ path: 'object.png' }).getPath(),
        param: iconsFolder.append({ path: 'param.png' }).getPath(),
        prototype: iconsFolder.append({ path: 'prototype.png' }).getPath(),
        returnValue: iconsFolder.append({ path: 'return-value.png' }).getPath(),
        string: iconsFolder.append({ path: 'string.png' }).getPath(),
        tag: iconsFolder.append({ path: 'tag.png' }).getPath(),
        test: iconsFolder.append({ path: 'test.png' }).getPath(),
        testGroup: iconsFolder.append({ path: 'test-group.png' }).getPath(),
        true: iconsFolder.append({ path: 'true.png' }).getPath(),
        undefined: iconsFolder.append({ path: 'undefined.png' }).getPath(),
    }
}

module.exports = Resource
