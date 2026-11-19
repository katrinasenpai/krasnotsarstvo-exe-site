import ts from 'typescript';
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const modules = {};
for (const name of ['characters', 'quiz']) {
  const code = ts.transpileModule(await readFile(`src/data/${name}.ts`, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  const context = {exports:{},require: id => modules[id.replace('./','')]};
  vm.runInNewContext(code, context);
  modules[name] = context.exports;
}
const {quizTypes, quizResults, quizQuestions, scoreAnswers} = modules.quiz;
const reached = new Set(); let ties = 0;
const examplePaths = {};
for(let n = 0; n < 5 ** quizQuestions.length; n++) {
  let code=n; const answers=quizQuestions.map(() => {const value=code%5; code=Math.floor(code/5);return value;});
  const winners=scoreAnswers(answers);
  assert(winners.length>0);
  if(winners.length>1) ties++;
  else { reached.add(winners[0]); examplePaths[winners[0]] ||= answers; }
}
assert.equal(reached.size,quizTypes.length,'Every result must be reachable without a tie');
const places=JSON.parse(await readFile('src/data/atlas.json','utf8'));
assert.equal(places.length,35); assert.equal(places.filter(p=>p.library).length,14);
assert.equal(new Set(places.map(p=>p.id)).size,35);
for(const p of places) for(const ref of [p.landmark,p.real_info.image,p.fantasy_info.image]) assert((await stat(`public${ref}`)).size>0,ref);
for(const c of modules.characters.charactersData) for(const ref of [c.image,...(c.variants||[]).map(v=>v.src),...(c.groupPortraits||[]).map(p=>p.src)]) assert((await stat(`public${ref}`)).size>0,ref);
for(const id of quizTypes) assert(quizResults[id]?.desc && quizResults[id]?.img,id);
const glb=await readFile('public/ar/iskin-projection-billboard.glb');
assert.equal(glb.toString('utf8',0,4),'glTF');
const model=JSON.parse(glb.toString('utf8',20,20+glb.readUInt32LE(12)));
assert.equal(model.images.length,4);
assert(model.animations.length>0);
const config=ts.readConfigFile('tsconfig.app.json',ts.sys.readFile);
const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,'.');
const program=ts.createProgram(parsed.fileNames,parsed.options);
const diagnostics=ts.getPreEmitDiagnostics(program);
const legacy=diagnostics.filter(d=>d.file?.fileName.replaceAll('\\','/').endsWith('/SplashCursor.tsx'));
const current=diagnostics.filter(d=>!legacy.includes(d));
if(current.length) { console.error(ts.formatDiagnosticsWithColorAndContext(current,{getCurrentDirectory:()=>process.cwd(),getCanonicalFileName:f=>f,getNewLine:()=> '\n'})); process.exitCode=1; }
console.log(JSON.stringify({locations:places.length,libraries:14,characters:modules.characters.charactersData.length,quizQuestions:quizQuestions.length,quizResults:reached.size,pathsChecked:5**quizQuestions.length,ties,arPoses:model.images.length,typeErrorsOutsideLegacy:current.length,existingSplashCursorTypeErrors:legacy.length,examplePaths},null,2));
await mkdir('tmp',{recursive:true});
await writeFile('tmp/quiz-paths.json',JSON.stringify(examplePaths));
