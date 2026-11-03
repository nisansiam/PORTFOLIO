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
var S,drafted=false,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function bg(p){return p.cover?' img" style="background-image:url(&quot;'+e(p.cover)+'&quot;)':' '+e(p.color||'p1')}
function ph(p,cls){return '<div class="'+(cls||'ph')+bg(p)+'">'+(p.cover?'':e(p.title))+'</div>'}
function tags(a){return '<div class="tags">'+(a||[]).map(function(t){return '<span class="tag">'+e(t)+'</span>'}).join('')+'</div>'}
function card(p,link,i){
 var inner=pic2(p,i||0)+'<h3>'+e(p.title)+'</h3><p>'+e(p.summary)+'</p>'+tags(p.tags);
 return link?'<a class="card" href="work.html#'+e(p.id)+'">'+inner+'</a>':'<button class="card" data-id="'+e(p.id)+'">'+inner+'</button>';
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
 return '<header class="wrap">'+logo()+'<div class="hr"><a class="pill hide" href="contact.html">Get in touch <i>↗</i></a><button class="burger" id="open" aria-label="Open menu" aria-expanded="false"><b></b><b></b></button></div></header>'+
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
function href(u){u=(u||'').trim();if(!u||u==='#')return '#';return /^(https?:|mailto:|tel:|#|\/|\.\.?\/)/i.test(u)?u:'https://'+u}
function ext(u){var h=href(u);return 'href="'+e(h)+'"'+(h.charAt(0)==='#'?'':' target="_blank" rel="noopener"')}
function brandsSec(){var B=S.brands;if(!B||!B.items||!B.items.length)return '';
 return '<section class="brands"><div class="wrap center"><h2 class="sm">'+e(B.title)+'</h2><div class="lgrow'+(B.mono?' mono':'')+'">'+B.items.filter(function(x){return x.img}).map(function(x){var im='<img src="'+e(x.img)+'" alt="'+e(x.name)+'" loading="lazy">';return x.url?'<a '+ext(x.url)+' aria-label="'+e(x.name)+'">'+im+'</a>':'<span>'+im+'</span>'}).join('')+'</div></div></section>'}
function aboutBlock(title,text,more){
 var A=S.about,ph=A.photo?'<img class="me" src="'+e(A.photo)+'" alt="'+e(S.brand.full)+'">':'';
 return '<div class="wrap abt'+(ph?'':' np')+'">'+ph+'<div><h2>'+e(title)+'</h2>'+String(text||'').split('\n').filter(Boolean).map(function(t){return '<p>'+e(t)+'</p>'}).join('')+more+'</div></div>'}
var views={
 home:function(){
  var H=S.home,F=featured(),fl=(H.floats||[]).slice(0,10).map(function(q,i){return '<div class="fl f'+(i+1)+bg({cover:q.img,color:'p'+(i%4+1)})+'" data-s="'+[.06,-.04,.09,-.07,.05,-.05,.08,-.09,.04,-.06][i]+'"></div>'}).join('');
  return '<div class="hero wrap">'+fl+'<h1>'+e(H.h1a)+'<br><em>'+e(H.h1b)+'</em></h1><p>'+e(H.intro)+'</p><div class="btns"><a class="pill" href="work.html">See my work <i>↗</i></a><a class="pill ghost" href="about.html">About me <i>↗</i></a></div></div>'+
  '<section>'+aboutBlock(H.teaserTitle,H.teaserText,'<div class="btns" style="justify-content:flex-start;margin-top:32px"><a class="pill" href="about.html">More about me <i>↗</i></a></div>')+'</section>'+
  '<section><div class="wrap"><div class="center"><h2>'+e(H.featTitle)+'</h2><p>'+e(H.featText)+'</p></div><div class="projects'+(S.layout==='natural'?' mas':'')+'">'+F.map(function(p,i){return card(p,true,i)}).join('')+'</div><div class="more"><a class="pill" href="work.html">View more <i>↗</i></a></div></div></section>'+brandsSec()+marquee();
 },
 work:function(){
  return '<section class="top"><div class="wrap"><div class="center"><h2>Work</h2><p>Every project. Select one to see details and more images.</p></div><div class="projects'+(S.layout==='natural'?' mas':'')+'">'+S.projects.map(function(p,i){return card(p,false,i)}).join('')+'</div></div></section>'+brandsSec()+
  '<dialog id="dlg" aria-label="Project details"></dialog>';
 },
 about:function(){
  var A=S.about;
  return '<section class="top">'+aboutBlock(A.title,A.text,'')+'<div class="wrap"><div class="grid">'+A.skills.map(function(k){return '<div class="tile"><h3>'+e(k.t)+'</h3><p>'+e(k.d)+'</p></div>'}).join('')+'</div>'+
  '<div class="tools">'+A.tools.split(',').map(function(t){return t.trim()?'<span class="tag">'+e(t.trim())+'</span>':''}).join('')+'</div><div class="btns" style="justify-content:flex-start;margin-top:48px"><a class="pill" href="contact.html">Work with me <i>↗</i></a></div></div></section>';
 },
 contact:function(){
  var C=S.contact;
  return '<section class="top"><div class="wrap contact"><div><h2>'+e(C.title)+'</h2><p class="dim" style="margin-top:20px">'+e(C.intro)+'</p><ul class="cl"><li><span>✉</span><a href="mailto:'+e(C.email)+'">'+e(C.email)+'</a></li><li><span>☎</span>'+e(C.phone)+'</li><li><span>⌖</span>'+e(C.location)+'</li></ul></div>'+
  '<form id="f"><label>First name<input name="first_name" required autocomplete="given-name"></label><label>Last name<input name="last_name" autocomplete="family-name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel"></label><label class="full">Message<textarea name="message" required placeholder="Tell me about your project…"></textarea></label><button type="submit">Send message</button><div id="fs" role="status"></div></form></div></section>';
 }
};
function wire(){
 var menu=document.getElementById('menu'),open=document.getElementById('open');
 function tog(v){menu.classList.toggle('open',v);open.setAttribute('aria-expanded',v);document.body.style.overflow=v?'hidden':''}
 open.onclick=function(){tog(true)};document.getElementById('close').onclick=function(){tog(false)};
 menu.addEventListener('click',function(ev){if(ev.target.closest('a.big'))tog(false)});
 document.addEventListener('keydown',function(ev){if(ev.key==='Escape')tog(false)});
 if(page==='home'&&!reduce){
  var fl=[].slice.call(document.querySelectorAll('.fl')),m1=document.getElementById('m1'),m2=document.getElementById('m2'),mq=document.querySelector('.mq');
  var tick=function(){var y=scrollY,vh=innerHeight;fl.forEach(function(el){el.style.transform='translateY('+(-y*parseFloat(el.dataset.s)*2*(S.home.floatSpeed==null?3:S.home.floatSpeed))+'px)'});
   var r=mq.getBoundingClientRect(),p=(vh-r.top)/(vh+r.height);m1.style.transform='translateX('+(-p*30+10)+'%)';m2.style.transform='translateX('+(p*30-40)+'%)'};
  addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);tick();
 }
 if(page==='work'){
  var dlg=document.getElementById('dlg');
  var show=function(id){
   var p=S.projects.filter(function(x){return x.id===id})[0];if(!p)return;
   var imgs=(p.images||[]).map(function(s){return '<img src="'+e(s)+'" alt="'+e(p.title)+'" loading="lazy">'}).join('');
   dlg.innerHTML='<div class="bar"><button class="pill" id="dx" style="padding:8px 18px">Close</button></div>'+(p.cover?'<img class="nat" style="border-radius:0;margin:0;max-height:70vh;object-fit:contain;background:#000" src="'+e(p.cover)+'" alt="'+e(p.title)+'">':ph(p))+
   '<div class="body"><div><h3>'+e(p.title)+'</h3><p class="desc">'+e(p.desc)+'</p>'+tags(p.tags)+'</div><dl><div><dt>Client</dt><dd>'+e(p.client||'—')+'</dd></div><div><dt>Date</dt><dd>'+e(p.date||'—')+'</dd></div><div><dt>Role</dt><dd>'+e(p.role||'—')+'</dd></div></dl></div>'+(imgs?'<div class="gal">'+imgs+'</div>':'');
   var q=dlg.querySelector('.ph');if(q)q.style.margin='0';
   document.getElementById('dx').onclick=function(){dlg.close()};
   dlg.querySelectorAll('.gal img').forEach(function(im){im.onclick=function(){window.open(im.src,'_blank')}});
   if(!dlg.open)dlg.showModal();dlg.scrollTop=0;history.replaceState(null,'','#'+id);
  };
  document.querySelectorAll('.card').forEach(function(c){c.onclick=function(){show(c.dataset.id)}});
  dlg.addEventListener('click',function(ev){if(ev.target===dlg)dlg.close()});
  dlg.addEventListener('close',function(){history.replaceState(null,'',location.pathname)});
  if(location.hash.length>1)show(decodeURIComponent(location.hash.slice(1)));
 }
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
 var titles={home:'Portfolio',work:'Work',about:'About',contact:'Contact'};
 document.title=titles[page]+' – '+S.brand.full+' ('+S.brand.name+')';
 document.getElementById('app').innerHTML=head()+'<main>'+views[page]()+'</main>'+foot();
 wire();
 if(location.hash&&page!=='work'){var t=document.getElementById(location.hash.slice(1));if(t)t.scrollIntoView()}
});
})();
