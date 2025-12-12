import{j as e}from"./iframe-JL5x0-uX.js";import{B as r}from"./Button-BiCkDpf-.js";import"./preload-helper-PPVm8Dsz.js";const b={title:"Components/UI/Button",component:r,parameters:{docs:{description:{component:"Le composant Button est utilisé pour déclencher des actions dans l'interface utilisateur. Il supporte plusieurs variantes et états."}},layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","outline","ghost","danger"],description:"Variante visuelle du bouton"},size:{control:"select",options:["sm","md","lg"],description:"Taille du bouton"},disabled:{control:"boolean",description:"État désactivé du bouton"},isLoading:{control:"boolean",description:"État de chargement du bouton"},children:{control:"text",description:"Contenu du bouton"}}},s={args:{children:"Button",variant:"primary",size:"md"}},a={args:{children:"Bouton Principal",variant:"primary"}},o={args:{children:"Bouton Secondaire",variant:"secondary"}},n={args:{children:"Bouton Outline",variant:"outline"}},t={args:{children:"Bouton Ghost",variant:"ghost"}},c={args:{children:"Bouton Danger",variant:"danger"}},i={args:{children:"Petit Bouton",size:"sm"}},d={args:{children:"Bouton Moyen",size:"md"}},l={args:{children:"Grand Bouton",size:"lg"}},m={args:{children:"Bouton Désactivé",disabled:!0}},u={args:{children:"Chargement...",isLoading:!0}},p={args:{children:"Bouton avec Icône",variant:"primary"}},g={render:v=>e.jsxs("div",{className:"space-x-2",children:[e.jsx(r,{...v,onClick:()=>console.log("Click!"),children:"Cliquer moi"}),e.jsx(r,{...v,variant:"secondary",onClick:()=>console.log("Secondary click!"),children:"Action Secondaire"})]}),parameters:{docs:{description:{story:"Exemple de boutons interactifs avec handlers de click."}}}},h={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"block sm:hidden",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Mobile (≤ 640px)"}),e.jsx(r,{size:"sm",className:"w-full",children:"Bouton Mobile"})]}),e.jsxs("div",{className:"hidden sm:block md:hidden",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Tablet (641-768px)"}),e.jsx(r,{size:"md",className:"w-full",children:"Bouton Tablet"})]}),e.jsxs("div",{className:"hidden md:block",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Desktop (≥ 769px)"}),e.jsxs("div",{className:"space-x-2",children:[e.jsx(r,{size:"md",children:"Bouton Desktop"}),e.jsx(r,{size:"md",variant:"secondary",children:"Action"})]})]})]}),parameters:{docs:{description:{story:"Boutons adaptatifs selon la taille d'écran."}}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md'
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Bouton Principal',
    variant: 'primary'
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Bouton Secondaire',
    variant: 'secondary'
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Bouton Outline',
    variant: 'outline'
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Bouton Ghost',
    variant: 'ghost'
  }
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Bouton Danger',
    variant: 'danger'
  }
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Petit Bouton',
    size: 'sm'
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Bouton Moyen',
    size: 'md'
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Grand Bouton',
    size: 'lg'
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Bouton Désactivé',
    disabled: true
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Chargement...',
    isLoading: true
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Bouton avec Icône',
    variant: 'primary'
  }
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-x-2">\r
      <Button {...args} onClick={() => console.log('Click!')}>\r
        Cliquer moi\r
      </Button>\r
      <Button {...args} variant="secondary" onClick={() => console.log('Secondary click!')}>\r
        Action Secondaire\r
      </Button>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Exemple de boutons interactifs avec handlers de click.'
      }
    }
  }
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">\r
      <div className="block sm:hidden">\r
        <p className="text-sm text-gray-600 mb-2">Mobile (≤ 640px)</p>\r
        <Button size="sm" className="w-full">Bouton Mobile</Button>\r
      </div>\r
      <div className="hidden sm:block md:hidden">\r
        <p className="text-sm text-gray-600 mb-2">Tablet (641-768px)</p>\r
        <Button size="md" className="w-full">Bouton Tablet</Button>\r
      </div>\r
      <div className="hidden md:block">\r
        <p className="text-sm text-gray-600 mb-2">Desktop (≥ 769px)</p>\r
        <div className="space-x-2">\r
          <Button size="md">Bouton Desktop</Button>\r
          <Button size="md" variant="secondary">Action</Button>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Boutons adaptatifs selon la taille d\\'écran.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};const S=["Default","Primary","Secondary","Outline","Ghost","Danger","Small","Medium","Large","Disabled","Loading","WithIcon","Interactive","Responsive"];export{c as Danger,s as Default,m as Disabled,t as Ghost,g as Interactive,l as Large,u as Loading,d as Medium,n as Outline,a as Primary,h as Responsive,o as Secondary,i as Small,p as WithIcon,S as __namedExportsOrder,b as default};
