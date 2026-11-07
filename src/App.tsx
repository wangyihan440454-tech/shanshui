import { lazy,Suspense,useEffect,useRef,useState } from 'react';
import { PaintingWall } from './components/PaintingWall';
import { Arrow,MountainMark,PauseIcon } from './components/Icons';
import { TopicHub } from './components/TopicHub';
import type { Section } from './components/SectionHeader';
import { siteConfig } from './config';
import { artworks } from './artworks';
const Viewer=lazy(()=>import('./components/ScrollViewer').then(m=>({default:m.ScrollViewer})));
const Models=lazy(()=>import('./components/ModelGallery').then(m=>({default:m.ModelGallery})));
const Library=lazy(()=>import('./components/MaterialLibrary').then(m=>({default:m.MaterialLibrary})));
type Page='opening'|Section;
type Theme='ink'|'silk';
const route=():Page=>{const key=location.hash.replace(/^#\/?/,'');return ['hub','models','scrolls','library'].includes(key)?key as Section:'opening';};
const readTheme=():Theme=>{try{return localStorage.getItem('shanshui-theme')==='silk'?'silk':'ink';}catch{return 'ink';}};
export function App({onEnter}:{onEnter?:()=>void}={}){
 const [page,setPage]=useState<Page>(route),[theme,setTheme]=useState<Theme>(readTheme),[transition,setTransition]=useState(false);
 const [paused,setPaused]=useState(false),[reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches),[hidden,setHidden]=useState(document.hidden),[info,setInfo]=useState(false);
 const [preparing,setPreparing]=useState(false),[error,setError]=useState(false);
 const entering=useRef(false),alive=useRef(true),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const dialog=useRef<HTMLDialogElement>(null),enterButton=useRef<HTMLButtonElement>(null);
 const navigate=(next:Page)=>{location.hash=next==='opening'?'#/':`#/${next}`;};
 useEffect(()=>{
  alive.current=true;const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const change=()=>setReduced(media.matches),visibility=()=>setHidden(document.hidden);
  const hash=()=>{setPage(route());setTransition(false);entering.current=false;window.scrollTo({top:0,behavior:'instant'});};
  media.addEventListener('change',change);document.addEventListener('visibilitychange',visibility);window.addEventListener('hashchange',hash);
  return()=>{alive.current=false;media.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('hashchange',hash);if(timer.current)clearTimeout(timer.current);};
 },[]);
 useEffect(()=>{if(info)dialog.current?.showModal();else if(dialog.current?.open)dialog.current.close();},[info]);
 useEffect(()=>{try{localStorage.setItem('shanshui-theme',theme);}catch{}document.documentElement.style.colorScheme=theme==='silk'?'light':'dark';},[theme]);
 useEffect(()=>{requestAnimationFrame(()=>{const heading=document.querySelector('.section-page h1');if(heading instanceof HTMLElement)heading.focus({preventScroll:true});});},[page]);
 function enter(){
  if(entering.current)return;entering.current=true;setPreparing(true);setError(false);
  const image=new Image();image.src=artworks[0].preview;
  image.decode().catch(()=>{}).finally(()=>{
   if(!alive.current)return;setPreparing(false);setTransition(true);
   timer.current=setTimeout(()=>{if(alive.current){try{sessionStorage.setItem('shanshui-topic','0');}catch{}navigate('hub');onEnter?.();}},reduced?180:850);
  });
 }
 const opening=()=>{navigate('opening');setTimeout(()=>enterButton.current?.focus(),0);};
 return <div className={`app theme-${theme} scene-${transition?'transition':page} ${reduced?'reduced-motion':''}`} style={{'--ink':theme==='ink'?siteConfig.colors.ink:'#e8e1d4','--paper':theme==='ink'?siteConfig.colors.paper:'#30372f','--mist':theme==='ink'?siteConfig.colors.mist:'#787d6a','--mineral':siteConfig.colors.mineral,'--seal':siteConfig.colors.seal} as React.CSSProperties}>
  {page==='opening'&&<main className="opening" aria-label="山水，墨夜流卷">
   <PaintingWall paused={paused||reduced||hidden||info} leaving={transition}/>
   <div className="atmosphere" aria-hidden="true"/><div className="paper-grain" aria-hidden="true"/>
   <div className="hero-content"><div className="title-composition"><h1>{siteConfig.title}</h1></div><div className="hero-rule" aria-hidden="true"/><button ref={enterButton} className="enter-button" onClick={enter} disabled={preparing||transition}><span>{preparing?'进入中':'进入'}</span><Arrow/></button>{(error||preparing)&&<p className="entry-caption" role="status">{error?'暂未载入，请再试一次':'正在展开山水'}</p>}</div>
   <div className="theme-picker" role="group" aria-label="选择网站风格"><button aria-pressed={theme==='ink'} onClick={()=>setTheme('ink')}><span className="theme-swatch swatch-ink"/>墨夜</button><button aria-pressed={theme==='silk'} onClick={()=>setTheme('silk')}><span className="theme-swatch swatch-silk"/>绢本</button></div>
   <footer className="opening-footer"><div className="footer-caption"><span className="tiny-square"/><span>{theme==='ink'?'墨夜流卷':'绢本山水'}</span></div><button className="motion-control" onClick={()=>setPaused(!paused)} disabled={reduced} aria-pressed={paused||reduced} aria-label={reduced?'已按系统设置减少动态效果':paused?'继续动效':'暂停动效'}><PauseIcon paused={paused||reduced}/><span>{reduced?'静观山水':paused?'继续流动':'暂停片刻'}</span></button></footer>
   {transition&&<div className="hub-entry-veil" aria-hidden="true"/>}
  </main>}
  {page==='hub'&&<TopicHub navigate={navigate} onOpening={opening}/>}
  <Suspense fallback={<div className="section-loading" role="status">正在展开山水…</div>}>
   {page==='scrolls'&&<Viewer onBack={()=>navigate('hub')} reduced={reduced}/>}
   {page==='models'&&<Models onBack={()=>navigate('hub')} theme={theme}/>}
   {page==='library'&&<Library onBack={()=>navigate('hub')}/>}
  </Suspense>
  <dialog ref={dialog} className="about-dialog" onClose={()=>setInfo(false)} onCancel={()=>setInfo(false)} onClick={e=>{if(e.target===e.currentTarget)setInfo(false);}}><div className="about-content"><button className="close-button" onClick={()=>setInfo(false)} aria-label="关闭关于山水">×</button><MountainMark/><h2>山水</h2><p>入一境，观一卷，拾一方山水。</p><p>馆藏画卷来源列于画面下方。生成山水源自 {'{Shan, Shui}*'}；水墨交互由 Art-Of-Ink 的 PixelFlow 实现移植。</p><div className="source-links"><a href="https://github.com/clouder118/Art-Of-Ink" target="_blank" rel="noreferrer">水墨交互来源</a><a href="/LICENSE-PixelFlow.txt" target="_blank" rel="noreferrer">PixelFlow 许可</a><a href="/LICENSE-shan-shui.txt" target="_blank" rel="noreferrer">绘景许可</a></div></div></dialog>
 </div>;
}



