import advect from '../vendor/art-of-ink/shaders/advect.frag?raw';
import buoyancy from '../vendor/art-of-ink/shaders/buoyancy.frag?raw';
import divergence from '../vendor/art-of-ink/shaders/divergence.frag?raw';
import jacobi from '../vendor/art-of-ink/shaders/jacobi.frag?raw';
import gradient from '../vendor/art-of-ink/shaders/gradient.frag?raw';
import vorticityCurl from '../vendor/art-of-ink/shaders/vorticityCurl.frag?raw';
import vorticityForce from '../vendor/art-of-ink/shaders/vorticityForce.frag?raw';
import addVelocityBlob from '../vendor/art-of-ink/shaders/addVelocityBlob.frag?raw';
import addTemperatureBlob from '../vendor/art-of-ink/shaders/addTemperatureBlob.frag?raw';
import addDensity from '../vendor/art-of-ink/shaders/addDensity.frag?raw';

type Target={texture:WebGLTexture;framebuffer:WebGLFramebuffer;width:number;height:number};
type Pair={src:Target;dst:Target;swap:()=>void};
type Shader={program:WebGLProgram;locations:Map<string,WebGLUniformLocation|null>};
const vertex=`#version 300 es
layout(location=0) in vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
const sourceShader=`#version 300 es
precision highp float;out vec4 glFragColor;
uniform sampler2D image;uniform vec2 wh;uniform vec2 view;uniform float scroll;uniform float imageWidth;
void main(){vec2 uv=gl_FragCoord.xy/wh;glFragColor=texture(image,vec2((uv.x*view.x+scroll)/imageWidth,uv.y));}`;
const renderShader=`#version 300 es
precision highp float;out vec4 glFragColor;
uniform sampler2D tex_density;uniform vec2 wh;
void main(){vec4 d=texture(tex_density,gl_FragCoord.xy/wh);float a=clamp(d.a,0.,1.);glFragColor=vec4(d.rgb/max(d.a,.00001),a);}`;

/** WebGL 2 host for Art-Of-Ink's PixelFlow density simulation. See the vendor README. */
export class ArtOfInk {
 readonly gl:WebGL2RenderingContext;
 private programs=new Map<string,Shader>();private shaders:WebGLShader[]=[];
 private targets:Target[]=[];private buffer:WebGLBuffer|null=null;private vao:WebGLVertexArrayObject|null=null;
 private imageTexture:WebGLTexture|null=null;private zeroTexture:WebGLTexture|null=null;
 private velocity!:Pair;private density!:Pair;private temperature!:Pair;private pressure!:Pair;
 private curl!:Target;private divergence!:Target;private source!:Target;
 private width=0;private height=0;private simWidth=0;private simHeight=0;private scroll=0;private imageWidth=1;
 private input:{x:number;y:number;dx:number;dy:number;heat:boolean}|null=null;
 private disposed=false;
 constructor(private canvas:HTMLCanvasElement,private image:HTMLImageElement){
  const gl=canvas.getContext('webgl2',{alpha:false,depth:false,antialias:false,powerPreference:'high-performance'});
  if(!gl)throw new Error('WebGL 2 unavailable');this.gl=gl;
  try{
   if(!gl.getExtension('EXT_color_buffer_float'))throw new Error('Floating point targets unavailable');
   this.vao=gl.createVertexArray();gl.bindVertexArray(this.vao);this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
   for(const [name,code] of Object.entries({advect,buoyancy,divergence,jacobi,gradient,vorticityCurl,vorticityForce,addVelocityBlob,addTemperatureBlob,addDensity,source:sourceShader,render:renderShader}))this.compile(name,code);
   this.zeroTexture=this.texture();gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(4));
   this.imageTexture=this.texture();gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
   const max=gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;let upload:TexImageSource=image;
   if(image.naturalWidth>max||image.naturalHeight>max){const small=document.createElement('canvas'),ratio=max/Math.max(image.naturalWidth,image.naturalHeight);small.width=Math.floor(image.naturalWidth*ratio);small.height=Math.floor(image.naturalHeight*ratio);const ctx=small.getContext('2d');if(!ctx)throw new Error('Image resize unavailable');ctx.drawImage(image,0,0,small.width,small.height);upload=small;}
   gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,upload);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
  }catch(error){this.dispose();throw error;}
 }
 private texture(){const gl=this.gl,t=gl.createTexture();if(!t)throw new Error('Texture unavailable');gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
 private compile(name:string,fragment:string){
  const gl=this.gl,program=gl.createProgram();if(!program)throw new Error('Program unavailable');
  for(const [type,code] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]] as const){const shader=gl.createShader(type);if(!shader)throw new Error('Shader unavailable');this.shaders.push(shader);gl.shaderSource(shader,code);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`${name}: ${gl.getShaderInfoLog(shader)}`);gl.attachShader(program,shader);}
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(`${name}: ${gl.getProgramInfoLog(program)}`);this.programs.set(name,{program,locations:new Map()});
 }
 private target(width:number,height:number,channels:1|2|4):Target{
  const gl=this.gl,texture=this.texture(),framebuffer=gl.createFramebuffer();if(!framebuffer)throw new Error('Framebuffer unavailable');
  gl.texImage2D(gl.TEXTURE_2D,0,channels===1?gl.R16F:channels===2?gl.RG16F:gl.RGBA16F,width,height,0,channels===1?gl.RED:channels===2?gl.RG:gl.RGBA,gl.HALF_FLOAT,null);
  gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE){gl.deleteTexture(texture);gl.deleteFramebuffer(framebuffer);throw new Error('Floating point framebuffer incomplete');}
  const target={texture,framebuffer,width,height};this.targets.push(target);this.clear(target);return target;
 }
 private pair(w:number,h:number,c:1|2|4):Pair{const pair={src:this.target(w,h,c),dst:this.target(w,h,c),swap(){[this.src,this.dst]=[this.dst,this.src];}};return pair;}
 private clear(target:Target){const gl=this.gl;gl.bindFramebuffer(gl.FRAMEBUFFER,target.framebuffer);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);}
 private location(shader:Shader,name:string){if(!shader.locations.has(name))shader.locations.set(name,this.gl.getUniformLocation(shader.program,name));return shader.locations.get(name)!;}
 private pass(name:string,target:Target|null,textures:Record<string,WebGLTexture>,floats:Record<string,number>={},vectors:Record<string,[number,number]>={},ints:Record<string,number>={}){
  const gl=this.gl,shader=this.programs.get(name)!;gl.useProgram(shader.program);gl.bindVertexArray(this.vao);gl.bindFramebuffer(gl.FRAMEBUFFER,target?.framebuffer??null);gl.viewport(0,0,target?.width??this.canvas.width,target?.height??this.canvas.height);
  let unit=0;for(const [key,value] of Object.entries({...textures,tex_obstacleC:this.zeroTexture!,tex_obstacleN:this.zeroTexture!})){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,value);gl.uniform1i(this.location(shader,key),unit++);}
  for(const [key,value] of Object.entries(floats))gl.uniform1f(this.location(shader,key),value);
  for(const [key,value] of Object.entries(vectors))gl.uniform2f(this.location(shader,key),...value);
  for(const [key,value] of Object.entries(ints))gl.uniform1i(this.location(shader,key),value);
  gl.drawArrays(gl.TRIANGLES,0,6);
 }
 resize(width:number,height:number,scroll:number,imageWidth:number){
  if(this.disposed)return;this.scroll=scroll;this.imageWidth=imageWidth;
  if(width===this.width&&height===this.height){this.reset();return;}
  const gl=this.gl;for(const target of this.targets){gl.deleteTexture(target.texture);gl.deleteFramebuffer(target.framebuffer);}this.targets=[];
  this.width=width;this.height=height;const dpr=Math.min(window.devicePixelRatio||1,1.25);
  this.canvas.width=Math.max(1,Math.round(width*dpr));this.canvas.height=Math.max(1,Math.round(height*dpr));
  this.simWidth=Math.min(768,Math.round(width));this.simHeight=Math.max(1,Math.round(height*this.simWidth/width));
  this.velocity=this.pair(this.simWidth,this.simHeight,2);this.temperature=this.pair(this.simWidth,this.simHeight,1);this.pressure=this.pair(this.simWidth,this.simHeight,1);
  this.curl=this.target(this.simWidth,this.simHeight,1);this.divergence=this.target(this.simWidth,this.simHeight,1);
  this.density=this.pair(this.canvas.width,this.canvas.height,4);this.source=this.target(this.canvas.width,this.canvas.height,4);this.reset();
 }
 reset(){
  if(!this.source||this.disposed)return;for(const target of this.targets)this.clear(target);this.input=null;
  this.pass('source',this.source,{image:this.imageTexture!},{scroll:this.scroll,imageWidth:this.imageWidth},{wh:[this.source.width,this.source.height],view:[this.width,this.height]});
  this.injectImage(1);this.render();
 }
 setScroll(scroll:number,imageWidth:number){this.scroll=scroll;this.imageWidth=imageWidth;this.reset();}
 pointer(x:number,y:number,dx:number,dy:number,heat=false){this.input={x,y,dx:(this.input?.dx??0)+dx,dy:(this.input?.dy??0)+dy,heat};}
 release(){this.input=null;}
 private injectImage(mix:number){this.pass('addDensity',this.density.dst,{tex_ext:this.source.texture,tex_src:this.density.src.texture},{mix_value:mix,multiplier:1},{wh:[this.density.dst.width,this.density.dst.height]},{blend_mode:6});this.density.swap();}
 private advect(pair:Pair,dissipation:number,timestep:number){this.pass('advect',pair.dst,{tex_velocity:this.velocity.src.texture,tex_source:pair.src.texture},{timestep,rdx:pair.dst.width/this.width,dissipation},{wh_inv:[1/pair.dst.width,1/pair.dst.height]});pair.swap();}
 step(seconds:number){
  if(this.disposed||!this.width)return;
  const scale=Math.min(2,Math.max(.25,seconds*70)),timestep=.125*scale,cell=this.width/this.simWidth,wh:[number,number]=[1/this.simWidth,1/this.simHeight];
  this.advect(this.velocity,Math.pow(.88,.05*scale),timestep);this.advect(this.density,Math.pow(.99,.05*scale),timestep);this.advect(this.temperature,Math.pow(.70,.05*scale),timestep);
  if(this.input){
   const p=this.input;
   if(p.heat){this.pass('addTemperatureBlob',this.temperature.dst,{tex_src:this.temperature.src.texture},{'data.rad':15,'data.temperature':15},{wh_src:[this.width,this.height],wh_dst:[this.simWidth,this.simHeight],'data.pos':[p.x,p.y]});this.temperature.swap();}
   else if(p.dx||p.dy){this.pass('addVelocityBlob',this.velocity.dst,{tex_src:this.velocity.src.texture},{'data.rad':25,mix_value:.5},{wh_src:[this.width,this.height],wh_dst:[this.simWidth,this.simHeight],'data.pos':[p.x,p.y],'data.velocity':[Math.max(-2500,Math.min(2500,p.dx*15)),Math.max(-2500,Math.min(2500,p.dy*15))]},{blend_mode:2});this.velocity.swap();}
   p.dx=0;p.dy=0;
  }
  this.injectImage(1-Math.pow(1-.009,scale));
  this.pass('buoyancy',this.velocity.dst,{tex_velocity:this.velocity.src.texture,tex_temperature:this.temperature.src.texture,tex_density:this.density.src.texture},{temperature_ambient:0,timestep,fluid_buoyancy:1,fluid_weight:.001},{wh_inv:wh});this.velocity.swap();
  this.pass('vorticityCurl',this.curl,{tex_velocity:this.velocity.src.texture},{halfrdx:.5/cell},{wh_inv:wh});
  this.pass('vorticityForce',this.velocity.dst,{tex_velocity:this.velocity.src.texture,tex_curl:this.curl.texture},{halfrdx:.5/cell,timestep,vorticity:.5},{wh_inv:wh});this.velocity.swap();
  this.pass('divergence',this.divergence,{tex_velocity:this.velocity.src.texture},{halfrdx:.5/cell},{wh_inv:wh});this.clear(this.pressure.src);
  for(let i=0;i<40;i++){this.pass('jacobi',this.pressure.dst,{tex_x:this.pressure.src.texture,tex_b:this.divergence.texture},{alpha:-cell*cell,rBeta:.25},{wh_inv:wh});this.pressure.swap();}
  this.pass('gradient',this.velocity.dst,{tex_velocity:this.velocity.src.texture,tex_pressure:this.pressure.src.texture},{halfrdx:1/cell},{wh_inv:wh});this.velocity.swap();this.render();
 }
 render(){if(!this.disposed&&this.density)this.pass('render',null,{tex_density:this.density.src.texture},{},{wh:[this.canvas.width,this.canvas.height]});}
 dispose(){
  if(this.disposed)return;this.disposed=true;const gl=this.gl;
  for(const target of this.targets){gl.deleteTexture(target.texture);gl.deleteFramebuffer(target.framebuffer);}this.targets=[];
  for(const shader of this.programs.values())gl.deleteProgram(shader.program);for(const shader of this.shaders)gl.deleteShader(shader);
  if(this.imageTexture)gl.deleteTexture(this.imageTexture);if(this.zeroTexture)gl.deleteTexture(this.zeroTexture);if(this.buffer)gl.deleteBuffer(this.buffer);if(this.vao)gl.deleteVertexArray(this.vao);
  gl.getExtension('WEBGL_lose_context')?.loseContext();
 }
}
