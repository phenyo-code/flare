if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const r=e=>a(e,i),d={module:{uri:i},exports:c,require:r};s[i]=Promise.all(n.map((e=>d[e]||r(e)))).then((e=>(t(...e),c)))}}define(["./workbox-07672ec7"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Splash.png",revision:"9b90659789904aa5ea2f1a910954bb33"},{url:"/_next/app-build-manifest.json",revision:"53ae24c015e5c671b6f2278136f94477"},{url:"/_next/static/VPBl2dLPmrkdxQH8aj37w/_buildManifest.js",revision:"7ec1ccb2069429cbb8997ff185f846e8"},{url:"/_next/static/VPBl2dLPmrkdxQH8aj37w/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1517-99312c9626788c10.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/2918-384cdb2a870fbef6.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/3060-d1c70be7459de068.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/3d47b92a-60dee8ebbbec26aa.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/479ba886-07dbe91b5223d098.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/4bd1b696-bb22e373c92d34f0.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/5197-5b24e0c4425140e6.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/5203.f4b97ab553880bca.js",revision:"f4b97ab553880bca"},{url:"/_next/static/chunks/5e22fd23-89a0f3ca78ba4170.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/6218.ba8ff6176d4fd6f6.js",revision:"ba8ff6176d4fd6f6"},{url:"/_next/static/chunks/66ec4792-04058793113a54f9.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/7970-9d4685dd157f5e15.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/8173-a6ebc58f7f9d7f2d.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/8553-2a9b438f8a7f2ea2.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/8e1d74a4-e464f64810c47bc5.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/9005-2a4fa292a553f31b.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/94730671-8a801cbfcdd1448b.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/9962-662601505111617a.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/9c4e2130-3f914282d9dd076d.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/_not-found/page-e132a5aae642a8d0.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/add-product/page-914b2d1948266fbb.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/admin/layout-4344337583f65a88.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/admin/page-02be5d800456a71f.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/admin/update-product/%5Bid%5D/page-ed3e75d588895669.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-2e3c3a7dceae69f5.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/api/auth/signup/page-aff26b1c4338b3ed.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/api/cart/add/route-1420a9fe3a0c0d20.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/api/cart/items/count/route-4bff37e2639863b0.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/api/search/route-963f630e5a042730.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/cart/layout-e47693baefd0fa0f.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/cart/loading-3ca24ea607dc8d35.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/cart/page-28b4887e57882809.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/category/%5Bcategory%5D/page-5ec9ad74154d97cc.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/check-out/page-281849c741505200.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/error-1db1bf73094e8811.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/for-you/page-ac189ea2f7fb3ce3.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/layout-ddf048f9b76d87b7.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/loading-0b8023885fdf438f.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/login/page-b97e10fc83272229.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/not-found-82ce8e1bd69c90de.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/order-success/page-d52851358a61cdd1.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/orders-admin/page-1469a5e2ab48120e.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/orders/page-0e3195b87a845aa7.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/page-b2150b32e7509967.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/payment/page-98a88fa6bdec4198.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/product/%5Bid%5D/layout-c044b41981560106.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/product/%5Bid%5D/loading-3c105b8d9920fede.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/product/%5Bid%5D/page-622c884d9f22b5e3.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/products/page-ea1e3a5c13342e41.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/profile/page-de712353fa848d08.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/search/page-762f92408e8585f3.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/settings/page-17e3636c472151d8.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/signout/page-c6891f7dcb20f1f5.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/signup/page-d5f42fadf518b785.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/success/page-66370902de2cd0e7.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/test/page-d996bdbe759fbbde.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/app/unauthorized/page-d1b39ce0f6fdc8a6.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/c916193b-ef478735fa7a7125.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/e34aaff9-31c7aac3936d3475.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/ee560e2c-15c3f6c78395c12f.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/framework-28674b8561f5ef2a.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/main-1ba50d21441bc10a.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/main-app-5f8908a97d977b1b.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/pages/_app-f9efafe803d2ac1c.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/pages/_error-c6b7a272f5d23717.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-aa23f9deeff96464.js",revision:"VPBl2dLPmrkdxQH8aj37w"},{url:"/_next/static/css/46d2f1b70d0e73f2.css",revision:"46d2f1b70d0e73f2"},{url:"/_next/static/css/63df38be936244c5.css",revision:"63df38be936244c5"},{url:"/_next/static/css/d498c84e4ab246b3.css",revision:"d498c84e4ab246b3"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icon.png",revision:"e761a81d0bf5cbf35ef226c3047f6136"},{url:"/icon1.png",revision:"2adbdeb6d2b8afa422155c40d46adac9"},{url:"/manifest.json",revision:"ae8dfd27c312f3c082a6df039c6055e8"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/opengraph-image.png",revision:"9c65b7a7fdab03094430225b0d0b52c7"},{url:"/screenshot1.png",revision:"02a2332ddc0f33e5751f9b9f5fff99f8"},{url:"/screenshot2.png",revision:"57be01fd67187c179cd2db4ab106c0b3"},{url:"/screenshot3.png",revision:"52b511bbaeb60aa36127f0f219fea90a"},{url:"/splash.html",revision:"cd7ebda13de9bad1e8f2cb8140866893"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
