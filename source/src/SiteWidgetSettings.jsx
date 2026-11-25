import React,{useEffect,useRef,useState} from 'react';
import {Button,InfoAlert,Radio,Switch,Text} from '@reactor/reactor';
import SidebarWindow from './GuardedSidebar';
import IconPickerSidebar from './IconPickerSidebar';
import {pictures} from './data';

const positions=[
 {id:'bottom-right',text:'Внизу справа'},
 {id:'bottom-left',text:'Внизу слева'},
 {id:'middle-right',text:'По середине справа'},
 {id:'middle-left',text:'По середине слева'}
];

export default function SiteWidgetSettings({onSaved,variant='single'}){
 const singleWidget=variant==='single';
 const [open,setOpen]=useState(false);
 const [picker,setPicker]=useState(false);
 const [settings,setSettings]=useState({enabled:false,position:'bottom-right',icon:''});
 const [draft,setDraft]=useState(settings);
 const trigger=useRef(null);
 const iconTrigger=useRef(null);
 const returnToIcon=useRef(false);
 const body=useRef(null);
 const visible=useRef(false);
 const changeOpen=value=>{visible.current=value;if(value)setDraft(settings);else{setPicker(false);returnToIcon.current=false}setOpen(value);if(!value)requestAnimationFrame(()=>{if(!visible.current)trigger.current?.focus()})};
 const appearanceText=singleWidget?'Цвет и стили виджета будут соответствовать стилям Модуля бронирования Travelline':'Цвет и стили виджета будут соответствовать стилям формы бронирования';
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
   card=picker?document.querySelector('[tag="widget-icon-picker"]'):body.current?.closest('[tag="site-widget-settings"]');
   if(!card)return;
   card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-label',picker?'Выберите иконку':'Настройка виджета');
   const initialFocus=picker?(card.querySelector('[role="radio"][aria-checked="true"]')||card.querySelector('[role="radio"]')):returnToIcon.current?iconTrigger.current:card.querySelector('[role="switch"]');
   initialFocus?.focus();
   if(!picker)returnToIcon.current=false;
   card.addEventListener('keydown',containFocus);
  });
  return()=>{cancelAnimationFrame(frame);card?.removeEventListener('keydown',containFocus)};
 },[open,picker]);
 const selectPosition=position=>setDraft(value=>({...value,position}));
 const navigatePositions=event=>{
  const step={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];
  if(step===undefined&&event.key!=='Home'&&event.key!=='End')return;
  event.preventDefault();
  const index=event.key==='Home'?0:event.key==='End'?positions.length-1:(positions.findIndex(p=>p.id===draft.position)+step+positions.length)%positions.length;
  selectPosition(positions[index].id);
  event.currentTarget.querySelectorAll('[role="radio"]')[index]?.focus();
 };
 return <SidebarWindow tag="site-widget-settings" header="Настройка виджета" width={600} shifted={picker} state={[open,changeOpen]} trigger={<Button ref={trigger} type="primary" text="Виджет для сайта"/>} footer={({close})=><div className="widget-settings-footer">
  <Button type="primary" text="Сохранить" onClick={()=>{setSettings({...draft});onSaved();close()}}/>
  <Button text="Посмотреть на сайте" link={{href:'https://polina-ko-dis.github.io/widget-test/c/',target:'_blank',rel:'noopener noreferrer'}}/>
  <Button text="Отмена" onClick={close}/>
 </div>}>
  <div className="widget-settings-body" ref={body}>
   <InfoAlert text={appearanceText}/>
   <Switch accent={draft.enabled} label="Активация виджета витрины на сайте" aria-label="Активация виджета витрины на сайте" role="switch" aria-checked={draft.enabled} value={draft.enabled} onChange={enabled=>setDraft(value=>({...value,enabled}))}/>
   {singleWidget&&<section className="widget-position-section" aria-labelledby="widget-icon-heading">
    <div id="widget-icon-heading"><Text text="Иконка виджета" typography="subtitle"/></div>
    <div className="illustration-field">
     {draft.icon&&<img className="chosen-picture" src={import.meta.env.BASE_URL+'assets/section-icons/'+draft.icon+'.svg'} alt={pictures.find(([id])=>id===draft.icon)?.[1]}/>}
     <Button ref={iconTrigger} type="link" text={draft.icon?'Изменить':'Выбрать'} onClick={()=>{returnToIcon.current=true;setPicker(true)}}/>
    </div>
   </section>}
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
  {picker&&<IconPickerSidebar tag="widget-icon-picker" infoText={appearanceText} pictures={pictures} value={draft.icon} onApply={icon=>{setDraft(value=>({...value,icon}));setPicker(false)}} onClose={()=>setPicker(false)}/>}
 </SidebarWindow>;
}
