const expect = require('chai').expect
const parser = require('esprima')
const jsSintax = require('../../../samples/JsSintax')

const Sirens = require('../../../../src/Sirens')

const namespace = Sirens.namespace()

describe('When visiting js parse tree it visits the expression', () => {

    it('this', () => {
        visit( jsSintax.thisExpression )
    })

    it('identifier', () => {
        visit( jsSintax.identifier )
    })

    it('literal', () => {
        visit( jsSintax.literal )
    })

    it('arrayExpression', () => {
        visit( jsSintax.arrayExpression )
    })

    it('objectExpression', () => {
        visit( jsSintax.objectExpression )
    })

    it('functionExpression', () => {
        visit( jsSintax.functionExpression )
    })

    it('arrowFunctionExpression', () => {
        visit( jsSintax.arrowFunctionExpression )
    })

    it('classExpression', () => {
        visit( jsSintax.classExpression )
    })

    it('methodDefinition', () => {
        visit( jsSintax.methodDefinition )
    })

    it('taggedTemplageString', () => {
        visit( jsSintax.taggedTemplageString )
    })

    it('memberExpression', () => {
        visit( jsSintax.memberExpression )
    })

    it('super', () => {
        visit( jsSintax.super )
    })

    it('metaProperty', () => {
        visit( jsSintax.metaProperty )
    })

    it('newExpression', () => {
        visit( jsSintax.newExpression )
    })

    it('callExpression', () => {
        visit( jsSintax.callExpression )
    })

    it('updateExpression', () => {
        visit( jsSintax.updateExpression )
    })

    it('awaitExpression', () => {
        visit( jsSintax.awaitExpression )
    })

    it('unaryExpression', () => {
        visit( jsSintax.unaryExpression )
    })

    it('binaryExpression', () => {
        visit( jsSintax.binaryExpression )
    })

    it('logicalExpression', () => {
        visit( jsSintax.logicalExpression )
    })

    it('conditionalExpression', () => {
        visit( jsSintax.conditionalExpression )
    })

    it('yieldExpression', () => {
        visit( jsSintax.yieldExpression )
    })

    it('assigmentExpression', () => {
        visit( jsSintax.assigmentExpression )
    })

    it('sequenceExpression', () => {
        visit( jsSintax.sequenceExpression )
    })

})

describe('When visiting js parse tree it visits the statement', () => {

    it('blockStatement', () => {
        visit( jsSintax.blockStatement )
    })

    it('breakStatement', () => {
        visit( jsSintax.breakStatement )
    })

    it('classDeclaration', () => {
        visit( jsSintax.classDeclaration )
    })

    it('continueStatement', () => {
        visit( jsSintax.continueStatement )
    })

    it('debuggerStatement', () => {
        visit( jsSintax.debuggerStatement )
    })

    it('doWhileStatement', () => {
        visit( jsSintax.doWhileStatement )
    })

    it('emptyStatement', () => {
        visit( jsSintax.emptyStatement )
    })

    it('expressionStatement', () => {
        visit( jsSintax.expressionStatement )
    })

    it('forStatement', () => {
        visit( jsSintax.forStatement )
    })

    it('forInStatement', () => {
        visit( jsSintax.forInStatement )
    })

    it('forOfStatement', () => {
        visit( jsSintax.forOfStatement )
    })

    it('functionDeclaration', () => {
        visit( jsSintax.functionDeclaration )
    })

    it('ifStatement', () => {
        visit( jsSintax.ifStatement )
    })

    it('labeledStatement', () => {
        visit( jsSintax.labeledStatement )
    })

    it('returnStatement', () => {
        visit( jsSintax.returnStatement )
    })

    it('switchStatement', () => {
        visit( jsSintax.switchStatement )
    })

    it('throwStatement', () => {
        visit( jsSintax.throwStatement )
    })

    it('tryStatement', () => {
        visit( jsSintax.tryStatement )
    })

    it('variableDeclaration', () => {
        visit( jsSintax.variableDeclaration )
    })

    it('whileStatement', () => {
        visit( jsSintax.whileStatement )
    })

    it('importDeclaration', () => {
        visit( jsSintax.importDeclaration )
    })

    it('exportDeclaration', () => {
        visit( jsSintax.exportDeclaration )
    })

})

function parse(string) {
    const parsingOptions = {
        range: true,
        comment: true,
        tokens: false,
        tolerant: false,
        jsx: false,
    }

    return parser.parseModule(string, parsingOptions)
}

function visit(string) {
    const visitor = namespace.JsSintaxVisitor.new()

    const treeNode = parse(string)

    return visitor.visit( treeNode )
}
