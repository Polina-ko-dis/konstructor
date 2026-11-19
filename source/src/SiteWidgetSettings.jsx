import React,{useEffect,useRef,useState} from 'react';
import {Button,InfoAlert,Radio,Switch,Text} from '@reactor/reactor';
import SidebarWindow from './GuardedSidebar';

const positions=[
 {id:'bottom-right',text:'Внизу справа'},
 {id:'bottom-left',text:'Внизу слева'},
 {id:'middle-right',text:'По середине справа'},
 {id:'middle-left',text:'По середине слева'}
];

export default function SiteWidgetSettings({onSaved}){
 const [open,setOpen]=useState(false);
 const [settings,setSettings]=useState({enabled:false,position:'bottom-right'});
 const [draft,setDraft]=useState(settings);
 const trigger=useRef(null);
 const body=useRef(null);
 const visible=useRef(false);
 const changeOpen=value=>{visible.current=value;if(value)setDraft(settings);setOpen(value);if(!value)requestAnimationFrame(()=>{if(!visible.current)trigger.current?.focus()})};
 // The installed Reactor sidebar does not move or contain focus itself.
 useEffect(()=>{
  if(!open)return;
  let card;
  const containFocus=event=>{
   if(event.key!=='Tab')return;
   const controls=[...card.querySelectorAll('[tabindex="0"],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(control=>control.getAttribute('aria-disabled')!=='true');
   const first=controls[0],last=controls[controls.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
  };
  const frame=requestAnimationFrame(()=>{
   if(!visible.current)return;
   card=body.current?.closest('[tag="site-widget-settings"]');
   if(!card)return;
   card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-label','Настройка виджета');
   card.querySelector('[role="switch"]')?.focus();
   card.addEventListener('keydown',containFocus);
  });
  return()=>{cancelAnimationFrame(frame);card?.removeEventListener('keydown',containFocus)};
 },[open]);
 const selectPosition=position=>setDraft(value=>({...value,position}));
 const navigatePositions=event=>{
  const step={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];
  if(step===undefined&&event.key!=='Home'&&event.key!=='End')return;
  event.preventDefault();
  const index=event.key==='Home'?0:event.key==='End'?positions.length-1:(positions.findIndex(p=>p.id===draft.position)+step+positions.length)%positions.length;
  selectPosition(positions[index].id);
  event.currentTarget.querySelectorAll('[role="radio"]')[index]?.focus();
 };
 const actions={
  closeOnPrimary:true,
  primary:{text:'Сохранить',onClick:()=>{setSettings({...draft});onSaved()}},
  cancel:{text:'Отмена'}
 };
 return <SidebarWindow tag="site-widget-settings" header="Настройка виджета" width={600} state={[open,changeOpen]} trigger={<Button ref={trigger} type="primary" text="Виджет для сайта"/>} actions={actions}>
  <div className="widget-settings-body" ref={body}>
   <InfoAlert text="Цвет иконки будет соответствовать основному цвету формы бронирования."/>
   <Switch accent={draft.enabled} label="Активация виджета витрины на сайте" aria-label="Активация виджета витрины на сайте" role="switch" aria-checked={draft.enabled} value={draft.enabled} onChange={enabled=>setDraft(value=>({...value,enabled}))}/>
   <section className="widget-position-section" aria-labelledby="widget-position-heading">
    <div id="widget-position-heading"><Text text="Расположение виджета на сайте" typography="subtitle"/></div>
    <div className="widget-position-grid" role="radiogroup" aria-labelledby="widget-position-heading" onKeyDown={navigatePositions}>
     {positions.map(position=><div className="widget-position-option" key={position.id}>
      <Radio label={position.text} aria-label={position.text} role="radio" aria-checked={draft.position===position.id} tabIndex={draft.position===position.id?0:-1} value={draft.position===position.id} onChange={()=>selectPosition(position.id)}/>
      <div className={'widget-position-preview widget-position-'+position.id} aria-hidden="true" onClick={()=>selectPosition(position.id)}><span className="widget-position-marker"/></div>
     </div>)}
    </div>
   </section>
  </div>
 </SidebarWindow>;
}
