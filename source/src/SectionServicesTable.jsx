import React,{useEffect,useRef,useState} from 'react';
import {Checkbox,CoreButton,Icon} from '@reactor/reactor';
import {Table} from '@reactor/table';

// Reorder only the visible slots so filtered-out services retain their positions.
export function reorderVisibleServices(selected,visible,source,target){
 const from=visible.indexOf(source),to=visible.indexOf(target);
 if(from<0||to<0||from===to)return selected;
 const ordered=[...visible];ordered.splice(to,0,ordered.splice(from,1)[0]);
 const included=new Set(visible);let index=0;
 return selected.map(id=>included.has(id)?ordered[index++]:id);
}

export default function SectionServicesTable({services,selected,onToggle,onReorder,sortable}){
 const [drag,setDrag]=useState(null);
 const cleanup=useRef(()=>{});
 useEffect(()=>()=>cleanup.current(),[]);
 const visible=services.map(service=>service.id);
 function start(event,id){
  if(event.button!==0||services.length<2)return;
  event.preventDefault();
  const handle=event.currentTarget;
  let target=id;
  setDrag({source:id,target:id});
  function move(e){
   const row=document.elementFromPoint(e.clientX,e.clientY)?.closest('tr');
   const next=row?.querySelector('[data-service-id]')?.dataset.serviceId;
   if(visible.includes(next)){target=next;setDrag({source:id,target:next})}
  }
  function end(e){
   move(e);cleanup.current();setDrag(null);
   onReorder(reorderVisibleServices(selected,visible,id,target));
   handle.focus();
  }
  function cancel(){cleanup.current();setDrag(null)}
  window.addEventListener('pointermove',move);
  window.addEventListener('pointerup',end);
  window.addEventListener('pointercancel',cancel);
  cleanup.current=()=>{
   window.removeEventListener('pointermove',move);
   window.removeEventListener('pointerup',end);
   window.removeEventListener('pointercancel',cancel);
  };
 }
 return <Table width="100%" stickyNoTop fixed head={{key:'services-head',cells:[...(sortable?[{content:'',width:40}]:[]),{content:'Услуга',width:'68%'},'Группа услуг']}} rows={services.map((s,index)=>({key:s.id,background:selected.includes(s.id)?'info':undefined,cells:[...(sortable?[{className:drag?.target===s.id?'service-drop-target':'',content:<CoreButton role="button" aria-label={'Переместить услугу «'+s.name+'»'} title="Перетащите для изменения порядка. С клавиатуры — стрелки вверх и вниз." decoration={["service-drag-handle"]} data-service-id={s.id} onPointerDown={e=>start(e,s.id)} onKeyDown={e=>{
 if(!['ArrowUp','ArrowDown'].includes(e.key))return;
 e.preventDefault();const target=visible[index+(e.key==='ArrowUp'?-1:1)];
 if(target)onReorder(reorderVisibleServices(selected,visible,s.id,target));
 }}><Icon name="more-vert"/></CoreButton>}]:[]),<Checkbox label={s.name} value={selected.includes(s.id)} onChange={()=>onToggle(s.id)}/>,s.group?.trim()||'—']}))}/>;
}
