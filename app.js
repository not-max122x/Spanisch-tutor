'use strict';
const KEY='es_state_v1',$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rnd=a=>a[Math.floor(Math.random()*a.length)],shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const fresh=()=>({v:1,lessons:{},vocab:{},wrong:[],last:null,secs:0,dark:false});
function migrate(o){if(!o||typeof o!=='object'||o.v!==1)return null;return Object.assign(fresh(),o)}
let S=(()=>{try{return migrate(JSON.parse(localStorage.getItem(KEY)))||fresh()}catch(e){return fresh()}})();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Speichern nicht möglich – bitte Fortschritt exportieren.')}}
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',3500)}
const norm=s=>s.trim().replace(/\s+/g,' ').replace(/^[¡¿]+|[.!?]+$/g,'').toLowerCase();
const noAcc=s=>s.normalize('NFD').replace(/n\u0303/g,'\u0001').replace(/[\u0300-\u036f]/g,'').replace(/\u0001/g,'ñ').normalize('NFC');
function check(accept,ans){const n=norm(ans);if(accept.some(x=>norm(x)===n))return{ok:1};
 if(n&&accept.some(x=>noAcc(norm(x))===noAcc(n)))return{ok:.5,msg:'Fast richtig – achte auf die Akzente.'};return{ok:0}}
function speak(t,r){if(!('speechSynthesis' in window)){toast('Dein Browser unterstützt keine Sprachausgabe.');return}
 const u=new SpeechSynthesisUtterance(t);u.lang='es-ES';u.rate=r||1;speechSynthesis.cancel();speechSynthesis.speak(u)}
/* ---------- Aufgaben ---------- */
const toItem=p=>p[0]==='z'?{t:'match',q:p[1],pairs:p[2],rule:'Lerne die Paare noch einmal.'}:p[0]==='m'?{t:'mc',q:p[1],o:shuf(p[2]),ans:p[2][p[3]],rule:p[4]}:p[0]==='t'?{t:'type',q:p[1],a:p[2].split('|'),rule:p[3]}:{t:'order',de:p[1],es:p[2]};
function build(L){if(L.gen)return L.gen();if(L.pool)return shuf(L.pool).slice(0,24).map(toItem);const it=[],SP=['yo','tú','ella','nosotros','vosotros','ellos'],P=()=>Math.floor(Math.random()*6);
 for(let k=0;k<8;k++){const v=rnd(L.verbs),p=P();it.push({t:'type',q:`${PRON[p]} ___ (${v.i}: ${v.de})`,a:[v.f[p]],rule:L.rule})}
 for(let k=0;k<3;k++){const v=rnd(L.verbs),p=P();it.push({t:'type',q:`Verneine den Satz: ${SP[p]} ${v.f[p]}`,a:[`${SP[p]} no ${v.f[p]}`,`no ${v.f[p]}`],rule:'Verneinung: no steht direkt vor dem konjugierten Verb.'})}
 shuf(L.verbs).slice(0,3).forEach(v=>it.push({t:'conj',v,rule:L.rule}));
 for(let k=0;k<3;k++){const v=rnd(L.verbs),p=P(),w=rnd(v.f.filter((x,j)=>j!==p));it.push({t:'mc',q:`Welche Form passt? ${PRON[p]} (${v.i})`,o:shuf([v.f[p],w]),c:null,ans:v.f[p],rule:L.rule})}
 const ss=shuf(L.sent),g=n=>ss[n%ss.length];
 [0,1,2].forEach(n=>it.push({t:'order',de:g(n)[1],es:g(n)[0]}));
 [3,4].forEach(n=>it.push({t:'type',q:`Übersetze ins Spanische: ${g(n)[1]}`,a:[g(n)[0]],rule:'Achte auf Endung und Akzente.'}));
 [0,2].forEach(n=>it.push({t:'type',q:`Übersetze ins Deutsche: ${g(n)[0]}`,a:[g(n)[1]],rule:'Es gibt oft mehrere gute Übersetzungen; hier zählt nur die hinterlegte.'}));
 return it}
function renderEx(x,box,done){let h='',get;
 if(x.t==='mc'||x.t==='listen'){let o,c,ans;if(x.t==='listen'){const ws=shuf(['hola','gracias','buenos días','mañana','ciudad','canción','adiós']);o=shuf([x.w,...ws.filter(w=>w!==x.w).slice(0,2)]);ans=x.w;h=`<p>Höre zu und wähle das Wort.</p><div class="row"><button id="p1">🔊 Abspielen</button><button id="p2">🐢 Langsam</button></div>`}
  else{o=x.o;ans=x.ans||x.o[x.c];h=(x.ctx?`<div class="card" style="white-space:pre-line">${esc(x.ctx)}</div>`:'')+`<p><b>${esc(x.q)}</b></p>`}
  h+=o.map((t,i)=>`<button class="opt" data-i="${i}">${esc(t)}</button>`).join('');box.innerHTML=h;
  if(x.t==='listen'){$('#p1').onclick=()=>speak(x.w,1);$('#p2').onclick=()=>speak(x.w,.6);speak(x.w,1)}
  box.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=o[b.dataset.i]===ans;box.querySelectorAll('.opt').forEach(z=>z.disabled=true);done(ok?1:0,ok?'':'Richtig wäre: '+ans,x.rule,x.q||x.w,b.textContent)});return}
 if(x.t==='type'){box.innerHTML=`<p><b>${esc(x.q)}</b></p><input type="text" id="in" autocomplete="off" autocapitalize="off" spellcheck="false"><p><button class="pri" id="ck">Prüfen</button></p>`;
  const f=()=>{const r=check(x.a,$('#in').value);$('#in').disabled=true;done(r.ok,(r.msg||'')+(r.ok<1?' Richtig: '+x.a[0]:''),x.rule,x.q,$('#in').value)};$('#ck').onclick=f;$('#in').onkeydown=e=>{if(e.key==='Enter')f()};$('#in').focus();return}
 if(x.t==='conj'){box.innerHTML=`<p><b>Konjugiere: ${esc(x.v.i)}</b> <span class="mute">(${esc(x.v.de)})</span></p>`+PRON.map((p,i)=>`<div class="row" style="margin:6px 0"><span style="width:9.5em">${p}</span><input type="text" data-i="${i}" autocapitalize="off" spellcheck="false" class="grow"></div>`).join('')+`<p><button class="pri" id="ck">Prüfen</button></p>`;
  $('#ck').onclick=()=>{let s=0,miss=[];box.querySelectorAll('input').forEach(n=>{const r=check([x.v.f[n.dataset.i]],n.value);s+=r.ok;n.disabled=true;if(r.ok<1)miss.push(PRON[n.dataset.i]+' '+x.v.f[n.dataset.i])});done(s/6,miss.length?'Richtig wäre: '+miss.join(', '):'',x.rule,'Konjugation '+x.v.i,'')};return}
 if(x.t==='match'){const P=x.pairs,R=shuf(P.map((p,i)=>i));let sel=null,err=0,n=0;box.innerHTML=`<p><b>${esc(x.q)}</b></p><p class="mute">Tippe links ein Wort, dann rechts die passende Bedeutung.</p><div class="row" style="align-items:flex-start"><div class="grow" id="ml"></div><div class="grow" id="mr"></div></div>`;
  $('#ml').innerHTML=P.map((p,i)=>`<button class="opt" data-i="${i}">${esc(p[0])}</button>`).join('');$('#mr').innerHTML=R.map(i=>`<button class="opt" data-j="${i}">${esc(P[i][1])}</button>`).join('');
  $('#ml').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('#ml').querySelectorAll('button').forEach(z=>z.style.outline='');sel=+b.dataset.i;b.style.outline='3px solid var(--acc)'});
  $('#mr').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(sel===null)return;const l=$('#ml').querySelector(`[data-i="${sel}"]`);if(+b.dataset.j===sel){l.disabled=b.disabled=true;l.style.outline='';sel=null;if(++n===P.length)done(Math.max(0,1-err/P.length),err?err+' Fehlversuch(e).':'',x.rule,x.q,'')}else{err++;l.style.outline='';sel=null;toast('Nicht passend – versuche es nochmal.')}});return}
 if(x.t==='order'){const tk=shuf(x.es.replace(/[¡¿.!?]/g,'').split(' ')),sel=[];box.innerHTML=`<p><b>Bilde den Satz:</b> ${esc(x.de)}</p><p id="ans" class="card" style="min-height:3em"></p><div id="pool"></div><p><button id="rs">Zurücksetzen</button> <button class="pri" id="ck">Prüfen</button></p>`;
  const draw=()=>{$('#ans').textContent=sel.map(i=>tk[i]).join(' ');$('#pool').innerHTML=tk.map((w,i)=>sel.includes(i)?'':`<button class="tok" data-i="${i}">${esc(w)}</button>`).join('');$('#pool').querySelectorAll('button').forEach(b=>b.onclick=()=>{sel.push(+b.dataset.i);draw()})};draw();
  $('#rs').onclick=()=>{sel.length=0;draw()};$('#ck').onclick=()=>{const a=sel.map(i=>tk[i]).join(' ');const r=check([x.es],a);done(r.ok,r.ok<1?'Richtig: '+x.es:r.msg,'Wortstellung: Subjekt – Verb – Ergänzung; no steht vor dem Verb.',x.de,a)}}}
function runLesson(id){const L=LESSONS.find(l=>l.id===id),items=build(L);let i=0,sc=0;S.last=id;save();
 const step=()=>{if(i>=items.length)return fin();const m=$('#app');m.innerHTML=`<p class="mute">Aufgabe ${i+1} von ${items.length}</p><div class="bar"><i style="width:${i/items.length*100}%"></i></div><div class="card" id="ex"></div><div id="fb"></div>`;
  renderEx(items[i],$('#ex'),(ok,msg,rule,q,a)=>{sc+=ok;if(ok<1)S.wrong=[{l:id,q:String(q),a:String(a),at:Date.now()},...S.wrong].slice(0,60);save();
   $('#fb').innerHTML=`<div class="card"><b class="${ok===1?'ok':ok>0?'warn':'bad'}">${ok===1?'Richtig!':ok>0?'Teilweise richtig':'Leider falsch'}</b><p>${esc(msg||'')}</p>${ok<1&&rule?`<p class="mute">${esc(rule)}</p>`:''}<button class="pri" id="nx">Weiter</button></div>`;$('#nx').onclick=()=>{i++;step()};$('#nx').focus()})};
 const fin=()=>{const pct=Math.round(sc/items.length*100),r=S.lessons[id]||{best:0,tries:0};r.best=Math.max(r.best,pct);r.tries++;r.last=pct;r.done=r.best>=85;S.lessons[id]=r;save();
  $('#app').innerHTML=`<h1>${pct} %</h1><p>${pct>=85?'Thema gemeistert (ab 85 %).':'Noch nicht gemeistert – ab 85 % gilt ein Thema als beherrscht. Lies die Erklärung noch einmal und versuche es erneut.'}</p><p class="mute">Die Aufgaben werden bei jedem Versuch neu erzeugt.</p><p><button class="pri" id="again">Nochmal üben</button> <button id="bk">Zum Lernpfad</button></p>`;$('#again').onclick=()=>runLesson(id);$('#bk').onclick=()=>go('path')};
 step()}
/* ---------- Vokabeln / SM-2 ---------- */
const DAY=864e5;
function vstat(v){const r=S.vocab[v.id];if(!r)return'new';if(r.due<=Date.now())return'due';return r.int>=21?'good':'unsure'}
function grade(v,g){const q=[0,3,4,5][g],r=S.vocab[v.id]||{ease:2.5,int:0,reps:0};
 r.ease=Math.max(1.3,r.ease+.1-(5-q)*(.08+(5-q)*.02));
 if(q<3){r.reps=0;r.int=0;r.due=Date.now()+6e5}else{r.reps++;r.int=r.reps===1?1:r.reps===2?3:Math.round(r.int*r.ease);r.due=Date.now()+r.int*DAY}
 S.vocab[v.id]=r;save()}
function flash(list,back){let q=shuf(list),i=0,shown=false;const m=$('#app');
 const draw=()=>{if(i>=q.length){m.innerHTML=`<h1>Fertig</h1><p>Alle Karten dieser Runde sind durch.</p><button class="pri" id="b">Zurück</button>`;$('#b').onclick=back;return}
  const v=q[i];m.innerHTML=`<p class="mute">${v.t} · Karte ${i+1}/${q.length}</p><div class="card fl">${esc(v.es)}${shown?`<p style="font-size:1rem">${esc(v.de)}${v.g?' ('+(v.g==='m'?'maskulin':'feminin')+')':''}<br><i class="mute">${esc(v.ex)}</i></p>`:''}</div><p><button id="sp">🔊 Hören</button></p>`+
  (shown?`<div class="row"><button class="grow" data-g="0">Nochmal</button><button class="grow" data-g="1">Schwer</button><button class="grow" data-g="2">Gut</button><button class="grow" data-g="3">Leicht</button></div>`:`<button class="pri opt" id="sh">Antwort zeigen</button>`);
  $('#sp').onclick=()=>speak(v.es,.8);
  if(shown)m.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{grade(v,+b.dataset.g);shown=false;i++;draw()});else $('#sh').onclick=()=>{shown=true;draw()}};draw()}
function quiz(list,back){const rk=v=>({due:0,new:1,unsure:2,good:3})[vstat(v)]+Math.random()*.9;const q=list.map(v=>[rk(v),v]).sort((x,y)=>x[0]-y[0]).slice(0,20).map(x=>x[1]);let i=0,sc=0;const m=$('#app');
 const draw=()=>{if(i>=q.length){m.innerHTML=`<h1>${sc.toFixed(1).replace('.0','')} von ${q.length}</h1><p class="mute">Die Karten wurden nach deinem Ergebnis neu eingeplant (Spaced Repetition).</p><button class="pri" id="b">Fertig</button>`;$('#b').onclick=back;return}
  const v=q[i];m.innerHTML=`<p class="mute">${esc(v.t)} · Karte ${i+1}/${q.length}</p><div class="bar"><i style="width:${i/q.length*100}%"></i></div><div class="card fl">${esc(v.de)}</div><input type="text" id="in" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Auf Spanisch eintippen"><p><button class="pri" id="ck">Prüfen</button></p><div id="fb"></div>`;$('#in').focus();
  const f=()=>{const bare=v.es.replace(/^(el|la|los|las) /,'');let r=check([v.es],$('#in').value);if(r.ok<1&&v.g){const r2=check([bare],$('#in').value);if(r2.ok>0)r={ok:.5,msg:'Fast: Lerne Nomen mit Artikel – '+v.es+'.'}}
   $('#in').disabled=true;$('#ck').disabled=true;sc+=r.ok;grade(v,r.ok===1?2:r.ok>0?1:0);
   $('#fb').innerHTML=`<div class="card"><b class="${r.ok===1?'ok':r.ok>0?'warn':'bad'}">${r.ok===1?'Richtig!':r.ok>0?'Fast richtig':'Leider falsch'}</b><p>${esc(r.msg||'')} ${r.ok<1?'Richtig: <b>'+esc(v.es)+'</b>':''}</p><div class="row"><button id="sp">🔊</button><button class="pri" id="nx">Weiter</button></div></div>`;$('#sp').onclick=()=>speak(v.es,.8);$('#nx').onclick=()=>{i++;draw()};$('#nx').focus()};
  $('#ck').onclick=f;$('#in').onkeydown=e=>{if(e.key==='Enter'){if($('#nx'))$('#nx').click();else f()}}};draw()}
/* ---------- Ansichten ---------- */
const NAV=[['path','Lernpfad'],['vocab','Vokabeln'],['review','Wiederholung'],['prog','Fortschritt']];
let cur='path';
function go(v){cur=v;speechSynthesis&&speechSynthesis.cancel&&speechSynthesis.cancel();$('#nav').innerHTML=NAV.map(n=>`<button data-v="${n[0]}" ${n[0]===v?'aria-current="page"':''}>${n[1]}</button>`).join('');$('#nav').querySelectorAll('button').forEach(b=>b.onclick=()=>go(b.dataset.v));views[v]();$('#app').focus();scrollTo(0,0)}
const views={
path(){const l=S.last&&LESSONS.find(x=>x.id===S.last);$('#app').innerHTML=`<h1>Lernpfad A1</h1>${l?`<div class="card row"><div class="grow">Zuletzt: ${esc(l.title)}</div><button class="pri" data-o="${l.id}">Fortsetzen</button></div>`:''}`+LESSONS.map(L=>{const r=S.lessons[L.id];return`<div class="card"><h2>${esc(L.title)}</h2><div class="bar"><i style="width:${r?r.best:0}%"></i></div><p class="mute">${r?`Bestes Ergebnis ${r.best} % · ${r.tries} Versuche${r.done?' · gemeistert':''}`:'Noch nicht bearbeitet'}</p><button class="pri" data-o="${L.id}">Öffnen</button></div>`}).join('')+`<p class="mute">Verfügbar: ${LESSONS.length} A1-Lektionen. A2 bis B2 sind noch nicht enthalten.</p>`;
 document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>lesson(b.dataset.o))},
vocab(){const c={new:0,unsure:0,due:0,good:0};VOCAB.forEach(v=>c[vstat(v)]++);const th=[...new Set(VOCAB.map(v=>v.t))];
 $('#app').innerHTML=`<h1>Vokabeln</h1><div class="card">${VOCAB.length} Wörter · Neu: ${c.new} · Unsicher: ${c.unsure} · Fällig: ${c.due} · Gut: ${c.good}</div><div class="card"><button class="pri opt" id="qa">Abfrage: alle Themen gemischt (20 Karten)</button></div>`+th.map((t,k)=>`<div class="card row"><div class="grow">${esc(t)} <span class="mute">(${VOCAB.filter(v=>v.t===t).length})</span></div><button class="pri" data-q="${k}">Abfrage</button><button data-k="${k}">Karten</button></div>`).join('');
 $('#qa').onclick=()=>quiz(VOCAB,()=>go('vocab'));
 document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>quiz(VOCAB.filter(v=>v.t===th[b.dataset.q]),()=>go('vocab')));
 document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>flash(VOCAB.filter(v=>v.t===th[b.dataset.k]),()=>go('vocab')))},
review(){const due=VOCAB.filter(v=>vstat(v)==='due'),weak=LESSONS.filter(L=>S.lessons[L.id]&&!S.lessons[L.id].done);
 $('#app').innerHTML=`<h1>Wiederholung</h1><div class="card"><h2>Fällige Vokabeln: ${due.length}</h2>${due.length?'<button class="pri" id="rv">Jetzt wiederholen</button>':'<p class="mute">Aktuell ist nichts fällig. Neue Vokabeln findest du unter „Vokabeln“.</p>'}</div><div class="card"><h2>Themen unter 85 %</h2>${weak.length?weak.map(L=>`<p>${esc(L.title)} (${S.lessons[L.id].best} %) <button data-o="${L.id}">Üben</button></p>`).join(''):'<p class="mute">Keine Themen offen.</p>'}</div><div class="card"><h2>Zuletzt falsch beantwortet</h2>${S.wrong.slice(0,8).map(w=>`<p class="mute">${esc(w.q)} → deine Antwort: „${esc(w.a)}“</p>`).join('')||'<p class="mute">Noch keine Fehler gespeichert.</p>'}</div>`;
 if(due.length)$('#rv').onclick=()=>quiz(due,()=>go('review'));document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>runLesson(b.dataset.o))},
prog(){const d=LESSONS.filter(L=>S.lessons[L.id]&&S.lessons[L.id].done).length,m=Math.round(S.secs/60);
 $('#app').innerHTML=`<h1>Fortschritt</h1><div class="card"><h2>A1</h2><div class="bar"><i style="width:${d/LESSONS.length*100}%"></i></div><p>${d} von ${LESSONS.length} Lektionen gemeistert · Lernzeit ca. ${m} Min.</p></div>
 <div class="card"><h2>Daten sichern</h2><p class="mute">Der Lernstand liegt nur in diesem Browser. Das Betriebssystem kann ihn löschen – exportiere ihn regelmäßig.</p><div class="row"><button class="pri" id="ex">Exportieren (JSON)</button><button id="im">Importieren</button><input type="file" id="f" accept=".json,application/json" hidden></div></div>
 <div class="card"><h2>Einstellungen</h2><button id="dk">Dunkelmodus ${S.dark?'ausschalten':'einschalten'}</button> <button id="rs" class="bad">Alles zurücksetzen</button></div>`;
 $('#ex').onclick=()=>{const b=new Blob([JSON.stringify(S,null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='spanisch-lernstand-'+new Date().toISOString().slice(0,10)+'.json';a.click()};
 $('#im').onclick=()=>$('#f').click();$('#f').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=migrate(JSON.parse(r.result));if(!o)throw 0;if(confirm('Aktuellen Lernstand durch die Datei ersetzen?')){S=o;save();applyTheme();toast('Import erfolgreich.');go('prog')}}catch(x){toast('Ungültige Datei.')}};r.readAsText(f)};
 $('#dk').onclick=()=>{S.dark=!S.dark;save();applyTheme();go('prog')};
 $('#rs').onclick=()=>{if(confirm('Wirklich ALLE Lerndaten löschen?')&&confirm('Letzte Warnung: Das kann nicht rückgängig gemacht werden.')){S=fresh();save();applyTheme();go('prog')}}}};
function lesson(id){const L=LESSONS.find(l=>l.id===id);S.last=id;save();$('#app').innerHTML=`<button id="bk">Zurück</button><h1>${esc(L.title)}</h1><div class="card"><b>Lernziele</b><ul>${L.goals.map(g=>`<li>${esc(g)}</li>`).join('')}</ul></div>${L.html}${L.verbs?`<div class="card"><b>Verben für die Übungen</b><p>${L.verbs.map(v=>esc(v.i)+' ('+esc(v.de)+')').join(', ')}</p></div>`:''}<p><button class="pri" id="st">Übungen starten</button></p>`;
 $('#bk').onclick=()=>go('path');$('#st').onclick=()=>runLesson(id);scrollTo(0,0)}
function applyTheme(){document.documentElement.classList.toggle('dark',!!S.dark)}
applyTheme();go('path');
setInterval(()=>{if(!document.hidden){S.secs++;if(S.secs%15===0)save()}},1000);
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
