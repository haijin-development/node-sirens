const JsSintax = {

    /// Expressions

    thisExpression:
`this`,

    identifier:
`abc`,

    literal:
`"123"`,

    arrayExpression:
`[]`,

    objectExpression:
`a = {}`,

    functionExpression:
`a = function() {}`,

    arrowFunctionExpression:
`a = () => {}`,

    classExpression:
`a = class Abc {
    m() {

    }
}`,

    methodDefinition:
`a = class Abc {
    m() {

    }
}`,

    taggedTemplageString:
"tagFunction`abc`",

    memberExpression:
`object.prop`,

    super:
`class Abc {
    m() {
        super.m()
    }
}`,

    metaProperty:
`function f() {
    new.target
}`,

    newExpression:
`new O()`,

    callExpression:
`f()`,

    updateExpression:
`i++`,

    awaitExpression:
`async function f() {
    const x = await g()
}`,

    unaryExpression:
`- 1`,

    binaryExpression:
`1 + 2`,

    logicalExpression:
`a || b`,

    conditionalExpression:
`a ? 1 : 2`,

    yieldExpression:
`function* f(a) {
    yield a
}`,

    assigmentExpression:
`a = 1`,

    sequenceExpression:
`(1, 2)`,

    /// Statements

    blockStatement:
`{}`,

    breakStatement:
`while(true) {
    break
}`,

    classDeclaration:
`class Abc {
}`,

    continueStatement:
`while(true) {
    continue
}`,

    debuggerStatement:
`debugger`,

    doWhileStatement:
`do {
    continue
} while( true )`,

    emptyStatement:
`;`,

    expressionStatement:
`1`,

    forStatement:
`for( const n =0; n<1; n++ ) {
}`,

    forInStatement:
`for( key in object ) {
}`,

    forOfStatement:
`for( item of collection ) {
}`,

    functionDeclaration:
`function abc() {
}`,

    ifStatement:
`if( a ) {
} else {
}`,

    labeledStatement:
`label:
    3 + 4
`,

    returnStatement:
`function a(){ return }`,

    switchStatement:
`switch( c ) {
    case 1 :
        'a'
}`,

    throwStatement:
`throw '123'`,

    tryStatement:
`try {

} catch(e) {

}`,

    variableDeclaration:
`let a`,

    whileStatement:
`while(true) {}`,

    withStatement:
`with(o) {}`,

    importDeclaration:
`import defaultExport from 'module-name'`,

    exportDeclaration:
`export default object`,

}


module.exports = JsSintax