import React,{useCallback,useRef} from 'react';
import {PopupCard,StandardActions} from '@reactor/reactor';
import {SidebarPopupWindow} from '@reactor/windows';
import classes from '../node_modules/@reactor/reactor/src/components/windows/SidebarWindow.module.scss';

// Compose Reactor's sidebar primitives so the form owns the unsaved-changes decision.
export default function GuardedSidebar({state,header,width=753,footer,actions,trigger,nested=false,shifted=false,children}){
 const [visible,setVisible]=state;
 // Stable close: a new callback makes Reactor re-attach this window, which closes the windows opened above it.
 const setVisibleRef=useRef(setVisible);
 setVisibleRef.current=setVisible;
 const close=useCallback(()=>setVisibleRef.current(false),[]);
 const controls={close,canOpen:false};
 const buttons=StandardActions.footer(actions,close);
 return <SidebarPopupWindow className={`${classes.overlay} ${classes['overlay-visible']}${nested?' sidebar-overlay-nested':''}`} mounted={visible} state={state} trigger={trigger} onClose={close} onOverlayClick={close}>
  <div className={`${classes.window} ${classes['window-active']} ${classes[shifted?'window-offset-1':'window-offset-0']}`} style={{inlineSize:width}}>
   <PopupCard modal header={header} close={close} decoration={classes.card} footer={typeof footer==='function'?footer(controls,buttons):(footer??buttons)}>{children}</PopupCard>
  </div>
 </SidebarPopupWindow>;
}
