import{j as e}from"./iframe-BdHU-FLj.js";import"./preload-helper-PPVm8Dsz.js";const o=({size:m="md",className:i=""})=>{const l={sm:"w-4 h-4",md:"w-6 h-6",lg:"w-8 h-8"};return e.jsx("div",{className:`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${l[m]} ${i}`,role:"status","aria-label":"Loading",children:e.jsx("span",{className:"sr-only",children:"Loading..."})})};o.__docgenInfo={description:"",methods:[],displayName:"Spinner",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const p={title:"UI/Spinner",component:o,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{size:"sm"}},s={args:{size:"md"}},a={args:{size:"lg"}},n={render:()=>e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(o,{size:"lg"}),e.jsx("p",{className:"text-gray-600",children:"Chargement en cours..."})]})},t={render:()=>e.jsxs("button",{className:"btn-primary flex items-center gap-2",disabled:!0,children:[e.jsx(o,{size:"sm"}),"Chargement..."]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md'
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg'
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-center gap-4">\r
      <Spinner size="lg" />\r
      <p className="text-gray-600">Chargement en cours...</p>\r
    </div>
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <button className="btn-primary flex items-center gap-2" disabled>\r
      <Spinner size="sm" />\r
      Chargement...\r
    </button>
}`,...t.parameters?.docs?.source}}};const u=["Small","Medium","Large","WithText","InButton"];export{t as InButton,a as Large,s as Medium,r as Small,n as WithText,u as __namedExportsOrder,p as default};
