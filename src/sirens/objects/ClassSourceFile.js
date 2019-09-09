const Classification = require('../../o-language/classifications/Classification')
const path = require('path')
const fs = require('fs')
const esprima = require('esprima')
const splitLines = require('split-lines')
const ClassDefinitionsCollector = require('./parsers/ClassDefinitionsCollector')
const FunctionDefinitionsCollector = require('./parsers/FunctionDefinitionsCollector')
const AbsentFunctionDefinition = require('./js-statements/AbsentFunctionDefinition')
const SourceFile = require('./SourceFile')

/*
 * A source file with a class definition.
 */
class ClassSourceFile {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [SourceFile]
    }

    /// Accessing

    /*
     * Returns all the class definitions in the file.
     */
    getClassDefinition() {
        return this.getClassDefinitions()[0]
    }
}

module.exports = Classification.define(ClassSourceFile)
