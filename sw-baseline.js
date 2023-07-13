/* Register service worker to this url */
self.navigator?.serviceWorker?.['register']?.(onRegister());
  function onRegister(){
    console.log('Registering Service Worker');
    return document.currentScript.src;    
  }

/* On install, cache core assets */
self.addEventListener('install', onInstall);
  function onInstall(event) {
    console.log('Installing Service Worker');
    /* start working immediately */
    let skipWait = self.skipWaiting();
    event.waitUntil(skipWait);   
    const baseAssets = ['offline.html'];    
    event.waitUntil(cacheAssets(baseAssets));
    async function cacheAssets(assets) {
      await skipWait;   
      let cache = await caches.open('app');   
      const baseAssets_length = baseAssets.length;
          for (let i = 0; i < baseAssets_length; i++) {
             try{
                await cache.add(baseAssets[i]);
             }catch(e){
                console.log('Precache of '+baseAssets[i]+' failed. Skipping.';
                continue;
             }
          }
      return cache;
    }
    return;
  }

/* Activate and start using available caches */
self.addEventListener('activate', onActivate);
  function onActivate(event) {
    console.log('Activating Service Worker');
    event.waitUntil(clients.claim());
    return;
  }

/* Listen for request events */
self.addEventListener('fetch', onFetch);
  function onFetch(event) {
   /* Define levels of cache search */
    const loose   = {ignoreVary: true, ignoreMethod: false, ignoreSearch: false}; 
    const looser  = {ignoreVary: true, ignoreMethod: true,  ignoreSearch: false}; 
    const loosest = {ignoreVary: true, ignoreMethod: false, ignoreSearch: true }; 
    const lost    = {ignoreVary: true, ignoreMethod: true,  ignoreSearch: true }; 
    
    async function cascadeMatchesTier1(req) {
      res = await caches.match(req);
      if(res&&(res.status<400)) { return res; }
      res = await caches.match(req, loose);
      return res;
    } 
    
    async function cascadeMatchesTier2(req) {
      res = await caches.match(req, looser);
      if(res&&(res.status<400)) { return res; }
      res = await caches.match(req, loosest);
      if(res&&(res.status<400)) { return res; }
      res = await caches.match(req, lost);
      return res;
    }
  
    async function cacheResponse(req, res) {
      let copy = res.clone();   
      let cache = await caches.open('app');
      return await cache.put(req, copy);
    }
    
    const endings = 
     ['.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.css',
      '.scss',
      '.json',
      '.jpg',
      '.png',
      '.pnj',
      '.gif',
      '.webp',
      '.svg',
      '.ico',
      '.woff',
      '.woff2'];
    const endings_length = endings.length;
    function matchEndings(fileURL) {
      shortURL=fileURL.toLowerCase().split('?')[0].split('#')[0];
      for (let i = 0; i < endings_length; i++) {   
        if (shortURL.endsWith(endings[i])) {
          return true;
        }    
      }  
      return false;  
    }

    const hosts = [self.location.host];
    const hosts_length = endings.length;
    function matchHosts(fileURL) {
      shortURL=fileURL.toLowerCase().split('?')[0].split('#')[0];
      for (let i = 0; i < hosts_length; i++) {   
        if (shortURL.startsWith(hosts[i])) {
          return true;
        }    
      }  
      return false;  
    }
    
    try {
      let processRequest = fetchCache();
      async function fetchCache() {
        let request = event.request;
        const lowURL = request.url.toLowerCase();
        /* Always send google analytics */
        if (lowURL.includes('GoogleAnalytics')) {return;}
        if (!lowURL.startsWith('https://')) {return;} 
        if (!matchHosts(lowURL)) {return;}
        
        /* Images */
        /* CSS & JavaScript */
        /* Offline-first */
        const accept = request.headers.get('accept').toLowerCase();
        if (accept.includes('text/css')
          ||accept.includes('javascript')
          ||accept.includes('image')
          ||matchEndings(request.url)) {
          let offlineFirst = offlineFirstFetch();
          async function offlineFirstFetch() {
            let res = await cascadeMatchesTier1(request);
            if(res&&(res.status<400)) { return res; }
            try {
              res = await fetch(request);
              if(res&&(res.status<400)) {
                /* Save a copy of it in cache */
                await cacheResponse(request, res);
                return res;
              }
              res = await cascadeMatchesTier2(request);              
              return res;
            } catch (e) {
              console.log(e.message);
              res = await cascadeMatchesTier2(request);           
              return res;
            }
          }
          /* Don't turn off Service Worker until this is done */
          event.waitUntil(offlineFirst);
          event.respondWith(offlineFirst);
          await offlineFirst;
          return;
        }
        /* HTML files */
        /* Network-first */
        if (accept.includes('html')) {
          let networkFirst = networkFirstFetch();
          async function networkFirstFetch() {
            try {
              let res = await fetch(request);
              /* Save a copy of it in cache */
              /* Return the response */
              if(res&&(res.status<400)) {
                await cacheResponse(request, res);
                return res;
              }
              res = await cascadeMatchesTier1(request);
              if(res&&(res.status<400)){return res;}
              res = await cascadeMatchesTier2(request);       
              return res;
            } catch (e) {
              console.log(e.message);
              let res = await cascadeMatchesTier1(request);
              if(res&&(res.status<400)){return res;}        
              res = await cascadeMatchesTier2(request);
              return res;
            }
          }
          /* Don't turn off Service Worker until this is done */
          event.waitUntil(networkFirst);
          event.respondWith(networkFirst);
          await networkFirst;
          return;
        }
      }
      /* Don't turn off Service Worker until everything is done */
      event.waitUntil(processRequest);
      return;
    } catch (e) {
      console.log(e.message);
      return;
    }  
  }
