const path = require('path')
const fs = require('fs')
const esprima = require('esprima')
const ClassDefinitionsCollector = require('./parsers/ClassDefinitionsCollector')
const FunctionDefinitionsCollector = require('./parsers/FunctionDefinitionsCollector')

/*
 * A source file to query javascript definitions.
 */
class SourceFile {
    /// Initializing

    constructor({filepath: filepath}) {
        this.filepath = path.resolve(filepath)
        this.parseTree = undefined
    }

    /// Accessing

    getFilePath() {
        return this.filepath
    }

    getFileName() {
        return path.basename(this.filepath)
    }

    getFileContents() {
        return fs.readFileSync(this.filepath).toString()
    }

    getParsedContents() {
        if( this.parseTree === undefined ) {
            this.parseTree = this.parseFileContents()
        }

        return this.parseTree
    }

    /*
     * Returns all the class definitions in the file.
     */
    getClassDefinitions() {
        const collector = new ClassDefinitionsCollector()

        return collector.collectClassDefinitionsIn( this.getParsedContents() )
    }


    /*
     * Returns all the functions defined in the file.
     * The functions may be defined in any scope, not just the top most module scope.
     */
    getFunctionDefinitions() {
        const collector = new FunctionDefinitionsCollector()

        return collector.collectFunctionDefinitionsIn( this.getParsedContents() )
    }

    /// Parsing

    parseFileContents() {
        const fileContents = this.getFileContents()

        return this.parseString(fileContents)
    }

    parseString(string) {
        const parsingOptions = {
            loc: true
        }

        return esprima.parseModule(string, parsingOptions)
    }
}

module.exports = SourceFile