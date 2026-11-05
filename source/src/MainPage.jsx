import React, {useState} from 'react';
import {Text,PageTop,Button,Icon,Switch,Tile,TileHeader,Link,Badge,InfoDialogWindow,ActionMenu,WarningDialogWindow,WarningAlert} from '@reactor/reactor';
import {Table} from '@reactor/table';
import {services} from './data';
import ServiceDetails from './ServiceDetails';
import StorefrontLink,{ShareLinkDialog,storefrontUrl} from './StorefrontLink';
import AddToSectionDialog from './AddToSectionDialog';

// serviceId links a feed entry to the catalog used by sections; the arrays stay separate demo data.
const feedItems=[['Завтрак «Шведский стол»','Питание0'],['Вход в термальную зону','Баня и бассейн2'],['Парковка','Трансфер и парковка0'],['Аренда квадроцикла','Спорт и отдых1'],['Обед комплексный','Питание3']];

export default function MainPage({noServices=false,loadError=false,sections,setSections,onEdit,onSaved,onNotify}){
 const [feed,setFeed]=useState(feedItems.map(([name,serviceId],i)=>({id:String(i),name,serviceId,visible:true})));
 const [details,setDetails]=useState(null);
 const [deleting,setDeleting]=useState(null);
 const [adding,setAdding]=useState(null);
 const [sharing,setSharing]=useState(null);
 if(noServices)return <main className="page"><PageTop title="Настройки показа"/><Tile decoration={["services-load-error-tile"]}><div className="no-services-state" role="status"><Icon name="room-service" size="md" color="neutral"/><Text text="Услуг на витрине нет" typography="block-title"/><Text text="Создайте услуги в Каталоге услуг и подключите их к витрине, чтобы они были видны гостям"/></div></Tile></main>;
 if(loadError)return <main className="page"><PageTop title="Настройки показа"/><Tile decoration={["services-load-error-tile"]}><div className="services-load-error" role="alert"><Icon name="block" size="xl" color="danger"/><div className="services-load-error-copy"><Text text="Не удалось загрузить страницу" typography="section-title"/><Text text="Обновите страницу. Если ошибка повторится, обратитесь в техподдержку."/><div><Button text="Обновить страницу" onClick={()=>window.location.reload()}/></div></div></div></Tile></main>;
 const sectionHint="Скроет раздел с витрины. Привязанные к нему услуги останутся видны в ленте";
 const serviceHint="Скроет услугу только из ленты. В разделах она останется видна гостям";
 const copyLink=async(param,name,success)=>{try{await navigator.clipboard.writeText(storefrontUrl+'?'+param+'='+encodeURIComponent(name));onNotify(success)}catch{onNotify('Не удалось скопировать ссылку','danger')}};
 const copyDisabledHint=section=>sections.length<2?'Ссылка появится, когда разделов будет минимум 2':section.visible?undefined:'Раздел скрыт с витрины. Включите видимость, чтобы получить ссылку';
 const serviceCopyDisabledHint=service=>service.visible||(sections.length>=2&&sections.some(s=>s.visible&&s.ids.includes(service.serviceId)))?undefined:'Услуга скрыта с витрины. Включите видимость, чтобы скопировать ссылку';
 const addDisabledHint=service=>sections.length===0?'Сначала создайте раздел':sections.every(s=>s.ids.includes(service.serviceId))?'Услуга уже есть во всех разделах':undefined;
 const addToSections=(service,targets)=>{setSections(prev=>prev.map(s=>targets.includes(s.name)?{...s,ids:[...s.ids,service.serviceId]}:s));setAdding(null);onNotify((targets.length>1?'Услуга добавлена в разделы: ':'Услуга добавлена в раздел ')+targets.map(name=>'«'+name+'»').join(', '))};
 const title=(text,subtitle,actions)=><TileHeader text={text} subtitle={<Text text={subtitle} typography="promo-paragraph"/>} actions={actions}/>;
 return <>
  <main className="page">
   <PageTop title="Настройки показа" subtitle={<div className="page-description"><Text text="Задайте структуру и наполнение витрины, чтобы помочь гостям найти нужную услугу" typography="subtitle"/><div className="page-secondary-actions"><StorefrontLink/></div></div>}/>
   <div className="main-tile sections-tile"><Tile header={title('Разделы','Кнопки навигации для быстрого перехода к предложениям на витрине',sections.length>0&&<Button icon="add" text="Создать раздел" onClick={()=>onEdit()}/>)}>
    <>{sections.length===1&&<div className="sections-warning" role="status"><WarningAlert
      text="Создайте не меньше 2 разделов, чтобы навигация появилась на витрине"
    /></div>}{sections.length===0?<div className="sections-empty"><Icon name="folder" size="md" color="neutral"/><div className="sections-empty-copy"><Text text="Пока нет разделов" typography="subtitle"/><Text text="Разделы помогают гостям быстрее находить услуги. Чтобы они появились на витрине, создайте минимум 2 раздела" color="foreground"/></div><Button text="Создать раздел" onClick={()=>onEdit()}/></div>:<Table key={JSON.stringify(sections.map(s=>s.name))} width="100%" fixed draggable stickyNoTop head={{key:'sections-head',cells:[{content:'Видимость',width:108},{content:'Раздел',width:'39.23%'},{content:'Привязано услуг'},{content:'Действие',width:193,hAlign:'right'}]}} rows={sections.map((s,i)=>({key:s.name,cells:[
      <Switch hint={sectionHint} accent={s.visible} selected={s.visible} onClick={()=>{setSections(prev=>prev.map((v,j)=>i===j?{...v,visible:!v.visible}:v));onSaved()}}/>,
      <Link text={s.name} onClick={()=>onEdit(s,i)}/>,
      <Badge color="info" filled text={String(s.ids.length)} hint={{html:true,text:services.filter(service=>s.ids.includes(service.id)).map(service=>"<p>"+service.name.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")+"</p>").join("")||"Нет привязанных услуг"}}/>,
      {content:<ActionMenu actions={[{icon:"edit",text:"Редактировать",onClick:()=>onEdit(s,i)},{icon:"link",text:"Поделиться разделом",onClick:()=>setSharing(s),disabled:Boolean(copyDisabledHint(s)),disabledHint:copyDisabledHint(s)},{icon:"delete",text:"Удалить",onClick:()=>setDeleting(s)}]}/>,hAlign:'right'}
    ]}))}/>}</>
   </Tile></div>
   <div className="main-tile feed-tile"><Tile header={title('Лента всех услуг','Общий порядок карточек при обычном просмотре витрины')}>
    <Table width="100%" fixed draggable stickyNoTop head={{key:'feed-head',cells:[{content:'Видимость',width:108},'Услуга',{content:'Действие',width:193,hAlign:'right'}]}} rows={feed.map(s=>({key:s.id,cells:[
     <Switch hint={serviceHint} accent={s.visible} selected={s.visible} onClick={()=>{setFeed(prev=>prev.map(v=>v.id===s.id?{...v,visible:!v.visible}:v));onSaved()}}/>,
     <Link text={s.name} onClick={()=>setDetails(s)}/>,
     {content:<ActionMenu actions={[{icon:"copy",text:"Копировать ссылку на услугу",onClick:()=>{copyLink('service',s.name,'Ссылка на услугу скопирована')},disabled:Boolean(serviceCopyDisabledHint(s)),disabledHint:serviceCopyDisabledHint(s)},{icon:"add",text:"Добавить в раздел",onClick:()=>setAdding(s),disabled:Boolean(addDisabledHint(s)),disabledHint:addDisabledHint(s)}]}/>,hAlign:'right'}
    ]}))}/>
   </Tile></div>
  </main>
  <WarningDialogWindow header="Удалить раздел?" state={[deleting!==null,v=>{if(!v)setDeleting(null)}]} actions={{primary:{text:'Удалить',onClick:()=>{setSections(prev=>prev.filter(s=>s!==deleting));setDeleting(null);onSaved()}},cancel:{text:'Отмена'}}}><Text text={'Раздел «'+(deleting?.name??'')+'» удалится, но все привязанные к нему услуги останутся видны гостям'}/></WarningDialogWindow>
  {sharing&&<ShareLinkDialog open setOpen={v=>{if(!v)setSharing(null)}} url={storefrontUrl+'?section='+encodeURIComponent(sharing.name)} header="Поделиться разделом" qrTitle="QR-код для стойки и номеров" linkLabel="Ссылка для сайта и чатов" qrAlt="QR-код ссылки на раздел" fileName="section-qr.png"/>}
  {adding&&<AddToSectionDialog key={adding.id} service={adding} sections={sections} onClose={()=>setAdding(null)} onConfirm={targets=>addToSections(adding,targets)}/>}
  {details&&<ServiceDetails key={details.id} service={details} onClose={()=>setDetails(null)} onSave={updated=>{setFeed(prev=>prev.map(s=>s.id===updated.id?updated:s));setDetails(updated);onSaved()}}/>}
 </>;
}
