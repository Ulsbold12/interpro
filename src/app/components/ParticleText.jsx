'use client';

// Adapted from React Bits. Copyright (c) 2026 David Haz.
// License and attribution: THIRD_PARTY_NOTICES.md.
import { useEffect, useRef } from 'react';
import './ParticleText.css';
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const hexToRgb = hex => /^[0-9a-f]{6}$/i.test(hex.replace('#','')) ? hex.replace('#','').match(/../g).map(v=>parseInt(v,16)) : null;
const mix = (a,b,t) => `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')})`;

/** @param {{text?:string,particleSize?:number,density?:number,color?:string,highlightColor?:string,scatter?:number,gatherDuration?:number,stagger?:number,pointerRepel?:number,repelRadius?:number,idleDrift?:number,trigger?:string,fontSize?:number|string,fontWeight?:number|string,fontFamily?:string,glow?:boolean,className?:string,style?:import('react').CSSProperties}} props */
export default function ParticleText({text='React Bits',particleSize=2,density=4,color='#ffffff',highlightColor='#bfc3ce',scatter=180,gatherDuration=1600,stagger=420,pointerRepel=40,repelRadius=120,idleDrift=.7,trigger='mount',fontSize='clamp(3rem,12vw,8rem)',fontWeight=800,fontFamily='inherit',glow=true,className='',style}) {
  const containerRef=useRef(null), canvasRef=useRef(null);
  useEffect(()=>{
    const container=containerRef.current, canvas=canvasRef.current;
    const ctx=canvas?.getContext('2d');
    if(!container || !ctx) return;
    let particles=[], frame=null, resizeFrame=null, buildId=0, disposed=false, visible=true;
    let gathering=false, started=0, width=0, height=0, settlingUntil=0;
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced=motion.matches;
    const pointer={active:false,x:0,y:0,sx:0,sy:0};
    const startGather=(scatterAgain=true)=>{
      if(reduced || !particles.length) return;
      particles.forEach(p=>{
        if(scatterAgain){const angle=p.seed*Math.PI*2, distance=scatter*(.35+p.depth*.75);p.x=p.tx+Math.cos(angle)*distance;p.y=p.ty+Math.sin(angle)*distance;}
        p.startX=p.x;p.startY=p.y;
      });
      started=performance.now();gathering=true;ensureLoop();
    };
    const render=now=>{
      frame=null;
      if(disposed || !visible || document.hidden) return;
      ctx.clearRect(0,0,width,height);
      ctx.shadowBlur=glow && !reduced ? particleSize*2 : 0;ctx.shadowColor=highlightColor;
      pointer.sx+=(pointer.x-pointer.sx)*.18;pointer.sy+=(pointer.y-pointer.sy)*.18;
      let complete=true;
      particles.forEach(p=>{
        let x=p.tx,y=p.ty,progress=1;
        if(gathering){progress=clamp((now-started-p.delay)/Math.max(1,gatherDuration),0,1);const eased=1-(1-progress)**3;x=p.startX+(p.tx-p.startX)*eased;y=p.startY+(p.ty-p.startY)*eased;if(progress<1)complete=false;}
        else if(!reduced && idleDrift>0){x+=Math.sin(now*.0009+p.seed*10)*idleDrift*p.depth;y+=Math.cos(now*.00075+p.depth*10)*idleDrift*p.depth;}
        if(pointer.active && !reduced && repelRadius>0){const dx=x-pointer.sx,dy=y-pointer.sy,distance=Math.hypot(dx,dy);if(distance>0 && distance<repelRadius){const force=(1-distance/repelRadius)**2*pointerRepel;x+=dx/distance*force;y+=dy/distance*force;}}
        const follow=reduced ? 1 : .22;p.x+=(x-p.x)*follow;p.y+=(y-p.y)*follow;
        ctx.globalAlpha=.4+progress*.6;ctx.fillStyle=p.color;ctx.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size);
      });
      ctx.globalAlpha=1;ctx.shadowBlur=0;
      if(gathering && complete){gathering=false;settlingUntil=now+500;}
      if(!reduced && (gathering || idleDrift>0 || pointer.active || now<settlingUntil)) frame=requestAnimationFrame(render);
    };
    function ensureLoop(){if(frame===null && visible && !document.hidden && !disposed)frame=requestAnimationFrame(render);}
    const sample=async()=>{
      const id=++buildId;
      container.removeAttribute('data-ready');
      if(reduced){particles=[];if(frame!==null)cancelAnimationFrame(frame);frame=null;ctx.clearRect(0,0,width,height);return;}
      const rect=container.getBoundingClientRect();width=Math.floor(rect.width);height=Math.floor(rect.height);
      if(!width || !height) return;
      const computed=getComputedStyle(container), family=fontFamily==='inherit' ? computed.fontFamily : fontFamily;
      const probe=document.createElement('span');probe.textContent='M';Object.assign(probe.style,{position:'absolute',visibility:'hidden',fontSize:typeof fontSize==='number' ? `${fontSize}px` : fontSize,fontWeight:String(fontWeight),fontFamily:family});container.appendChild(probe);
      let size=parseFloat(getComputedStyle(probe).fontSize)||60;probe.remove();
      let font=`${fontWeight} ${size}px ${family}`;
      try{await document.fonts?.load(font);await document.fonts?.ready;}catch{}
      if(disposed || id!==buildId) return;
      const off=document.createElement('canvas'), offCtx=off.getContext('2d',{willReadFrequently:true});if(!offCtx)return;
      offCtx.font=font;
      const measured=offCtx.measureText(text);
      size=Math.min(size,size*(width*.96/Math.max(1,measured.width)),height*.78);
      font=`${fontWeight} ${size}px ${family}`;offCtx.font=font;
      const metrics=offCtx.measureText(text), left=Math.ceil(metrics.actualBoundingBoxLeft||0), right=Math.ceil(metrics.actualBoundingBoxRight||metrics.width);
      const ascent=Math.ceil(metrics.actualBoundingBoxAscent||size*.78),descent=Math.ceil(metrics.actualBoundingBoxDescent||size*.22),pad=8;
      off.width=left+right+pad*2;off.height=ascent+descent+pad*2;
      offCtx.font=font;offCtx.fillStyle='#fff';offCtx.fillText(text,pad+left,pad+ascent);
      const pixels=offCtx.getImageData(0,0,off.width,off.height).data,targets=[],step=Math.max(2,Math.floor(density));
      for(let y=0;y<off.height;y+=step)for(let x=0;x<off.width;x+=step){const alpha=pixels[(y*off.width+x)*4+3];if(alpha>40)targets.push({x:width/2-off.width/2+x,y:height/2-off.height/2+y,alpha:alpha/255});}
      const max=Math.min(3500,Math.max(600,Math.floor(width*height/65))),stride=Math.max(1,Math.ceil(targets.length/max)),a=hexToRgb(color),b=hexToRgb(highlightColor);
      particles=targets.filter((_,i)=>i%stride===0).map((t,i)=>{const seed=((i*9301+49297)%233280)/233280,depth=.45+((i*233+97)%1000)/1000*.9;return {tx:t.x,ty:t.y,x:t.x+Math.cos(seed*Math.PI*2)*scatter,y:t.y+Math.sin(seed*Math.PI*2)*scatter,startX:t.x,startY:t.y,seed,depth,delay:seed*stagger,size:Math.max(.6,particleSize*(.75+t.alpha*.45)),color:a&&b?mix(a,b,clamp(t.x/width+(seed-.5)*.35,0,1)):color};});
      const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
      pointer.x=pointer.sx=width/2;pointer.y=pointer.sy=height/2;
      if(particles.length){container.setAttribute('data-ready','true');startGather(false);}
    };
    const queueSample=()=>{if(resizeFrame!==null)cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{resizeFrame=null;sample();});};
    const move=e=>{if(e.pointerType==='touch' || reduced)return;const rect=canvas.getBoundingClientRect();pointer.x=e.clientX-rect.left;pointer.y=e.clientY-rect.top;pointer.active=true;ensureLoop();};
    const leave=()=>{pointer.active=false;settlingUntil=performance.now()+700;ensureLoop();};
    const enter=e=>{move(e);if(e.pointerType!=='touch' && trigger==='hover')startGather(true);};
    const click=()=>{if(trigger==='click')startGather(true);};
    const changeMotion=e=>{reduced=e.matches;queueSample();};
    const visibility=()=>{if(document.hidden){if(frame!==null)cancelAnimationFrame(frame);frame=null;pointer.active=false;}else ensureLoop();};
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)ensureLoop();else{if(frame!==null)cancelAnimationFrame(frame);frame=null;pointer.active=false;}},{rootMargin:'80px'});
    const resize=new ResizeObserver(queueSample);resize.observe(container);observer.observe(container);
    canvas.addEventListener('pointerenter',enter);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);canvas.addEventListener('click',click);
    motion.addEventListener('change',changeMotion);document.addEventListener('visibilitychange',visibility);sample();
    return()=>{disposed=true;buildId++;resize.disconnect();observer.disconnect();motion.removeEventListener('change',changeMotion);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('pointerenter',enter);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('click',click);if(frame!==null)cancelAnimationFrame(frame);if(resizeFrame!==null)cancelAnimationFrame(resizeFrame);container.removeAttribute('data-ready');};
  },[text,particleSize,density,color,highlightColor,scatter,gatherDuration,stagger,pointerRepel,repelRadius,idleDrift,trigger,fontSize,fontWeight,fontFamily,glow]);
  return <span ref={containerRef} className={`particle-text ${className}`} style={style}><canvas ref={canvasRef} className="particle-text__canvas" aria-hidden="true"/><span className="particle-text__fallback">{text}</span></span>;
}
