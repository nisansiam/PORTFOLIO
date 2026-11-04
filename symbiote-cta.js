/* Symbiote CTA — three-zone predator button. Vanilla JS + Canvas, no dependencies.
   The button never moves and the real cursor is never touched; the "pull" is drawn
   (tendrils + a ghost cursor proxy). Edit CFG below, or override per button with
   data attributes, e.g. data-sym-hunt-radius="200". Live tweaking: Symbiote.config.huntRadius=200 */
(function(){
'use strict';
var CFG={stalkRadius:300,huntRadius:150,criticalRadius:45,absorbMs:450,maxPull:34,hysteresis:10,
 measureFrom:'edge', /* 'edge' = radii measured outward from the capsule outline; 'center' = from its centre point */
 tendrils:14};
var IDLE=0,STALKING=1,HUNTING=2,CRITICAL=3,ABSORBING=4,NAMES=['idle','stalking','hunting','critical','absorbing'];
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return; /* CSS hover/focus styles still apply */
var btn,cv,cx,dpr=1,W=0,H=0,rect,ptr=null,fake=null,state=IDLE,zone=0,absorbT=0,navigated=false,veil=0,over=false,
 raf=0,last=0,ang0=0,dist=1e4,pull={x:0,y:0},proxy={x:0,y:0},tn=[],cfg=Object.assign({},CFG);
var rnd=function(a,b){return a+Math.random()*(b-a)},cl=function(v,a,b){return Math.max(a,Math.min(b,v))},
 ease=function(dt,k){return 1-Math.pow(1-k,dt*60)};

function boot(){var el=document.querySelector('[data-symbiote]');if(!el||el._sym)return false;el._sym=1;start(el);return true}
if(!boot()){var mo=new MutationObserver(function(){if(boot())mo.disconnect()});mo.observe(document.documentElement,{childList:true,subtree:true})}

function start(el){
 btn=el;
 Object.keys(CFG).forEach(function(k){var v=btn.dataset['sym'+k[0].toUpperCase()+k.slice(1)];if(v!=null)cfg[k]=isNaN(+v)?v:+v});
 cv=document.createElement('canvas');cv.className='sym-canvas';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);cx=cv.getContext('2d');
 for(var i=0;i<cfg.tendrils;i++)tn.push({off:(i/(cfg.tendrils-1)-.5)*2.4+rnd(-.15,.15),len:rnd(110,230),k:rnd(.6,1.4),ph:rnd(0,6.28),
  wob:rnd(5,14),w:rnd(3.2,5.2),curl:rnd(-1,1),ang:0,x:0,y:0,mx:0,my:0,rx:0,ry:0,vis:0,init:0});
 tn.sort(function(a,b){return Math.abs(a.off)-Math.abs(b.off)}); /* centre-facing tendrils wake first */
 resize();
 var onMove=function(e){ptr={x:e.clientX,y:e.clientY};rect=btn.getBoundingClientRect();if(state!==IDLE||zoneFor(distTo(ptr))>0)wake()};
 addEventListener('pointermove',onMove,{passive:true});addEventListener('pointerdown',onMove,{passive:true});
 var lose=function(e){if(!e||!e.pointerType||e.pointerType==='touch'){ptr=null;wake()}};
 addEventListener('pointerup',lose);addEventListener('pointercancel',function(){ptr=null;wake()});
 document.documentElement.addEventListener('mouseleave',function(){ptr=null;wake()});
 addEventListener('blur',function(){ptr=null;wake()});
 addEventListener('resize',resize);addEventListener('scroll',function(){if(ptr&&state!==IDLE||ptr)wake()},{passive:true});
 btn.addEventListener('click',function(){navigated=true}); /* normal click navigates through the plain link */
 addEventListener('pageshow',function(e){if(e.persisted){navigated=false;absorbT=0;state=IDLE;veil=0;ptr=null;fake=null;wake()}}); /* back button */
 if(matchMedia('(hover:none)').matches&&'IntersectionObserver' in window){ /* touch: one-time "sniff" hint when it scrolls into view */
  var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){fake={until:performance.now()+1800};wake();io.disconnect()}},{threshold:.9});io.observe(btn)}
 window.Symbiote={config:cfg,get state(){return NAMES[state]}};
}
function resize(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,2);cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);rect=btn.getBoundingClientRect();wake()}

/* distance from the capsule (stadium signed-distance: <0 inside the button) or from its centre */
function distTo(p){
 var cxn=rect.left+rect.width/2,cyn=rect.top+rect.height/2,dx=p.x-cxn,dy=p.y-cyn;
 if(cfg.measureFrom==='center')return Math.hypot(dx,dy);
 var r=rect.height/2,a=rect.width/2-r;return Math.hypot(Math.max(Math.abs(dx)-a,0),dy)-r}
/* zone 0..3 with hysteresis so the boundaries never flicker */
function zoneFor(d){
 var cur=state>=CRITICAL?3:state,h=cfg.hysteresis,r=[0,cfg.stalkRadius,cfg.huntRadius,cfg.criticalRadius],n=0;
 for(var i=1;i<=3;i++)if(d<=r[i]+(cur>=i?h:0))n=i;return n}

function wake(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
function busy(){if(state!==IDLE||veil>.004||fake)return true;for(var i=0;i<tn.length;i++)if(tn[i].vis>.01)return true;return false}
function frame(now){
 raf=0;var dt=Math.min(.05,(now-last)/1000||.016);last=now; /* dt clamp: a hidden tab can't fast-forward an absorption */
 update(dt,now/1000);render(now/1000);
 if(busy())raf=requestAnimationFrame(frame);else cx.clearRect(0,0,W,H)}

function update(dt,time){
 rect=btn.getBoundingClientRect();
 var cxn=rect.left+rect.width/2,cyn=rect.top+rect.height/2,p=ptr;
 if(!p&&fake){if(performance.now()>fake.until)fake=null;else p={x:cxn,y:rect.top-cfg.stalkRadius*.55}}
 dist=p?distTo(p):1e4;zone=p?zoneFor(dist):0;
 /* ---- state machine ---- */
 var T=cfg.absorbMs/1000;
 if(zone===3){absorbT+=dt;state=absorbT<T*.35?CRITICAL:ABSORBING;
  if(absorbT>=T&&!navigated){navigated=true;location.href=btn.href}}
 else{absorbT=0;state=zone} /* leaving before completion = cancel: nothing is scheduled, so nothing can fire late */
 btn.dataset.sym=NAMES[state];
 var wantOver=state>=CRITICAL;if(wantOver!==over){over=wantOver;cv.classList.toggle('over',over)}
 veil+=((state>=CRITICAL?cl((absorbT/T-.55)/.45,0,1)*.92:0)-veil)*ease(dt,.3);
 /* ---- visual pull: ghost cursor proxy is drawn nearer the button; the real cursor never moves ---- */
 var tp={x:0,y:0};
 if(p&&zone>=2){var s=Math.pow(cl((cfg.huntRadius-dist)/cfg.huntRadius,0,1),1.3),dx=cxn-p.x,dy=cyn-p.y,dl=Math.hypot(dx,dy)||1,
  m=Math.min(cfg.maxPull*s*(zone===3?1.4:1),dl*.9);tp.x=dx/dl*m;tp.y=dy/dl*m}
 var a=ease(dt,.18);pull.x+=(tp.x-pull.x)*a;pull.y+=(tp.y-pull.y)*a;
 var px=p?p.x+pull.x:cxn,py=p?p.y+pull.y:cyn;proxy.x=px;proxy.y=py;
 /* ---- tendrils ---- */
 if(p)ang0=Math.atan2(p.y-cyn,p.x-cxn);
 var count=zone===0?0:zone===1?5:zone===2?9:tn.length,rx=rect.width/2-4,ry=rect.height/2-4,
  prog=cl((cfg.stalkRadius-dist)/(cfg.stalkRadius-cfg.huntRadius),0,1),ap=cl(absorbT/T,0,1);
 for(var i=0;i<tn.length;i++){var t=tn[i],act=i<count;
  var da=Math.atan2(Math.sin(ang0+t.off*(zone>=2?1:.55)-t.ang),Math.cos(ang0+t.off*(zone>=2?1:.55)-t.ang));
  t.ang+=da*ease(dt,.12);t.rx=cxn+Math.cos(t.ang)*rx;t.ry=cyn+Math.sin(t.ang)*ry; /* roots flow around the capsule to face the prey */
  if(!t.init){t.x=t.mx=t.rx;t.y=t.my=t.ry;t.init=1}
  var gx=t.rx,gy=t.ry,k=.1,vt=0;
  if(act){vt=1;var ex=px-t.rx,ey=py-t.ry,el=Math.hypot(ex,ey)||1;
   if(zone===1){k=.045;var L=Math.min(el*.85,t.len*(.35+.65*prog));gx=t.rx+ex/el*L;gy=t.ry+ey/el*L} /* slow, no pulling */
   else if(zone===2){k=.15;var o=t.ph+time*2.4,r=9+6*t.k;gx=px+Math.cos(o)*r;gy=py+Math.sin(o)*r; /* wrap the cursor */
    var mx=t.len*1.6;if(el>mx){gx=t.rx+ex/el*mx;gy=t.ry+ey/el*mx}} /* stretch, then reach their limit */
   else{k=.42;if(i%2===0){var rr=46-41*ap,o2=t.ph+time*(9+4*ap);gx=px+Math.cos(o2)*rr;gy=py+Math.sin(o2)*rr} /* converge on cursor */
    else{var o3=t.ph+time*6;gx=cxn+Math.cos(o3)*rx*.95;gy=cyn+Math.sin(o3)*ry*.95}}} /* clamp over the capsule */
  var kk=ease(dt,k*t.k);t.x+=(gx-t.x)*kk;t.y+=(gy-t.y)*kk;
  t.vis+=(vt-t.vis)*ease(dt,(vt?.09:.05)*t.k);
  var ddx=t.x-t.rx,ddy=t.y-t.ry,dd=Math.hypot(ddx,ddy)||1,bow=(Math.sin(time*1.4*t.k+t.ph)*t.wob+t.curl*dd*.2)*(1+state*.25),
   km=ease(dt,.08*t.k); /* the mid-point lags the tip, which gives the whip / drag of a living limb */
  t.mx+=(t.rx+ddx*.5-ddy/dd*bow-t.mx)*km;t.my+=(t.ry+ddy*.5+ddx/dd*bow-t.my)*km}
}

function render(time){
 cx.clearRect(0,0,W,H);
 if(veil>.004){cx.fillStyle='rgba(0,0,0,'+veil.toFixed(3)+')';cx.fillRect(0,0,W,H)}
 if(state>=HUNTING){cx.beginPath();cx.arc(proxy.x,proxy.y,8,0,6.283);cx.strokeStyle='rgba(255,255,255,.7)';cx.lineWidth=1.2;cx.stroke();
  cx.beginPath();cx.arc(proxy.x,proxy.y,1.8,0,6.283);cx.fillStyle='#fff';cx.fill()}
 for(var i=0;i<tn.length;i++)if(tn[i].vis>.03)draw(tn[i],time)}

function draw(t,time){
 var N=16,Ls=[],Rs=[],Hs=[],wb=t.w*(state>=CRITICAL?1.45:state===HUNTING?1.2:1)*t.vis,i;
 for(var s=0;s<=N;s++){var u=s/N,iu=1-u,
  x=iu*iu*t.rx+2*u*iu*t.mx+u*u*t.x,y=iu*iu*t.ry+2*u*iu*t.my+u*u*t.y,
  tx=2*iu*(t.mx-t.rx)+2*u*(t.x-t.mx),ty=2*iu*(t.my-t.ry)+2*u*(t.y-t.my),tl=Math.hypot(tx,ty)||1,nx=-ty/tl,ny=tx/tl,
  sw=Math.sin(time*(2.2+t.k)+u*7+t.ph)*t.wob*1.1*u*iu*t.vis; /* irregular side-to-side writhing */
  x+=nx*sw;y+=ny*sw;
  var w=wb*Math.pow(iu,.9)*(1+.9*Math.pow(iu,3))+.35*t.vis+Math.sin(time*5+u*10+t.ph)*.06*wb; /* thick root, tapered tip, slight pulsing */
  Ls.push(x+nx*w,y+ny*w);Rs.push(x-nx*w,y-ny*w);Hs.push(x+nx*w*.45,y+ny*w*.45)}
 cx.beginPath();cx.moveTo(Ls[0],Ls[1]);for(i=2;i<Ls.length;i+=2)cx.lineTo(Ls[i],Ls[i+1]);
 for(i=Rs.length-2;i>=0;i-=2)cx.lineTo(Rs[i],Rs[i+1]);cx.closePath();
 cx.fillStyle='#000';cx.fill();cx.strokeStyle='rgba(255,255,255,.2)';cx.lineWidth=.8;cx.stroke(); /* rim light */
 cx.beginPath();cx.moveTo(Hs[4],Hs[5]);for(i=6;i<Hs.length-6;i+=2)cx.lineTo(Hs[i],Hs[i+1]);
 cx.strokeStyle='rgba(255,255,255,.45)';cx.lineWidth=1;cx.stroke(); /* wet specular streak */
 if(state>=HUNTING){cx.beginPath();cx.arc(t.x,t.y,Math.max(1.4,wb*.3+1),0,6.283);cx.fillStyle='#000';cx.fill()} /* gripping tip */
}
})();
