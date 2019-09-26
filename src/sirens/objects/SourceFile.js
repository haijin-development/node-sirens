const Classification = require('../../o-language/classifications/Classification')
const path = require('path')
const fs = require('fs')
const esprima = require('esprima')
const splitLines = require('split-lines')
const ClassDefinitionsCollector = require('./parsers/ClassDefinitionsCollector')
const FunctionDefinitionsCollector = require('./parsers/FunctionDefinitionsCollector')
const AbsentFunctionDefinition = require('./js-statements/AbsentFunctionDefinition')
const StringStream = require('../../o-language/classifications/StringStream')

/*
 * A source file to query javascript definitions.
 */
class SourceFile {
    /// Definition

    static definition() {
        this.instanceVariables = ['filepath', 'parseTree']
    }

    /// Initializing

    initialize({ filepath: filepath }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.filepath = path.resolve(filepath)
        this.parseTree = undefined

        this.doParseContents()
    }

    doParseContents() {
        this.getParsedContents()
    }

    /// Accessing

    getFilePath() {
        return this.filepath
    }

    getFileName() {
        return path.basename(this.filepath)
    }

    getFileContents() {
        try {
            return fs.readFileSync(this.filepath).toString()
        } catch(e) {
            return null
        }
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
        const collector = ClassDefinitionsCollector.new()

        return collector.collectClassDefinitionsIn({
            treeNode: this.getParsedContents(),
            sourceFile: this,
        })
    }


    /*
     * Returns all the functions defined in the file.
     * The functions may be defined in any scope, not just the top most module scope.
     */
    getFunctionDefinitions() {
        const collector = FunctionDefinitionsCollector.new()

        return collector.collectFunctionDefinitionsIn({
            treeNode: this.getParsedContents(),
            sourceFile: this,
        })
    }

    getAllTopMostStatements() {
        const parsedContents = this.getParsedContents()

        if( parsedContents === null ) {
            return []
        }

        return parsedContents.body
    }

    getAllStatementsBefore({parseNode: parseNode}) {
        const topMostStatements = this.getAllTopMostStatements()

        const index = topMostStatements.indexOf( parseNode )

        return topMostStatements.slice(0, index)
    }

    getAllStatementsAfter({parseNode: parseNode}) {
        const topMostStatements = this.getAllTopMostStatements()

        const index = topMostStatements.indexOf( parseNode )

        return topMostStatements.slice(index + 1)
    }

    /// Querying

    existsFile() {
        return fs.existsSync( this.filepath )
    }

    isJavascriptFile() {
        return this.parseTree !== null
    }

    newAbsentFunctionDefinitionAt(line, column) {
        return AbsentFunctionDefinition.new({
                sourceFile: this,
                line: line,
                column: column
            })
    }

    getFunctionAt({ line: line, column: column }) {
        if( !this.existsFile() ) {
            return this.newAbsentFunctionDefinitionAt(line, column)
        }

        const allFunctions = this.getFunctionDefinitions()

        const functionDefinition = allFunctions.find( (functionDefinition, i) => {
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

        if( functionDefinition !== undefined ) {
            return functionDefinition
        }

        return this.newAbsentFunctionDefinitionAt(line, column)
    }

    getOriginalSourceCode({
        fromLine: fromLine, fromColumn: fromColumn, toLine: toLine, toColumn: toColumn
    }) {
        const fileContents = this.getFileContents()

        const allLines = splitLines(fileContents)

        if( toLine === undefined && toColumn === undefined ) {
            toLine = allLines.length
            toColumn = allLines[toLine - 1].length
        }

        /// fromLine and toLine are 1 based whilst slice is 0 based.
        fromLine = fromLine - 1
        toLine = toLine - 1

        const firstLine = allLines[fromLine]

        const middleLines = allLines.slice(fromLine + 1, toLine)

        const lastLine = allLines[toLine]

        if(fromLine === toLine) {
            return firstLine.slice(fromColumn, toColumn)
        }

        let sourceCode = StringStream.new()

        sourceCode.append({ string: firstLine.slice(fromColumn) })

        if( middleLines.length > 0 ) {
            sourceCode.cr()
            sourceCode.append({ string: middleLines.join( "\n" ) })
        }

        sourceCode.cr()
        sourceCode.append({ string: lastLine.slice(0, toColumn) })

        return sourceCode.getString()
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

        try {
            return esprima.parseModule(string, parsingOptions)
        } catch(error) {
            return null
        }
    }

    /// Writing

    saveFileContents(newFileContents) {
        fs.writeFileSync( this.filepath, newFileContents )
    }
}

module.exports = Classification.define(SourceFile)
