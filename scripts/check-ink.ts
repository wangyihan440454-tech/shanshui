import assert from 'node:assert/strict';
import { InkFlow } from '../src/landscape/inkFlow';
const field=new InkFlow(960,420);
assert.equal(field.magnitude(),0,'A still painting must remain still');
for(let i=0;i<12;i++){field.stroke(280+i*9,190,289+i*9,193);field.step(1/60);}
const displaced=field.magnitude();
assert(displaced>1,'A pointer sweep must visibly transport ink');
assert(displaced<=field.maxOffset,'Displacement must stay bounded');
const started=performance.now();
for(let i=0;i<660;i++)field.step(1/60);
assert(Number.isFinite(field.magnitude()),'Flow must remain stable');
assert(field.magnitude()<.15,'Ink must return to the original painting after input stops');
field.clear();assert.equal(field.magnitude(),0,'Switching work or scrolling must clear the interaction');
console.log(`PASS: still baseline, continuous stroke, bounded motion and return to paper. Peak ${displaced.toFixed(2)}px; average step ${((performance.now()-started)/660).toFixed(2)}ms.`);
