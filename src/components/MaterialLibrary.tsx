import {useEffect,useRef,useState,type FormEvent} from 'react';
import {artworks} from '../artworks';
import {collectionMaterials,type Material} from '../materials';
import {SectionHeader} from './SectionHeader';
import {MaterialPreview} from './MaterialPreview';
const builtIn:Material[]=[...collectionMaterials,...artworks.map(work=>({id:work.id,title:work.title,kind:'画卷' as const,source:work.source,url:work.sourceUrl,description:work.description,image:work.src})),{id:'art-of-ink',title:'Art-Of-Ink',kind:'工具',source:'clouder118 · GitHub',url:'https://github.com/clouder118/Art-Of-Ink',description:'让图像进入流体，探索水墨交互的开源作品。',image:'/landscapes/landscape-2.webp'}];
export function normalizeSourceUrl(value:string){const url=new URL(value.trim());if(!['https:','http:'].includes(url.protocol))throw new Error('请输入 http 或 https 素材链接。');return url.href;}
function read<T>(key:string,fallback:T):T{try{const value=localStorage.getItem(key);return value?JSON.parse(value) as T:fallback;}catch{return fallback;}}
export function MaterialLibrary({onBack}:{onBack:()=>void}){
 const [custom,setCustom]=useState<Material[]>(()=>{const value=read<Material[]>('shanshui-materials',[]);return Array.isArray(value)?value.filter(item=>item&&typeof item.id==='string'&&typeof item.title==='string'&&typeof item.url==='string'&&/^https?:\/\//.test(item.url)):[];});
 const [favorites,setFavorites]=useState<string[]>(()=>{const value=read<string[]>('shanshui-favorites',[]);return Array.isArray(value)?value.filter(item=>typeof item==='string'):[];});
 const [search,setSearch]=useState(''),[onlyFavorites,setOnlyFavorites]=useState(false),[open,setOpen]=useState(false),[message,setMessage]=useState('');
 const [preview,setPreview]=useState<Material|null>(null),dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{try{localStorage.setItem('shanshui-materials',JSON.stringify(custom));localStorage.setItem('shanshui-favorites',JSON.stringify(favorites));}catch{setMessage('浏览器暂未允许保存，当前会话仍可使用。');}},[custom,favorites]);
 useEffect(()=>{if(open)dialog.current?.showModal();else if(dialog.current?.open)dialog.current.close();},[open]);
 const materials=[...builtIn,...custom];
 const shown=materials.filter(item=>(!onlyFavorites||favorites.includes(item.id))&&(item.title+(item.author||'')+item.source+item.description).toLowerCase().includes(search.trim().toLowerCase()));
 const favorite=(id:string)=>setFavorites(items=>items.includes(id)?items.filter(item=>item!==id):[...items,id]);
 function add(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const form=new FormData(event.currentTarget);
  try{
   const url=normalizeSourceUrl(String(form.get('url')||'')),title=String(form.get('title')||'').trim();
   if(!title)throw new Error('请填写素材名称。');
   const source=String(form.get('source')||'').trim()||new URL(url).hostname;
   setCustom(items=>[...items,{id:crypto.randomUUID(),title,kind:String(form.get('kind')) as Material['kind'],source,url,description:String(form.get('description')||'').trim(),image:'/landscapes/landscape-5.webp',custom:true}]);
   setOpen(false);setMessage('素材已加入，保存在此浏览器。');
  }catch(error){setMessage(error instanceof Error?error.message:'链接未能加入，请检查后重试。');}
 }
 function remove(id:string){setCustom(items=>items.filter(record=>record.id!==id));setFavorites(items=>items.filter(item=>item!==id));setMessage('已移除此条素材。');}
 return <main className="section-page library-page">
  <SectionHeader onBack={onBack} label=""/>
  <div className="section-heading section-heading-row"><div><h1 tabIndex={-1}>山水拾藏</h1></div><button className="outlined-button" onClick={()=>{setMessage('');setOpen(true);}}>添加素材</button></div>
  <div className="library-controls"><label className="library-search"><span className="visually-hidden">搜索素材</span><input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="搜索作品、来源或关键词"/></label><button className="favorite-filter" aria-pressed={onlyFavorites} onClick={()=>setOnlyFavorites(!onlyFavorites)}>我的收藏 <span>{favorites.length}</span></button></div>
  <div className="material-filters" role="group" aria-label="素材浏览"><button aria-pressed={!onlyFavorites&&!search} onClick={()=>{setSearch('');setOnlyFavorites(false);}}>全部</button></div>
  {shown.length?<div className="material-grid">{shown.map(item=><article key={item.id} className="material-card">
   {item.image?(!item.custom&&item.kind==='画卷'?<button className={'material-picture material-preview-trigger'+(item.author?' collection-picture':'')} onClick={()=>setPreview(item)} aria-label={'看画：'+(item.author||'')+'《'+item.title+'》'}><img src={item.image} alt={item.title+'预览'} loading="lazy"/><span className="material-picture-action">看画{(item.images?.length||0)>1?' · '+item.images!.length+'页':''}</span></button>:<a className="material-picture" href={item.url} target="_blank" rel="noreferrer" aria-label={'查看'+item.title+'来源'}><img src={item.image} alt="" loading="lazy"/></a>):<a className="material-picture material-unavailable" href={item.url} target="_blank" rel="noreferrer"><span>{item.title}</span><small>前往来源看画</small></a>}
   <div className="material-content">
    <p className="material-meta">{item.kind}<span>·</span>{item.author&&<>{item.author}<span>·</span></>}{item.source}</p>
    <div className="material-title"><h2>{item.title}</h2><button className="save-material" aria-label={(favorites.includes(item.id)?'取消收藏':'收藏')+(item.author?item.author+'《'+item.title+'》':item.title)} aria-pressed={favorites.includes(item.id)} onClick={()=>favorite(item.id)}><svg width="16" height="20" viewBox="0 0 16 20" fill={favorites.includes(item.id)?'currentColor':'none'} aria-hidden="true"><path d="M3 2h10v15l-5-3-5 3V2Z" stroke="currentColor" strokeWidth="1"/></svg></button></div>
    <p className="material-description">{item.description||'一份关于山水的创作线索。'}</p>
    {item.acquisition&&<p className="material-access">{item.acquisition}</p>}
    <div className="material-actions">{item.image&&!item.custom&&item.kind==='画卷'&&<button className="material-view-link" onClick={()=>setPreview(item)}>看画</button>}<a href={item.url} target="_blank" rel="noreferrer">查看来源</a>{item.custom&&<button onClick={()=>remove(item.id)} aria-label={'移除'+item.title}>移除</button>}</div>
   </div>
  </article>)}</div>:<div className="library-empty"><h2>{onlyFavorites?'还没有这一类收藏':'暂未找到素材'}</h2><p>{onlyFavorites?'点击素材旁的书签，将它留在这里。':'换个关键词，或加入你自己的山水素材。'}</p><button className="text-button" onClick={()=>{setSearch('');setOnlyFavorites(false);}}>查看全部素材</button></div>}
  <p className="form-message" role="status">{message}</p><footer className="section-footnote">收藏和新增链接仅保存在此浏览器；清理浏览器数据会一并清除。</footer>
  {preview&&<MaterialPreview key={preview.id} work={preview} onClose={()=>setPreview(null)}/>}
  <dialog ref={dialog} className="about-dialog material-dialog" onClose={()=>setOpen(false)} onCancel={()=>setOpen(false)}><form onSubmit={add}><div className="about-content"><button type="button" className="close-button" onClick={()=>setOpen(false)} aria-label="关闭添加素材">×</button><h2>拾一份山水</h2><label>素材名称<input name="title" required maxLength={80}/></label><label>来源链接<input name="url" type="url" required placeholder="https://"/></label><div className="form-columns"><label>类型<select name="kind"><option>画卷</option><option>三维</option><option>工具</option><option>参考</option></select></label><label>来源名称<input name="source" maxLength={60} placeholder="选填"/></label></div><label>一句描述<textarea name="description" maxLength={180} rows={2} placeholder="选填"/></label><p className="form-message" role="status">{message}</p><button className="outlined-button" type="submit">加入素材库</button></div></form></dialog>
 </main>;
}



