if(!self.define){let s,e={};const a=(a,i)=>(a=new URL(a+".js",i).href,e[a]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=a,s.onload=e,document.head.appendChild(s)}else s=a,importScripts(a),e()})).then((()=>{let s=e[a];if(!s)throw new Error(`Module ${a} didn’t register its module`);return s})));self.define=(i,n)=>{const c=s||("document"in self?document.currentScript.src:"")||location.href;if(e[c])return;let t={};const u=s=>a(s,c),r={module:{uri:c},exports:t,require:u};e[c]=Promise.all(i.map((s=>r[s]||u(s)))).then((s=>(n(...s),t)))}}define(["./workbox-07672ec7"],(function(s){"use strict";importScripts(),self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"/Splash.png",revision:"9b90659789904aa5ea2f1a910954bb33"},{url:"/_next/app-build-manifest.json",revision:"14754cfe4ea90700302295405ebbb505"},{url:"/_next/static/VCEun-Ymk5OcvGLbziUas/_buildManifest.js",revision:"6324fd8a2021774e38d4614c247be85f"},{url:"/_next/static/VCEun-Ymk5OcvGLbziUas/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1318-1ab4bd0c3af4f098.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/1684-b4d14df0d60c6345.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/1835-6ca3ceb0a24b30b4.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/2589-02ca9fd644be1060.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/3063-45674e33f68311ef.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/3549-586f9599a6336bd5.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/3597.ff7f21be4a6b85d8.js",revision:"ff7f21be4a6b85d8"},{url:"/_next/static/chunks/3d47b92a-0142f0fa6d27844e.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/4460-5a32517c01424c69.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/472.a3826d29d6854395.js",revision:"a3826d29d6854395"},{url:"/_next/static/chunks/479ba886-c5af451b65ac7363.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/4bd1b696-5ba87f801ea451bf.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/5049-643ed219ea962ecb.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/59650de3-b8e68e20873d7572.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/5e22fd23-4bc169e4f1413fd0.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/6454-caccbeed4bf4ac6f.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/6502-2f8a56920020e444.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/6788-ec4e5da8d84f036c.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/6874-4ba8faeb3197bdd7.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/6907-d1417ffc51cd756f.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/7041-c0d11ee1f4f3eec7.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/7121-a941bb852168e608.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/7430-d41704b3a6a8edb0.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/7726-80950c12be6f5bfc.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/8827-bd670618ec5b8ee5.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/8e1d74a4-939eb58a6235eed2.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/9341.48099055d616fd0a.js",revision:"48099055d616fd0a"},{url:"/_next/static/chunks/94730671-50f66bcbecfbb5e0.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/9828-9663ad38512695ed.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/9c4e2130-86da9ebd55e7ee03.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/_not-found/page-8f7d5793294fcafb.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/about/page-6b1be53dbb86d0ea.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/add-product/page-c32db5c9ac991243.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/admin/layout-0c93ea2e645d3a3d.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/admin/page-ec21147d71b23249.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/admin/update-product/%5Bid%5D/page-a47b4464bb54874c.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/apply-coupon/route-0e9c98488abeef63.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-eb5898d8df77f595.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/auth/signup/page-4cc7d87f61188fc1.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/cart/add/route-0bcec15677a0c7a9.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/cart/details/route-de72b442564dc9ff.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/cart/items/count/route-1656d105e89063e6.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/check-verification/route-fa5c15cb047f33ca.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/coupons/route-d2b332363f2e5be3.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/delete-account/route-508ffbef51a22af8.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/products/%5Bid%5D/route-fc171ad981c1d174.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/recently-viewed/route-94dc4d5a7e1023f4.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/resend-verification/route-c7eb460b634bf1a6.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/robots/route-9e6021ed58a48806.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/search/route-b77926a6fe085804.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/sitemap-products/route-8d6b7cacee46d831.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/sitemap.xml/route-1ec9c4c93fb39576.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/sitemap/route-31f627dbdd26791e.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/api/verify/route-44059ea547971e74.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/brand/%5Bbrand%5D/page-d5725fdaa17859d0.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/brand/page-f824b6e06ff2bc02.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/careers/page-0b0ebbb5b2dfd02e.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/cart/layout-ee39174453491b8d.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/cart/loading-13fdea2b996d8e6d.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/cart/page-cbddf14d938087ab.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/category/%5Bcategory%5D/page-a6a723cdb32c9a6f.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/check-out/page-98e5b26afce458dc.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/contact/page-47455df00e700263.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/coupons-admin/page-42a23d00a1f06b7f.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/error-90e4d9941ca3d9f6.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/faq/page-69774581dc4dba39.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/for-you/page-e435f04fe0f0f7d5.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/forgot-password/page-6bb31b3121c4de30.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/layout-66a6c67fd7df0e26.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/loading-77a2b32150dd363d.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/login/page-20aae1f081af8894.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/not-found-8fe0c5ab8973f22d.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/order-confirmation/page-ef032e89d9831d8c.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/order-success/page-6e13ab4cf9c0cc4e.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/orders-admin/page-547d14eb91093189.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/orders/%5Bid%5D/page-0b9aad88ea04dc34.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/orders/page-4def4318b7917d4b.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/page-21ab9f0b66f0966a.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/payment/page-f51690f17a9d70c9.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/press/page-0668d7a74ed0555e.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/privacy/page-5945cd01684578e3.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/product/%5Bid%5D/layout-f29bec146dd3b33f.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/product/%5Bid%5D/loading-6e841593246be40f.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/product/%5Bid%5D/page-38c129a7a62fb8d0.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/products/page-501b8e8e79df5eb6.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/profile/page-35b8e8bb873d4256.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/recently-viewed/page-a32ffe00dd3a74f7.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/reset-password/page-9f4ce1f565ff72e6.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/returns/page-23a004ef2b9ced4b.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/search/page-b955faac282df535.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/settings/delete-account/page-24a10de7091fdac6.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/settings/notifications/page-c346e8101b7cc80c.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/settings/page-f399eae55388d331.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/settings/privacy/page-c87b1c6e5e535160.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/settings/theme/page-127e78a242bd926f.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/signout/page-ee2a643e88f34dcf.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/signup/page-325aa1c793d6ea34.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/success/page-fcc2ed8798b1157a.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/team/page-eab36988a121137c.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/terms/page-60167d3d3a98264c.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/test/page-0e701d3bbba7f38a.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/unauthorized/page-e499defc6028d2c5.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/unsubscribe/page-902b37e73c30498f.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/update-product/%5Bid%5D/page-8a37aa97b7eecb9a.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/verify-email/page-035824cf2b580429.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/app/wishlist/page-52a1ecf5d8b1b19c.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/c916193b-99ad539e8729a3fc.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/e34aaff9-1f4fef0b9a5beaf7.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/ee560e2c-53dc8153937e6c12.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/framework-dcd2c1f5d9432bec.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/main-app-2d0ee995c5bd8409.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/main-e71a7c05bea1915b.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/pages/_app-c5edea036b2e1360.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/pages/_error-a0194b07e927b492.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-74ad8da9ec5c5a24.js",revision:"VCEun-Ymk5OcvGLbziUas"},{url:"/_next/static/css/30ed0e4cd604b851.css",revision:"30ed0e4cd604b851"},{url:"/_next/static/css/b4d0d6f7c5d704ab.css",revision:"b4d0d6f7c5d704ab"},{url:"/_next/static/css/d498c84e4ab246b3.css",revision:"d498c84e4ab246b3"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/googleb5692cc8d4c7cb95.html",revision:"256863abcdfbaef9ac01e4e0d9c9b1c2"},{url:"/icon.png",revision:"e761a81d0bf5cbf35ef226c3047f6136"},{url:"/icon1.png",revision:"2adbdeb6d2b8afa422155c40d46adac9"},{url:"/logo.png",revision:"e761a81d0bf5cbf35ef226c3047f6136"},{url:"/manifest.json",revision:"ae8dfd27c312f3c082a6df039c6055e8"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/opengraph-image.png",revision:"9c65b7a7fdab03094430225b0d0b52c7"},{url:"/screenshot1.png",revision:"02a2332ddc0f33e5751f9b9f5fff99f8"},{url:"/screenshot2.png",revision:"57be01fd67187c179cd2db4ab106c0b3"},{url:"/screenshot3.png",revision:"52b511bbaeb60aa36127f0f219fea90a"},{url:"/sitemap.xml",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/splash.html",revision:"cd7ebda13de9bad1e8f2cb8140866893"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),s.cleanupOutdatedCaches(),s.registerRoute("/",new s.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:s,response:e,event:a,state:i})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new s.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new s.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new s.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/image\?url=.+$/i,new s.StaleWhileRevalidate({cacheName:"next-image",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp3|wav|ogg)$/i,new s.CacheFirst({cacheName:"static-audio-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp4)$/i,new s.CacheFirst({cacheName:"static-video-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:js)$/i,new s.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:css|less)$/i,new s.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new s.StaleWhileRevalidate({cacheName:"next-data",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:json|xml|csv)$/i,new s.NetworkFirst({cacheName:"static-data-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;const e=s.pathname;return!e.startsWith("/api/auth/")&&!!e.startsWith("/api/")}),new s.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;return!s.pathname.startsWith("/api/")}),new s.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>!(self.origin===s.origin)),new s.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
