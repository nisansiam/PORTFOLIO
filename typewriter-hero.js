/* Typewriter hero. Types the Home headline + intro from the admin panel (content.js: home.h1a, h1b, intro).
   Keys on the photo press for whatever letters are typed; the lever is pulled down at the end of each line. */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',BASE=322,CX=768,MAXW=470,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function boot(){var el=document.querySelector('[data-tw]');if(!el||el._tw)return false;el._tw=1;start(el);return true}
if(!boot()){var mo=new MutationObserver(function(){if(boot())mo.disconnect()});mo.observe(document.documentElement,{childList:true,subtree:true})}
var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
function mk(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}

/* key positions measured on the photo (viewBox coordinates) */
var POS={},LETTERS=[];
[['QWERTYUIOP',[517,567,617,667,717,767,816,866,915,965],799],['ASDFGHJKL',[535,584,633,682,731,780,828,876,925],842],['ZXCVBNM',[564,610,659,707,756,803,850],884]].forEach(function(r){r[0].split('').forEach(function(c,i){POS[c]=[r[1][i],r[2]];LETTERS.push(c)})});
POS[',']=[898,884];POS['.']=[947,884];POS[' ']=[774,928];
var ROW1={1:537,2:589,3:640,4:640,5:690,6:741,7:791,8:841,9:892,0:942};for(var d in ROW1)POS[d]=[ROW1[d],748];
var ALT={'-':[992,748],'?':[992,748],'!':[537,748],'"':[589,748],'(':[892,748],')':[942,748],':':[947,884],';':[973,842],"'":[973,842],'’':[973,842],'‘':[973,842],'+':[1015,799],'=':[1015,799],'%':[1024,842],'/':[994,884],'&':[690,748],'@':[1015,799]};
function posFor(ch){var u=ch.toUpperCase();return POS[u]||ALT[ch]||POS[LETTERS[ch.charCodeAt(0)%LETTERS.length]]} /* any other character (e.g. Bangla) still presses a key */

function start(host){
 var H=(window.SITE&&window.SITE.home)||{},strip=function(s){return String(s||'').replace(/\*/g,'').trim()},
  speed=H.twSpeed>0?+H.twSpeed:1,loop=H.twLoop!=='once',holder=host.querySelector('.tws');
 var sv=holder.appendChild(mk('svg',{viewBox:'190 0 970 970',preserveAspectRatio:'xMidYMid meet',role:'img'}));
 var defs=mk('defs',{},sv);
 mk('image',{id:'twm',x:190,y:0,width:970,height:970,href:'machine.webp'},defs);
 var g1=mk('linearGradient',{id:'twpg',x1:0,y1:0,x2:1,y2:0},defs);[[0,'#ece4d8'],[.05,'#f6efe4'],[.95,'#f6efe4'],[1,'#e9e1d4']].forEach(function(s){mk('stop',{offset:s[0],'stop-color':s[1]},g1)});
 var g2=mk('linearGradient',{id:'twsh',x1:0,y1:0,x2:0,y2:1},defs);mk('stop',{offset:0,'stop-color':'#3a2a14','stop-opacity':0},g2);mk('stop',{offset:1,'stop-color':'#3a2a14','stop-opacity':.2},g2);
 var paper=mk('g',{},sv),lines=mk('g',{class:'twl'},mk('g',{},paper));
 mk('rect',{x:498,y:0,width:540,height:560,fill:'url(#twpg)'},paper);paper.appendChild(lines.parentNode);
 var caret=mk('rect',{class:'twc',width:3,height:28,style:'opacity:0'},paper);
 mk('rect',{x:498,y:270,width:540,height:66,fill:'url(#twsh)'},sv);
 mk('use',{href:'#twm'},sv);
 var lever=mk('g',{},sv);mk('image',{x:196,y:215,width:250,height:275,href:'lever.webp'},lever);
 var keysG=mk('g',{},sv);

 var mq=matchMedia('(max-width:700px)'),vb=function(){sv.setAttribute('viewBox',mq.matches?'470 0 596 600':'190 0 970 970')};vb();mq.addEventListener('change',vb);

 /* ---- layout: wrap the admin text into lines and centre each one on the paper ---- */
 var probe=mk('text',{y:0,style:'opacity:0'},lines),TXT=[],LH=44,TOP=60,LX=[],made={};
 function w(s){probe.textContent=s;return probe.getComputedTextLength()}
 function wrap(par){var out=[];String(par).split(/\n/).forEach(function(p){var words=p.split(/\s+/).filter(Boolean),cur='';words.forEach(function(x){var t=cur?cur+' '+x:x;if(cur&&w(t)>MAXW){out.push(cur);cur=x}else cur=t});if(cur)out.push(cur)});return out}
 function layout(){
  var head=wrap(strip(H.h1a)).concat(wrap(strip(H.h1b))),body=wrap(strip(H.intro));
  TXT=head.concat(head.length&&body.length?['']:[],body);if(!TXT.length)TXT=['Hello'];
  var n=TXT.length;LH=Math.min(44,260/Math.max(1,n-1));var fs=27*LH/44;lines.style.fontSize=fs+'px';
  TOP=162-(n-1)*LH/2;
  while(lines.childNodes.length>1)lines.removeChild(lines.lastChild);
  LX=[];TXT.forEach(function(t,k){var el=mk('text',{y:TOP+k*LH},lines);el.style.fontSize=fs+'px';el.textContent=t;LX[k]=CX-el.getComputedTextLength()/2;el.setAttribute('x',LX[k]);el.textContent=''});
  sv.setAttribute('aria-label','A typewriter typing: '+TXT.join(' ').trim())}

 /* ---- keys: a cut-out copy of the real key from the photo that sinks when pressed ---- */
 function key(ch){var p=posFor(ch);if(!p)return null;var id=p[0]+'_'+p[1];if(made[id])return made[id];
  var n='twc'+Object.keys(made).length,sp=ch===' ',cp=mk('clipPath',{id:n},keysG);
  if(sp)mk('rect',{x:548,y:914,width:452,height:30,rx:7},cp);else mk('circle',{cx:p[0],cy:p[1],r:19.5},cp);
  var g=mk('g',{class:'key'},keysG);
  if(sp)mk('rect',{class:'hole',x:548,y:914,width:452,height:30,rx:7,fill:'#050505'},g);else mk('circle',{class:'hole',cx:p[0],cy:p[1],r:20,fill:'#050505'},g);
  mk('use',{href:'#twm'},mk('g',{class:'cap','clip-path':'url(#'+n+')'},g));return made[id]=g}
 function press(ch){var g=key(ch);if(!g)return;g.classList.add('down');setTimeout(function(){g.classList.remove('down')},100)}

 var setPaper=function(k,d){paper.style.transition='transform '+d+'s cubic-bezier(.35,.1,.2,1)';paper.style.transform='translateY('+(BASE-(TOP+k*LH))+'px)'},
  hide=function(d){paper.style.transition='transform '+d+'s ease-in';paper.style.transform='translateY(345px)'},
  moveCaret=function(k,s){caret.style.opacity=1;caret.setAttribute('x',LX[k]+lines.childNodes[k+1].getComputedTextLength()+2);caret.setAttribute('y',TOP+k*LH-23)};
 function reset(){for(var i=1;i<lines.childNodes.length;i++)lines.childNodes[i].textContent='';caret.style.opacity=0;paper.style.transition='none';paper.style.transform='translateY(345px)';paper.getBoundingClientRect()}
 function showAll(){TXT.forEach(function(t,k){lines.childNodes[k+1].textContent=t});caret.style.opacity=0;paper.style.transition='none';paper.style.transform='translateY(18px)'}

 var vis=true,run=0;if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(host);
 async function wait(ms,alive){await sleep(ms);while((!vis||document.hidden)&&alive())await sleep(300)}
 async function play(){
  var my=++run,alive=function(){return my===run};reset();await wait(700,alive);if(!alive())return;
  setPaper(0,1.7);await wait(2000,alive);                                   /* sheet feeds out of the roller */
  for(var k=0;k<TXT.length;k++){
   if(k>0){if(!alive())return;pullLever();await wait(110,alive);setPaper(k,.45);await wait(620,alive)} /* lever down, paper rolls up one line */
   var t=TXT[k],el=lines.childNodes[k+1];
   for(var i=1;i<=t.length;i++){if(!alive())return;var ch=t[i-1];el.textContent=t.slice(0,i).replace(/ $/,'\u00a0');if(ch!==' ')press(ch);else press(' ');moveCaret(k);
    await wait((55+Math.random()*75+(',.'.indexOf(ch)>-1?130:0))/speed,alive)}
  }
  caret.style.opacity=0;pullLever();await wait(110,alive);if(!alive())return;paper.style.transition='transform .9s ease';paper.style.transform='translateY(18px)'; /* last lever pull: paper rises so the text sits in the middle */
  if(!loop)return;await wait(6500,alive);if(!alive())return;hide(1.2);await wait(1800,alive);if(alive())play()}

 /* ---- lever: pulled down at the end of every line (carriage return), then springs back ---- */
 function setLever(a){lever.setAttribute('transform','rotate('+(-a).toFixed(2)+' 448 248)')}
 var lraf=0;
 function pullLever(){var t0=performance.now(),D=180,Hd=60,R=320,MAX=28;cancelAnimationFrame(lraf);
  (function step(now){var t=now-t0,a;
   if(t<D){var u=t/D;a=MAX*(1-Math.pow(1-u,3))}                       /* quick pull down */
   else if(t<D+Hd)a=MAX                                                /* held at the bottom */
   else if(t<D+Hd+R){var v=(t-D-Hd)/R;a=MAX*(1-(v<.5?2*v*v:1-Math.pow(-2*v+2,2)/2))} /* springs back up */
   else{setLever(0);return}
   setLever(a);lraf=requestAnimationFrame(step)})(t0)}

 var go=function(){layout();if(reduce)showAll();else play()};
 (document.fonts&&document.fonts.load?document.fonts.load("27px 'Special Elite'").catch(function(){}):Promise.resolve()).then(function(){return document.fonts?document.fonts.ready:0}).then(go);
 sv.addEventListener('click',function(){if(!reduce)play()});sv.style.cursor='pointer';
}
})();
