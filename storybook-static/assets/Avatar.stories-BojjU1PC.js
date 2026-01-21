import{j as e}from"./iframe-BdHU-FLj.js";import{c as p}from"./cn-BB8OEnXs.js";import"./preload-helper-PPVm8Dsz.js";import"./bundle-mjs-BNe0Xlio.js";const j={sm:"w-8 h-8 text-sm",md:"w-10 h-10 text-base",lg:"w-12 h-12 text-lg",xl:"w-16 h-16 text-xl"},k={default:"bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"},a=({src:d,alt:x,name:s,size:b="md",className:f,fallbackClassName:v,...h})=>{const m=j[b],u=v||k.default;return d?e.jsx("div",{className:p("rounded-full overflow-hidden flex items-center justify-center",m,f),...h,children:e.jsx("img",{src:d,alt:x||s||"Avatar",className:"w-full h-full object-cover",onError:z=>{const g=z.target;g.style.display="none";const i=g.parentElement;i&&(i.className=p("rounded-full overflow-hidden flex items-center justify-center font-bold",m,u),i.textContent=s?s.charAt(0).toUpperCase():"?")}})}):e.jsx("div",{className:p("rounded-full overflow-hidden flex items-center justify-center font-bold",m,u,f),...h,children:s?s.charAt(0).toUpperCase():"?"})};a.__docgenInfo={description:"",methods:[],displayName:"Avatar",props:{src:{required:!1,tsType:{name:"string"},description:""},alt:{required:!1,tsType:{name:"string"},description:""},name:{required:!1,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},fallbackClassName:{required:!1,tsType:{name:"string"},description:""}}};const S={title:"UI/Avatar",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:{type:"select"},options:["sm","md","lg","xl"]}}},r={args:{src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",alt:"John Doe",size:"md"}},t={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",alt:"Small",size:"sm"}),e.jsx(a,{src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face",alt:"Medium",size:"md"}),e.jsx(a,{src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",alt:"Large",size:"lg"}),e.jsx(a,{src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",alt:"Extra Large",size:"xl"})]})},o={args:{name:"John Doe",size:"md"}},c={render:()=>e.jsxs("div",{className:"flex -space-x-2",children:[e.jsx(a,{src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",alt:"John",name:"John",size:"sm"}),e.jsx(a,{src:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",alt:"Jane",name:"Jane",size:"sm"}),e.jsx(a,{src:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",alt:"Bob",name:"Bob",size:"sm"}),e.jsx(a,{name:"+3",size:"sm"})]})},n={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{name:"John Doe",size:"md",fallbackClassName:"bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"}),e.jsx(a,{name:"Jane Smith",size:"md",fallbackClassName:"bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"}),e.jsx(a,{name:"Bob Wilson",size:"md",fallbackClassName:"bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"})]})},l={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{src:"https://example.com/nonexistent.jpg",alt:"Broken Image",name:"BI",size:"md"}),e.jsx(a,{src:"",alt:"Empty Source",name:"ES",size:"md"}),e.jsx(a,{name:"No Source",size:"md"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    alt: 'John Doe',
    size: 'md'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">\r
      <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="Small" size="sm" />\r
      <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" alt="Medium" size="md" />\r
      <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" alt="Large" size="lg" />\r
      <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" alt="Extra Large" size="xl" />\r
    </div>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'John Doe',
    size: 'md'
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex -space-x-2">\r
      <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="John" name="John" size="sm" />\r
      <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" alt="Jane" name="Jane" size="sm" />\r
      <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="Bob" name="Bob" size="sm" />\r
      <Avatar name="+3" size="sm" />\r
    </div>
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">\r
      <Avatar name="John Doe" size="md" fallbackClassName="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300" />\r
      <Avatar name="Jane Smith" size="md" fallbackClassName="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" />\r
      <Avatar name="Bob Wilson" size="md" fallbackClassName="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" />\r
    </div>
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">\r
      <Avatar src="https://example.com/nonexistent.jpg" alt="Broken Image" name="BI" size="md" />\r
      <Avatar src="" alt="Empty Source" name="ES" size="md" />\r
      <Avatar name="No Source" size="md" />\r
    </div>
}`,...l.parameters?.docs?.source}}};const C=["Default","Sizes","WithName","Grouped","WithFallbackColor","FallbackStates"];export{r as Default,l as FallbackStates,c as Grouped,t as Sizes,n as WithFallbackColor,o as WithName,C as __namedExportsOrder,S as default};
