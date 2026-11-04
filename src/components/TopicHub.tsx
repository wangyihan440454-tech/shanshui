import { useRef, useState, type CSSProperties } from 'react';
import { SectionHeader, type Section } from './SectionHeader';
import { Arrow } from './Icons';

const topics = [
 {id:'models' as const,title:'山川立境',eyebrow:'山水模型预览',description:'转身之间，换一重山色。',accent:'#8aab9b',image:'/landscapes/landscape-5.webp',position:'50%'},
 {id:'scrolls' as const,title:'山水画卷',eyebrow:'整卷浏览 · 交互拨墨',description:'循一卷山水，看墨色流动。',accent:'#90aeb0',image:'/artworks/qianli-jiangshan.webp',position:'63%'},
 {id:'library' as const,title:'山水拾藏',eyebrow:'中国山水素材库',description:'把心动的山川，慢慢收集。',accent:'#b8aa89',image:'/artworks/yangzi-river.webp',position:'65%'},
];
function savedTopic(){try{const value=Number(sessionStorage.getItem('shanshui-topic'));return value>=0&&value<topics.length?value:0;}catch{return 0;}}
export function TopicHub({navigate,onOpening}:{navigate:(section:Section)=>void;onOpening:()=>void}){
 const [active,setActive]=useState(savedTopic);
 const gesture=useRef<{x:number;y:number}|null>(null);
 const wheel=useRef({amount:0,last:0});
 const topic=topics[active];
 function step(direction:number){
  setActive(previous=>{const next=(previous+direction+topics.length)%topics.length;try{sessionStorage.setItem('shanshui-topic',String(next));}catch{}return next;});
 }
 return <main className="section-page topic-stage" style={{'--chapter-accent':topic.accent} as CSSProperties}
  onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();step(1);}if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();step(-1);}}}
  onWheel={event=>{if(event.ctrlKey||Math.abs(event.deltaY)+Math.abs(event.deltaX)<2)return;const now=performance.now();if(now-wheel.current.last<800)return;wheel.current.amount+=Math.abs(event.deltaY)>Math.abs(event.deltaX)?event.deltaY:event.deltaX;if(Math.abs(wheel.current.amount)>70){step(wheel.current.amount>0?1:-1);wheel.current={amount:0,last:now};}}}
  onPointerDown={event=>{if((event.target as Element).closest('button,a')||event.button!==0)return;gesture.current={x:event.clientX,y:event.clientY};}}
  onPointerCancel={()=>{gesture.current=null;}}
  onPointerUp={event=>{const start=gesture.current;gesture.current=null;if(!start)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.max(Math.abs(dx),Math.abs(dy))>70)step((Math.abs(dx)>Math.abs(dy)?dx:dy)<0?1:-1);}}>
  <SectionHeader onBack={onOpening} label="" backLabel="返回开场"/>
  <div className="chapter-content" key={topic.id}>
   <p className="chapter-number" aria-hidden="true">{String(active+1).padStart(2,'0')}<span/>山水之间</p>
   <div aria-live="polite" aria-atomic="true"><p className="chapter-eyebrow">{topic.eyebrow}</p><div className="chapter-subject"><div className="chapter-medallion" aria-hidden="true"><img src={topic.image} alt="" draggable={false} style={{objectPosition:topic.position}}/></div><h1 tabIndex={-1}>{topic.title}</h1></div></div>
   <button className="chapter-enter" onClick={()=>navigate(topic.id)}><span>进入专题</span><Arrow/></button>
  </div>
  <footer className="chapter-navigation" aria-label="专题切换">
   <span className="chapter-hint">滚动或滑动，换一方山水</span>
   <div className="chapter-switch"><button onClick={()=>step(-1)} aria-label="上一个专题"><Arrow direction="left"/></button><span aria-label={'第'+(active+1)+'个专题，共3个'}>{String(active+1).padStart(2,'0')}<i/>03</span><button onClick={()=>step(1)} aria-label="下一个专题"><Arrow/></button></div>

  </footer>
 </main>;
}


