import{r as c,j as e}from"./iframe-BdHU-FLj.js";import{r as k}from"./index-C0pH0-xp.js";import{X as w}from"./x-BC62ssot.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bb6XB68h.js";import"./createLucideIcon-ClzONTEY.js";const u=({isOpen:r,onClose:a,title:s,children:x,size:h="md",footer:m,className:g="",hideCloseButton:b=!1,padding:f="default"})=>{const y=c.useRef(null);if(c.useEffect(()=>{const p=N=>{N.key==="Escape"&&a()};return r&&(document.addEventListener("keydown",p),document.body.style.overflow="hidden"),()=>{document.removeEventListener("keydown",p),document.body.style.overflow="unset"}},[r,a]),!r)return null;const j={sm:"max-w-md",md:"max-w-lg",lg:"max-w-2xl",xl:"max-w-4xl",full:"max-w-full m-4 h-[calc(100vh-2rem)]"},v=e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",children:[e.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity",onClick:a,"aria-hidden":"true"}),e.jsxs("div",{ref:y,className:`
          relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-h-[90vh] flex flex-col
          transform transition-all duration-200 scale-100 opacity-100
          ${j[h]}
          ${g}
        `,role:"dialog","aria-modal":"true",children:[!b&&e.jsxs("div",{className:`flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0 ${s?"":"justify-end border-none pb-0"}`,children:[s&&e.jsx("h3",{className:"text-lg font-semibold text-gray-900 dark:text-white",children:s}),e.jsx("button",{onClick:a,"aria-label":"Fermer",className:"text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700",children:e.jsx(w,{className:"w-5 h-5"})})]}),e.jsx("div",{className:`${f==="none"?"p-0":"px-6 py-4"} overflow-y-auto custom-scrollbar grow`,children:x}),m&&e.jsx("div",{className:"px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 rounded-b-xl shrink-0 flex justify-end gap-3",children:m})]})]});return k.createPortal(v,document.body)},F={title:"UI/Modal",component:u,parameters:{layout:"centered"},tags:["autodocs"]},t=r=>{const[a,s]=c.useState(!0);return e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>s(!0),children:"Ouvrir Modal"}),e.jsx(u,{...r,isOpen:a,onClose:()=>s(!1)})]})},n={render:r=>e.jsx(t,{...r}),args:{title:"Modal par défaut",children:e.jsx("p",{children:"Contenu de la modal"})}},o={render:r=>e.jsx(t,{...r}),args:{title:"Modal avec beaucoup de contenu",children:e.jsxs("div",{children:[e.jsx("p",{children:"Premier paragraphe de contenu."}),e.jsx("p",{children:"Deuxième paragraphe de contenu."}),e.jsx("p",{children:"Troisième paragraphe de contenu."}),e.jsx("p",{children:"Quatrième paragraphe de contenu."}),e.jsx("p",{children:"Cinquième paragraphe de contenu."}),e.jsx("p",{children:"Sixième paragraphe de contenu."})]})}},d={render:r=>e.jsx(t,{...r}),args:{title:"Formulaire",children:e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block mb-2",children:"Nom"}),e.jsx("input",{type:"text",className:"w-full p-2 border rounded"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block mb-2",children:"Email"}),e.jsx("input",{type:"email",className:"w-full p-2 border rounded"})]}),e.jsx("button",{type:"submit",className:"btn-primary",children:"Envoyer"})]})}},l={render:r=>e.jsx(t,{...r}),args:{title:"Petite modal",size:"sm",children:e.jsx("p",{children:"Confirmation requise"})}},i={render:r=>e.jsx(t,{...r}),args:{title:"Grande modal",size:"lg",children:e.jsx("p",{children:"Beaucoup d'espace pour du contenu"})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <ModalWithState {...args} />,
  args: {
    title: 'Modal par défaut',
    children: <p>Contenu de la modal</p>
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <ModalWithState {...args} />,
  args: {
    title: 'Modal avec beaucoup de contenu',
    children: <div>\r
        <p>Premier paragraphe de contenu.</p>\r
        <p>Deuxième paragraphe de contenu.</p>\r
        <p>Troisième paragraphe de contenu.</p>\r
        <p>Quatrième paragraphe de contenu.</p>\r
        <p>Cinquième paragraphe de contenu.</p>\r
        <p>Sixième paragraphe de contenu.</p>\r
      </div>
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <ModalWithState {...args} />,
  args: {
    title: 'Formulaire',
    children: <form className="space-y-4">\r
        <div>\r
          <label className="block mb-2">Nom</label>\r
          <input type="text" className="w-full p-2 border rounded" />\r
        </div>\r
        <div>\r
          <label className="block mb-2">Email</label>\r
          <input type="email" className="w-full p-2 border rounded" />\r
        </div>\r
        <button type="submit" className="btn-primary">\r
          Envoyer\r
        </button>\r
      </form>
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <ModalWithState {...args} />,
  args: {
    title: 'Petite modal',
    size: 'sm',
    children: <p>Confirmation requise</p>
  }
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <ModalWithState {...args} />,
  args: {
    title: 'Grande modal',
    size: 'lg',
    children: <p>Beaucoup d'espace pour du contenu</p>
  }
}`,...i.parameters?.docs?.source}}};const L=["Default","WithLongContent","WithForm","Small","Large"];export{n as Default,i as Large,l as Small,d as WithForm,o as WithLongContent,L as __namedExportsOrder,F as default};
