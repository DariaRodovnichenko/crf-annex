import{a as Fe}from"./chunk-446NSGHC.js";import{a as Ce,d as we,k as q}from"./chunk-FQ7FNXWH.js";import{h as K}from"./chunk-2M23OMBR.js";import{a as re}from"./chunk-LF5XB4YN.js";import{f as v}from"./chunk-D7YYRZS5.js";var oe,Cn=n=>{if(oe===void 0){let t=n.style.animationName!==void 0,r=n.style.webkitAnimationName!==void 0;oe=!t&&r?"-webkit-":""}return oe},se=(n,t,r)=>{let a=t.startsWith("animation")?Cn(n):"";n.style.setProperty(a+t,r)},N=(n=[],t)=>{if(t!==void 0){let r=Array.isArray(t)?t:[t];return[...n,...r]}return n},zn=n=>{let t,r,a,d,b,A,f=[],C=[],$=[],w=!1,l,G={},Z=[],J=[],Q={},L=0,x=!1,M=!1,k,W,P,S=!0,I=!1,T=!0,o,O=!1,ce=n,X=[],V=[],U=[],p=[],m=[],fe=[],le=[],ue=[],de=[],me=[],E=[],Te=typeof AnimationEffect=="function"||re!==void 0&&typeof re.AnimationEffect=="function",h=typeof Element=="function"&&typeof Element.prototype.animate=="function"&&Te,ge=()=>E,Ve=e=>(m.forEach(i=>{i.destroy(e)}),Re(e),p.length=0,m.length=0,f.length=0,Oe(),w=!1,T=!0,o),Re=e=>{Ee(),e&&Ue()},De=()=>{x=!1,M=!1,T=!0,k=void 0,W=void 0,P=void 0,L=0,I=!1,S=!0,O=!1},xe=()=>L!==0&&!O,he=(e,i)=>{let s=i.findIndex(c=>c.c===e);s>-1&&i.splice(s,1)},Me=(e,i)=>(U.push({c:e,o:i}),o),j=(e,i)=>((i?.oneTimeCallback?V:X).push({c:e,o:i}),o),Oe=()=>(X.length=0,V.length=0,o),Ee=()=>{h&&(E.forEach(e=>{e.cancel()}),E.length=0)},Ue=()=>{fe.forEach(e=>{e?.parentNode&&e.parentNode.removeChild(e)}),fe.length=0},Be=e=>(le.push(e),o),ze=e=>(ue.push(e),o),qe=e=>(de.push(e),o),Ke=e=>(me.push(e),o),Ne=e=>(C=N(C,e),o),Ye=e=>($=N($,e),o),He=(e={})=>(G=e,o),$e=(e=[])=>{for(let i of e)G[i]="";return o},Ge=e=>(Z=N(Z,e),o),Ze=e=>(J=N(J,e),o),Je=(e={})=>(Q=e,o),Qe=(e=[])=>{for(let i of e)Q[i]="";return o},ee=()=>b!==void 0?b:l?l.getFill():"both",B=()=>k!==void 0?k:A!==void 0?A:l?l.getDirection():"normal",ne=()=>x?"linear":a!==void 0?a:l?l.getEasing():"linear",_=()=>M?0:W!==void 0?W:r!==void 0?r:l?l.getDuration():0,te=()=>d!==void 0?d:l?l.getIterations():1,ie=()=>P!==void 0?P:t!==void 0?t:l?l.getDelay():0,Xe=()=>f,je=e=>(A=e,g(!0),o),en=e=>(b=e,g(!0),o),nn=e=>(t=e,g(!0),o),tn=e=>(a=e,g(!0),o),rn=e=>(!h&&e===0&&(e=1),r=e,g(!0),o),on=e=>(d=e,g(!0),o),sn=e=>(l=e,o),an=e=>{if(e!=null)if(e.nodeType===1)p.push(e);else if(e.length>=0)for(let i=0;i<e.length;i++)p.push(e[i]);else console.error("Invalid addElement value");return o},cn=e=>{if(e!=null)if(Array.isArray(e))for(let i of e)i.parent(o),m.push(i);else e.parent(o),m.push(e);return o},fn=e=>{let i=f!==e;return f=e,i&&ln(f),o},ln=e=>{h&&ge().forEach(i=>{let s=i.effect;if(s.setKeyframes)s.setKeyframes(e);else{let c=new KeyframeEffect(s.target,e,s.getTiming());i.effect=c}})},un=()=>{le.forEach(c=>c()),ue.forEach(c=>c());let e=C,i=$,s=G;p.forEach(c=>{let u=c.classList;e.forEach(y=>u.add(y)),i.forEach(y=>u.remove(y));for(let y in s)s.hasOwnProperty(y)&&se(c,y,s[y])})},dn=()=>{de.forEach(u=>u()),me.forEach(u=>u());let e=S?1:0,i=Z,s=J,c=Q;p.forEach(u=>{let y=u.classList;i.forEach(F=>y.add(F)),s.forEach(F=>y.remove(F));for(let F in c)c.hasOwnProperty(F)&&se(u,F,c[F])}),W=void 0,k=void 0,P=void 0,X.forEach(u=>u.c(e,o)),V.forEach(u=>u.c(e,o)),V.length=0,T=!0,S&&(I=!0),S=!0},z=()=>{L!==0&&(L--,L===0&&(dn(),l&&l.animationFinish()))},mn=()=>{p.forEach(e=>{let i=e.animate(f,{id:ce,delay:ie(),duration:_(),easing:ne(),iterations:te(),fill:ee(),direction:B()});i.pause(),E.push(i)}),E.length>0&&(E[0].onfinish=()=>{z()})},ye=()=>{un(),f.length>0&&h&&mn(),w=!0},R=e=>{e=Math.min(Math.max(e,0),.9999),h&&E.forEach(i=>{i.currentTime=i.effect.getComputedTiming().delay+_()*e,i.pause()})},pe=e=>{E.forEach(i=>{i.effect.updateTiming({delay:ie(),duration:_(),easing:ne(),iterations:te(),fill:ee(),direction:B()})}),e!==void 0&&R(e)},g=(e=!1,i=!0,s)=>(e&&m.forEach(c=>{c.update(e,i,s)}),h&&pe(s),o),gn=(e=!1,i)=>(m.forEach(s=>{s.progressStart(e,i)}),be(),x=e,w||ye(),g(!1,!0,i),o),hn=e=>(m.forEach(i=>{i.progressStep(e)}),R(e),o),En=(e,i,s)=>(x=!1,m.forEach(c=>{c.progressEnd(e,i,s)}),s!==void 0&&(W=s),I=!1,S=!0,e===0?(k=B()==="reverse"?"normal":"reverse",k==="reverse"&&(S=!1),h?(g(),R(1-i)):(P=(1-i)*_()*-1,g(!1,!1))):e===1&&(h?(g(),R(i)):(P=i*_()*-1,g(!1,!1))),e!==void 0&&!l&&ve(),o),be=()=>{w&&(h?E.forEach(e=>{e.pause()}):p.forEach(e=>{se(e,"animation-play-state","paused")}),O=!0)},yn=()=>(m.forEach(e=>{e.pause()}),be(),o),pn=()=>{z()},bn=()=>{E.forEach(e=>{e.play()}),(f.length===0||p.length===0)&&z()},vn=()=>{h&&(R(0),pe())},ve=e=>new Promise(i=>{e?.sync&&(M=!0,j(()=>M=!1,{oneTimeCallback:!0})),w||ye(),I&&(vn(),I=!1),T&&(L=m.length+1,T=!1);let s=()=>{he(c,V),i()},c=()=>{he(s,U),i()};j(c,{oneTimeCallback:!0}),Me(s,{oneTimeCallback:!0}),m.forEach(u=>{u.play()}),h?bn():pn(),O=!1}),An=()=>{m.forEach(e=>{e.stop()}),w&&(Ee(),w=!1),De(),U.forEach(e=>e.c(0,o)),U.length=0},Ae=(e,i)=>{let s=f[0];return s!==void 0&&(s.offset===void 0||s.offset===0)?s[e]=i:f=[{offset:0,[e]:i},...f],o};return o={parentAnimation:l,elements:p,childAnimations:m,id:ce,animationFinish:z,from:Ae,to:(e,i)=>{let s=f[f.length-1];return s!==void 0&&(s.offset===void 0||s.offset===1)?s[e]=i:f=[...f,{offset:1,[e]:i}],o},fromTo:(e,i,s)=>Ae(e,i).to(e,s),parent:sn,play:ve,pause:yn,stop:An,destroy:Ve,keyframes:fn,addAnimation:cn,addElement:an,update:g,fill:en,direction:je,iterations:on,duration:rn,easing:tn,delay:nn,getWebAnimations:ge,getKeyframes:Xe,getFill:ee,getDirection:B,getDelay:ie,getIterations:te,getEasing:ne,getDuration:_,afterAddRead:qe,afterAddWrite:Ke,afterClearStyles:Qe,afterStyles:Je,afterRemoveClass:Ze,afterAddClass:Ge,beforeAddRead:Be,beforeAddWrite:ze,beforeClearStyles:$e,beforeStyles:He,beforeRemoveClass:Ye,beforeAddClass:Ne,onFinish:j,isRunning:xe,progressStart:gn,progressStep:hn,progressEnd:En}};var wn="ionViewWillEnter",Fn="ionViewDidEnter",Ln="ionViewWillLeave",kn="ionViewDidLeave",$n="ionViewWillUnload",D=n=>{n.tabIndex=-1,n.focus()},Y=n=>n.offsetParent!==null,Pn=()=>({saveViewFocus:r=>{if(q.get("focusManagerPriority",!1)){let d=document.activeElement;d!==null&&r?.contains(d)&&d.setAttribute(Le,"true")}},setViewFocus:r=>{let a=q.get("focusManagerPriority",!1);if(Array.isArray(a)&&!r.contains(document.activeElement)){let d=r.querySelector(`[${Le}]`);if(d&&Y(d)){D(d);return}for(let b of a)switch(b){case"content":let A=r.querySelector('main, [role="main"]');if(A&&Y(A)){D(A);return}break;case"heading":let f=r.querySelector('h1, [role="heading"][aria-level="1"]');if(f&&Y(f)){D(f);return}break;case"banner":let C=r.querySelector('header, [role="banner"]');if(C&&Y(C)){D(C);return}break;default:Fe(`Unrecognized focus manager priority value ${b}`);break}D(r)}}}),Le="ion-last-focus",Sn=()=>import("./chunk-GBV2CESL.js"),_n=()=>import("./chunk-6GPB3ZKY.js"),Se=Pn(),Gn=n=>new Promise((t,r)=>{we(()=>{Wn(n),In(n).then(a=>{a.animation&&a.animation.destroy(),ke(n),t(a)},a=>{ke(n),r(a)})})}),Wn=n=>{let t=n.enteringEl,r=n.leavingEl;Se.saveViewFocus(r),Mn(t,r,n.direction),n.showGoBack?t.classList.add("can-go-back"):t.classList.remove("can-go-back"),Pe(t,!1),t.style.setProperty("pointer-events","none"),r&&(Pe(r,!1),r.style.setProperty("pointer-events","none"))},In=n=>v(void 0,null,function*(){let t=yield Tn(n);return t&&Ce.isBrowser?Vn(t,n):Rn(n)}),ke=n=>{let t=n.enteringEl,r=n.leavingEl;t.classList.remove("ion-page-invisible"),t.style.removeProperty("pointer-events"),r!==void 0&&(r.classList.remove("ion-page-invisible"),r.style.removeProperty("pointer-events")),Se.setViewFocus(t)},Tn=n=>v(void 0,null,function*(){return!n.leavingEl||!n.animated||n.duration===0?void 0:n.animationBuilder?n.animationBuilder:n.mode==="ios"?(yield Sn()).iosTransitionAnimation:(yield _n()).mdTransitionAnimation}),Vn=(n,t)=>v(void 0,null,function*(){yield _e(t,!0);let r=n(t.baseEl,t);We(t.enteringEl,t.leavingEl);let a=yield xn(r,t);return t.progressCallback&&t.progressCallback(void 0),a&&Ie(t.enteringEl,t.leavingEl),{hasCompleted:a,animation:r}}),Rn=n=>v(void 0,null,function*(){let t=n.enteringEl,r=n.leavingEl,a=q.get("focusManagerPriority",!1);return yield _e(n,a),We(t,r),Ie(t,r),{hasCompleted:!0}}),_e=(n,t)=>v(void 0,null,function*(){(n.deepWait!==void 0?n.deepWait:t)&&(yield Promise.all([ae(n.enteringEl),ae(n.leavingEl)])),yield Dn(n.viewIsReady,n.enteringEl)}),Dn=(n,t)=>v(void 0,null,function*(){n&&(yield n(t))}),xn=(n,t)=>{let r=t.progressCallback,a=new Promise(d=>{n.onFinish(b=>d(b===1))});return r?(n.progressStart(!0),r(n)):n.play(),a},We=(n,t)=>{H(t,Ln),H(n,wn)},Ie=(n,t)=>{H(n,Fn),H(t,kn)},H=(n,t)=>{if(n){let r=new CustomEvent(t,{bubbles:!1,cancelable:!1});n.dispatchEvent(r)}},Zn=()=>new Promise(n=>K(()=>K(()=>n()))),ae=n=>v(void 0,null,function*(){let t=n;if(t){if(t.componentOnReady!=null){if((yield t.componentOnReady())!=null)return}else if(t.__registerHost!=null){yield new Promise(a=>K(a));return}yield Promise.all(Array.from(t.children).map(ae))}}),Pe=(n,t)=>{t?(n.setAttribute("aria-hidden","true"),n.classList.add("ion-page-hidden")):(n.hidden=!1,n.removeAttribute("aria-hidden"),n.classList.remove("ion-page-hidden"))},Mn=(n,t,r)=>{n!==void 0&&(n.style.zIndex=r==="back"?"99":"101"),t!==void 0&&(t.style.zIndex="100")},Jn=n=>{if(n.classList.contains("ion-page"))return n;let t=n.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs");return t||n};export{zn as a,wn as b,Fn as c,Ln as d,kn as e,$n as f,Gn as g,Zn as h,ae as i,Jn as j};
