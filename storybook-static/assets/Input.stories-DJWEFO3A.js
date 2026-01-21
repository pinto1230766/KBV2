import{j as e}from"./iframe-BdHU-FLj.js";import"./preload-helper-PPVm8Dsz.js";const b=({label:u,error:r,helperText:h,leftIcon:p,rightIcon:m,className:y="",id:f,...g})=>{const x=f||g.name||Math.random().toString(36).substr(2,9);return e.jsxs("div",{className:"w-full",children:[u&&e.jsx("label",{htmlFor:x,className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",children:u}),e.jsxs("div",{className:"relative",children:[p&&e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400",children:p}),e.jsx("input",{id:x,className:`
            w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200
            disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed
            ${p?"pl-10":"pl-4"}
            ${m?"pr-10":"pr-4"}
            ${r?"border-danger-500 focus:ring-danger-500":"border-gray-300 dark:border-gray-600"}
            ${y}
            py-2
          `,...g}),m&&e.jsx("div",{className:"absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 z-10",children:m})]}),r&&e.jsx("p",{className:"mt-1 text-sm text-danger-600 dark:text-danger-400",children:r}),h&&!r&&e.jsx("p",{className:"mt-1 text-sm text-gray-500 dark:text-gray-400",children:h})]})};b.__docgenInfo={description:"",methods:[],displayName:"Input",props:{label:{required:!1,tsType:{name:"string"},description:""},error:{required:!1,tsType:{name:"string"},description:""},helperText:{required:!1,tsType:{name:"string"},description:""},leftIcon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},rightIcon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1}}};const w={title:"UI/Input",component:b,parameters:{layout:"centered"},tags:["autodocs"]},a={args:{placeholder:"Enter text..."}},s={args:{label:"Email Address",placeholder:"Enter your email",type:"email"}},t={args:{label:"Password",type:"password",placeholder:"Enter your password",helperText:"Password must be at least 8 characters long"}},o={args:{label:"Email",placeholder:"Enter your email",type:"email",value:"invalid-email",error:"Please enter a valid email address"}},l={args:{placeholder:"Search...",leftIcon:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})}},n={args:{placeholder:"Search...",rightIcon:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})}},i={args:{placeholder:"Disabled input",disabled:!0}},d={args:{label:"Required Field",placeholder:"This field is required",required:!0}},c={args:{placeholder:"Search users, conversations...",leftIcon:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),className:"w-80"}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter text...'
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email'
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    helperText: 'Password must be at least 8 characters long'
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    value: 'invalid-email',
    error: 'Please enter a valid email address'
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search...',
    leftIcon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />\r
      </svg>
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search...',
    rightIcon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />\r
      </svg>
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Disabled input',
    disabled: true
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search users, conversations...',
    leftIcon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />\r
      </svg>,
    className: 'w-80'
  }
}`,...c.parameters?.docs?.source}}};const j=["Default","WithLabel","WithHelperText","WithError","WithIcon","WithRightIcon","Disabled","Required","SearchBox"];export{a as Default,i as Disabled,d as Required,c as SearchBox,o as WithError,t as WithHelperText,l as WithIcon,s as WithLabel,n as WithRightIcon,j as __namedExportsOrder,w as default};
