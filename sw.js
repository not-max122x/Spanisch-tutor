const V='es-v7';const FILES=['./','index.html','styles.css','app.js','content.js','lessons-a1-ende.js','manifest.json','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.open(V).then(c=>c.match(e.request).then(r=>{const n=fetch(e.request).then(x=>{if(x&&x.ok)c.put(e.request,x.clone());return x}).catch(()=>r||c.match('./'));return r||n})))});
