import React,{useState} from 'react';
import {Button,ModalWindow,OptionCheckbox,Text,TileHeader} from '@reactor/reactor';

const modalSize=()=>{const width=Math.min(600,window.innerWidth-32);return {minWidth:width,maxWidth:width}};

export default function AddToSectionDialog({service,sections,onClose,onConfirm}){
 const [targets,setTargets]=useState([]);
 const current=sections.filter(s=>s.ids.includes(service.serviceId));
 const available=sections.filter(s=>!current.includes(s));
 const toggle=name=>setTargets(prev=>prev.includes(name)?prev.filter(v=>v!==name):[...prev,name]);
 return <ModalWindow size={modalSize} header={<TileHeader text="Добавить в раздел" subtitle={'Услуга «'+service.name.replaceAll('«','„').replaceAll('»','“')+'»'}/>} state={[true,v=>{if(!v)onClose()}]} footer={<div className="unsaved-actions"><Button type="primary" text="Добавить" disabled={targets.length===0} onClick={()=>onConfirm(available.map(s=>s.name).filter(name=>targets.includes(name)))}/><Button text="Отмена" onClick={onClose}/></div>}>
  <div className="add-to-section-body">{current.length>0&&<Text text={(current.length>1?'Услуга уже находится в разделах: ':'Услуга уже находится в разделе: ')+current.map(s=>'«'+s.name+'»').join(', ')} typography="caption" color="neutral"/>}<div className="add-to-section-list">{available.map(s=><OptionCheckbox key={s.name} text={s.name} selected={targets.includes(s.name)} onClick={()=>toggle(s.name)}/>)}</div></div>
 </ModalWindow>;
}
