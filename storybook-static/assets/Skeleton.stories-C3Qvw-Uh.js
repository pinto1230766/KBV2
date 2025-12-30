import{j as e}from"./iframe-BdHU-FLj.js";import"./preload-helper-PPVm8Dsz.js";const s=({className:w="",variant:l="text",width:n,height:c,animation:N="pulse"})=>{const x="bg-gray-200 dark:bg-gray-700",g={text:"rounded h-4",circular:"rounded-full",rectangular:"rounded-lg"},f={pulse:"animate-pulse",wave:"animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",none:""},v=()=>{const r=[];if(n){const a=typeof n=="number"?`${n}px`:n;a.includes("px")?r.push(`w-[${a}]`):a==="100%"?r.push("w-full"):a==="60%"?r.push("w-[60%]"):a==="40%"?r.push("w-[40%]"):a==="50%"?r.push("w-[50%]"):a==="70%"?r.push("w-[70%]"):a==="80%"?r.push("w-[80%]"):r.push(`w-[${a}]`)}if(c){const a=typeof c=="number"?`${c}px`:c;a.includes("px")?r.push(`h-[${a}]`):a==="100%"?r.push("h-full"):r.push(`h-[${a}]`)}return r.join(" ")};return e.jsx("div",{className:`${x} ${g[l]} ${f[N]} ${v()} ${w}`})};s.__docgenInfo={description:"",methods:[],displayName:"Skeleton",props:{className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'text' | 'circular' | 'rectangular'",elements:[{name:"literal",value:"'text'"},{name:"literal",value:"'circular'"},{name:"literal",value:"'rectangular'"}]},description:"",defaultValue:{value:"'text'",computed:!1}},width:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:""},height:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:""},animation:{required:!1,tsType:{name:"union",raw:"'pulse' | 'wave' | 'none'",elements:[{name:"literal",value:"'pulse'"},{name:"literal",value:"'wave'"},{name:"literal",value:"'none'"}]},description:"",defaultValue:{value:"'pulse'",computed:!1}}}};const k={title:"UI/Skeleton",component:s,parameters:{layout:"centered"},tags:["autodocs"]},m={args:{className:"w-48 h-4"}},t={render:()=>e.jsxs("div",{className:"space-y-2 w-64",children:[e.jsx(s,{className:"h-4 w-full"}),e.jsx(s,{className:"h-4 w-3/4"}),e.jsx(s,{className:"h-4 w-1/2"})]})},o={args:{className:"w-12 h-12 rounded-full"}},d={render:()=>e.jsxs("div",{className:"space-y-4 w-80",children:[e.jsx(s,{className:"h-32 w-full rounded-lg"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{className:"h-4 w-3/4"}),e.jsx(s,{className:"h-4 w-1/2"})]})]})},i={render:()=>e.jsx("div",{className:"space-y-3 w-64",children:Array.from({length:5}).map((w,l)=>e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx(s,{className:"w-10 h-10 rounded-full"}),e.jsxs("div",{className:"space-y-2 flex-1",children:[e.jsx(s,{className:"h-4 w-3/4"}),e.jsx(s,{className:"h-3 w-1/2"})]})]},l))})},u={render:()=>e.jsxs("div",{className:"grid grid-cols-2 gap-4 w-96",children:[e.jsxs("div",{className:"p-6 bg-white dark:bg-gray-800 rounded-lg border space-y-3",children:[e.jsx(s,{className:"h-4 w-24"}),e.jsx(s,{className:"h-8 w-16"}),e.jsx(s,{className:"h-3 w-20"})]}),e.jsxs("div",{className:"p-6 bg-white dark:bg-gray-800 rounded-lg border space-y-3",children:[e.jsx(s,{className:"h-4 w-32"}),e.jsx(s,{className:"h-8 w-20"}),e.jsx(s,{className:"h-3 w-16"})]})]})},p={render:()=>e.jsxs("div",{className:"space-y-2 w-full max-w-2xl",children:[e.jsxs("div",{className:"flex space-x-4",children:[e.jsx(s,{className:"h-6 w-1/4"}),e.jsx(s,{className:"h-6 w-1/4"}),e.jsx(s,{className:"h-6 w-1/4"}),e.jsx(s,{className:"h-6 w-1/4"})]}),Array.from({length:5}).map((w,l)=>e.jsxs("div",{className:"flex space-x-4",children:[e.jsx(s,{className:"h-4 w-1/4"}),e.jsx(s,{className:"h-4 w-1/4"}),e.jsx(s,{className:"h-4 w-1/4"}),e.jsx(s,{className:"h-4 w-1/4"})]},l))]})},h={render:()=>e.jsxs("div",{className:"flex items-center space-x-4 w-80",children:[e.jsx(s,{className:"w-16 h-16 rounded-full"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{className:"h-5 w-32"}),e.jsx(s,{className:"h-4 w-48"}),e.jsx(s,{className:"h-4 w-24"})]})]})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    className: 'w-48 h-4'
  }
}`,...m.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 w-64">\r
      <Skeleton className="h-4 w-full" />\r
      <Skeleton className="h-4 w-3/4" />\r
      <Skeleton className="h-4 w-1/2" />\r
    </div>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    className: 'w-12 h-12 rounded-full'
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-80">\r
      <Skeleton className="h-32 w-full rounded-lg" />\r
      <div className="space-y-2">\r
        <Skeleton className="h-4 w-3/4" />\r
        <Skeleton className="h-4 w-1/2" />\r
      </div>\r
    </div>
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-3 w-64">\r
      {Array.from({
      length: 5
    }).map((_, i) => <div key={i} className="flex items-center space-x-3">\r
          <Skeleton className="w-10 h-10 rounded-full" />\r
          <div className="space-y-2 flex-1">\r
            <Skeleton className="h-4 w-3/4" />\r
            <Skeleton className="h-3 w-1/2" />\r
          </div>\r
        </div>)}\r
    </div>
}`,...i.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 gap-4 w-96">\r
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border space-y-3">\r
        <Skeleton className="h-4 w-24" />\r
        <Skeleton className="h-8 w-16" />\r
        <Skeleton className="h-3 w-20" />\r
      </div>\r
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border space-y-3">\r
        <Skeleton className="h-4 w-32" />\r
        <Skeleton className="h-8 w-20" />\r
        <Skeleton className="h-3 w-16" />\r
      </div>\r
    </div>
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 w-full max-w-2xl">\r
      {/* Header */}\r
      <div className="flex space-x-4">\r
        <Skeleton className="h-6 w-1/4" />\r
        <Skeleton className="h-6 w-1/4" />\r
        <Skeleton className="h-6 w-1/4" />\r
        <Skeleton className="h-6 w-1/4" />\r
      </div>\r
      {/* Rows */}\r
      {Array.from({
      length: 5
    }).map((_, i) => <div key={i} className="flex space-x-4">\r
          <Skeleton className="h-4 w-1/4" />\r
          <Skeleton className="h-4 w-1/4" />\r
          <Skeleton className="h-4 w-1/4" />\r
          <Skeleton className="h-4 w-1/4" />\r
        </div>)}\r
    </div>
}`,...p.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-4 w-80">\r
      <Skeleton className="w-16 h-16 rounded-full" />\r
      <div className="space-y-2">\r
        <Skeleton className="h-5 w-32" />\r
        <Skeleton className="h-4 w-48" />\r
        <Skeleton className="h-4 w-24" />\r
      </div>\r
    </div>
}`,...h.parameters?.docs?.source}}};const S=["Default","TextLines","Avatar","Card","List","DashboardCard","Table","Profile"];export{o as Avatar,d as Card,u as DashboardCard,m as Default,i as List,h as Profile,p as Table,t as TextLines,S as __namedExportsOrder,k as default};
