(function(){
var DB=window.SiteDB={
 o:function(){return new Promise(function(ok,no){var r=indexedDB.open('siam-site',1);r.onupgradeneeded=function(){r.result.createObjectStore('k')};r.onsuccess=function(){ok(r.result)};r.onerror=no})},
 get:function(k){return DB.o().then(function(d){return new Promise(function(ok){var q=d.transaction('k').objectStore('k').get(k);q.onsuccess=function(){ok(q.result)};q.onerror=function(){ok()}})}).catch(function(){})},
 set:function(k,v){return DB.o().then(function(d){return new Promise(function(ok){var t=d.transaction('k','readwrite');t.objectStore('k').put(v,k);t.oncomplete=ok})}).catch(function(){})},
 del:function(k){return DB.o().then(function(d){return new Promise(function(ok){var t=d.transaction('k','readwrite');t.objectStore('k').delete(k);t.oncomplete=ok})}).catch(function(){})}
};
var page=document.body.dataset.page;
if(!page)return;
function e(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function rich(t){return e(t).replace(/\*([^*]+)\*/g,'<em class="sf">$1</em>')}
var S,drafted=false,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function bg(p){return p.cover?' img" style="background-image:url(&quot;'+e(p.cover)+'&quot;)':' '+e(p.color||'p1')}
function ph(p,cls){return '<div class="'+(cls||'ph')+bg(p)+'">'+(p.cover?'':e(p.title))+'</div>'}
function tags(a){return '<div class="tags">'+(a||[]).map(function(t){return '<span class="tag">'+e(t)+'</span>'}).join('')+'</div>'}
function card(p,link,i){
 var n=String((i||0)+1);if(n.length<2)n='0'+n;
 return '<a class="card" href="project.html?p='+encodeURIComponent(p.id)+'"><div class="imw">'+pic2(p,i||0)+'</div><div class="cr"><h3>'+e(p.title)+'</h3><span class="num">'+n+'</span></div><p>'+e(p.summary)+'</p>'+tags(p.tags)+'</a>';
}
function logo(){var B=S.brand,m=B.logoMode||'text',h='';
 if((m==='image'||m==='both')&&B.logoImg)h+='<img class="lg" src="'+e(B.logoImg)+'" alt="'+e(B.name)+'">';
 if(m==='text'||m==='both'||!B.logoImg)h+='<span class="lt">'+e(B.name)+' <span>'+e(B.tag)+'</span></span>';
 return '<a class="logo" href="index.html" aria-label="Home">'+h+'</a>'}
function pic2(p,i){
 if(S.layout==='natural'){
  if(p.cover)return '<img class="nat" src="'+e(p.cover)+'" alt="'+e(p.title)+'" loading="lazy">';
  return '<div class="ph '+e(p.color||'p1')+'" style="aspect-ratio:'+['4/5','1/1','3/4','16/10'][i%4]+'">'+e(p.title)+'</div>';
 }
 return ph(p)}
function head(){
 var B=S.brand;
 return '<header class="wrap">'+logo()+(B.center===''?'':'<span class="hc">'+e(B.center==null?'PORTFOLIO':B.center)+'</span>')+'<div class="hr"><a class="pill hide" href="contact.html">Get in touch <i>↗</i></a><button class="burger" id="open" aria-label="Open menu" aria-expanded="false"><b></b><b></b></button></div></header>'+
 '<nav id="menu" aria-label="Main"><button class="x" id="close" aria-label="Close menu">×</button><a class="big" href="index.html">Home</a><a class="big" href="about.html">About</a><a class="big" href="work.html">Work</a><a class="big" href="contact.html">Contact</a><div class="soc">'+S.contact.socials.map(function(s){return '<a '+ext(s.u)+'>'+e(s.n)+'</a>'}).join('')+'</div></nav>';
}
function foot(){
 var B=S.brand,C=S.contact;
 return '<footer><div class="wrap"><div class="ft"><div>'+logo()+'<small>Based in</small><address>'+e(C.location)+'</address><small>Contact</small><a href="mailto:'+e(C.email)+'">'+e(C.email)+'</a></div>'+
 '<div class="nav"><ul><li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li><li><a href="work.html">Work</a></li><li><a href="contact.html">Contact</a></li></ul><ul>'+C.socials.map(function(s){return '<li><a '+ext(s.u)+'>'+e(s.n)+'</a></li>'}).join('')+'</ul></div></div>'+
 '<div class="copy"><span>© '+new Date().getFullYear()+' '+e(B.full)+'. All rights reserved.</span><span class="dim">'+e(B.name)+' · Graphic design, '+e(C.location)+'</span></div>'+
 (page==='home'?'<div class="giant" aria-hidden="true">'+e(S.home.giant)+'</div>':'')+'</div></footer>';
}
function marquee(){return '<div class="mq" aria-hidden="true"><div id="m1">'+e(S.home.marquee)+'</div><div id="m2">'+e(S.home.marquee)+'</div></div>'}
function featured(){return S.projects.filter(function(p){return p.featured})}
function href(u){u=(u||'').trim();if(/^#.*[.\/:@]/.test(u))u=u.slice(1);if(!u||u==='#')return '#';return /^(https?:|mailto:|tel:|#|\/|\.\.?\/)/i.test(u)||/^[\w-]+\.html([?#].*)?$/.test(u)?u:'https://'+u}
function ext(u){var h=href(u);return 'href="'+e(h)+'"'+(h.charAt(0)==='#'?'':' target="_blank" rel="noopener"')}
function brandsSec(){var B=S.brands;if(!B||!B.items)return '';
 var its=B.items.filter(function(x){return x.img});if(!its.length)return '';
 return '<section class="brands"><div class="wrap center"><h2 class="sm">'+rich(B.title)+'</h2></div><div class="mqr'+(B.mono?' mono':'')+'" style="--lh:'+(B.size||64)+'px"><div class="mtrack">'+its.map(function(x){var im='<img src="'+e(x.img)+'" alt="'+e(x.name)+'">';return x.url?'<a '+ext(x.url)+' aria-label="'+e(x.name)+'">'+im+'</a>':'<span>'+im+'</span>'}).join('')+'</div></div></section>'}
function logoMq(){
 var tr=document.querySelector('.mtrack');if(!tr)return;
 var sp=S.brands.speed==null?3:+S.brands.speed,items=[].slice.call(tr.children),per=Math.max(1,Math.ceil(16/items.length));
 for(var k=1;k<per*2;k++)items.forEach(function(n){tr.appendChild(n.cloneNode(true))});
 if(sp<=0||reduce){tr.style.animationPlayState='paused';return}
 Promise.all([].map.call(tr.querySelectorAll('img'),function(im){return im.decode?im.decode().catch(function(){}):Promise.resolve()})).then(function(){
  tr.style.animationDuration=(tr.scrollWidth/2/(sp*20))+'s'});
}
function aboutBlock(title,text,more){
 var A=S.about,ph=A.photo?'<img class="me" src="'+e(A.photo)+'" alt="'+e(S.brand.full)+'">':'';
 return '<div class="wrap abt'+(ph?'':' np')+'">'+ph+'<div><h2>'+rich(title)+'</h2>'+String(text||'').split('\n').filter(Boolean).map(function(t){return '<p>'+e(t)+'</p>'}).join('')+more+'</div></div>'}
function heroTW(H){if((H.heroStyle||'typewriter')!=='typewriter')return '';return '<div class="tw" data-tw><h1 class="twsr">'+rich(H.h1a)+' '+rich(H.h1b)+'</h1><div class="tws"></div><div class="twb">'+(H.avail?'<div class="av"><i></i>'+e(H.avail)+'</div>':'')+'<div class="btns"><a class="pill" href="work.html">See my work <i>↗</i></a><a class="pill ghost" href="about.html">About me <i>↗</i></a></div></div></div>'}
function symCta(){var C=S.cta||{};if(C.on===false)return '';
 var d=function(k,v){return v==null||v===''?'':' data-sym-'+k+'="'+e(v)+'"'};
 return '<section class="sym-sec"><div class="wrap"><a class="symbiote-cta" data-symbiote href="'+e(href(C.link||'contact.html'))+'"'+d('stalk-radius',C.stalk)+d('hunt-radius',C.hunt)+d('critical-radius',C.critical)+d('absorb-ms',C.absorb)+d('max-pull',C.pull)+d('tendrils',C.tendrils)+d('measure-from',C.from)+'>'+e(C.text||'LET’S WORK TOGETHER')+'</a></div></section>'}
function servicesSec(){var V=S.services;if(!V||V.on===false||!V.items||!V.items.length)return '';
 var rows=V.items.map(function(x,i){var n=String(i+1);if(n.length<2)n='0'+n;return '<div class="svr"><span class="num">'+n+'</span><h3>'+rich(x.t)+'</h3><p>'+e(x.d)+'</p></div>'}).join(''),
 st=(V.steps||[]).map(function(x,i){return '<div class="stp"><span class="num">0'+(i+1)+'</span><h4>'+e(x.t)+'</h4><p>'+e(x.d)+'</p></div>'}).join('');
 return '<section><div class="wrap"><div class="center"><h2>'+rich(V.title)+'</h2>'+(V.intro?'<p>'+e(V.intro)+'</p>':'')+'</div><div class="svl">'+rows+'</div>'+(st?'<h3 class="prt">'+rich(V.stepsTitle||'How we work together')+'</h3><div class="steps">'+st+'</div>':'')+'</div></section>'}
function cvHref(){var C=S.contact||{};return C.cvUrl?href(C.cvUrl):(C.cv||'')}
function cvBtn(){var h=cvHref();return h?'<a class="pill ghost" href="'+e(h)+'" download="'+e(String(S.brand.full||'CV').replace(/\s+/g,'-'))+'-CV.pdf" target="_blank" rel="noopener">Download CV <i>↓</i></a>':''}
function waUrl(){var C=S.contact||{},n=String(C.whatsapp||'').replace(/\D/g,'');if(!n)return '';if(n.indexOf('00')===0)n=n.slice(2);if(/^01\d{9}$/.test(n))n='880'+n.slice(1);return 'https://wa.me/'+n+(C.waMsg?'?text='+encodeURIComponent(C.waMsg):'')}
function waBtn(){var u=waUrl();if(!u||(S.contact&&S.contact.waFloat===false))return '';return '<a class="wa" href="'+e(u)+'" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5zm4.7 13.3c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-3.4-.9-2.9-1.2-4.7-4.2-4.9-4.4-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.9 1.9 1 2 .1.2.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.6 2 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.8-.1 1.5z"/></svg><span>WhatsApp</span></a>'}
var views={
 home:function(){
  var H=S.home,F=featured(),fl=(H.floats||[]).slice(0,10).map(function(q,i){var d=' data-s="'+[.06,-.04,.09,-.07,.05,-.05,.08,-.09,.04,-.06][i]+'"';
   return q.img?'<div class="fl f'+(i+1)+' has"'+d+'><img src="'+e(q.img)+'" alt=""></div>':'<div class="fl f'+(i+1)+' p'+(i%4+1)+'"'+d+'></div>'}).join('');
  return (heroTW(H)||'<div class="hero wrap'+((H.heroMode||'3d')==='3d'?' d3':'')+'"><div class="stage">'+fl+'</div><div class="hbox" style="--bo:'+(H.boxOpacity==null?.4:H.boxOpacity)+'">'+(H.avail?'<div class="av"><i></i>'+e(H.avail)+'</div>':'')+'<h1>'+rich(H.h1a)+'<br><span class="mu">'+rich(H.h1b)+'</span></h1><p>'+e(H.intro)+'</p></div><div class="btns"><a class="pill" href="work.html">See my work <i>↗</i></a><a class="pill ghost" href="about.html">About me <i>↗</i></a></div></div>')+
  '<section><div class="wrap"><div class="center"><h2>'+rich(H.featTitle)+'</h2><p>'+e(H.featText)+'</p></div><div class="projects'+(S.layout==='natural'?' mas':'')+'">'+F.map(function(p,i){return card(p,true,i)}).join('')+'</div><div class="more"><a class="pill" href="work.html">View more <i>↗</i></a></div></div></section>'+brandsSec()+servicesSec()+
  '<section>'+aboutBlock(H.teaserTitle,H.teaserText,'<div class="btns" style="justify-content:flex-start;margin-top:32px"><a class="pill" href="about.html">More about me <i>↗</i></a>'+cvBtn()+'</div>')+'</section>'+symCta()+marquee();
 },
 work:function(){
  if(location.hash.length>1)location.replace('project.html?p='+encodeURIComponent(decodeURIComponent(location.hash.slice(1))));
  return '<section class="top"><div class="wrap"><div class="center"><h2>Selected <em class="sf">work</em></h2><p>Every project. Select one to read the full case study.</p></div><div class="projects'+(S.layout==='natural'?' mas':'')+'">'+S.projects.map(function(p,i){return card(p,true,i)}).join('')+'</div></div></section>'+brandsSec();
 },
 about:function(){
  var A=S.about;
  return '<section class="top">'+aboutBlock(A.title,A.text,'')+'<div class="wrap"><div class="grid">'+A.skills.map(function(k){return '<div class="tile"><h3>'+e(k.t)+'</h3><p>'+e(k.d)+'</p></div>'}).join('')+'</div>'+
  '<div class="tools">'+A.tools.split(',').map(function(t){return t.trim()?'<span class="tag">'+e(t.trim())+'</span>':''}).join('')+'</div><div class="btns" style="justify-content:flex-start;margin-top:48px"><a class="pill" href="contact.html">Work with me <i>↗</i></a>'+cvBtn()+'</div></div></section>';
 },
 contact:function(){
  var C=S.contact;
  return '<section class="top"><div class="wrap contact"><div><h2>'+e(C.title)+'</h2><p class="dim" style="margin-top:20px">'+e(C.intro)+'</p><ul class="cl"><li><span>✉</span><a href="mailto:'+e(C.email)+'">'+e(C.email)+'</a></li><li><span>☎</span>'+e(C.phone)+'</li><li><span>⌖</span>'+e(C.location)+'</li>'+(waUrl()?'<li><span>💬</span><a href="'+e(waUrl())+'" target="_blank" rel="noopener">Chat on WhatsApp</a></li>':'')+'</ul></div>'+
  '<form id="f"><label>First name<input name="first_name" required autocomplete="given-name"></label><label>Last name<input name="last_name" autocomplete="family-name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel"></label><label class="full">Message<textarea name="message" required placeholder="Tell me about your project…"></textarea></label><button type="submit">Send message</button><div id="fs" role="status"></div></form></div></section>';
 },
 project:function(){
  var id=new URLSearchParams(location.search).get('p'),P=S.projects,i=-1,k;
  for(k=0;k<P.length;k++)if(P[k].id===id)i=k;
  if(i<0)return '<section class="top"><div class="wrap center"><h2>Project not found</h2><p><a class="pill" href="work.html" style="margin-top:24px">Back to work <i>↗</i></a></p></div></section>';
  var p=P[i],nx=P[(i+1)%P.length];
  document.title=p.title+' – '+S.brand.full+' ('+S.brand.name+')';
  var meta=[['Client',p.client],['Date',p.date],['Role',p.role]].filter(function(m){return m[1]}).map(function(m){return '<div><dt>'+m[0]+'</dt><dd>'+e(m[1])+'</dd></div>'}).join('');
  var secs=[['Overview',p.desc],['The brief',p.brief],['The process',p.process],['The result',p.result]].filter(function(x){return x[1]&&String(x[1]).trim()}).map(function(x,n){return '<div class="cs"><div class="csl"><span class="num">0'+(n+1)+'</span>'+x[0]+'</div><div class="cst">'+String(x[1]).split('\n').filter(Boolean).map(function(t){return '<p>'+e(t)+'</p>'}).join('')+'</div></div>'}).join('');
  var gal=(p.images||[]).map(function(x){return '<img class="gi" src="'+e(x)+'" alt="'+e(p.title)+'" loading="lazy" decoding="async">'}).join('');
  return '<section class="top pj"><div class="wrap"><a class="back" href="work.html">← All work</a><h1 class="pt">'+rich(p.title)+'</h1><p class="ps">'+e(p.summary)+'</p>'+tags(p.tags)+(meta?'<dl class="meta">'+meta+'</dl>':'')+
   '<div class="pcov">'+(p.cover?'<img class="gi" src="'+e(p.cover)+'" alt="'+e(p.title)+'">':ph(p))+'</div>'+secs+(gal?'<div class="gals">'+gal+'</div>':'')+
   (P.length>1?'<a class="next" href="project.html?p='+encodeURIComponent(nx.id)+'"><span class="dim">Next project</span><span class="nt">'+e(nx.title)+' <i>↗</i></span></a>':'')+'</div></section>';
 }
};
function wire(){
 var menu=document.getElementById('menu'),open=document.getElementById('open');
 function tog(v){menu.classList.toggle('open',v);open.setAttribute('aria-expanded',v);document.body.style.overflow=v?'hidden':''}
 open.onclick=function(){tog(true)};document.getElementById('close').onclick=function(){tog(false)};
 menu.addEventListener('click',function(ev){if(ev.target.closest('a.big'))tog(false)});
 document.addEventListener('keydown',function(ev){if(ev.key==='Escape')tog(false)});
 if(page==='home'){
  var d3=!document.querySelector('[data-tw]')&&(S.home.heroMode||'3d')==='3d',fl=[].slice.call(document.querySelectorAll('.fl')),m1=document.getElementById('m1'),m2=document.getElementById('m2'),mq=document.querySelector('.mq');
  var SP=S.home.floatSpeed==null?3:+S.home.floatSpeed,tick=function(){if(reduce)return;var y=scrollY,vh=innerHeight;if(!d3)fl.forEach(function(el){el.style.transform='translateY('+(-y*parseFloat(el.dataset.s)*2*SP)+'px)'});
   var r=mq.getBoundingClientRect(),p=(vh-r.top)/(vh+r.height);m1.style.transform='translateX('+(-p*30+10)+'%)';m2.style.transform='translateX('+(p*30-40)+'%)'};
  addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);tick();
  if(d3){
   var hero=document.querySelector('.hero'),stage=document.querySelector('.stage'),box=document.querySelector('.hbox'),
   tilt=S.home.tilt==null?10:+S.home.tilt,depth=S.home.depth==null?140:+S.home.depth,
   DZ=[.6,-.2,.9,-.7,.3,-.9,.1,.7,-.4,.5],RY=[-14,10,-12,14,-9,11,-7,13,-15,8],RX=[6,-5,4,-6,5,-4,3,-5,6,-3],RZ=[-3,2,-2,3,-2,2,-1,3,-3,1],
   tx=0,ty=0,cx=0,cy=0,act=false,t0=performance.now();
   hero.addEventListener('pointermove',function(ev){var r=hero.getBoundingClientRect();act=true;tx=((ev.clientX-r.left)/r.width-.5)*2;ty=((ev.clientY-r.top)/r.height-.5)*2});
   hero.addEventListener('pointerleave',function(){act=false});
   var apply=function(t){var y=scrollY,time=t/1000;
    stage.style.transform='rotateX('+(-cy*tilt)+'deg) rotateY('+(cx*tilt)+'deg)';
    fl.forEach(function(el,i){var sc=parseFloat(el.dataset.s)*2*SP,bob=reduce?0:Math.sin(time*.8+i*1.7)*8;
     el.style.transform='translate3d(0,'+(-y*sc+bob)+'px,'+(DZ[i]*depth)+'px) rotateX('+RX[i]+'deg) rotateY('+RY[i]+'deg) rotateZ('+(RZ[i]+(reduce?0:Math.sin(time*.5+i)*1.5))+'deg)'});
    if(box)box.style.transform='translate3d('+(-cx*14)+'px,'+(-cy*10)+'px,0)'};
   if(reduce)apply(0);else{
    var frame=function(now){var t=now-t0;if(!act){tx=Math.sin(t/2800)*.4;ty=Math.cos(t/3300)*.25}
     cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;if(hero.getBoundingClientRect().bottom>0)apply(t);requestAnimationFrame(frame)};
    requestAnimationFrame(frame)}
  }
 }
 var fx=S.fx||{};
 if(fx.progress!==false){var pg=document.createElement('div');pg.id='pg';document.body.appendChild(pg);
  addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-innerHeight;pg.style.width=(h>0?scrollY/h*100:0)+'%'},{passive:true})}
 if(!reduce&&fx.reveal!==false&&'IntersectionObserver' in window){
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
  [].forEach.call(document.querySelectorAll('.center>*,.abt>*,.card,.tile,.tools,.contact>*,.ft>*,.copy,.cs,.gi,.next,.back,.pt,.ps,.meta,.mqr,.svr,.stp,.prt'),function(el){el.classList.add('rv');el.style.transitionDelay=([].indexOf.call(el.parentNode.children,el)%4*80)+'ms';io.observe(el)});
 }
 if(!reduce&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  if(fx.cursor!==false){
   var cu=document.createElement('div'),mx=0,my=0,px=0,py=0;cu.id='cur';cu.innerHTML='<span>View</span>';document.body.appendChild(cu);document.body.classList.add('hascur');
   addEventListener('mousemove',function(ev){mx=ev.clientX;my=ev.clientY;cu.classList.add('vis')});
   document.addEventListener('mouseover',function(ev){cu.classList.toggle('on',!!(ev.target.closest&&ev.target.closest('.card')))});
   document.documentElement.addEventListener('mouseleave',function(){cu.classList.remove('vis')});
   (function mv(){px+=(mx-px)*.2;py+=(my-py)*.2;cu.style.transform='translate3d('+px+'px,'+py+'px,0) translate(-50%,-50%)';requestAnimationFrame(mv)})();
  }
  if(fx.magnet!==false){var ms=fx.magnetStr==null?.18:+fx.magnetStr;
   [].forEach.call(document.querySelectorAll('.pill'),function(b){b.addEventListener('mousemove',function(ev){var r=b.getBoundingClientRect();b.style.transform='translate('+((ev.clientX-r.left-r.width/2)*ms)+'px,'+((ev.clientY-r.top-r.height/2)*ms*1.55)+'px)'});b.addEventListener('mouseleave',function(){b.style.transform=''})})}
 }
 [].forEach.call(document.querySelectorAll('.fl.has img'),function(im){var f=function(){if(im.naturalWidth)im.parentNode.style.setProperty('--r',im.naturalWidth/im.naturalHeight)};im.complete?f():im.addEventListener('load',f)});
 logoMq();
 var f=document.getElementById('f');
 if(f)f.onsubmit=function(ev){ev.preventDefault();var fs=document.getElementById('fs'),u=(S.contact.formUrl||'').trim();
  if(u){fs.textContent='Sending…';
   fetch(u,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){if(!r.ok)throw 0;f.reset();fs.textContent='Thank you! Your message has been sent.'}).catch(function(){fs.textContent='Sorry, the message could not be sent. Please email '+S.contact.email+' directly.'});return}
  var d=new FormData(f),b='From: '+d.get('first_name')+' '+d.get('last_name')+' ('+d.get('email')+', '+d.get('phone')+')\n\n'+d.get('message');
  location.href='mailto:'+S.contact.email+'?subject='+encodeURIComponent('Portfolio enquiry')+'&body='+encodeURIComponent(b);
  fs.textContent='Opening your email app to send the message.'};
 if(drafted){var b=document.createElement('div');b.id='pv';b.innerHTML='Previewing your unpublished edits <button id="pvx">Show live version</button>';document.body.appendChild(b);
  document.getElementById('pvx').onclick=function(){DB.del('draft').then(function(){location.reload()})}}
}
DB.get('draft').then(function(d){
 if(d&&d.brand&&d.projects){S=d;drafted=true}else S=window.SITE;
 var titles={home:'Portfolio',work:'Work',about:'About',contact:'Contact',project:'Project'};
 document.documentElement.style.setProperty('--ac',S.brand.accent||'#e8643c');
 (function(){var f=S.fx||{},r=document.documentElement,v=function(k,x,u){if(x!=null&&x!=='')r.style.setProperty(k,x+(u||''))};
  v('--rvd',f.revealDist,'px');v('--rvs',f.revealSpeed,'s');v('--zoom',f.zoom);v('--grain',f.grain);v('--cursz',f.cursorSize,'px');if(f.intro===false)r.classList.add('nointro')})();
 document.title=titles[page]+' – '+S.brand.full+' ('+S.brand.name+')';
 if(S.brand.favicon){var lk=document.querySelector('link[rel~=icon]');if(!lk){lk=document.createElement('link');lk.rel='icon';document.head.appendChild(lk)}lk.type='image/png';lk.href=S.brand.favicon}
 document.getElementById('app').innerHTML=head()+'<main>'+views[page]()+'</main>'+foot()+waBtn();
 wire();
 if(location.hash&&page!=='work'){var t=document.getElementById(location.hash.slice(1));if(t)t.scrollIntoView()}
});
})();
