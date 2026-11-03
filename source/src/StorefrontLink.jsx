import React, {useEffect,useState} from 'react';
import {Button,Field,ModalWindow,SnackbarWindow,Text,Separator} from '@reactor/reactor';

import QRCode from 'qrcode';

// Keep the guest address separate from the designer's URL.
const configuredUrl=import.meta.env.VITE_STOREFRONT_URL?.trim();
export const storefrontUrl=configuredUrl||'https://example.com/showcase';

export function ShareLinkDialog({open,setOpen,url,header,description,qrTitle,qrDescription,linkLabel,qrAlt,fileName}){
 const [status,setStatus]=useState('');
 const [copied,setCopied]=useState(false);
 const [copying,setCopying]=useState(false);
 const [qrUrl,setQrUrl]=useState('');
 const [qrPreview,setQrPreview]=useState('');
 const [qrError,setQrError]=useState(false);
 useEffect(()=>{
  if(!open)return;
  let active=true;
  setStatus('');setCopied(false);setQrUrl('');setQrPreview('');setQrError(false);
  // Preview without the quiet zone so it lines up with the heading; the PNG keeps it.
  Promise.all([
   QRCode.toDataURL(url,{width:1024,margin:4,errorCorrectionLevel:'M'}),
   QRCode.toDataURL(url,{width:288,margin:0,errorCorrectionLevel:'M'})
  ])
   .then(([png,preview])=>{if(active){setQrUrl(png);setQrPreview(preview)}})
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
   setStatus('');setCopied(true);
  }catch{
   setCopied(false);setStatus('Не удалось скопировать. Выделите ссылку и скопируйте её вручную.');
  }finally{setCopying(false)}
 }
 return <>
  <ModalWindow header={header} size={()=>({minWidth:600,maxWidth:600})} state={[open,setOpen]} footer={<Button type="default" text="Закрыть" onClick={()=>setOpen(false)}/>}>
   <div className="storefront-link-body">
    <div className="storefront-section">
     <Text text={linkLabel} typography="subtitle"/>
     {description&&<Text text={description}/>}
    </div>
    <div className="storefront-copy-row"><Field value={url} onChange={()=>{}} aria-label={linkLabel} onFocus={event=>event.target.select()}/><Button type="link" text="Скопировать" disabled={copying} onClick={copy}/></div>
    {status&&<div role="alert"><Text text={status} typography="caption" color="danger"/></div>}
    <Separator/>
    <div className="storefront-section">
     <Text text={qrTitle} typography="subtitle"/>
     {qrDescription&&<Text text={qrDescription}/>}
    </div>
    <div className="storefront-qr-row">
     {qrPreview&&<img className="storefront-qr-preview" src={qrPreview} alt={qrAlt} width="128" height="128"/>}
     <div className="storefront-qr-copy">
      {qrError?<div role="alert"><Text text="Не удалось создать QR-код. Закройте окно и попробуйте ещё раз." color="danger"/></div>:<div className="storefront-qr-download"><Button type="link" text="Скачать QR-код" disabled={!qrUrl} onClick={downloadQr}/></div>}
     </div>
    </div>
   </div>
  </ModalWindow>
  <SnackbarWindow status="success" text="Ссылка скопирована" state={[copied,setCopied]} close={()=>setCopied(false)}/>
 </>;
}

export default function StorefrontLink(){
 const [open,setOpen]=useState(false);
 return <>
  <Button text="Поделиться витриной" onClick={()=>setOpen(true)}/>
  <ShareLinkDialog open={open} setOpen={setOpen} url={storefrontUrl} header="Поделиться витриной"  qrTitle="QR-код для стойки и номеров"  linkLabel="Ссылка для сайта и чатов" qrAlt="QR-код ссылки на витрину" fileName="storefront-qr.png"/>
 </>;
}
