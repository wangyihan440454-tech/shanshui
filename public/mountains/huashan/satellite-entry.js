const trigger=document.getElementById('weather-satellite');
const dialog=document.getElementById('satellite-dialog');
const frame=document.getElementById('satellite-frame');
trigger.addEventListener('click',()=>{if(!frame.getAttribute('src'))frame.src='./lst/?embedded=1';dialog.showModal();});
document.getElementById('satellite-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>trigger.focus());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
