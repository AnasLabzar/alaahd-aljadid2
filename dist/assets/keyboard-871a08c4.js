import{r as a,R as E,p as S}from"./index-0a09aeff.js";var I=Object.defineProperty,P=(e,t,n)=>t in e?I(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,w=(e,t,n)=>(P(e,typeof t!="symbol"?t+"":t,n),n);let T=class{constructor(){w(this,"current",this.detect()),w(this,"handoffState","pending"),w(this,"currentId",0)}set(t){this.current!==t&&(this.handoffState="pending",this.currentId=0,this.current=t)}reset(){this.set(this.detect())}nextId(){return++this.currentId}get isServer(){return this.current==="server"}get isClient(){return this.current==="client"}detect(){return typeof window>"u"||typeof document>"u"?"server":"client"}handoff(){this.handoffState==="pending"&&(this.handoffState="complete")}get isHandoffComplete(){return this.handoffState==="complete"}},m=new T,R=(e,t)=>{m.isServer?a.useEffect(e,t):a.useLayoutEffect(e,t)};function x(e){let t=a.useRef(e);return R(()=>{t.current=e},[e]),t}let D=function(e){let t=x(e);return E.useCallback((...n)=>t.current(...n),[t])};function H(){let e=typeof document>"u";return"useSyncExternalStore"in S?(t=>t.useSyncExternalStore)(S)(()=>()=>{},()=>!1,()=>!e):!1}function C(){let e=H(),[t,n]=a.useState(m.isHandoffComplete);return t&&m.isHandoffComplete===!1&&n(!1),a.useEffect(()=>{t!==!0&&n(!0)},[t]),a.useEffect(()=>m.handoff(),[]),e?!1:t}var j;let W=(j=E.useId)!=null?j:function(){let e=C(),[t,n]=E.useState(e?()=>m.nextId():null);return R(()=>{t===null&&n(m.nextId())},[t]),t!=null?""+t:void 0};function $(e,t,...n){if(e in t){let o=t[e];return typeof o=="function"?o(...n):o}let r=new Error(`Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(t).map(o=>`"${o}"`).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(r,$),r}function Y(e){return m.isServer?null:e instanceof Node?e.ownerDocument:e!=null&&e.hasOwnProperty("current")&&e.current instanceof Node?e.current.ownerDocument:document}let A=Symbol();function q(e,t=!0){return Object.assign(e,{[A]:t})}function z(...e){let t=a.useRef(e);a.useEffect(()=>{t.current=e},[e]);let n=D(r=>{for(let o of t.current)o!=null&&(typeof o=="function"?o(r):o.current=r)});return e.every(r=>r==null||(r==null?void 0:r[A]))?void 0:n}function N(...e){return Array.from(new Set(e.flatMap(t=>typeof t=="string"?t.split(" "):[]))).filter(Boolean).join(" ")}var F=(e=>(e[e.None=0]="None",e[e.RenderStrategy=1]="RenderStrategy",e[e.Static=2]="Static",e))(F||{}),U=(e=>(e[e.Unmount=0]="Unmount",e[e.Hidden=1]="Hidden",e))(U||{});function G({ourProps:e,theirProps:t,slot:n,defaultTag:r,features:o,visible:c=!0,name:l,mergeRefs:i}){i=i??B;let s=k(t,e);if(c)return g(s,n,r,l,i);let h=o??0;if(h&2){let{static:u=!1,...p}=s;if(u)return g(p,n,r,l,i)}if(h&1){let{unmount:u=!0,...p}=s;return $(u?0:1,{0(){return null},1(){return g({...p,hidden:!0,style:{display:"none"}},n,r,l,i)}})}return g(s,n,r,l,i)}function g(e,t={},n,r,o){let{as:c=n,children:l,refName:i="ref",...s}=b(e,["unmount","static"]),h=e.ref!==void 0?{[i]:e.ref}:{},u=typeof l=="function"?l(t):l;"className"in s&&s.className&&typeof s.className=="function"&&(s.className=s.className(t));let p={};if(t){let f=!1,y=[];for(let[v,d]of Object.entries(t))typeof d=="boolean"&&(f=!0),d===!0&&y.push(v);f&&(p["data-headlessui-state"]=y.join(" "))}if(c===a.Fragment&&Object.keys(O(s)).length>0){if(!a.isValidElement(u)||Array.isArray(u)&&u.length>1)throw new Error(['Passing props on "Fragment"!',"",`The current component <${r} /> is rendering a "Fragment".`,"However we need to passthrough the following props:",Object.keys(s).map(d=>`  - ${d}`).join(`
`),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',"Render a single element as the child so that we can forward the props onto that element."].map(d=>`  - ${d}`).join(`
`)].join(`
`));let f=u.props,y=typeof(f==null?void 0:f.className)=="function"?(...d)=>N(f==null?void 0:f.className(...d),s.className):N(f==null?void 0:f.className,s.className),v=y?{className:y}:{};return a.cloneElement(u,Object.assign({},k(u.props,O(b(s,["ref"]))),p,h,{ref:o(u.ref,h.ref)},v))}return a.createElement(c,Object.assign({},b(s,["ref"]),c!==a.Fragment&&h,c!==a.Fragment&&p),u)}function J(){let e=a.useRef([]),t=a.useCallback(n=>{for(let r of e.current)r!=null&&(typeof r=="function"?r(n):r.current=n)},[]);return(...n)=>{if(!n.every(r=>r==null))return e.current=n,t}}function B(...e){return e.every(t=>t==null)?void 0:t=>{for(let n of e)n!=null&&(typeof n=="function"?n(t):n.current=t)}}function k(...e){if(e.length===0)return{};if(e.length===1)return e[0];let t={},n={};for(let r of e)for(let o in r)o.startsWith("on")&&typeof r[o]=="function"?(n[o]!=null||(n[o]=[]),n[o].push(r[o])):t[o]=r[o];if(t.disabled||t["aria-disabled"])return Object.assign(t,Object.fromEntries(Object.keys(n).map(r=>[r,void 0])));for(let r in n)Object.assign(t,{[r](o,...c){let l=n[r];for(let i of l){if((o instanceof Event||(o==null?void 0:o.nativeEvent)instanceof Event)&&o.defaultPrevented)return;i(o,...c)}}});return t}function K(e){var t;return Object.assign(a.forwardRef(e),{displayName:(t=e.displayName)!=null?t:e.name})}function O(e){let t=Object.assign({},e);for(let n in t)t[n]===void 0&&delete t[n];return t}function b(e,t=[]){let n=Object.assign({},e);for(let r of t)r in n&&delete n[r];return n}var L=(e=>(e.Space=" ",e.Enter="Enter",e.Escape="Escape",e.Backspace="Backspace",e.Delete="Delete",e.ArrowLeft="ArrowLeft",e.ArrowUp="ArrowUp",e.ArrowRight="ArrowRight",e.ArrowDown="ArrowDown",e.Home="Home",e.End="End",e.PageUp="PageUp",e.PageDown="PageDown",e.Tab="Tab",e))(L||{});export{G as C,W as I,F as O,q as T,K as U,J as a,Y as b,L as c,C as d,m as e,R as l,D as o,x as s,N as t,$ as u,U as v,z as y};
