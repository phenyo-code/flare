if(!self.define){let e,s={};const c=(c,i)=>(c=new URL(c+".js",i).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(i,a)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let n={};const r=e=>c(e,t),p={module:{uri:t},exports:n,require:r};s[t]=Promise.all(i.map((e=>p[e]||r(e)))).then((e=>(a(...e),n)))}}define(["./workbox-07672ec7"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Splash.png",revision:"9b90659789904aa5ea2f1a910954bb33"},{url:"/_next/app-build-manifest.json",revision:"47861f75e0d6c8587799ade29ec2a43b"},{url:"/_next/static/chunks/1684-b4d14df0d60c6345.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/2589-02ca9fd644be1060.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/3063-45674e33f68311ef.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/3370-b4071dd33abef3ee.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/3597.ff7f21be4a6b85d8.js",revision:"ff7f21be4a6b85d8"},{url:"/_next/static/chunks/3d47b92a-0142f0fa6d27844e.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/4460-0a12d3559f89d6eb.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/472.a3826d29d6854395.js",revision:"a3826d29d6854395"},{url:"/_next/static/chunks/479ba886-c5af451b65ac7363.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/4bd1b696-5ba87f801ea451bf.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/5049-643ed219ea962ecb.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/5e22fd23-4bc169e4f1413fd0.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/6454-caccbeed4bf4ac6f.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/6495-2417bc0c77e87354.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/6788-ec4e5da8d84f036c.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/6874-4ba8faeb3197bdd7.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/7041-eea81372ee1de414.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/7121-b0e026386a41c663.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/7430-d41704b3a6a8edb0.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/7633-95f145695bd8c331.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/8827-bd670618ec5b8ee5.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/8950-fc0e65231e3a52c9.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/8e1d74a4-bb2787bb7cdef92f.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/9341.48099055d616fd0a.js",revision:"48099055d616fd0a"},{url:"/_next/static/chunks/94730671-50f66bcbecfbb5e0.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/9c4e2130-86da9ebd55e7ee03.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/_not-found/page-78693e523c3dde3a.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/about/page-6df34648d3c252c0.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/add-product/page-e0ce1eb5cfc700a6.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/admin/layout-5292b3bc161d6177.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/admin/page-ec21147d71b23249.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/admin/update-product/%5Bid%5D/page-a8125e4ea90e177a.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-750dd620d4f2faf6.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/auth/signup/page-4cc7d87f61188fc1.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/cart/add/route-2e4f0c3b936af524.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/cart/items/count/route-9fb63d4b1aca031b.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/check-verification/route-5a78a005cd4ec9ab.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/coupons/route-70b7ceb4bbd74e92.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/delete-account/route-bf1e9ae14babcc2d.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/products/%5Bid%5D/route-0df58ceb6ed75223.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/resend-verification/route-7e783a8a0099e58a.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/search/route-2085ffcd588da0f2.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/api/verify/route-df706d63c6c40f9a.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/brand/%5Bbrand%5D/page-91275834ffb8b178.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/brand/page-c567a1632bd31f68.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/careers/page-93d11ce8a486f72f.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/cart/layout-e899e581553f064b.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/cart/loading-014aa29a751081c1.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/cart/page-4ed268884f4b956f.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/category/%5Bcategory%5D/page-82523b58e9e0964c.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/check-out/page-e7060612d5f64dc3.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/contact/page-9f8fdd28eb3afad7.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/coupons-admin/page-4d9783f2923dac56.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/error-d4a93454e8850502.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/faq/page-14130aa4f4349811.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/for-you/page-006763c82d23ed4f.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/forgot-password/page-6bb31b3121c4de30.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/layout-c4252b613ed923b5.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/loading-d3887290ed9c601e.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/login/page-20aae1f081af8894.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/not-found-91b0611e740a927a.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/order-success/page-66bd9d20b3e5cf87.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/orders-admin/page-4894f3f5526ade88.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/orders/page-4b9632cd2bb39efc.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/page-772205ca0b57de14.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/payment/page-8e61bd993bf40ef3.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/press/page-e2ef904c04175082.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/privacy/page-7b310781d193f072.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/product/%5Bid%5D/layout-06bdefdbbb5a4c1c.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/product/%5Bid%5D/loading-83dca69648bf78a5.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/product/%5Bid%5D/page-999b2396889d11fd.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/products/page-da0e04746ac2c4ed.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/profile/page-45210d195f0e2275.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/reset-password/page-811bf7fce61b2a9e.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/returns/page-7718dae50eb676b4.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/robots.txt/route-92fa28c0ea8a77ff.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/search/page-7e2d8a273feb76b9.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/settings/delete-account/page-37196195feda458f.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/settings/notifications/page-7ef6d11b61cec97a.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/settings/page-81b2b4269d6971a8.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/settings/privacy/page-4b7edd6efbadbffa.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/settings/theme/page-bf2804e2dd17bc14.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/signout/page-f2ed6a69842702e1.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/signup/page-2cfa96245fe4b63c.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/sitemap.xml/route-f1115cfe135efc76.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/success/page-0ecb63725d56a85c.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/team/page-1a0ee1542be88c14.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/terms/page-238819c245d7d1d9.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/test/page-0e701d3bbba7f38a.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/unauthorized/page-c3b6d32d675389c9.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/unsubscribe/page-902b37e73c30498f.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/update-product/%5Bid%5D/page-8a37aa97b7eecb9a.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/verify-email/page-035824cf2b580429.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/app/wishlist/page-862f9463d1cb7e00.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/c916193b-99ad539e8729a3fc.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/e34aaff9-1f4fef0b9a5beaf7.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/ee560e2c-af0ecdf1df45c4af.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/framework-dcd2c1f5d9432bec.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/main-app-2d0ee995c5bd8409.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/main-e71a7c05bea1915b.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/pages/_app-c5edea036b2e1360.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/pages/_error-a0194b07e927b492.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-74ad8da9ec5c5a24.js",revision:"rPcPxOvpVcsCg9eOBEid8"},{url:"/_next/static/css/30ed0e4cd604b851.css",revision:"30ed0e4cd604b851"},{url:"/_next/static/css/b19da48641acf225.css",revision:"b19da48641acf225"},{url:"/_next/static/css/d498c84e4ab246b3.css",revision:"d498c84e4ab246b3"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/_next/static/rPcPxOvpVcsCg9eOBEid8/_buildManifest.js",revision:"4679944f451b19a8390fc2411ba41127"},{url:"/_next/static/rPcPxOvpVcsCg9eOBEid8/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/googleb5692cc8d4c7cb95.html",revision:"256863abcdfbaef9ac01e4e0d9c9b1c2"},{url:"/icon.png",revision:"e761a81d0bf5cbf35ef226c3047f6136"},{url:"/icon1.png",revision:"2adbdeb6d2b8afa422155c40d46adac9"},{url:"/logo.png",revision:"e761a81d0bf5cbf35ef226c3047f6136"},{url:"/manifest.json",revision:"ae8dfd27c312f3c082a6df039c6055e8"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/opengraph-image.png",revision:"9c65b7a7fdab03094430225b0d0b52c7"},{url:"/screenshot1.png",revision:"02a2332ddc0f33e5751f9b9f5fff99f8"},{url:"/screenshot2.png",revision:"57be01fd67187c179cd2db4ab106c0b3"},{url:"/screenshot3.png",revision:"52b511bbaeb60aa36127f0f219fea90a"},{url:"/splash.html",revision:"cd7ebda13de9bad1e8f2cb8140866893"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
