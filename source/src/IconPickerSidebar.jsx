import React,{useState} from 'react';
import {InfoAlert,Radio,Text} from '@reactor/reactor';
import SidebarWindow from './GuardedSidebar';

// Reactor closes other windows on open unless the new one has a parent; the trigger inside its sidebar establishes that parent.
// The choice applies only by the primary button.
export default function IconPickerSidebar({pictures,value,onApply,onClose,tag,width=753,imageDirectory='assets/section-icons',infoText='На витрине цвет иконок подстроится под стиль сайта отеля. Здесь показан нейтральный шаблон.'}){
 const [draft,setDraft]=useState(value);
 const actions={primary:{text:'Применить',disabled:!draft,onClick:()=>{onApply(draft);return false}},cancel:{text:'Отмена',onClick:()=>{onClose();return false}}};
 return <SidebarWindow tag={tag} header="Выберите иконку" width={width} nested trigger={<span/>} state={[true,v=>{if(!v)onClose()}]} actions={actions}>
  <div className="icon-picker-body"><InfoAlert text={infoText}/>
  {pictures.length===0&&<Text text="Все иконки уже используются в других разделах" color="neutral"/>}
  <div className="picture-grid">{pictures.map(([id,title])=><div className="picture-option" key={id}><Radio role="radio" aria-label={title} aria-checked={draft===id} value={draft===id} onChange={()=>setDraft(id)}/><img src={import.meta.env.BASE_URL+imageDirectory+'/'+id+'.svg'} alt={title} onClick={()=>setDraft(id)}/></div>)}</div></div>
 </SidebarWindow>;
}
