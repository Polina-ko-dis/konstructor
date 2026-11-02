import React,{useState} from 'react';
import {Text,Label,Button,Badge,Separator,Field,Textarea,WarningDialogWindow} from '@reactor/reactor';

import SidebarWindow from './GuardedSidebar';

const referenceDescription='[Описание услуги, которое скорее всего занимает целый абзац, потому чсто состоит из нескольких предложений. Возможна даже там есть список.]';

export default function ServiceDetails({service,onClose,onSave}){
 const [editing,setEditing]=useState(false);
 const [name,setName]=useState(service.name);
 const [description,setDescription]=useState(service.description??referenceDescription);
 const [confirm,setConfirm]=useState(false);
 const dirty=name!==service.name||description!==(service.description??referenceDescription);
 const close=()=>{if(editing&&dirty)setConfirm(true);else onClose()};
 const cancelEdit=()=>{setName(service.name);setDescription(service.description??referenceDescription);setEditing(false)};
 return <>
  <SidebarWindow width={753} header={service.name} state={[true,v=>{if(!v)close()}]} footer={<div className="service-details-footer">{editing?<><Button type="primary" text="Сохранить" disabled={!name.trim()} onClick={()=>{onSave({...service,name:name.trim(),description});setEditing(false)}}/><Button text="Отмена" onClick={cancelEdit}/></>:<><Button type="primary" text="Закрыть" onClick={close}/><Button icon="edit" text="Редактировать услугу" onClick={()=>setEditing(true)}/></>}</div>}>
   <div className="service-details-body">
    {editing&&<div className="service-detail-row"><Label text="Название"/><Field value={name} onChange={setName} size="stretch"/></div>}
    <div className="service-detail-row"><Label text="Описание"/>{editing?<Textarea value={description} onChange={setDescription} size="stretch"/>:<Text text={description}/>}</div>
    <div className="service-detail-row"><Label text="Фото"/><div className="service-detail-photos">{[0,1].map(index=><div className="service-detail-photo" key={index}><img src={import.meta.env.BASE_URL+"assets/service-detail-photo.png"} alt={'Фото услуги '+(index+1)}/></div>)}</div></div>
    <Separator/>
    <div className="service-detail-row"><Label text="Где продаётся"/><div className="service-detail-channels"><Badge color="orange" text="TL:BE"/><Badge color="light-green" text="Витрина"/></div></div>
   </div>
  </SidebarWindow>
  <WarningDialogWindow header="Сохранить изменения?" state={[confirm,setConfirm]} footer={<div className="unsaved-actions"><Button type="primary" text="Сохранить и закрыть" disabled={!name.trim()} onClick={()=>{onSave({...service,name:name.trim(),description});onClose()}}/><Button text="Не сохранять" onClick={onClose}/></div>}><Text text="В услуге есть несохранённые изменения."/></WarningDialogWindow>
 </>;
}
