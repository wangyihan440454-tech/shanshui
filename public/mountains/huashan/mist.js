import * as THREE from 'three';
export class ValleyFog{
 constructor(renderer,camera){
  this.renderer=renderer;this.camera=camera;this.enabled=false;
  this.target=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType});this.target.depthTexture=new THREE.DepthTexture(1,1,THREE.UnsignedIntType);
  this.material=new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,uniforms:{colorMap:{value:this.target.texture},depthMap:{value:this.target.depthTexture},inverseProjection:{value:camera.projectionMatrixInverse},cameraWorld:{value:camera.matrixWorld},origin:{value:camera.position},time:{value:0},strength:{value:1}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,fragmentShader:`
   precision highp float;varying vec2 vUv;uniform sampler2D colorMap,depthMap;uniform mat4 inverseProjection,cameraWorld;uniform vec3 origin;uniform float time,strength;
   float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
   float noise(vec3 x){vec3 p=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(p),hash(p+vec3(1,0,0)),f.x),mix(hash(p+vec3(0,1,0)),hash(p+vec3(1,1,0)),f.x),f.y),mix(mix(hash(p+vec3(0,0,1)),hash(p+vec3(1,0,1)),f.x),mix(hash(p+vec3(0,1,1)),hash(p+vec3(1,1,1)),f.x),f.y),f.z);}
   float fbm(vec3 p){return .57*noise(p)+.29*noise(p*2.09+vec3(7.2,2.5,1.7))+.14*noise(p*4.31+vec3(2.1,9.4,3.5));}
   float density(vec3 p){
    vec3 q=p*vec3(1.6,3.1,1.6)+vec3(time*.012,0.,time*.004);
    float n=fbm(q)-.10*noise(q*5.2);float height=.82+.30*(fbm(p*1.7+4.)-.5);
    float layer=exp(-pow((p.y-height)/.115,2.));
    float edge=1.-smoothstep(.70,1.45,length(p.xz/vec2(1.2,1.7)));
    float billow=smoothstep(.34,.64,n);
    return layer*billow*edge*2.5*strength;
   }
   void main(){
    vec4 base=texture2D(colorMap,vUv);float depth=texture2D(depthMap,vUv).r;
    vec4 farPoint=cameraWorld*inverseProjection*vec4(vUv*2.-1.,1.,1.);vec3 rd=normalize(farPoint.xyz/farPoint.w-origin);
    vec3 inv=1./rd;vec3 t0=(vec3(-2.8,-.40,-2.8)-origin)*inv;vec3 t1=(vec3(2.8,1.35,2.8)-origin)*inv;
    vec3 lo=min(t0,t1),hi=max(t0,t1);float begin=max(max(lo.x,lo.y),max(lo.z,0.));float end=min(min(hi.x,hi.y),hi.z);
    if(depth<.999999){vec4 wp=cameraWorld*inverseProjection*vec4(vUv*2.-1.,depth*2.-1.,1.);end=min(end,length(wp.xyz/wp.w-origin)-.002);}
    float alpha=0.;vec3 scatter=vec3(0.);
    if(end>begin){float stepSize=(end-begin)/36.;float jitter=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);for(int i=0;i<36;i++){vec3 p=origin+rd*(begin+(float(i)+jitter)*stepSize);float d=density(p);float a=1.-exp(-d*stepSize);float light=.79+.21*smoothstep(.13,.58,p.y);vec3 tint=mix(vec3(.64,.74,.79),vec3(.94,.97,.96),light);scatter+=(1.-alpha)*a*tint;alpha+=(1.-alpha)*a;if(alpha>.985)break;}}
    float outAlpha=base.a+alpha*(1.-base.a);vec3 color=(base.rgb*base.a*(1.-alpha)+scatter)/max(outAlpha,.0001);gl_FragColor=vec4(color,outAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`});
  this.scene=new THREE.Scene();this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),this.material));this.ortho=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
 }
 resize(w,h){const ratio=this.renderer.getPixelRatio();this.target.setSize(Math.round(w*ratio),Math.round(h*ratio));}
 render(scene,time){if(!this.enabled){this.renderer.setRenderTarget(null);this.renderer.render(scene,this.camera);return;}this.camera.updateMatrixWorld();this.material.uniforms.time.value=time;this.renderer.setRenderTarget(this.target);this.renderer.clear();this.renderer.render(scene,this.camera);this.renderer.setRenderTarget(null);this.renderer.render(this.scene,this.ortho);}
 dispose(){this.target.dispose();this.material.dispose();}
}
