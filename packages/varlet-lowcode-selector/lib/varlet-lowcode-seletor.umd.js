;(function(){var style=document.createElement('style');style.type='text/css';style.rel='stylesheet';style.appendChild(document.createTextNode(`.varlet-low-code--selector-plugins{position:absolute;top:100%;right:0}
`));var head=document.querySelector('head');head.appendChild(style)})();var w=Object.defineProperty;var d=Object.getOwnPropertySymbols;var b=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var p=(n,e,t)=>e in n?w(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,i=(n,e)=>{for(var t in e||(e={}))b.call(e,t)&&p(n,t,e[t]);if(d)for(var t of d(e))B.call(e,t)&&p(n,t,e[t]);return n};(function(n,e){typeof exports=="object"&&typeof module!="undefined"?e(exports,require("vue"),require("@varlet/lowcode-core"),require("@varlet/ui")):typeof define=="function"&&define.amd?define(["exports","vue","@varlet/lowcode-core","@varlet/ui"],e):(n=typeof globalThis!="undefined"?globalThis:n||self,e(n.VarletLowcodeSeletor={},n.Vue,n.VarletLowcodeCore,n.Varlet))})(this,function(n,e,t,r){"use strict";var P="",u=e.defineComponent({name:"VarletLowCodeSelectorPluginRender",setup(){const l=t.pluginsManager.exportSelectorPlugins();return console.log("plugins",l),()=>e.createVNode("div",{class:"varlet-low-code--selector-plugins"},[l.map(({component:o})=>{const a=o;return e.createVNode(a,null,null)})])}}),f=e.defineComponent({name:"VarletLowCodeSelector",setup(){const l={border:"2px solid red",boxSizing:"border-box",position:"absolute",pointerEvents:"none"},o=e.ref([]);function a(c){const s=document.querySelectorAll(`#${c}`);if(s&&s.length>0){const _=Array.from(s);o.value=_.map(S=>{const{top:k,left:y,width:C,height:x}=S.getBoundingClientRect(),V={top:`${k}px`,left:`${y}px`,width:`${C}px`,height:`${x}px`};return i(i({},V),l)})}}return e.onMounted(()=>{t.eventsManager.on("schema-click",a)}),e.onUnmounted(()=>{t.eventsManager.off("schema-click",a)}),()=>o.value&&o.value.map((c,s)=>e.createVNode("div",{key:Symbol(c.toString()),style:c},[c&&s===o.value.length-1&&e.createVNode(u,null,null)]))}});const m=e.defineComponent({setup(l){const o=()=>{r.Snackbar.success("Successfully ! Let's check it out.")};return(a,c)=>(e.openBlock(),e.createBlock(e.unref(r.Button),{onClick:o,round:"",size:"small",type:"success"},{default:e.withCtx(()=>[e.createVNode(e.unref(r.Icon),{name:"file-document-outline"})]),_:1}))}}),g=e.defineComponent({setup(l){const o=()=>{r.Snackbar.error("Trashed ! This is a dangerous operation.")};return(a,c)=>(e.openBlock(),e.createBlock(e.unref(r.Button),{round:"",onClick:o,size:"small",type:"danger"},{default:e.withCtx(()=>[e.createVNode(e.unref(r.Icon),{name:"trash-can-outline"})]),_:1}))}}),h=e.defineComponent({setup(l){const o=()=>{r.Snackbar.warning("Happy birthday to you")};return(a,c)=>(e.openBlock(),e.createBlock(e.unref(r.Button),{onClick:o,round:"",size:"small",type:"warning"},{default:e.withCtx(()=>[e.createVNode(e.unref(r.Icon),{name:"cake-variant"})]),_:1}))}});t.pluginsManager.useSelectorPlugin({name:"copy",component:m}).useSelectorPlugin({name:"transh",component:g}).useSelectorPlugin({name:"demo",component:h}),n.default=f,Object.defineProperties(n,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});