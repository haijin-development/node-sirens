const Classification = require('../../../O').Classification
const ObjectWithNamespace = require('../../../O').ObjectWithNamespace

const PlainTextStructureParser = require('../file-structure-parsers/PlainTextStructureParser')

const TextualContentInspectorFlow = require('../../flows/file-object-inspectors/TextualContentInspectorFlow')
const JsClassInspectorFlow = require('../../flows/file-object-inspectors/JsClassInspectorFlow')
const JsMethodInspectorFlow = require('../../flows/file-object-inspectors/JsMethodInspectorFlow')

/*
    Class(`
        A fileObject contents may vary depending on the type of the file.
        It could be a plain text file like a readme, a .json file, a .yaml
        file, a js script file, a js containing classes, a js containing
        tests, a js containing html components, etc.
        It could even be a script writen in a different language.

        Since the dynamic nature of the possible content types a file
        may have and the possibilities to show and edit those contents
        (the same file can have many different views, for example a script defining
        a ComponentView may be edited as plain text or with an WYSIWYG editor,
        or even may mix both modes, it may handle metadata of the file
        contents like its git history and diffs, etc) it is not possible to have
        a static decision tree to handle them all in advance.
        Instead the application should provide a way to define and plug in
        new FileObjectInspectorFlows dynamically.

        This Classification is a means to dynamically load and pick a FileObjectInspectorFlow
        to show and edit a fileObject based on its contents among all the available
        ones.
    `)
*/
class FileInspectorPlugins {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'availableFileParsers',
            'availableFileObjectInspectors'
        ]
        this.assumes = [ObjectWithNamespace]
    }

    initialize() {
        // review
        this.availableFileParsers = {
            default: PlainTextStructureParser,
        }

        this.availableFileObjectInspectors = {
            default: TextualContentInspectorFlow,
            jsClass: JsClassInspectorFlow,
            jsMethod: JsMethodInspectorFlow,
        }
    }

    addFileInspectorPlugin(pluginObject) {
        if( pluginObject.parser !== undefined ) {
            const fileType = pluginObject.parser.fileType
            const parser = pluginObject.parser.parser

            this.availableFileParsers[fileType] = parser
        }

        if( pluginObject.content !== undefined ) {
            const contentType = pluginObject.content.contentType
            const fileInspectorFlow = pluginObject.content.fileInspectorFlow

            this.availableFileObjectInspectors[contentType] = fileInspectorFlow
        }
    }

    pickFileParserFor({ sourceFile: sourceFile }) {
        const fileType = sourceFile.getFileType()

        const parserClassification = this.availableFileParsers[fileType] ?
            this.availableFileParsers[fileType]
            :
            this.availableFileParsers.default

        const parser = parserClassification.new()

        parser.setNamespace( this.namespace() )

        return parser
    }

    pickFileObjectInspectorFlowFor({ fileObject: fileObject }) {
        const fileObjectType = fileObject ?
            fileObject.getFileObjectType()
            :
            'null'

        const fileObjectInspectorFlowClassification =
            this.availableFileObjectInspectors[fileObjectType] ?
                this.availableFileObjectInspectors[fileObjectType]
                :
                this.availableFileObjectInspectors.default            

        return fileObjectInspectorFlowClassification.new()
    }
}

module.exports = Classification.define(FileInspectorPlugins)
