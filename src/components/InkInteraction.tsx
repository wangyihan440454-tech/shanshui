import { useEffect,useRef,useState,type RefObject } from 'react';
import { ArtOfInk } from '../landscape/artOfInk';

type Props={viewport:RefObject<HTMLDivElement|null>;image:RefObject<HTMLImageElement|null>;source:string;resetKey:number;onAvailable:(value:boolean)=>void};

/** The Art-Of-Ink interaction is held-pointer painting, separate from scroll navigation. */
export function InkInteraction({viewport,image,source,resetKey,onAvailable}:Props){
 const canvas=useRef<HTMLCanvasElement>(null),engine=useRef<ArtOfInk|null>(null);
 const [ready,setReady]=useState(false);
 useEffect(()=>{engine.current?.reset();},[resetKey]);
 useEffect(()=>{
  const element=canvas.current,view=viewport.current,picture=image.current;if(!element||!view||!picture)return;
  let destroyed=false,frame=0,lastFrame=0,held:number|null=null,previous:{x:number;y:number}|null=null,paused=false;
  const loop=(time:number)=>{frame=0;if(destroyed||document.hidden||!engine.current)return;if(!paused)engine.current.step(lastFrame?Math.min((time-lastFrame)/1000,.04):1/70);lastFrame=time;frame=requestAnimationFrame(loop);};
  const start=()=>{if(!frame&&!destroyed&&!document.hidden&&engine.current){lastFrame=0;frame=requestAnimationFrame(loop);}};
  const point=(event:PointerEvent)=>{const rect=view.getBoundingClientRect();return {x:event.clientX-rect.left,y:rect.height-event.clientY+rect.top};};
  const down=(event:PointerEvent)=>{
   if(!engine.current||held!==null)return;if(event.pointerType==='mouse'&&event.button!==0&&event.button!==2)return;
   held=event.pointerId;previous=point(event);view.setPointerCapture(event.pointerId);event.preventDefault();engine.current.pointer(previous.x,previous.y,0,0,event.button===2);
  };
  const move=(event:PointerEvent)=>{
   if(held!==event.pointerId||!previous||!engine.current)return;const next=point(event);engine.current.pointer(next.x,next.y,next.x-previous.x,next.y-previous.y,(event.buttons&2)!==0);previous=next;event.preventDefault();
  };
  const up=()=>{held=null;previous=null;engine.current?.release();};
  const context=(event:Event)=>event.preventDefault();
  const scroll=()=>engine.current?.setScroll(view.scrollLeft,picture.getBoundingClientRect().width);
  const resize=new ResizeObserver(()=>{if(engine.current&&view.clientWidth&&view.clientHeight)engine.current.resize(view.clientWidth,view.clientHeight,view.scrollLeft,picture.getBoundingClientRect().width);});
  const visibility=()=>{up();if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();};
  const key=(event:KeyboardEvent)=>{if(event.key==='r'){engine.current?.reset();event.preventDefault();}if(event.key==='p'){paused=!paused;event.preventDefault();}};
  const lost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;setReady(false);onAvailable(false);};
  async function init(){
   try{
    await picture!.decode();if(destroyed)return;
    const fluid=new ArtOfInk(element!,picture!);if(destroyed){fluid.dispose();return;}
    engine.current=fluid;fluid.resize(view!.clientWidth,view!.clientHeight,view!.scrollLeft,picture!.getBoundingClientRect().width);
    setReady(true);onAvailable(true);start();
   }catch(error){if(!destroyed){setReady(false);onAvailable(false);if(import.meta.env.DEV)console.warn('Art-Of-Ink renderer unavailable',error);}}
  }
  view.addEventListener('pointerdown',down);view.addEventListener('pointermove',move);view.addEventListener('pointerup',up);view.addEventListener('pointercancel',up);view.addEventListener('lostpointercapture',up);view.addEventListener('contextmenu',context);view.addEventListener('scroll',scroll,{passive:true});view.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);element.addEventListener('webglcontextlost',lost);resize.observe(view);void init();
  return()=>{destroyed=true;cancelAnimationFrame(frame);resize.disconnect();view.removeEventListener('pointerdown',down);view.removeEventListener('pointermove',move);view.removeEventListener('pointerup',up);view.removeEventListener('pointercancel',up);view.removeEventListener('lostpointercapture',up);view.removeEventListener('contextmenu',context);view.removeEventListener('scroll',scroll);view.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);element.removeEventListener('webglcontextlost',lost);engine.current?.dispose();engine.current=null;};
 },[viewport,image,source,onAvailable]);
 return <canvas ref={canvas} className={`ink-surface ${ready?'is-ready':''}`} data-ink-state={ready?'ready':'fallback'} data-ink-engine="Art-Of-Ink" aria-hidden="true"/>;
}
