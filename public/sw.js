if(!self.define){let e,c={};const s=(s,t)=>(s=new URL(s+".js",t).href,c[s]||new Promise((c=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=c,document.head.appendChild(e)}else e=s,importScripts(s),c()})).then((()=>{let e=c[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(t,a)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(c[i])return;let n={};const u=e=>s(e,i),r={module:{uri:i},exports:n,require:u};c[i]=Promise.all(t.map((e=>r[e]||u(e)))).then((e=>(a(...e),n)))}}define(["./workbox-07672ec7"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Splash.png",revision:"9b90659789904aa5ea2f1a910954bb33"},{url:"/_next/app-build-manifest.json",revision:"f36ad9edcc2ed0ebfaf6bbe737824dbb"},{url:"/_next/static/chunks/1684-b4d14df0d60c6345.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/2589-02ca9fd644be1060.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/3063-45674e33f68311ef.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/3549-027ce674e7acec8c.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/3597.ff7f21be4a6b85d8.js",revision:"ff7f21be4a6b85d8"},{url:"/_next/static/chunks/3d47b92a-0142f0fa6d27844e.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/4460-3ee64fb230b4dbd0.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/472.a3826d29d6854395.js",revision:"a3826d29d6854395"},{url:"/_next/static/chunks/479ba886-c5af451b65ac7363.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/4bd1b696-5ba87f801ea451bf.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/5049-643ed219ea962ecb.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/535-f7813171ba4b1b7c.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/59650de3-b8e68e20873d7572.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/5e22fd23-4bc169e4f1413fd0.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/6454-caccbeed4bf4ac6f.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/6502-ceaa0012278e7d82.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/6788-ec4e5da8d84f036c.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/6874-4ba8faeb3197bdd7.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/6907-d1417ffc51cd756f.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/7041-8834b7b947482ec3.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/7430-d41704b3a6a8edb0.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/7726-0d2164bc3089ada5.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/8827-bd670618ec5b8ee5.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/8950-fc0e65231e3a52c9.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/8e1d74a4-f8c412e671a37a09.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/9341.48099055d616fd0a.js",revision:"48099055d616fd0a"},{url:"/_next/static/chunks/94730671-9143a68fa75cb1fd.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/9828-bd6b4630fcc5d435.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/9c4e2130-86da9ebd55e7ee03.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/_not-found/page-0e0e286915322970.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/about/page-5aa9ef8b325a449b.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/add-product/page-c32db5c9ac991243.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/admin/layout-0c93ea2e645d3a3d.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/admin/page-ec21147d71b23249.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/admin/update-product/%5Bid%5D/page-a47b4464bb54874c.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/apply-coupon/route-2db5a8a2a3df53b8.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-4b2af6e8a1d38f8b.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/auth/signup/page-4cc7d87f61188fc1.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/cart/add/route-2d0e81c9e804597a.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/cart/details/route-093419d5223d7719.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/cart/items/count/route-2af6f8624d62d4a7.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/cart/items/savings/route-818bb20d4d352e64.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/check-verification/route-8fd1e37f0c7b4a67.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/coupons/route-389925b377c8596b.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/delete-account/route-9330da8586e6284b.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/payfast/notify/route-785e54719c4d51dc.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/products/%5Bid%5D/route-6f61dc97344f06bd.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/recently-viewed/route-84d278891c6ac5d4.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/resend-verification/route-16075a52002d88fb.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/robots/route-26c50d63346b2647.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/search/route-a2ed96ee020c22cf.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/sitemap-products/route-339851ba387c8d55.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/sitemap.xml/route-ddd8c34e9de2dd39.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/sitemap/route-0e482c95619ed63d.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/verify/route-c5eb33aba05a6666.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/api/wishlist/route-e4c2b9d8dfd69a44.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/brand/%5Bbrand%5D/page-e013ffa74870b571.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/brand/page-6d39ef3b1e3ea731.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/careers/page-627509b2a9f9deba.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/cart/layout-054e45ec24cbd802.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/cart/loading-2f814ca31308a766.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/cart/page-3366fbb7ce54275b.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/category/%5Bcategory%5D/page-d58a68ed8d007b19.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/check-out/page-60960b82bbb31dd2.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/contact/page-7f0f86e781baef09.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/coupons-admin/page-83d19a18aa265fab.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/error-064268af7464fcbe.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/faq/page-6284c3c5b0b27c21.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/for-you/page-a46d93de8dd38d5a.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/forgot-password/page-4ae85e1b92e8a45e.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/help/page-508ff19023ff4108.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/layout-11d451cf154a1200.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/loading-1c4ed35d2a5caf8f.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/login/page-3d801d5345925de1.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/not-found-a6676c41a807d059.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/order-confirmation/page-047498202db795f1.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/order-success/page-b757d2f58ef3b967.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/orders-admin/page-1e6de35ad83564e7.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/orders/%5Bid%5D/page-0b9aad88ea04dc34.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/orders/page-4def4318b7917d4b.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/page-612800e35965166f.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/payment/page-f51690f17a9d70c9.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/press/page-ae9d074626b571f3.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/privacy/page-34006d0ce4205c5e.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/product/%5Bid%5D/layout-5c70e51ab0a73d01.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/product/%5Bid%5D/loading-9b13e26eed8b1f0e.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/product/%5Bid%5D/page-03195359da0c0868.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/products/page-501b8e8e79df5eb6.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/profile/page-128fb4af776f4a2f.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/recently-viewed/page-65089b77b637b62d.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/resend-verification-sent/page-4ebc0f6b0ccf31b5.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/reset-password/page-855519c38029b8ce.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/returns/page-96d85f25b262377d.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/search/page-6e80eaf5a358e12e.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/settings/delete-account/page-bf1ad2007e99a5d6.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/settings/notifications/page-dce67c5598b63119.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/settings/page-281b6eb27247b24a.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/settings/privacy/page-b58d95acc6d534ac.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/settings/theme/page-d6e539c04e7eea97.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/shipping-details/page-15f79feade2f6eee.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/signout/page-74948137fbc56ec5.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/signup/page-640624d6ab4bf016.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/success/page-5d8f57934a9731e5.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/team/page-5042d27883ed5517.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/terms/page-33fceae2eae5a304.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/test/page-0e701d3bbba7f38a.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/unauthorized/page-53111746bea03c4e.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/unsubscribe/page-902b37e73c30498f.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/update-product/%5Bid%5D/page-8a37aa97b7eecb9a.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/verify-email/page-fb87f87bb9d36a65.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/app/wishlist/page-b007f7bd7c30c133.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/c916193b-99ad539e8729a3fc.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/e34aaff9-1f4fef0b9a5beaf7.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/ee560e2c-53dc8153937e6c12.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/framework-dcd2c1f5d9432bec.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/main-app-2d0ee995c5bd8409.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/main-e71a7c05bea1915b.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/pages/_app-c5edea036b2e1360.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/pages/_error-a0194b07e927b492.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-74ad8da9ec5c5a24.js",revision:"eSzu853eWVtcvmycOXS2L"},{url:"/_next/static/css/0ca2fddd337cce3b.css",revision:"0ca2fddd337cce3b"},{url:"/_next/static/css/30ed0e4cd604b851.css",revision:"30ed0e4cd604b851"},{url:"/_next/static/css/d498c84e4ab246b3.css",revision:"d498c84e4ab246b3"},{url:"/_next/static/eSzu853eWVtcvmycOXS2L/_buildManifest.js",revision:"130b181001602be40139b38fbba62cb2"},{url:"/_next/static/eSzu853eWVtcvmycOXS2L/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/googleb5692cc8d4c7cb95.html",revision:"256863abcdfbaef9ac01e4e0d9c9b1c2"},{url:"/icon.png",revision:"e761a81d0bf5cbf35ef226c3047f6136"},{url:"/icon1.png",revision:"2adbdeb6d2b8afa422155c40d46adac9"},{url:"/logo.png",revision:"e761a81d0bf5cbf35ef226c3047f6136"},{url:"/manifest.json",revision:"ae8dfd27c312f3c082a6df039c6055e8"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/opengraph-image.png",revision:"9c65b7a7fdab03094430225b0d0b52c7"},{url:"/screenshot1.png",revision:"02a2332ddc0f33e5751f9b9f5fff99f8"},{url:"/screenshot2.png",revision:"57be01fd67187c179cd2db4ab106c0b3"},{url:"/screenshot3.png",revision:"52b511bbaeb60aa36127f0f219fea90a"},{url:"/sitemap.xml",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/splash.html",revision:"cd7ebda13de9bad1e8f2cb8140866893"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:c,event:s,state:t})=>c&&"opaqueredirect"===c.type?new Response(c.body,{status:200,statusText:"OK",headers:c.headers}):c}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const c=e.pathname;return!c.startsWith("/api/auth/")&&!!c.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
