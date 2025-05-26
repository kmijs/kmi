/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 376:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

(function(n,s){ true?module.exports=s(__nccwpck_require__(353),__nccwpck_require__(17)):0})(this,function(n,s){"use strict";var $=Object.defineProperty,L=Object.defineProperties;var m=Object.getOwnPropertyDescriptors;var T=Object.getOwnPropertySymbols;var C=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;var W=(n,s,r)=>s in n?$(n,s,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[s]=r,j=(n,s)=>{for(var r in s||(s={}))C.call(s,r)&&W(n,r,s[r]);if(T)for(var r of T(s))D.call(s,r)&&W(n,r,s[r]);return n},P=(n,s)=>L(n,m(s));var g=(n,s,r)=>new Promise((k,v)=>{var l=c=>{try{b(r.next(c))}catch(x){v(x)}},A=c=>{try{b(r.throw(c))}catch(x){v(x)}},b=c=>c.done?k(c.value):Promise.resolve(c.value).then(l,A);b((r=r.apply(n,s)).next())});function r(t,e){return g(this,null,function*(){if(!t||!e)return[];const o=typeof t=="function"?yield t():t;let u=[];if(typeof o=="object"&&!Array.isArray(o))for(const d in o){const i=o[d],f=i.import||i;k(u,f,e)}else k(u,o,e);return u.filter(d=>!!d)})}function k(t,e,o){typeof e=="string"?t.push(v(e,o)):Array.isArray(e)&&t.push(...e.map(u=>v(u,o)))}function v(t,e){return s.isAbsolute(t)?n.normalizePath(t):t.startsWith(".")?s.resolve(e,n.normalizePath(t)):""}let l="";typeof __dirname!="undefined"?l=__dirname:l=s.dirname(n.fileURLToPath(typeof document=="undefined"&&typeof location=="undefined"?(__nccwpck_require__(310).pathToFileURL)(__filename).href:typeof document=="undefined"?location.href:document.currentScript&&document.currentScript.src||new URL("index.umd.js",document.baseURI).href));let A=!0;const b=(t,e)=>{var h,a;if(!A)return;A=!1;const o=(e==null?void 0:e.compiler)||e,u=(h=o==null?void 0:o.options)==null?void 0:h.module,d=(u==null?void 0:u.rules)||(u==null?void 0:u.loaders)||[];let i=t.include||[];Array.isArray(i)||(i=[i]);let f=t.exclude||[];Array.isArray(f)||(f=[f]),d.push(j({test:(a=t.match)!=null?a:/\.(vue|jsx|tsx|js|ts|mjs|mts)$/,exclude:[...f,/node_modules/],use:[{loader:s.resolve(l,"./loader.js"),options:t}]},t.enforcePre===!1?{}:{enforce:"pre"}),...i.map(y=>j({resource:{and:[y,/\.(vue|jsx|tsx|js|ts|mjs|mts)$/]},use:[{loader:s.resolve(l,"./loader.js"),options:t}]},t.enforcePre===!1?{}:{enforce:"pre"})),P(j({},t.injectTo?{resource:t.injectTo}:{test:/\.(jsx|tsx|js|ts|mjs|mts)$/,exclude:/node_modules/}),{use:[{loader:s.resolve(l,"./inject-loader.js"),options:t}],enforce:"post"}))};function c(u){return g(this,arguments,function*({options:t,record:e,assets:o}){const d=Object.keys(o).filter(i=>/\.html$/.test(i));if(d.length){const i=yield n.getCodeWithWebComponent({options:P(j({},t),{importClient:"code"}),file:"main.js",code:"",record:e,inject:!0});d.forEach(f=>{var a,y;const h=(y=(a=o[f])==null?void 0:a.source)==null?void 0:y.call(a);if(typeof h=="string"){const p=h.replace("<head>",'<head><script type="module">\n'.concat(i,"\n<\/script>"));o[f]={source:()=>p,size:()=>p.length}}})}})}class x{constructor(e){this.options=e}apply(e){return g(this,null,function*(){var u,d,i,f,h,a;if(A=!0,this.options.close||!n.isDev(this.options.dev,((u=e==null?void 0:e.options)==null?void 0:u.mode)==="development"||process.env.NODE_ENV==="development"))return;((i=(d=e==null?void 0:e.options)==null?void 0:d.cache)==null?void 0:i.type)==="filesystem"&&(e.options.cache.version="code-inspector-".concat(Date.now()));const o={port:0,entry:"",output:this.options.output,inputs:r((f=e==null?void 0:e.options)==null?void 0:f.entry,(h=e==null?void 0:e.options)==null?void 0:h.context)};if(b(P(j({},this.options),{record:o}),e),(a=e==null?void 0:e.hooks)!=null&&a.emit){const y=this.options;e.hooks.emit.tapAsync("WebpackCodeInspectorPlugin",(p,w)=>g(this,null,function*(){let _={};p.getAssets?_=yield p.getAssets():_=p.assets,yield c({options:y,record:o,assets:_}),w()}))}})}}return x});


/***/ }),

/***/ 353:
/***/ ((module) => {

"use strict";
module.exports = require("../code-inspector-core");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(376);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;