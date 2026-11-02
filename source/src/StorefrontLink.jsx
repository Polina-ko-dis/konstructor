import React, {useEffect,useState} from 'react';
import {Button,Field,InfoDialogWindow,Text,Separator} from '@reactor/reactor';

import QRCode from 'qrcode';

// Keep the guest address separate from the designer's URL.
const configuredUrl=import.meta.env.VITE_STOREFRONT_URL?.trim();
export const storefrontUrl=configuredUrl||'https://example.com/showcase';

export default function StorefrontLink(){
 const [open,setOpen]=useState(false);
 const [status,setStatus]=useState('');
 const [copying,setCopying]=useState(false);
 const [qrUrl,setQrUrl]=useState('');
 const [qrError,setQrError]=useState(false);
 useEffect(()=>{
  if(!open)return;
  let active=true;
  setQrError(false);
  QRCode.toDataURL(storefrontUrl,{width:1024,margin:4,errorCorrectionLevel:'M'})
   .then(url=>{if(active)setQrUrl(url)})
   .catch(()=>{if(active)setQrError(true)});
  return()=>{active=false};
 },[open]);
 function downloadQr(){
  if(!qrUrl)return;
  const link=document.createElement('a');
  link.href=qrUrl;link.download='storefront-qr.png';
  document.body.appendChild(link);link.click();link.remove();
 }

 async function copy(){
  setCopying(true);
  try{
   await navigator.clipboard.writeText(storefrontUrl);
   setStatus('Ссылка скопирована');
  }catch{
   setStatus('Не удалось скопировать. Выделите ссылку и скопируйте её вручную.');
  }finally{setCopying(false)}
 }
 return <>
  <Button text="Поделиться витриной" onClick={()=>{setStatus('');setOpen(true)}}/>
  <InfoDialogWindow header="Поделиться витриной" state={[open,setOpen]} footer={<Button type="default" text="Закрыть" onClick={()=>setOpen(false)}/>}>
   <div className="storefront-link-body">
    <Text text="Отправьте ссылку гостям или разместите её на сайте. По ней откроется вся витрина услуг."/>
    <div className="storefront-copy-row"><Field value={storefrontUrl} onChange={()=>{}} aria-label="Ссылка на витрину" onFocus={event=>event.target.select()}/><Button type="link" text={status==='Ссылка скопирована'?'Скопировано':'Скопировать'} disabled={copying} onClick={copy}/></div>
    {status&&<div role="status"><Text text={status} typography="caption"/></div>}
    <Separator/>
    <div className="storefront-qr-row">
     {qrUrl&&<img className="storefront-qr-preview" src={qrUrl} alt="QR-код ссылки на витрину" width="144" height="144"/>}
     <div className="storefront-qr-copy">
      <Text text="QR-код витрины" typography="subtitle"/>
      <Text text="Разместите его на стойке регистрации или в номере — гости смогут открыть витрину с телефона."/>
      {qrError?<div role="alert"><Text text="Не удалось создать QR-код. Закройте окно и попробуйте ещё раз." color="danger"/></div>:<div><Button text="Скачать QR-код" disabled={!qrUrl} onClick={downloadQr}/></div>}
      <Text text="PNG · 1024 × 1024" typography="caption" color="neutral"/>
     </div>
    </div>
   </div>
  </InfoDialogWindow>
 </>;
}
