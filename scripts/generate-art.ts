import { writeFileSync,mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { generateLandscape } from '../src/landscape/generate';
mkdirSync('artwork',{recursive:true});
mkdirSync('public/landscapes',{recursive:true});
const seeds = [8361,2077,4658,9012,6123,3862];
for(let i=0;i<seeds.length;i++){
 const svg=generateLandscape(seeds[i],2400);
 writeFileSync(`artwork/landscape-${i+1}.svg`,svg);
 await sharp(Buffer.from(svg)).resize(1600).webp({quality:85}).toFile(`public/landscapes/landscape-${i+1}.webp`);
 console.log(`Optimized landscape ${i+1}`);
}
const fallback=generateLandscape(8361,4800);
writeFileSync('artwork/fallback.svg',fallback);
await sharp(Buffer.from(fallback)).webp({quality:88}).toFile('public/landscapes/fallback.webp');
