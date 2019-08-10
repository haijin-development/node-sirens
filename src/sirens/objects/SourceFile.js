const path = require('path')
const fs = require('fs')
const esprima = require('esprima')
const splitLines = require('split-lines')
const ClassDefinitionsCollector = require('./parsers/ClassDefinitionsCollector')
const FunctionDefinitionsCollector = require('./parsers/FunctionDefinitionsCollector')
const Sirens = require('../../Sirens')

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

        return collector.collectFunctionDefinitionsIn({
            treeNode: this.getParsedContents(),
            sourceFile: this,
        })
    }

    /// Querying

    getFunctionAt({ line: line, column: column }) {
        const allFunctions = this.getFunctionDefinitions()

        return allFunctions.find( (functionDefinition, i) => {
            const startLine = functionDefinition.getStartingLine()
            const startColumn = functionDefinition.getStartingColumn()

            const endLine = functionDefinition.getEndingLine()
            const endColumn = functionDefinition.getEndingColumn()

            if( line < startLine || line > endLine ) {
                return false
            }

            if( line == startLine && line == endLine ) {
                if( column < startColumn || column >= endColumn ) {
                    return false
                }
            }

            if( line == startLine ) {
                if( column < startColumn ) {
                    return false
                }                
            }

            if( line == endLine ) {
                if( column >= endColumn ) {
                    return false
                }
            }

            return true
        })
    }

    getOriginalSourceCode({
        fromLine: fromLine, fromColumn: fromColumn, toLine: toLine, toColumn: toColumn, cr = cr
    }) {
        /// fromLine and toLine are 1 based whilst slice is 0 based.
        fromLine = fromLine - 1
        toLine = toLine - 1
        if( cr === undefined ) {
            cr = "\n"
        }

        const fileContents = this.getFileContents()

        const allLines = splitLines(fileContents)

        const firstLine = allLines[fromLine]

        const middleLines = allLines.slice(fromLine + 1, toLine)

        const lastLine = allLines[toLine]

        if(fromLine === toLine) {
            return firstLine.slice(fromColumn, toColumn)
        }

        let sourceCode = ''

        sourceCode += firstLine.slice(fromColumn)
        sourceCode += cr
        sourceCode += middleLines.join(cr)
        sourceCode += cr
        sourceCode += lastLine.slice(0, toColumn)

        return sourceCode
    }

    /// Parsing

    parseFileContents() {
        const fileContents = this.getFileContents()

        return this.parseString(fileContents)
    }

    parseString(string) {
        const parsingOptions = {
            loc: true,
            comment: true,
            tokens: true,
            tolerant: true,
            jsx: true,
        }

        return esprima.parseModule(string, parsingOptions)
    }
}

module.exports = SourceFile