import { useEffect,useRef,useState } from 'react';
import { artworks } from '../artworks';
import { siteConfig } from '../config';
import { Arrow,MountainMark } from './Icons';
import { InkInteraction } from './InkInteraction';

type Result={svg?:string;error?:boolean};
export function ScrollViewer({onBack,reduced=false}:{onBack:()=>void;reduced?:boolean}){
 const viewport=useRef<HTMLDivElement>(null),picture=useRef<HTMLImageElement>(null),picker=useRef<HTMLDivElement>(null);
 const worker=useRef<Worker|null>(null),objectUrl=useRef<string|null>(null);
 const request=useRef(0),selectionRequest=useRef(0),alive=useRef(true);
 const timeout=useRef<ReturnType<typeof setTimeout>|null>(null),selectionTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const [selected,setSelected]=useState(()=>Math.max(0,artworks.findIndex(work=>work.id==='yangzi'))),[generated,setGenerated]=useState<string|null>(null);
 const [busy,setBusy]=useState(false),[failed,setFailed]=useState(false),[pending,setPending]=useState<number|null>(null);
 const [selectionError,setSelectionError]=useState(false),[menu,setMenu]=useState(false),[ink]=useState(true);
 const [inkAvailable,setInkAvailable]=useState<boolean|null>(null),[resetKey,setResetKey]=useState(0);
 const effectiveInk=ink&&!reduced&&inkAvailable!==false;
 const [position,setPosition]=useState({left:0,max:0});
 const drag=useRef<{x:number;scroll:number}|null>(null);
 const artwork=artworks[selected];
 const source=artwork.id==='generated'&&generated?generated:artwork.src;
 const stop=()=>{worker.current?.terminate();worker.current=null;if(timeout.current)clearTimeout(timeout.current);};
 const updatePosition=()=>{const el=viewport.current;if(el)setPosition({left:el.scrollLeft,max:Math.max(0,el.scrollWidth-el.clientWidth)});};
 const startPosition=()=>{const el=viewport.current;if(!el)return;el.scrollLeft=artwork.direction==='rtl'?el.scrollWidth-el.clientWidth:0;updatePosition();};
 const generate=()=>{
  stop();const current=++request.current;setBusy(true);setFailed(false);
  try{
   const currentWorker=new Worker(new URL('../landscape/generator.worker.ts',import.meta.url),{type:'module'});worker.current=currentWorker;
   const fail=()=>{if(request.current!==current)return;++request.current;stop();setBusy(false);setFailed(true);};
   currentWorker.onerror=fail;
   currentWorker.onmessage=async(event:MessageEvent<Result>)=>{
    if(request.current!==current)return;if(!event.data.svg){fail();return;}
    const url=URL.createObjectURL(new Blob([event.data.svg],{type:'image/svg+xml'}));
    try{const decoded=new Image();decoded.src=url;await decoded.decode();}catch{URL.revokeObjectURL(url);fail();return;}
    if(request.current!==current){URL.revokeObjectURL(url);return;}
    const previous=objectUrl.current;objectUrl.current=url;setGenerated(url);setBusy(false);stop();if(previous)URL.revokeObjectURL(previous);
   };
   timeout.current=setTimeout(fail,20000);currentWorker.postMessage({seed:siteConfig.seeds[0],width:siteConfig.panorama.width});
  }catch{++request.current;stop();setBusy(false);setFailed(true);}
 };
 useEffect(()=>{
  alive.current=true;viewport.current?.focus({preventScroll:true});
  const observer=new ResizeObserver(updatePosition);if(viewport.current)observer.observe(viewport.current);
  return()=>{alive.current=false;++selectionRequest.current;++request.current;stop();observer.disconnect();if(selectionTimer.current)clearTimeout(selectionTimer.current);if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);};
 },[]);
 useEffect(()=>{
  ++request.current;stop();setBusy(false);setFailed(false);
  if(artwork.id==='generated')generate();
  return()=>{++request.current;stop();};
 },[artwork.id]);
 useEffect(()=>{
  const outside=(event:PointerEvent)=>{if(picker.current&&!picker.current.contains(event.target as Node))setMenu(false);};
  document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);
 },[]);
 async function choose(index:number){
  if(index===selected){setMenu(false);return;}
  const current=++selectionRequest.current;setPending(index);setSelectionError(false);
  try{
   const image=new Image();image.src=artworks[index].src;
   await Promise.race([image.decode(),new Promise<never>((_,reject)=>{selectionTimer.current=setTimeout(()=>reject(new Error('Image timeout')),15000);})]);
   if(!alive.current||selectionRequest.current!==current)return;
   setSelected(index);setMenu(false);
  }catch{if(alive.current&&selectionRequest.current===current)setSelectionError(true);}
  finally{if(selectionTimer.current)clearTimeout(selectionTimer.current);if(alive.current&&selectionRequest.current===current)setPending(null);}
 }
 const move=(direction:number)=>viewport.current?.scrollBy({left:direction*(viewport.current.clientWidth*.65),behavior:reduced?'instant':'smooth'});
 const progress=position.max>0?(artwork.direction==='rtl'?1-position.left/position.max:position.left/position.max):0;
 return <main className="viewer artwork-viewer" onKeyDown={e=>{if(e.key==='Escape'&&menu){setMenu(false);return;}if((e.target as HTMLElement).closest('.scroll-viewport'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}}}>
  <header className="site-header viewer-header"><button className="brand" onClick={onBack} aria-label="山水，返回专题首页"><MountainMark/></button><button className="text-button" onClick={onBack}>专题首页</button></header>
  <div className="viewer-intro"><div className={"work-heading work-heading-"+artwork.id}><p className="small-label">{artwork.subtitle}</p><h1 id="viewer-title" aria-label={artwork.title}><span className="work-title-main">{artwork.title.split(" · ")[0]}</span>{artwork.title.includes(" · ")&&<small className="work-title-edition">{artwork.title.split(" · ")[1]}</small>}</h1></div><div className="work-picker" ref={picker}>
   <button className="outlined-button" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-controls="work-menu">选卷<span aria-hidden="true">⌄</span></button>
   {menu&&<div className="work-menu" id="work-menu" role="group" aria-label="选择画卷">{artworks.map((work,i)=><button key={work.id} onClick={()=>void choose(i)} disabled={pending!==null} aria-pressed={selected===i}><span>{work.title}</span><small>{pending===i?'正在展卷':work.subtitle}</small></button>)}{selectionError&&<p role="status">画卷未载入，请重新选择。</p>}</div>}
  </div></div>
  <div className="scroll-stage"><div ref={viewport} className={`scroll-viewport ${effectiveInk?'is-ink-mode':''}`} tabIndex={0} role="region" aria-label="山水长卷，使用左右方向键或拖动游览" aria-busy={busy||pending!==null}
   onScroll={updatePosition}
   onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}if(e.key==='Home'||e.key==='End'){e.preventDefault();const atRight=e.key==='Home'?artwork.direction==='rtl':artwork.direction!=='rtl';e.currentTarget.scrollLeft=atRight?e.currentTarget.scrollWidth:0;}}}
   onPointerDown={e=>{if(!effectiveInk&&e.pointerType==='mouse'&&e.button===0){drag.current={x:e.clientX,scroll:e.currentTarget.scrollLeft};e.currentTarget.setPointerCapture(e.pointerId);}}}
   onPointerMove={e=>{if(drag.current)e.currentTarget.scrollLeft=drag.current.scroll+drag.current.x-e.clientX;}}
   onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
   <img ref={picture} className="panorama" src={source} alt={artwork.alt} draggable={false} onLoad={startPosition}/>
  </div>{ink&&!reduced&&<InkInteraction key={source} viewport={viewport} image={picture} source={source} resetKey={resetKey} onAvailable={setInkAvailable}/>}<span className="scroll-edge edge-left"/><span className="scroll-edge edge-right"/></div>
  <div className="viewer-bottom"><div className="scroll-controls"><button className="circle-button" aria-label="向左游览" onClick={()=>move(-1)} disabled={position.left<1}><Arrow direction="left"/></button><span>徐徐展卷</span><button className="circle-button" aria-label="向右游览" onClick={()=>move(1)} disabled={position.left>=position.max-1}><Arrow/></button></div>
   <p className="viewer-status" role="status">{pending!==null?'正在载入画卷':busy?'新景正在落笔，仍可游览整卷':failed?<>正在展示完整备用画卷。<button className="inline-button" onClick={generate}>重新绘景</button></>:effectiveInk?'按住拖动拨墨 · 方向键展卷':'拖动画卷，或使用左右方向键'}</p>
   <div className="ink-tools">{effectiveInk&&<button className="ink-reset" onClick={()=>setResetKey(key=>key+1)} aria-label="复原画面">复原</button>}</div>
  </div>
  <div className="journey-track" aria-hidden="true"><span style={{transform:`scaleX(${Math.max(.01,progress)})`}}/></div>
  <footer className="artwork-source"><p><span>来源：</span><a href={artwork.sourceUrl} target="_blank" rel="noreferrer">{artwork.source}</a><span className="source-divider">·</span><span>{artwork.subtitle}</span></p><p>{artwork.description}</p></footer>
 </main>;
}





