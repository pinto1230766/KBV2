import{r as a,j as s}from"./iframe-BdHU-FLj.js";import{c as R}from"./cn-BB8OEnXs.js";import"./preload-helper-PPVm8Dsz.js";import"./bundle-mjs-BNe0Xlio.js";const A=r=>{if(typeof window>"u")return r.jpg;const e=document.createElement("canvas");if(e.width=1,e.height=1,!e.getContext("2d"))return r.jpg;const i=e.toDataURL("image/webp").indexOf("data:image/webp")===0;return e.toDataURL("image/avif").indexOf("data:image/avif")===0&&r.avif?r.avif:i&&r.webp?r.webp:r.jpg},D=(r,e=75)=>{const o=r.replace(/\.[^/.]+$/,"");return{webp:`${o}.webp?q=${e}`,avif:`${o}.avif?q=${e}`,jpg:`${o}.jpg?q=${e}`,png:`${o}.png?q=${e}`}},z=({src:r,alt:e,className:o,fallback:i="/placeholder.jpg",placeholder:I="/placeholder-blur.jpg",quality:T=75,loading:p="lazy",sizes:N,onLoad:j,onError:S,aspectRatio:q,priority:u=!1})=>{const[n,V]=a.useState(!1),[$,E]=a.useState(!u&&p==="lazy"),[b,P]=a.useState(!1),[c,L]=a.useState(I),W=a.useRef(null),w=a.useRef(null),C=D(r,T),x=A(C);a.useEffect(()=>{if(u||p==="eager")return;const t=new IntersectionObserver(U=>{U.forEach(k=>{k.isIntersecting&&(E(!0),t.disconnect())})},{rootMargin:"50px",threshold:.1});return w.current&&t.observe(w.current),()=>t.disconnect()},[u,p]),a.useEffect(()=>{if(!$||n||b)return;const t=new Image;t.onload=()=>{L(x),V(!0),j?.()},t.onerror=()=>{P(!0),L(i),S?.()},t.src=x},[$,n,b,x,i,j,S]);const O=n?(()=>{if(typeof window>"u")return c;const t=window.innerWidth;return t<640?`${c}&w=400`:t<768?`${c}&w=600`:t<1024?`${c}&w=800`:`${c}&w=1200`})():I;return s.jsxs("div",{ref:w,className:R("relative overflow-hidden bg-gray-100",q&&`aspect-[${q}]`,o),children:[s.jsx("img",{ref:W,src:O,alt:e,className:R("absolute inset-0 h-full w-full object-cover transition-opacity duration-300",n?"opacity-100":"opacity-0"),loading:u?"eager":p,sizes:N,decoding:"async"}),!n&&s.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse",children:s.jsx("div",{className:"w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"})}),b&&s.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-gray-200",children:s.jsxs("div",{className:"text-center text-gray-500",children:[s.jsx("svg",{className:"w-8 h-8 mx-auto mb-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})}),s.jsx("p",{className:"text-sm",children:"Image non disponible"})]})})]})};z.__docgenInfo={description:"",methods:[],displayName:"LazyImage",props:{src:{required:!0,tsType:{name:"string"},description:""},alt:{required:!0,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:""},fallback:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'/placeholder.jpg'",computed:!1}},placeholder:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'/placeholder-blur.jpg'",computed:!1}},quality:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"75",computed:!1}},loading:{required:!1,tsType:{name:"union",raw:"'lazy' | 'eager'",elements:[{name:"literal",value:"'lazy'"},{name:"literal",value:"'eager'"}]},description:"",defaultValue:{value:"'lazy'",computed:!1}},sizes:{required:!1,tsType:{name:"string"},description:""},onLoad:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onError:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},aspectRatio:{required:!1,tsType:{name:"string"},description:""},priority:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const B={title:"UI/LazyImage",component:z,parameters:{layout:"centered"},tags:["autodocs"]},l={args:{src:"https://picsum.photos/400/300",alt:"Image par défaut"}},d={args:{src:"https://picsum.photos/400/300",alt:"Image avec placeholder",placeholder:"https://picsum.photos/400/300?blur=10"}},m={args:{src:"https://picsum.photos/400/300",alt:"Image prioritaire (eager loading)",priority:!0}},g={args:{src:"https://picsum.photos/800/600",alt:"Image haute qualité",quality:90}},h={args:{src:"https://picsum.photos/800/600",alt:"Image avec aspect ratio",aspectRatio:"16/9"}},f={args:{src:"https://picsum.photos/800/400",alt:"Image paysage"}},y={args:{src:"https://picsum.photos/400/600",alt:"Image portrait"}},v={args:{src:"https://picsum.photos/400/400",alt:"Image carrée"}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Image par défaut'
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Image avec placeholder',
    placeholder: 'https://picsum.photos/400/300?blur=10'
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Image prioritaire (eager loading)',
    priority: true
  }
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://picsum.photos/800/600',
    alt: 'Image haute qualité',
    quality: 90
  }
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://picsum.photos/800/600',
    alt: 'Image avec aspect ratio',
    aspectRatio: '16/9'
  }
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://picsum.photos/800/400',
    alt: 'Image paysage'
  }
}`,...f.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://picsum.photos/400/600',
    alt: 'Image portrait'
  }
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://picsum.photos/400/400',
    alt: 'Image carrée'
  }
}`,...v.parameters?.docs?.source}}};const G=["Default","WithPlaceholder","Priority","CustomQuality","WithAspectRatio","Landscape","Portrait","Square"];export{g as CustomQuality,l as Default,f as Landscape,y as Portrait,m as Priority,v as Square,h as WithAspectRatio,d as WithPlaceholder,G as __namedExportsOrder,B as default};
