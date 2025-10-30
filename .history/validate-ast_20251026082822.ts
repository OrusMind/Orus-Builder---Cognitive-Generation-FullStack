// validate-ast.ts
import * as ts from 'typescript';
import * as fs from 'fs';

const fileName = 'backend/src/engines/cognitive-generation-engine.ts';
const sourceCode = fs.readFileSync(fileName, 'utf-8');

console.log('🔬 MINERVA OMEGA - AST VALIDATOR\n');
console.log('=' .repeat(80));

// Criar AST
const sourceFile = ts.createSourceFile(
  fileName,
  sourceCode,
  ts.ScriptTarget.Latest,
  true // setParentNodes
);

let errorFound = false;
let methodInfo: any = null;

function analyzeNode(node: ts.Node, depth = 0) {
  // Procurar pela classe GenerationPipeline
  if (ts.isClassDeclaration(node)) {
    const className = node.name?.getText();
    if (className === 'GenerationPipeline') {
      console.log(`\n✅ Classe encontrada: ${className}`);
      console.log(`   Posição: Linha ${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
    }
  }

  // Procurar pelo método splitCodeIntoComponents
  if (ts.isMethodDeclaration(node)) {
    const methodName = node.name.getText();
    
    if (methodName === 'splitCodeIntoComponents') {
      const startPos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      const endPos = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
      
      methodInfo = {
        name: methodName,
        startLine: startPos.line + 1,
        endLine: endPos.line + 1,
        hasReturnType: node.type !== undefined,
        returnType: node.type?.getText() || 'undefined',
      };
      
      console.log(`\n🎯 Método encontrado: ${methodName}`);
      console.log(`   Início: Linha ${methodInfo.startLine}`);
      console.log(`   Fim: Linha ${methodInfo.endLine}`);
      console.log(`   Tipo de retorno: ${methodInfo.returnType}`);
      
      // Verificar se tem return statement
      let hasReturn = false;
      
      function checkReturn(n: ts.Node) {
        if (ts.isReturnStatement(n)) {
          hasReturn = true;
          const returnLine = sourceFile.getLineAndCharacterOfPosition(n.getStart()).line + 1;
          console.log(`   ✅ Return encontrado na linha ${returnLine}`);
        }
        ts.forEachChild(n, checkReturn);
      }
      
      checkReturn(node);
      
      if (!hasReturn) {
        console.log(`   ❌ ERRO: Nenhum return statement encontrado!`);
        errorFound = true;
      }
      
      // Verificar paths de código
      console.log(`\n   📊 Analisando fluxo de controle...`);
      analyzeControlFlow(node);
    }
  }

  ts.forEachChild(node, child => analyzeNode(child, depth + 1));
}

function analyzeControlFlow(method: ts.MethodDeclaration) {
  let ifCount = 0;
  let tryCount = 0;
  let switchCount = 0;
  let returnCount = 0;

  function countStructures(node: ts.Node) {
    if (ts.isIfStatement(node)) ifCount++;
    if (ts.isTryStatement(node)) tryCount++;
    if (ts.isSwitchStatement(node)) switchCount++;
    if (ts.isReturnStatement(node)) returnCount++;
    
    ts.forEachChild(node, countStructures);
  }

  countStructures(method);

  console.log(`   - Blocos IF: ${ifCount}`);
  console.log(`   - Blocos TRY: ${tryCount}`);
  console.log(`   - Blocos SWITCH: ${switchCount}`);
  console.log(`   - Return statements: ${returnCount}`);

  // Verificar se todos os paths retornam
  if (returnCount === 0) {
    console.log(`\n   ❌ CRÍTICO: Método não tem return statement!`);
    errorFound = true;
  } else if (ifCount > 0 && returnCount === 1) {
    console.log(`\n   ⚠️  SUSPEITO: ${ifCount} IFs mas apenas 1 return`);
    console.log(`       Possível path sem return!`);
    errorFound = true;
  }
}

// Executar análise
analyzeNode(sourceFile);

console.log('\n' + '='.repeat(80));

if (errorFound) {
  console.log('\n❌ PROBLEMAS DETECTADOS NO CÓDIGO!');
  process.exit(1);
} else {
  console.log('\n✅ Estrutura válida!');
  process.exit(0);
}
