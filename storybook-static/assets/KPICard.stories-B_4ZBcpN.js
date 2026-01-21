import{r as w,j as e}from"./iframe-BdHU-FLj.js";import{C as _,a as R,b as T,c as M}from"./Card-DdcGw4ON.js";import"./Button-2jS3QZp2.js";import"./Badge-DYB8t85G.js";import{t as S,c as V}from"./bundle-mjs-BNe0Xlio.js";import{c as o}from"./createLucideIcon-ClzONTEY.js";import{C as E}from"./check-circle-DHBlsod4.js";import"./preload-helper-PPVm8Dsz.js";const A=o("Activity",[["path",{d:"M22 12h-4l-3 9L9 3l-3 9H2",key:"d5dnw9"}]]);const D=o("ArrowDownRight",[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]]);const O=o("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);const H=o("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);const q=o("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);const P=o("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);const F=o("TrendingDown",[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]]);const U=o("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);const B=o("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);function n(...s){return S(V(s))}const L="_progressBar_997yd_2",W="_progressBarFill_997yd_14",z="_complete_997yd_59",$="_high_997yd_63",G="_medium_997yd_67",Z="_low_997yd_71",J="_chartContainer_997yd_76",c={progressBar:L,progressBarFill:W,complete:z,high:$,medium:G,low:Z,chartContainer:J},Q=5,X=-5,K=60,Y=75,ee=50,C=10,se=(s,i)=>{if(i===0)return{direction:s>0?"up":"stable",percentage:100};const d=s-i,r=Math.round(d/i*100);return r>Q?{direction:"up",percentage:r}:r<X?{direction:"down",percentage:Math.abs(r)}:{direction:"stable",percentage:Math.abs(r)}},j=(s,i="number")=>{switch(i){case"percentage":return`${s.toFixed(1)}%`;case"currency":return new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(s);case"time":{const d=Math.floor(s/K),r=s%K;return d>0?`${d}h ${r}m`:`${r}m`}default:return new Intl.NumberFormat("fr-FR").format(s)}},t=({kpi:s,onToggleVisibility:i,compact:d=!1})=>{const r=w.useMemo(()=>s.previousValue===void 0?null:se(s.value,s.previousValue),[s.value,s.previousValue]),l=w.useMemo(()=>s.target?Math.min(100,s.value/s.target*100):null,[s.value,s.target]),k=s.icon||A,N=s.color||"text-primary-600",I=s.color?.replace("text-","bg-").replace("-600","-100")||"bg-primary-100";return d?e.jsxs("div",{className:"flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg",children:[e.jsx("div",{className:n("p-2 rounded-lg",I,"dark:bg-opacity-20"),children:e.jsx(k,{className:n("w-4 h-4",N)})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 truncate",children:s.label}),e.jsx("p",{className:"font-bold text-gray-900 dark:text-white",children:j(s.value,s.format)})]}),r&&e.jsxs("div",{className:n("flex items-center gap-1 text-xs font-medium",r.direction==="up"?"text-green-600":r.direction==="down"?"text-red-600":"text-gray-500"),children:[r.direction==="up"&&e.jsx(O,{className:"w-3 h-3"}),r.direction==="down"&&e.jsx(D,{className:"w-3 h-3"}),r.direction==="stable"&&e.jsx(P,{className:"w-3 h-3"}),r.percentage,"%"]})]}):e.jsxs(_,{className:"relative overflow-hidden",children:[i&&e.jsx("button",{onClick:()=>i(s.id),className:"absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",children:s.visible!==!1?e.jsx(q,{className:"w-4 h-4"}):e.jsx(H,{className:"w-4 h-4"})}),e.jsx(R,{className:"p-4",children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:n("p-3 rounded-xl",I,"dark:bg-opacity-20"),children:e.jsx(k,{className:n("w-6 h-6",N)})}),e.jsxs("div",{className:c.chartContainer,children:[e.jsx("p",{className:"text-sm font-medium text-gray-500 dark:text-gray-400",children:s.label}),e.jsxs("div",{className:"flex items-end gap-2 mt-1",children:[e.jsx("span",{className:"text-2xl font-bold text-gray-900 dark:text-white",children:j(s.value,s.format)}),r&&e.jsxs("span",{className:n("flex items-center gap-0.5 text-sm font-medium pb-0.5",r.direction==="up"?"text-green-600":r.direction==="down"?"text-red-600":"text-gray-500"),children:[r.direction==="up"&&e.jsx(U,{className:"w-4 h-4"}),r.direction==="down"&&e.jsx(F,{className:"w-4 h-4"}),r.direction==="stable"&&e.jsx(P,{className:"w-4 h-4"}),r.percentage,"%"]})]}),l!==null&&e.jsxs("div",{className:"mt-3",children:[e.jsxs("div",{className:"flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1",children:[e.jsxs("span",{children:["Objectif: ",j(s.target,s.format)]}),e.jsxs("span",{children:[l.toFixed(0),"%"]})]}),e.jsx("div",{className:"h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",children:e.jsx("div",{className:c.progressBar,children:e.jsx("div",{className:n(c.progressBarFill,`progressBarFillWidth${Math.round(Math.min(100,l)/C)*C}`,l>=100?c.complete:l>=Y?c.high:l>=ee?c.medium:c.low)})})})]})]})]})})]})};t.__docgenInfo={description:"",methods:[],displayName:"KPICard",props:{kpi:{required:!0,tsType:{name:"KPIConfig"},description:""},onToggleVisibility:{required:!1,tsType:{name:"signature",type:"function",raw:"(_id: string) => void",signature:{arguments:[{type:{name:"string"},name:"_id"}],return:{name:"void"}}},description:""},compact:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const le={title:"Components/Dashboard/KPICard",component:t,parameters:{docs:{description:{component:"KPICard affiche un indicateur clé de performance avec sa valeur, tendance et objectif."}},layout:"centered"},tags:["autodocs"],argTypes:{kpi:{control:"object",description:"Configuration de l'indicateur"},onToggleVisibility:{action:"Toggle Visibility",description:"Handler pour masquer/afficher le widget"},compact:{control:"boolean",description:"Mode compact pour les listes"}}},a={visits:{id:"total-visits",label:"Visites ce mois",value:12,previousValue:8,target:15,format:"number",icon:T,color:"text-blue-600"},speakers:{id:"active-speakers",label:"Orateurs actifs",value:24,format:"number",icon:B,color:"text-purple-600"},confirmationRate:{id:"confirmation-rate",label:"Taux de confirmation",value:87.5,previousValue:82.1,format:"percentage",icon:E,color:"text-green-600"},pendingActions:{id:"pending-actions",label:"Actions en attente",value:5,previousValue:2,target:0,format:"number",icon:M,color:"text-red-600"}},m={args:{kpi:a.visits}},p={args:{kpi:a.confirmationRate}},g={args:{kpi:a.visits}},u={args:{kpi:a.speakers,compact:!0}},x={args:{kpi:{...a.visits,value:0}}},v={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl",children:[e.jsx(t,{kpi:a.visits}),e.jsx(t,{kpi:a.confirmationRate}),e.jsx(t,{kpi:a.speakers}),e.jsx(t,{kpi:a.pendingActions})]}),parameters:{docs:{description:{story:"Vue d'ensemble de toutes les variantes de KPICard."}}}},h={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl",children:[e.jsx(t,{kpi:a.visits}),e.jsx(t,{kpi:a.confirmationRate})]}),parameters:{docs:{description:{story:"KPI avec calcul automatique des tendances."}}}},y={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl",children:[e.jsx(t,{kpi:{...a.visits,value:18,target:15}}),e.jsx(t,{kpi:{...a.pendingActions,value:0,target:0}})]}),parameters:{docs:{description:{story:"KPI avec objectifs atteints et barres de progression."}}}},f={render:s=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Cliquez sur l'icône 👁️ pour masquer/afficher le widget"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl",children:[e.jsx(t,{...s,kpi:a.visits,onToggleVisibility:i=>console.log("Toggle visibility:",i)}),e.jsx(t,{...s,kpi:a.confirmationRate,onToggleVisibility:i=>console.log("Toggle visibility:",i)})]})]}),parameters:{docs:{description:{story:"KPICard interactifs avec gestion de visibilité."}}}},b={render:()=>e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"block lg:hidden",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Vue Mobile"}),e.jsxs("div",{className:"space-y-3",children:[e.jsx(t,{kpi:a.visits,compact:!0}),e.jsx(t,{kpi:a.confirmationRate,compact:!0})]})]}),e.jsxs("div",{className:"hidden lg:block",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Vue Desktop"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(t,{kpi:a.visits}),e.jsx(t,{kpi:a.confirmationRate})]})]})]}),parameters:{docs:{description:{story:"Adaptation du layout selon la taille d'écran."}}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    kpi: sampleKPIs.visits
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    kpi: sampleKPIs.confirmationRate
  }
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    kpi: sampleKPIs.visits
  }
}`,...g.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    kpi: sampleKPIs.speakers,
    compact: true
  }
}`,...u.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    kpi: {
      ...sampleKPIs.visits,
      value: 0
    }
  }
}`,...x.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl'>\r
      <KPICard kpi={sampleKPIs.visits} />\r
      <KPICard kpi={sampleKPIs.confirmationRate} />\r
      <KPICard kpi={sampleKPIs.speakers} />\r
      <KPICard kpi={sampleKPIs.pendingActions} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Vue d'ensemble de toutes les variantes de KPICard."
      }
    }
  }
}`,...v.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl'>\r
      <KPICard kpi={sampleKPIs.visits} />\r
      <KPICard kpi={sampleKPIs.confirmationRate} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'KPI avec calcul automatique des tendances.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl'>\r
      <KPICard kpi={{
      ...sampleKPIs.visits,
      value: 18,
      target: 15
    }} />\r
      <KPICard kpi={{
      ...sampleKPIs.pendingActions,
      value: 0,
      target: 0
    }} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'KPI avec objectifs atteints et barres de progression.'
      }
    }
  }
}`,...y.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div className='space-y-4'>\r
      <p className='text-sm text-gray-600'>\r
        Cliquez sur l'icône 👁️ pour masquer/afficher le widget\r
      </p>\r
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl'>\r
        <KPICard {...args} kpi={sampleKPIs.visits} onToggleVisibility={id => console.log('Toggle visibility:', id)} />\r
        <KPICard {...args} kpi={sampleKPIs.confirmationRate} onToggleVisibility={id => console.log('Toggle visibility:', id)} />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'KPICard interactifs avec gestion de visibilité.'
      }
    }
  }
}`,...f.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className='space-y-8'>\r
      {/* Mobile */}\r
      <div className='block lg:hidden'>\r
        <h3 className='text-lg font-semibold mb-4'>Vue Mobile</h3>\r
        <div className='space-y-3'>\r
          <KPICard kpi={sampleKPIs.visits} compact />\r
          <KPICard kpi={sampleKPIs.confirmationRate} compact />\r
        </div>\r
      </div>\r
\r
      {/* Desktop */}\r
      <div className='hidden lg:block'>\r
        <h3 className='text-lg font-semibold mb-4'>Vue Desktop</h3>\r
        <div className='grid grid-cols-2 gap-4'>\r
          <KPICard kpi={sampleKPIs.visits} />\r
          <KPICard kpi={sampleKPIs.confirmationRate} />\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Adaptation du layout selon la taille d'écran."
      }
    }
  }
}`,...b.parameters?.docs?.source}}};const me=["Default","WithTrend","WithTarget","Compact","LoadingState","AllVariants","TrendsOnly","Objectives","Interactive","Responsive"];export{v as AllVariants,u as Compact,m as Default,f as Interactive,x as LoadingState,y as Objectives,b as Responsive,h as TrendsOnly,g as WithTarget,p as WithTrend,me as __namedExportsOrder,le as default};
