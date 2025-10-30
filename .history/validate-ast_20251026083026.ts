// validate-ast.ts (VERSÃO CORRIGIDA)
import * as ts from 'typescript';
import * as fs from 'fs';

const fileName = 'backend/src/engines/cognitive-generation-engine.ts';
const sourceCode = fs.readFileSync(fileName, 'utf-8');

console.log('🔬 MINERVA OMEGA - AST VALIDATOR\n');
console.log('='.repeat(80));

// Criar AST
const sourceFile = ts.createSourceFile(
  fileName,
  sourceCode,
  ts.ScriptTarget.Latest,
  true
);

let errorFound = false;
let methodInfo: any = null;

// Mover checkReturn para fora (correção do erro ES5)
const checkReturn = (node: ts.Node, sourceFile: ts.SourceFile): boolean => {
  let hasReturn = false;
  
  const visitor = (n: ts.Node): void => {
    if (ts.isReturnStatement(n)) {
      hasReturn = true;
      const returnLine = sourceFile.getLineAndCharacterOfPosition(n.getStart()).line + 1;
      console.log(`   ✅ Return encontrado na linha ${returnLine}`);
    }
    ts.forEachChild(n, visitor);
  };
  
  visitor(node);
  return hasReturn;
};

// Mover countStructures para fora também
const analyzeControlFlow = (method: ts.MethodDeclaration, sourceFile: ts.SourceFile): void => {
  let ifCount = 0;
  let tryCount = 0;
  let switchCount = 0;
  let returnCount = 0;

  const countStructures = (node: ts.Node): void => {
    if (ts.isIfStatement(node)) ifCount++;
    if (ts.isTryStatement(node)) tryCount++;
    if (ts.isSwitchStatement(node)) switchCount++;
    if (ts.isReturnStatement(node)) returnCount++;
    
    ts.forEachChild(node, countStructures);
  };

  countStructures(method);

  console.log(`   - Blocos IF: ${ifCount}`);
  console.log(`   - Blocos TRY: ${tryCount}`);
  console.log(`   - Blocos SWITCH: ${switchCount}`);
  console.log(`   - Return statements: ${returnCount}`);

  if (returnCount === 0) {
    console.log(`\n   ❌ CRÍTICO: Método não tem return statement!`);
    errorFound = true;
  } else if (ifCount > 0 && returnCount === 1) {
    console.log(`\n   ⚠️  SUSPEITO: ${ifCount} IFs mas apenas 1 return`);
    console.log(`       Possível path sem return!`);
    errorFound = true;
  }
};

const analyzeNode = (node: ts.Node, depth = 0): void => {
  // Procurar pela classe
  if (ts.isClassDeclaration(node)) {
    const className = node.name?.getText();
    if (className === 'GenerationPipeline') {
      console.log(`\n✅ Classe encontrada: ${className}`);
      console.log(`   Posição: Linha ${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
    }
  }

  // Procurar pelo método
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
      
      // Verificar retorno
      const hasReturn = checkReturn(node, sourceFile);
      
      if (!hasReturn) {
        console.log(`   ❌ ERRO: Nenhum return statement encontrado!`);
        errorFound = true;
      }
      
      // Analisar fluxo
      console.log(`\n   📊 Analisando fluxo de controle...`);
      analyzeControlFlow(node, sourceFile);
    }
  }

  ts.forEachChild(node, child => analyzeNode(child, depth + 1));
};

// Executar
analyzeNode(sourceFile);

console.log('\n' + '='.repeat(80));

if (errorFound) {
  console.log('\n❌ PROBLEMAS DETECTADOS NO CÓDIGO!');
  process.exit(1);
} else {
  console.log('\n✅ Estrutura válida!');
  process.exit(0);
}
