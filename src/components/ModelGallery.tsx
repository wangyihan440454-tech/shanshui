import { useEffect, useRef } from 'react';
export function ModelGallery({onBack,theme}:{onBack:()=>void;theme:'ink'|'silk'}) {
 const frame=useRef<HTMLIFrameElement>(null);
 useEffect(()=>{const handle=(event:MessageEvent)=>{if(event.origin===location.origin&&event.source===frame.current?.contentWindow&&event.data?.type==='shanshui:return-hub')onBack();};window.addEventListener('message',handle);return()=>window.removeEventListener('message',handle);},[onBack]);
 return <main data-theme={theme} style={{position:'fixed',inset:0,background:'#f0f3f5'}}><h1 className="visually-hidden">山川立境 · 全国地图与华山实景山境</h1><iframe ref={frame} src="/mountains/index.html" title="山川立境，全国地图；点击陕西进入华山" style={{display:'block',width:'100%',height:'100%',border:0}} allow="fullscreen"/><button className="visually-hidden" onClick={onBack}>返回专题首页</button></main>;
}
