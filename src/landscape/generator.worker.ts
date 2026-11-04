import { generateLandscape } from './generate';
self.onmessage = (event: MessageEvent<{seed:number; width:number}>) => {
  try { self.postMessage({svg:generateLandscape(event.data.seed,event.data.width)}); }
  catch { self.postMessage({error:true}); }
};
