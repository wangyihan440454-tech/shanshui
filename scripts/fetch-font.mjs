import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
function sourceFiles(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(item=>item.name==='vendor'?[]:item.isDirectory()?sourceFiles(path.join(dir,item.name)):/\.tsx?$/.test(item.name)?[path.join(dir,item.name)]:[])}
const text=[...new Set(sourceFiles('src').map(file=>readFileSync(file,'utf8')).join('').match(/[\u4e00-\u9fff]/g))].join('');
let localCss='';
for(const [family,name] of [['Noto Serif SC:wght@400','serif-sc'],['Ma Shan Zheng','brush-sc']]){
 const css=await fetch('https://fonts.googleapis.com/css2?family='+family.replaceAll(' ','+')+'&display=swap&text='+encodeURIComponent(text),{headers:{'User-Agent':'Mozilla/5.0'}}).then(r=>r.text());
 const url=css.match(/url\(([^)]+)\)/)?.[1];if(!url)throw new Error('Font not found: '+family);
 const bytes=await fetch(url).then(r=>r.arrayBuffer()),filename=name+(css.includes('truetype')?'.ttf':'.woff2');
 writeFileSync('public/fonts/'+filename,Buffer.from(bytes));localCss+=css.replace(url,'/fonts/'+filename)+'\n';console.log(filename+': '+bytes.byteLength+' bytes');
}
writeFileSync('public/fonts/fonts.css',localCss);
const licenses=[['https://raw.githubusercontent.com/notofonts/noto-cjk/main/Serif/LICENSE','OFL.txt'],['https://raw.githubusercontent.com/google/fonts/main/ofl/mashanzheng/OFL.txt','OFL-MaShanZheng.txt']];
for(const [url,file] of licenses){const response=await fetch(url);if(!response.ok)throw new Error('Font license unavailable');writeFileSync('public/fonts/'+file,await response.text());}
