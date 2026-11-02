import React, {useEffect,useState} from 'react';
import {Button,Field,InfoDialogWindow,Text,Separator} from '@reactor/reactor';

import QRCode from 'qrcode';

// Keep the guest address separate from the designer's URL.
const configuredUrl=import.meta.env.VITE_STOREFRONT_URL?.trim();
export const storefrontUrl=configuredUrl||'https://example.com/showcase';

export function ShareLinkDialog({open,setOpen,url,header,description,qrTitle,qrDescription,linkLabel,qrAlt,fileName}){
 const [status,setStatus]=useState('');
 const [copying,setCopying]=useState(false);
 const [qrUrl,setQrUrl]=useState('');
 const [qrError,setQrError]=useState(false);
 useEffect(()=>{
  if(!open)return;
  let active=true;
  setStatus('');setQrUrl('');setQrError(false);
  QRCode.toDataURL(url,{width:1024,margin:4,errorCorrectionLevel:'M'})
   .then(url=>{if(active)setQrUrl(url)})
   .catch(()=>{if(active)setQrError(true)});
  return()=>{active=false};
 },[open,url]);
 function downloadQr(){
  if(!qrUrl)return;
  const link=document.createElement('a');
  link.href=qrUrl;link.download=fileName;
  document.body.appendChild(link);link.click();link.remove();
 }

 async function copy(){
  setCopying(true);
  try{
   await navigator.clipboard.writeText(url);
   setStatus('Ссылка скопирована');
  }catch{
   setStatus('Не удалось скопировать. Выделите ссылку и скопируйте её вручную.');
  }finally{setCopying(false)}
 }
 return <InfoDialogWindow header={header} state={[open,setOpen]} footer={<Button type="default" text="Закрыть" onClick={()=>setOpen(false)}/>}>
   <div className="storefront-link-body">
    <Text text={description}/>
    <div className="storefront-copy-row"><Field value={url} onChange={()=>{}} aria-label={linkLabel} onFocus={event=>event.target.select()}/><Button type="link" text={status==='Ссылка скопирована'?'Скопировано':'Скопировать'} disabled={copying} onClick={copy}/></div>
    {status&&<div role="status"><Text text={status} typography="caption"/></div>}
    <Separator/>
    <div className="storefront-qr-row">
     {qrUrl&&<img className="storefront-qr-preview" src={qrUrl} alt={qrAlt} width="144" height="144"/>}
     <div className="storefront-qr-copy">
      <Text text={qrTitle} typography="subtitle"/>
      <Text text={qrDescription}/>
      {qrError?<div role="alert"><Text text="Не удалось создать QR-код. Закройте окно и попробуйте ещё раз." color="danger"/></div>:<div><Button text="Скачать QR-код" disabled={!qrUrl} onClick={downloadQr}/></div>}
      <Text text="PNG · 1024 × 1024" typography="caption" color="neutral"/>
     </div>
    </div>
   </div>
  </InfoDialogWindow>;
}

export default function StorefrontLink(){
 const [open,setOpen]=useState(false);
 return <>
  <Button text="Поделиться витриной" onClick={()=>setOpen(true)}/>
  <ShareLinkDialog open={open} setOpen={setOpen} url={storefrontUrl} header="Поделиться витриной" description="Отправьте ссылку гостям или разместите её на сайте. По ней откроется вся витрина услуг." qrTitle="QR-код витрины" qrDescription="Разместите его на стойке регистрации или в номере — гости смогут открыть витрину с телефона." linkLabel="Ссылка на витрину" qrAlt="QR-код ссылки на витрину" fileName="storefront-qr.png"/>
 </>;
}
