const path = require('path')
const fs = require('fs')
const esprima = require('esprima')
const ClassDefinition = require('./ClassDefinition')

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
        const parseTree = this.getParsedContents()

        return parseTree.body
            .filter( (parseNode) => {
                return parseNode.type === 'ClassDeclaration'
            })
            .map( (parseNode) => {
                return new ClassDefinition(parseNode)
            })
    }


    /*
     * Returns all the functions defined in the file.
     * The functions may be defined in any scope, not just the top most module scope.
     */
    getFunctionDefinitions() {
        this.dfsWalkTree( (parseNode) => {
            console.log(parseNode)
        })
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

    /*
     * Walks in Depth First Search each node of the parse tree.
     *
     * To do: reimplement using iteration instead of resursion.
     */
    dfsWalkTree(block, currentNode = undefined) {
        if(currentNode === undefined) {
            currentNode = this.parseTree.body
        }

        const childNodes = currentNode.childNodes
    }
}

module.exports = SourceFile