import React,{useState} from 'react';
import {DashedButton,Field,Icon,IconButton,OptionRadio,SelectCard,Text} from '@reactor/reactor';

export const CUSTOM_SECTION='custom';
const focusOnOpen=el=>el?.focus?.();

// Reactor SelectPopup has no slot under the list; same search and radio items plus the add action (Figma 15225:15825).
export default function SectionSelectPopup({options,value,onChange}){
 const [query,setQuery]=useState('');
 const search=query.trim().toLowerCase();
 const items=options.filter(o=>o.value&&o.value!==CUSTOM_SECTION&&o.text.toLowerCase().includes(search));
 return <div className="section-select-popup"><div className="section-select-search"><Field value={query} onChange={setQuery} prefix={<Icon name="search"/>} suffix={query?<IconButton icon="cancel" hint="Очистить поиск" onClick={()=>setQuery('')}/>:undefined} refs={{input:focusOnOpen}} size="stretch"/></div><SelectCard>{search&&items.length===0&&<div className="section-select-empty"><Text text="Совпадений не найдено" color="neutral"/></div>}{items.map(o=><OptionRadio key={o.value} text={o.text} selected={value===o.value} onClick={()=>onChange(o.value)}/>)}<div className="section-select-add"><DashedButton icon="add" text="Свой раздел" onClick={()=>onChange(CUSTOM_SECTION)}/></div></SelectCard></div>;
}
