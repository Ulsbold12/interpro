'use client';
// Adapted from React Bits. Copyright (c) 2026 David Haz.
// License and attribution: THIRD_PARTY_NOTICES.md.
import { useEffect, useRef } from 'react';
import './ScrollExpand.css';
const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
const smoothstep=(a,b,x)=>{const t=clamp((x-a)/(b-a||1e-6),0,1);return t*t*(3-2*t);};

/** @param {{src?:string,mediaType?:string,poster?:string,alt?:string,title?:string,scrollHint?:string,startWidth?:number,startHeight?:number,startRadius?:number,endRadius?:number,mediaZoom?:number,scrollDistance?:number,holdDistance?:number,smoothing?:number,overlayScrim?:number,useWindowScroll?:boolean,enabled?:boolean,children?:import('react').ReactNode,className?:string,style?:import('react').CSSProperties}} props */
export default function ScrollExpand({src='',mediaType='image',poster='',alt='',title='',scrollHint='',startWidth=42,startHeight=58,startRadius=24,endRadius=0,mediaZoom=1.35,scrollDistance=1.2,holdDistance=.35,smoothing=.1,overlayScrim=.45,useWindowScroll=false,enabled=true,children,className='',style}) {
  const rootRef=useRef(null),trackRef=useRef(null),stageRef=useRef(null),frameRef=useRef(null),mediaRef=useRef(null),titleRef=useRef(null),overlayRef=useRef(null),scrimRef=useRef(null),hintRef=useRef(null);
  useEffect(()=>{
    const root=rootRef.current,track=trackRef.current,stage=stageRef.current,frame=frameRef.current,media=mediaRef.current;
    if(!root||!track||!stage||!frame||!media)return;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    let raf=0,current=0,target=0,stageHeight=0,offset=0,last=0;
    const animated=()=>enabled&&!motion.matches;
    const apply=p=>{
      const e=smoothstep(0,1,p),w=clamp(startWidth,10,100)+(100-clamp(startWidth,10,100))*e,h=clamp(startHeight,10,100)+(100-clamp(startHeight,10,100))*e;
      frame.style.clipPath=`inset(${(100-h)/2}% ${(100-w)/2}% ${(100-h)/2}% ${(100-w)/2}% round ${startRadius+(endRadius-startRadius)*e}px)`;
      media.style.transform=`scale(${mediaZoom+(1-mediaZoom)*e})`;
      if(scrimRef.current)scrimRef.current.style.opacity=String(overlayScrim*e);
      if(titleRef.current){const out=smoothstep(.35,.8,p);titleRef.current.style.opacity=String(1-out);titleRef.current.style.transform=`translateY(${-28*out}px)`;}
      if(hintRef.current)hintRef.current.style.opacity=String(1-smoothstep(0,.15,p));
      if(overlayRef.current){const inn=smoothstep(.65,1,p);overlayRef.current.style.opacity=String(inn);overlayRef.current.style.transform=`translateY(${18*(1-inn)}px)`;overlayRef.current.inert=inn<.95;}
    };
    const read=()=>!animated()?1:clamp((useWindowScroll ? offset-track.getBoundingClientRect().top : root.scrollTop)/(stageHeight*Math.max(.01,scrollDistance)),0,1);
    const measure=()=>{
      if(raf)cancelAnimationFrame(raf);raf=0;last=0;
      offset=useWindowScroll?(document.querySelector('.site-header')?.getBoundingClientRect().height||0):0;
      stageHeight=useWindowScroll?Math.max(280,window.innerHeight-offset):Math.max(280,root.clientHeight);
      stage.style.height=`${stageHeight}px`;stage.style.top=`${animated()?offset:0}px`;stage.style.position=animated()?"sticky":"relative";
      track.style.height=`${animated()?stageHeight*(1+Math.max(0,scrollDistance)+Math.max(0,holdDistance)):stageHeight}px`;
      root.toggleAttribute('data-animated',animated());
      stage.style.setProperty('--se-title-size',`${clamp(root.clientWidth*.065,28,76)}px`);
      current=target=read();apply(current);
      if(!animated()){frame.style.clipPath='none';media.style.transform='none';if(titleRef.current)titleRef.current.style.opacity='0';if(hintRef.current)hintRef.current.style.opacity='0';if(overlayRef.current){overlayRef.current.style.opacity='1';overlayRef.current.style.transform='none';overlayRef.current.inert=false;}if(scrimRef.current)scrimRef.current.style.opacity=String(overlayScrim);}
    };
    const tick=ts=>{
      if(document.hidden){raf=0;last=0;return;}
      const dt=last?Math.min((ts-last)/1000,.1):1/60;last=ts;
      current+=(target-current)*(smoothing<=0?1:1-Math.exp(-dt/smoothing));
      if(Math.abs(target-current)<.0004)current=target;
      apply(current);raf=current===target?0:requestAnimationFrame(tick);if(!raf)last=0;
    };
    const onScroll=()=>{target=read();if(!animated()||smoothing<=0){current=target;apply(current);}else if(!raf)raf=requestAnimationFrame(tick);};
    const visibility=()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;last=0;}else onScroll();};
    const scroller=useWindowScroll?window:root;
    measure();scroller.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',measure);motion.addEventListener('change',measure);document.addEventListener('visibilitychange',visibility);
    const ro=new ResizeObserver(measure);ro.observe(root);
    return()=>{if(raf)cancelAnimationFrame(raf);ro.disconnect();scroller.removeEventListener('scroll',onScroll);window.removeEventListener('resize',measure);motion.removeEventListener('change',measure);document.removeEventListener('visibilitychange',visibility);};
  },[startWidth,startHeight,startRadius,endRadius,mediaZoom,scrollDistance,holdDistance,smoothing,overlayScrim,useWindowScroll,enabled]);
  return <div ref={rootRef} className={`scroll-expand ${useWindowScroll?'':'scroll-expand--scroller'} ${className}`} style={style}>
    <div ref={trackRef} className="scroll-expand__track"><div ref={stageRef} className="scroll-expand__stage"><div ref={frameRef} className="scroll-expand__frame">
      {mediaType==='video'?<video ref={mediaRef} className="scroll-expand__media" src={src} poster={poster} autoPlay muted loop playsInline/>:<img ref={mediaRef} className="scroll-expand__media" src={src} alt={alt} draggable={false} loading="lazy"/>}
      <div ref={scrimRef} className="scroll-expand__scrim" aria-hidden="true"/>
      {children&&<div ref={overlayRef} className="scroll-expand__overlay">{children}</div>}
    </div>{title&&<div ref={titleRef} className="scroll-expand__title" aria-hidden="true">{title}</div>}{scrollHint&&<div ref={hintRef} className="scroll-expand__hint" aria-hidden="true">{scrollHint}<span>↓</span></div>}</div></div>
  </div>;
}
