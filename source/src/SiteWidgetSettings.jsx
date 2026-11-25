import React,{useEffect,useRef,useState} from 'react';
import {Button,InfoAlert,InfoDialogWindow,Label,Radio,Switch,Text} from '@reactor/reactor';
import SidebarWindow from './GuardedSidebar';
import IconPickerSidebar from './IconPickerSidebar';
import {widgetPictures,widgetIconDirectory,defaultWidgetIcon} from './widgetIcons';

const positionOptions=[
 {id:'middle-left',text:'По середине слева'},
 {id:'middle-right',text:'По середине справа'},
 {id:'bottom-left',text:'Внизу слева'},
 {id:'bottom-right',text:'Внизу справа'}
];
const sizes=[{id:'S',pixels:58},{id:'M',pixels:88},{id:'L',pixels:116}];
const publishDialogSize=()=>({minWidth:600,maxWidth:600});

export default function SiteWidgetSettings({onSaved,variant='single'}){
 const singleWidget=variant==='single';
 const positions=singleWidget?positionOptions:[...positionOptions].reverse();
 const [open,setOpen]=useState(false);
 const [picker,setPicker]=useState(false);
 const [publishConfirm,setPublishConfirm]=useState(false);
 const [settings,setSettings]=useState({enabled:false,position:singleWidget?'middle-right':'bottom-right',icon:singleWidget?defaultWidgetIcon:'',size:'M'});
 const [draft,setDraft]=useState(settings);
 const trigger=useRef(null);
 const iconTrigger=useRef(null);
 const saveTrigger=useRef(null);
 const returnToIcon=useRef(false);
 const returnToSave=useRef(false);
 const body=useRef(null);
 const visible=useRef(false);
 const changeOpen=value=>{visible.current=value;if(value)setDraft(settings);else{setPicker(false);setPublishConfirm(false);returnToIcon.current=false;returnToSave.current=false}setOpen(value);if(!value)requestAnimationFrame(()=>{if(!visible.current)trigger.current?.focus()})};
 const previewLink={href:singleWidget?'https://polina-ko-dis.github.io/widget-test/d-solo/':'https://polina-ko-dis.github.io/widget-test/c/',target:'_blank',rel:'noopener noreferrer'};
 const saveSettings=()=>{setSettings({...draft});onSaved();changeOpen(false)};
 const appearanceText=singleWidget?'Цвет виджета будет соответствовать цвету кнопок с вашего Модуля бронирования Travelline. Отображение виджета на сайте можно проверить до сохранения.':'Цвет и стили виджета будут соответствовать стилям формы бронирования';
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
   // The installed DialogWindow does not forward tag to its card; locate it through our footer.
   card=publishConfirm?document.querySelector('.widget-publish-actions')?.closest('[class*="_popup_"]'):picker?document.querySelector('[tag="widget-icon-picker"]'):body.current?.closest('[tag="site-widget-settings"]');
   if(!card)return;
   if(publishConfirm)card.setAttribute('tag','widget-publish-confirmation');
   card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-label',publishConfirm?'Публикация виджета':picker?'Выберите иконку':'Настройка виджета');
   const initialFocus=publishConfirm?card.querySelector('.widget-publish-actions [tabindex="0"]'):picker?(card.querySelector('[role="radio"][aria-checked="true"]')||card.querySelector('[role="radio"]')):returnToSave.current?saveTrigger.current:returnToIcon.current?iconTrigger.current:card.querySelector('[role="switch"]');
   initialFocus?.focus();
   if(!picker)returnToIcon.current=false;
   if(!publishConfirm)returnToSave.current=false;
   card.addEventListener('keydown',containFocus);
  });
  return()=>{cancelAnimationFrame(frame);card?.removeEventListener('keydown',containFocus)};
 },[open,picker,publishConfirm]);
 const selectPosition=position=>setDraft(value=>({...value,position}));
 const navigatePositions=event=>{
  const step={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];
  if(step===undefined&&event.key!=='Home'&&event.key!=='End')return;
  event.preventDefault();
  const index=event.key==='Home'?0:event.key==='End'?positions.length-1:(positions.findIndex(p=>p.id===draft.position)+step+positions.length)%positions.length;
  selectPosition(positions[index].id);
  event.currentTarget.querySelectorAll('[role="radio"]')[index]?.focus();
 };
 const selectSize=size=>setDraft(value=>({...value,size}));
 const navigateSizes=event=>{
  const step={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];
  if(step===undefined&&event.key!=='Home'&&event.key!=='End')return;
  event.preventDefault();
  const index=event.key==='Home'?0:event.key==='End'?sizes.length-1:(sizes.findIndex(size=>size.id===draft.size)+step+sizes.length)%sizes.length;
  selectSize(sizes[index].id);
  event.currentTarget.querySelectorAll('[role="radio"]')[index]?.focus();
 };
 return <SidebarWindow tag="site-widget-settings" header="Настройка виджета" width={600} shifted={picker} state={[open,changeOpen]} trigger={<Button ref={trigger} type="primary" text="Виджет для сайта"/>} footer={({close})=><div className="widget-settings-footer">
  <Button ref={saveTrigger} type="primary" text="Сохранить" onClick={singleWidget?()=>{returnToSave.current=true;setPublishConfirm(true)}:saveSettings}/>
  <Button text="Посмотреть на сайте" link={previewLink}/>
  <Button text="Отмена" onClick={close}/>
 </div>}>
  <div className="widget-settings-body" ref={body}>
   {!singleWidget&&<InfoAlert text={appearanceText}/>}
   <Switch accent={singleWidget||draft.enabled} label="Активация виджета витрины на сайте" aria-label="Активация виджета витрины на сайте" role="switch" aria-checked={draft.enabled} value={draft.enabled} onChange={enabled=>setDraft(value=>({...value,enabled}))}/>
   {singleWidget&&<section className="widget-position-section" aria-labelledby="widget-appearance-heading">
    <div id="widget-appearance-heading"><Text text="Вид виджета" typography="subtitle"/></div>
    <InfoAlert text={appearanceText}/>
    <div className="form-row">
     <Label text="Иконка"/>
     <div className="illustration-field">
      {draft.icon&&<img className="chosen-picture" src={import.meta.env.BASE_URL+widgetIconDirectory+'/'+draft.icon+'.svg'} alt={widgetPictures.find(([id])=>id===draft.icon)?.[1]}/>}
      <Button ref={iconTrigger} type="link" text={draft.icon?'Изменить':'Выбрать'} onClick={()=>{returnToIcon.current=true;setPicker(true)}}/>
     </div>
    </div>
    <div className="form-row widget-size-row">
     <div id="widget-size-label"><Label text="Размер"/></div>
     <div className="widget-size-options" role="radiogroup" aria-labelledby="widget-size-label" onKeyDown={navigateSizes}>
      {sizes.map(size=><Radio key={size.id} label={`${size.id} (${size.pixels} px)`} aria-label={`${size.id} (${size.pixels} px)`} role="radio" aria-checked={draft.size===size.id} tabIndex={draft.size===size.id?0:-1} value={draft.size===size.id} onChange={()=>selectSize(size.id)}/>)}
     </div>
    </div>
   </section>}
   <section className="widget-position-section" aria-labelledby="widget-position-heading">
    <div id="widget-position-heading"><Text text="Расположение виджета на сайте" typography="subtitle"/></div>
    <div className="widget-position-grid" role="radiogroup" aria-labelledby="widget-position-heading" onKeyDown={navigatePositions}>
     {positions.map(position=><div className="widget-position-option" key={position.id}>
      <Radio label={position.text} aria-label={position.text} role="radio" aria-checked={draft.position===position.id} tabIndex={draft.position===position.id?0:-1} value={draft.position===position.id} onChange={()=>selectPosition(position.id)}/>
      <div className={'widget-position-preview widget-position-'+position.id+(singleWidget?' widget-position-preview-static':'')} aria-hidden="true" onClick={singleWidget?undefined:()=>selectPosition(position.id)}><span className="widget-position-marker"/></div>
     </div>)}
    </div>
   </section>
  </div>
  {picker&&<IconPickerSidebar tag="widget-icon-picker" width={600} infoText={appearanceText} imageDirectory={widgetIconDirectory} pictures={widgetPictures} value={draft.icon} onApply={icon=>{setDraft(value=>({...value,icon}));setPicker(false)}} onClose={()=>setPicker(false)}/>}
  {singleWidget&&<InfoDialogWindow tag="widget-publish-confirmation" header="Публикация виджета" title="После сохранения виджет появится на сайте" size={publishDialogSize} trigger={<span/>} state={[publishConfirm,setPublishConfirm]} footer={<div className="unsaved-actions widget-publish-actions">
   <Button type="primary" text="Сохранить и опубликовать" onClick={saveSettings}/>
   <Button text="Проверить" onClick={()=>{window.open(previewLink.href,'_blank','noopener,noreferrer');setPublishConfirm(false)}}/>
   <Button text="Закрыть" onClick={()=>setPublishConfirm(false)}/>
  </div>}><Text text="Перед сохранением рекомендуем проверить расположение виджета на сайте и его взаимодействие со сторонними виджетами."/></InfoDialogWindow>}
 </SidebarWindow>;
}
