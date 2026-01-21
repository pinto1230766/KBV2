import{j as e}from"./iframe-BdHU-FLj.js";import{B as r}from"./Badge-DYB8t85G.js";import"./preload-helper-PPVm8Dsz.js";const u={title:"UI/Badge",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["default","success","warning","error","info","primary"]},size:{control:{type:"select"},options:["sm","md","lg"]}}},a={args:{children:"Badge",variant:"default",size:"md"}},s={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(r,{variant:"default",children:"Default"}),e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"warning",children:"Warning"}),e.jsx(r,{variant:"danger",children:"Danger"}),e.jsx(r,{variant:"info",children:"Info"})]})},n={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(r,{size:"sm",children:"Small"}),e.jsx(r,{size:"md",children:"Medium"})]})},i={args:{children:"With Icon",variant:"primary"},render:o=>e.jsxs("div",{className:"flex gap-4",children:[e.jsxs(r,{...o,children:[e.jsx("svg",{className:"w-3 h-3 mr-1",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",clipRule:"evenodd"})}),"Success"]}),e.jsxs(r,{variant:"warning",children:[e.jsx("svg",{className:"w-3 h-3 mr-1",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),"Warning"]})]})},l={render:()=>e.jsx("div",{className:"flex gap-2",children:e.jsxs(r,{variant:"primary",children:["Removable",e.jsx("button",{className:"ml-1 hover:bg-white/20 rounded-full p-0.5",children:e.jsx("svg",{className:"w-3 h-3",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",clipRule:"evenodd"})})})]})})},d={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("p",{children:["This is a paragraph with a"," ",e.jsx(r,{variant:"primary",size:"sm",children:"inline badge"})," ","that flows with the text."]}),e.jsxs("p",{children:["Another example with"," ",e.jsx(r,{variant:"success",size:"sm",children:"success status"})," ","showing completion."]})]})},t={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-3 h-3 bg-green-500 rounded-full"}),e.jsx(r,{variant:"success",children:"Online"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-3 h-3 bg-yellow-500 rounded-full"}),e.jsx(r,{variant:"warning",children:"Away"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-3 h-3 bg-red-500 rounded-full"}),e.jsx(r,{variant:"danger",children:"Busy"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-3 h-3 bg-gray-500 rounded-full"}),e.jsx(r,{variant:"default",children:"Offline"})]})]})},c={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center",children:e.jsx("svg",{className:"w-6 h-6 text-gray-600",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM15 7h5l-5 5v-5zM9 7H4l5 5v-5z"})})}),e.jsx(r,{variant:"danger",size:"sm",className:"absolute -top-2 -right-2",children:"5"})]}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center",children:e.jsx("svg",{className:"w-6 h-6 text-gray-600",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 19l9 2-9-18-9 18 9-2zm0 0v-8"})})}),e.jsx(r,{variant:"success",size:"sm",className:"absolute -top-2 -right-2",children:"12"})]})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'md'
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">\r
      <Badge variant="default">Default</Badge>\r
      <Badge variant="primary">Primary</Badge>\r
      <Badge variant="success">Success</Badge>\r
      <Badge variant="warning">Warning</Badge>\r
      <Badge variant="danger">Danger</Badge>\r
      <Badge variant="info">Info</Badge>\r
    </div>
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">\r
      <Badge size="sm">Small</Badge>\r
      <Badge size="md">Medium</Badge>\r
    </div>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'With Icon',
    variant: 'primary'
  },
  render: args => <div className="flex gap-4">\r
      <Badge {...args}>\r
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">\r
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />\r
        </svg>\r
        Success\r
      </Badge>\r
      <Badge variant="warning">\r
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">\r
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />\r
        </svg>\r
        Warning\r
      </Badge>\r
    </div>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2">\r
      <Badge variant="primary">\r
        Removable\r
        <button className="ml-1 hover:bg-white/20 rounded-full p-0.5">\r
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">\r
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />\r
          </svg>\r
        </button>\r
      </Badge>\r
    </div>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">\r
      <p>\r
        This is a paragraph with a{' '}\r
        <Badge variant="primary" size="sm">inline badge</Badge>\r
        {' '}that flows with the text.\r
      </p>\r
      <p>\r
        Another example with{' '}\r
        <Badge variant="success" size="sm">success status</Badge>\r
        {' '}showing completion.\r
      </p>\r
    </div>
}`,...d.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">\r
      <div className="flex items-center gap-2">\r
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>\r
        <Badge variant="success">Online</Badge>\r
      </div>\r
      <div className="flex items-center gap-2">\r
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>\r
        <Badge variant="warning">Away</Badge>\r
      </div>\r
      <div className="flex items-center gap-2">\r
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>\r
        <Badge variant="danger">Busy</Badge>\r
      </div>\r
      <div className="flex items-center gap-2">\r
        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>\r
        <Badge variant="default">Offline</Badge>\r
      </div>\r
    </div>
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">\r
      <div className="relative">\r
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">\r
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM15 7h5l-5 5v-5zM9 7H4l5 5v-5z" />\r
          </svg>\r
        </div>\r
        <Badge variant="danger" size="sm" className="absolute -top-2 -right-2">\r
          5\r
        </Badge>\r
      </div>\r
      <div className="relative">\r
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">\r
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />\r
          </svg>\r
        </div>\r
        <Badge variant="success" size="sm" className="absolute -top-2 -right-2">\r
          12\r
        </Badge>\r
      </div>\r
    </div>
}`,...c.parameters?.docs?.source}}};const p=["Default","Variants","Sizes","WithIcon","Removable","InText","StatusBadges","CountBadges"];export{c as CountBadges,a as Default,d as InText,l as Removable,n as Sizes,t as StatusBadges,s as Variants,i as WithIcon,p as __namedExportsOrder,u as default};
