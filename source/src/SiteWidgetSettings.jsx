import React,{useEffect,useRef,useState} from 'react';
import {Button,DialogWindow,InfoAlert,Label,Radio,Row,Switch,Text,Tile} from '@reactor/reactor';
import SidebarWindow from './GuardedSidebar';
import IconPickerSidebar from './IconPickerSidebar';
import {widgetPictures,widgetIconDirectory,defaultWidgetIcon} from './widgetIcons';

const positionOptions=[
 {id:'middle-left',text:'Слева по центру'},
 {id:'middle-right',text:'Справа по центру'},
 {id:'bottom-left',text:'Слева внизу'},
 {id:'bottom-right',text:'Справа внизу'}
];
const sizes=[{id:'S'},{id:'M'},{id:'L'}];
const displayDialogSize=()=>({minWidth:600,maxWidth:600});
const chatSettingsUrl='https://www.qatl.ru/app/AiChatExtranet/#/opportunity/AiChatManagement/';

export default function SiteWidgetSettings({onSaved,variant='single'}){
 const singleWidget=variant==='single';
 const positions=positionOptions;
 const [open,setOpen]=useState(false);
 const [picker,setPicker]=useState(false);
 const [displayConfirmation,setDisplayConfirmation]=useState(null);
 const displayConfirmOpen=displayConfirmation!==null;
 const deactivating=displayConfirmation==='deactivate';
 const confirmationHeader=deactivating?'Деактивация виджета':'Активация виджета';
 const [enabled,setEnabled]=useState(false);
 const [settings,setSettings]=useState({position:'middle-right',icon:defaultWidgetIcon,size:'M'});
 const [draft,setDraft]=useState(settings);
 const [hasSaved,setHasSaved]=useState(false);
 const canPreview=hasSaved&&draft.icon===settings.icon&&draft.size===settings.size&&draft.position===settings.position;
 const previewDisabledHint='Сохраните изменения перед просмотром';
 const trigger=useRef(null);
 const activationTrigger=useRef(null);
 const iconTrigger=useRef(null);
 const returnToControl=useRef(null);
 const body=useRef(null);
 const visible=useRef(false);
 const changeOpen=value=>{visible.current=value;if(value)setDraft(settings);else{setPicker(false);setDisplayConfirmation(null);returnToControl.current=null}setOpen(value);if(!value)requestAnimationFrame(()=>{if(!visible.current)trigger.current?.focus()})};
 const previewLink={href:singleWidget?'https://polina-ko-dis.github.io/widget-test/d-solo/':'https://polina-ko-dis.github.io/widget-test/c/',target:'_blank',rel:'noopener noreferrer'};
 const saveSettings=()=>{setSettings({...draft});setHasSaved(true);onSaved()};
 const changeEnabled=value=>{returnToControl.current=activationTrigger.current;setDisplayConfirmation(value?'activate':'deactivate')};
 const closeDisplayConfirmation=()=>setDisplayConfirmation(null);
 const appearanceText='Цвет виджета будет соответствовать цвету кнопок с вашего Модуля бронирования Travelline. Отображение виджета на сайте можно проверить после сохранения настроек.';
 // The installed Reactor sidebar does not move or contain focus itself.
 useEffect(()=>{
  if(!open&&!displayConfirmOpen){
   const frame=requestAnimationFrame(()=>{returnToControl.current?.focus();returnToControl.current=null});
   return()=>cancelAnimationFrame(frame);
  }
  let card;
  const containFocus=event=>{
   if(event.key!=='Tab')return;
   const controls=[...card.querySelectorAll('[tabindex="0"],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(control=>control.getAttribute('aria-disabled')!=='true');
   const first=controls[0],last=controls[controls.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
  };
  const frame=requestAnimationFrame(()=>{
   if(!visible.current&&!displayConfirmOpen)return;
   // The installed DialogWindow does not forward tag to its card; locate it through our footer.
   card=displayConfirmOpen?document.querySelector('.widget-display-confirmation-actions')?.closest('[class*="_popup_"]'):picker?document.querySelector('[tag="widget-icon-picker"]'):body.current?.closest('[tag="site-widget-settings"]');
   if(!card)return;
   if(displayConfirmOpen)card.setAttribute('tag',deactivating?'widget-deactivation-confirmation':'widget-activation-confirmation');
   card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-label',displayConfirmOpen?confirmationHeader:picker?'Выберите иконку':'Настройка виджета');
   const initialFocus=displayConfirmOpen?card.querySelector('.widget-display-confirmation-actions [tabindex="0"]'):picker?(card.querySelector('[role="radio"][aria-checked="true"]')||card.querySelector('[role="radio"]')):returnToControl.current||iconTrigger.current;
   initialFocus?.focus();
   if(!displayConfirmOpen)returnToControl.current=null;
   card.addEventListener('keydown',containFocus);
  });
  return()=>{cancelAnimationFrame(frame);card?.removeEventListener('keydown',containFocus)};
 },[open,picker,displayConfirmation]);
 const selectPosition=position=>{if(singleWidget)setDraft(value=>({...value,position}))};
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
 return <div className="widget-display-card" role="group" aria-label="Отображение виджета на сайте">
  <Tile>
   <div className="widget-display-actions">
    <Switch refs={{input:node=>{activationTrigger.current=node}}} accent label="Показывать виджет витрины на сайте" aria-label="Показывать виджет витрины на сайте" role="switch" aria-checked={enabled} value={enabled} onChange={changeEnabled}/>
    <Button ref={trigger} type="link" icon="settings" text="Настроить виджет" onClick={()=>changeOpen(true)}/>
   </div>
  </Tile>
  <SidebarWindow tag="site-widget-settings" header="Настройка виджета" width={600} shifted={picker} state={[open,changeOpen]} trigger={<span/>} footer={({close})=><div className="widget-settings-footer">
  <Button type="primary" text={enabled?'Сохранить и опубликовать':'Сохранить'} onClick={saveSettings}/>
  <Button text="Посмотреть на сайте" disabled={!canPreview} disabledHint={previewDisabledHint} link={canPreview?previewLink:undefined}/>
  <Button text="Отмена" onClick={close}/>
 </div>}>
  <div className="widget-settings-body" ref={body}>
   <section className="widget-position-section" aria-labelledby="widget-appearance-heading">
    <div id="widget-appearance-heading"><Text text="Вид виджета" typography="subtitle"/></div>
    <div className="form-row">
     <Label text="Иконка"/>
     <div className="illustration-field">
      {draft.icon&&<img className="chosen-picture" src={import.meta.env.BASE_URL+widgetIconDirectory+'/'+draft.icon+'.svg'} alt={widgetPictures.find(([id])=>id===draft.icon)?.[1]}/>}
      <Button ref={iconTrigger} type="link" text={draft.icon?'Изменить':'Выбрать'} onClick={()=>setPicker(true)}/>
     </div>
    </div>
    {singleWidget&&<div className="form-row widget-size-row">
     <div id="widget-size-label"><Label text="Размер"/></div>
     <div className="widget-size-options" role="radiogroup" aria-labelledby="widget-size-label" onKeyDown={navigateSizes}>
      {sizes.map(size=><Radio key={size.id} label={size.id} aria-label={size.id} role="radio" aria-checked={draft.size===size.id} tabIndex={draft.size===size.id?0:-1} value={draft.size===size.id} onChange={()=>selectSize(size.id)}/>)}
     </div>
    </div>}
   </section>
   <section className="widget-position-section" aria-labelledby="widget-position-heading">
    <div id="widget-position-heading"><Text text="Расположение на экране" typography="subtitle"/></div>
    {!singleWidget&&<div id="widget-chat-position-note"><InfoAlert text={`Виджет витрины размещается вместе с виджетом ИИ-помощника. Настроить общее положение на сайте можно <a href="${chatSettingsUrl}" target="_blank" rel="noopener noreferrer"><u>в разделе Помощник</u></a>`}/></div>}
    <div className={'widget-position-grid'+(singleWidget?'':' widget-position-grid-group')} role="radiogroup" aria-labelledby="widget-position-heading" aria-describedby={singleWidget?undefined:'widget-chat-position-note'} onKeyDown={singleWidget?navigatePositions:undefined}>
     {positions.map(position=><div className={'widget-position-option'+(singleWidget?' widget-position-option-selectable':'')} key={position.id} onClick={singleWidget?event=>{selectPosition(position.id);event.currentTarget.querySelector('[role="radio"]')?.focus()}:undefined}>
      <Row noGrow alignItems="center" gap={8}>
       <Radio disabled={!singleWidget} label={singleWidget?position.text:undefined} aria-label={position.text} role="radio" aria-checked={draft.position===position.id} tabIndex={singleWidget&&draft.position===position.id?0:-1} value={draft.position===position.id} onChange={()=>selectPosition(position.id)}/>
       {!singleWidget&&<Text text={position.text}/>}
      </Row>
      <div className={'widget-position-preview widget-position-'+position.id+(singleWidget?'':' widget-position-preview-static')} aria-hidden="true">
       <span className="widget-position-site-header"/>
       <span className="widget-position-site-banner"/>
       <span className="widget-position-site-cards"><span/><span/><span/></span>
       <span className="widget-position-marker"/>
      </div>
     </div>)}
    </div>
   </section>
  </div>
  {picker&&<IconPickerSidebar tag="widget-icon-picker" width={600} infoText={appearanceText} imageDirectory={widgetIconDirectory} pictures={widgetPictures} value={draft.icon} onApply={icon=>{setDraft(value=>({...value,icon}));setPicker(false)}} onClose={()=>setPicker(false)}/>}
  </SidebarWindow>
  <DialogWindow type={deactivating?'warning':'info'} tag={deactivating?'widget-deactivation-confirmation':'widget-activation-confirmation'} header={confirmationHeader} title={deactivating?'Деактивировать виджет?':'Активировать виджет?'} size={displayDialogSize} trigger={<span/>} state={[displayConfirmOpen,value=>{if(!value)closeDisplayConfirmation()}]} footer={<div className="unsaved-actions widget-display-confirmation-actions">
   <Button type="primary" text={deactivating?'Деактивировать':'Активировать и опубликовать'} onClick={()=>{setEnabled(!deactivating);onSaved();closeDisplayConfirmation()}}/>
   {!deactivating&&<Button text="Проверить" disabled={!hasSaved} disabledHint={previewDisabledHint} onClick={()=>{if(hasSaved){window.open(previewLink.href,'_blank','noopener,noreferrer');closeDisplayConfirmation()}}}/>}
   <Button text="Закрыть" onClick={closeDisplayConfirmation}/>
  </div>}><Text text={deactivating?'После деактивации виджет витрины пропадёт с сайта.':'Активируйте виджет, чтобы гости могли открывать витрину с вашего сайта. Перед активацией рекомендуем проверить, как виджет отображается на сайте, и убедиться, что другие виджеты его не перекрывают.'}/></DialogWindow>
 </div>;
}
