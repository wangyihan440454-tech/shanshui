/** A small, stable fluid field. Pointer momentum carries brushwork; the field relaxes to the original. */
export class InkFlow {
 readonly nx:number;readonly ny:number;readonly pixels:Uint8Array;
 private vx:Float32Array;private vy:Float32Array;private dx:Float32Array;private dy:Float32Array;
 private nextX:Float32Array;private nextY:Float32Array;private nextDX:Float32Array;private nextDY:Float32Array;
 private pressure:Float32Array;private nextPressure:Float32Array;private divergence:Float32Array;
 readonly maxOffset:number;
 constructor(readonly width:number,readonly height:number){
  this.nx=98;this.ny=Math.max(26,Math.min(100,Math.round(96*height/width)+2));
  const size=this.nx*this.ny;
  this.vx=new Float32Array(size);this.vy=new Float32Array(size);this.dx=new Float32Array(size);this.dy=new Float32Array(size);
  this.nextX=new Float32Array(size);this.nextY=new Float32Array(size);this.nextDX=new Float32Array(size);this.nextDY=new Float32Array(size);
  this.pressure=new Float32Array(size);this.nextPressure=new Float32Array(size);this.divergence=new Float32Array(size);
  this.pixels=new Uint8Array(size*4);this.maxOffset=Math.min(70,height*.2);this.encode();
 }
 clear(){for(const field of [this.vx,this.vy,this.dx,this.dy])field.fill(0);this.encode();}
 private sample(field:Float32Array,x:number,y:number){
  x=Math.max(.5,Math.min(this.nx-1.5,x));y=Math.max(.5,Math.min(this.ny-1.5,y));
  const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,k=y0*this.nx+x0;
  return (field[k]*(1-fx)+field[k+1]*fx)*(1-fy)+(field[k+this.nx]*(1-fx)+field[k+this.nx+1]*fx)*fy;
 }
 stroke(fromX:number,fromY:number,toX:number,toY:number){
  const cellX=this.width/(this.nx-2),cellY=this.height/(this.ny-2);
  const movementX=toX-fromX,movementY=toY-fromY,len=Math.hypot(movementX,movementY);
  if(len<.3)return;
  const radius=Math.min(115,Math.max(65,this.height*.25));
  const x0=Math.max(1,Math.floor((Math.min(fromX,toX)-radius*2)/cellX)),x1=Math.min(this.nx-2,Math.ceil((Math.max(fromX,toX)+radius*2)/cellX));
  const y0=Math.max(1,Math.floor((Math.min(fromY,toY)-radius*2)/cellY)),y1=Math.min(this.ny-2,Math.ceil((Math.max(fromY,toY)+radius*2)/cellY));
  const forceX=Math.max(-18,Math.min(18,movementX/cellX*3.2)),forceY=Math.max(-18,Math.min(18,movementY/cellY*3.2));
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
   const px=(x-1)*cellX,py=(y-1)*cellY;
   const along=Math.max(0,Math.min(1,((px-fromX)*movementX+(py-fromY)*movementY)/(len*len)));
   const ax=px-fromX-along*movementX,ay=py-fromY-along*movementY;
   const weight=Math.exp(-(ax*ax+ay*ay)/(radius*radius*.55));
   const curl=.12*weight*Math.min(len,12);
   const k=y*this.nx+x;
   this.vx[k]=Math.max(-32,Math.min(32,this.vx[k]+forceX*weight-ay/radius*curl));
   this.vy[k]=Math.max(-32,Math.min(32,this.vy[k]+forceY*weight+ax/radius*curl));
  }
 }
 step(delta:number){
  const dt=Math.max(.001,Math.min(delta,1/30)),n=this.nx,cellX=this.width/(n-2),cellY=this.height/(this.ny-2);
  const drag=Math.exp(-1.55*dt),returnToPaper=Math.exp(-.85*dt);
  this.nextX.fill(0);this.nextY.fill(0);
  for(let y=1;y<this.ny-1;y++)for(let x=1;x<n-1;x++){
   const k=y*n+x,bx=x-this.vx[k]*dt,by=y-this.vy[k]*dt;
   this.nextX[k]=(this.sample(this.vx,bx,by)*.94+(this.vx[k-1]+this.vx[k+1]+this.vx[k-n]+this.vx[k+n])*.015)*drag;
   this.nextY[k]=(this.sample(this.vy,bx,by)*.94+(this.vy[k-1]+this.vy[k+1]+this.vy[k-n]+this.vy[k+n])*.015)*drag;
  }
  [this.vx,this.nextX]=[this.nextX,this.vx];[this.vy,this.nextY]=[this.nextY,this.vy];
  this.pressure.fill(0);this.nextPressure.fill(0);
  for(let y=1;y<this.ny-1;y++)for(let x=1;x<n-1;x++){const k=y*n+x;this.divergence[k]=-.5*(this.vx[k+1]-this.vx[k-1]+this.vy[k+n]-this.vy[k-n]);}
  for(let iteration=0;iteration<7;iteration++){
   for(let y=1;y<this.ny-1;y++)for(let x=1;x<n-1;x++){const k=y*n+x;this.nextPressure[k]=(this.divergence[k]+this.pressure[k-1]+this.pressure[k+1]+this.pressure[k-n]+this.pressure[k+n])*.25;}
   [this.pressure,this.nextPressure]=[this.nextPressure,this.pressure];
  }
  for(let y=1;y<this.ny-1;y++)for(let x=1;x<n-1;x++){
   const k=y*n+x;this.vx[k]-=.5*(this.pressure[k+1]-this.pressure[k-1]);this.vy[k]-=.5*(this.pressure[k+n]-this.pressure[k-n]);
   const bx=x-this.vx[k]*dt,by=y-this.vy[k]*dt;
   const dx=(this.sample(this.dx,bx,by)+this.vx[k]*cellX*dt*.72)*returnToPaper;
   const dy=(this.sample(this.dy,bx,by)+this.vy[k]*cellY*dt*.72)*returnToPaper;
   this.nextDX[k]=Math.max(-this.maxOffset,Math.min(this.maxOffset,dx));this.nextDY[k]=Math.max(-this.maxOffset,Math.min(this.maxOffset,dy));
  }
  [this.dx,this.nextDX]=[this.nextDX,this.dx];[this.dy,this.nextDY]=[this.nextDY,this.dy];this.encode();
 }
 private encode(){
  for(let k=0;k<this.dx.length;k++){
   this.pixels[k*4]=Math.max(0,Math.min(255,Math.round(128+this.dx[k]/this.maxOffset*127)));
   this.pixels[k*4+1]=Math.max(0,Math.min(255,Math.round(128+this.dy[k]/this.maxOffset*127)));
   this.pixels[k*4+2]=Math.min(255,Math.round(Math.hypot(this.dx[k],this.dy[k])/this.maxOffset*180));this.pixels[k*4+3]=255;
  }
 }
 magnitude(){let max=0;for(let k=0;k<this.dx.length;k++)max=Math.max(max,Math.abs(this.dx[k]),Math.abs(this.dy[k]));return max;}
}
