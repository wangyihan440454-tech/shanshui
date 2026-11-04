import { useEffect,useRef,type CSSProperties } from 'react';
import { siteConfig } from '../config';
import { artworks } from '../artworks';
// Every frame is a preview of one complete work, never a separately titled fragment.
const columns=[[0,1,2],[2,0,1],[1,2,0],[0,2,1]];
export function PaintingWall({paused,leaving}:{paused:boolean;leaving:boolean}) {
 const wall=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!leaving)return;
  const animations=wall.current?.getAnimations({subtree:true})??[];
  let raf=0;const start=performance.now();
  const decelerate=(now:number)=>{const rate=Math.max(.08,1-(now-start)/550);for(const animation of animations)animation.updatePlaybackRate(rate);if(rate>.08)raf=requestAnimationFrame(decelerate);};
  raf=requestAnimationFrame(decelerate);return()=>cancelAnimationFrame(raf);
 },[leaving]);
 return <div ref={wall} className={`painting-wall ${paused?'is-paused':''} ${leaving?'is-leaving':''}`} aria-hidden="true" style={{'--tilt':`${siteConfig.wall.tilt}deg`} as CSSProperties}>
  <div className="wall-plane">{columns.map((column,i)=><div className={`wall-column column-${i}`} key={i} style={{'--duration':`${siteConfig.wall.durations[i]}s`} as CSSProperties}>
   {[0,1].map(copy=><div className="wall-set" key={copy}>{column.map((index,j)=>{const p=artworks[index];return <div className={`painting painting-${j} work-${p.id}`} key={p.id}>
    <div className="painting-mat"><img src={p.src} alt="" draggable={false} style={{objectPosition:index===0?'63%':index===1?'55%':'35%'}}/>{p.id!=='generated'&&<span className="painting-inscription">{p.title.replace(' · ','・')}</span>}</div>
    <div className="painting-caption"><span>{p.id==="generated"?"":p.title}</span><span>整卷可览</span></div>
   </div>;})}</div>)}
  </div>)}</div>
 </div>;
}



