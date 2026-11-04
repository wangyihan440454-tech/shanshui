import {useEffect,useRef,useState} from 'react';
import type {Material} from '../materials';
import {Arrow} from './Icons';
export function MaterialPreview({work,onClose}:{work:Material;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),surface=useRef<HTMLDivElement>(null);
 const [page,setPage]=useState(0),[zoomed,setZoomed]=useState(false);
 const pages=work.images?.length?work.images:[{src:work.image}],current=pages[page];
 useEffect(()=>{const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;if(!dialog.current?.open)dialog.current?.showModal();return()=>{previous?.focus({preventScroll:true});};},[]);
 function move(direction:number){setPage(index=>Math.max(0,Math.min(pages.length-1,index+direction)));setZoomed(false);surface.current?.scrollTo(0,0);}
 return <dialog ref={dialog} className="material-preview-dialog" aria-labelledby="material-preview-title" onClose={onClose} onCancel={onClose} onClick={event=>{if(event.target===event.currentTarget)onClose();}} onKeyDown={event=>{if(!zoomed&&event.key==='ArrowLeft'){event.preventDefault();move(-1);}if(!zoomed&&event.key==='ArrowRight'){event.preventDefault();move(1);}}}>
  <header className="material-preview-header"><div><p>{work.author}{work.author&&' · '}{work.source}</p><h2 id="material-preview-title">{work.title}</h2></div><button className="close-button" aria-label="关闭看画" onClick={onClose}>×</button></header>
  <div ref={surface} className={'material-preview-image'+(zoomed?' is-zoomed':'')} tabIndex={0} aria-label="画作预览，可滚动细看"><img key={current.src} src={current.src} alt={(work.author||'')+'《'+work.title+'》'+(current.caption||'')}/></div>
  <div className="material-preview-toolbar"><div className="material-page-controls">{pages.length>1&&<><button className="circle-button" aria-label="上一页画作" disabled={page===0} onClick={()=>move(-1)}><Arrow direction="left"/></button><span aria-live="polite">{page+1} / {pages.length}</span><button className="circle-button" aria-label="下一页画作" disabled={page===pages.length-1} onClick={()=>move(1)}><Arrow/></button></>}</div><button className="text-button" aria-pressed={zoomed} onClick={()=>{setZoomed(!zoomed);surface.current?.scrollTo(0,0);}}>{zoomed?'适合画面':'放大细看'}</button></div>
  <footer className="material-preview-source"><p>{work.description}</p>{current.caption&&<p>{current.caption}</p>}<div><a href={work.url} target="_blank" rel="noreferrer">查看来源</a>{work.downloadUrl&&<a href={work.downloadUrl} target="_blank" rel="noreferrer">原图下载</a>}{work.acquisition&&<span>{work.acquisition}</span>}</div></footer>
 </dialog>;
}


