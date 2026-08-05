import"./disclose-version.DwdwGuwu.js";import{B as x,D as k,F as z,H as Ee,J as $,K as ue,L as Le,M as D,N as De,O as ne,P as n,Q as a,R as l,S as ze,T as j,U as de,V as Ie,W as ve,X as Ve,Y as ee,Z as Re,_ as He,b as xe,c as H,d as F,et as Be,f as qe,g as Fe,j as Y,k as S,m as we,p as Ae,q as oe,r as Ke,t as Z,u as _e,v as B,y as ke,z as G}from"./client.BxU0Kc3j.js";import{t as I}from"./Icon.Bq_Z_UXk.js";import{n as J,t as Q}from"./translation.DNjA8JaL.js";import{n as ce}from"./config.c9ESr3Bj.js";import{t as _}from"./musicPlayerStore.CxJRafHl.js";import{a as ge,c as Ne,i as Xe,l as je,n as We,o as Ue,r as Ye,s as Oe,t as Je}from"./SidebarTrackInfo.BVumJMWT.js";Ve();function Qe(u){const e=u-1;return e*e*e+1}function pe(u){const e=u-1;return e*e*e+1}function fe(u){const e=typeof u=="string"&&u.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[u,"px"]}function Ze(u,{delay:e=0,duration:t=400,easing:c=pe,x:r=0,y:o=0,opacity:f=0}={}){const d=getComputedStyle(u),p=+d.opacity,i=d.transform==="none"?"":d.transform,g=p*(1-f),[m,y]=fe(r),[b,P]=fe(o);return{delay:e,duration:t,easing:c,css:(s,E)=>`
			transform: ${i} translate(${(1-s)*m}${y}, ${(1-s)*b}${P});
			opacity: ${p-g*E}`}}function Ge(u,{delay:e=0,duration:t=400,easing:c=pe,axis:r="y"}={}){const o=getComputedStyle(u),f=+o.opacity,d=r==="y"?"height":"width",p=parseFloat(o[d]),i=r==="y"?["top","bottom"]:["left","right"],g=i.map(h=>`${h[0].toUpperCase()}${h.slice(1)}`),m=parseFloat(o[`padding${g[0]}`]),y=parseFloat(o[`padding${g[1]}`]),b=parseFloat(o[`margin${g[0]}`]),P=parseFloat(o[`margin${g[1]}`]),s=parseFloat(o[`border${g[0]}Width`]),E=parseFloat(o[`border${g[1]}Width`]);return{delay:e,duration:t,easing:c,css:h=>`overflow: hidden;opacity: ${Math.min(h*20,1)*f};${d}: ${h*p}px;padding-${i[0]}: ${h*m}px;padding-${i[1]}: ${h*y}px;margin-${i[0]}: ${h*b}px;margin-${i[1]}: ${h*P}px;border-${i[0]}-width: ${h*s}px;border-${i[1]}-width: ${h*E}px;min-${d}: 0`}}var $e=S('<div class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw] svelte-1lty5dg"><div class="fab-music-header svelte-1lty5dg"><!> <!></div> <!> <!> <!></div>');function et(u,e){ee(e,!0);let t=ve(Ie(_.getState())),c=ve(!1);function r(L){const q=L;q.detail&&de(t,q.detail,!0)}xe(()=>{window.addEventListener("music-sidebar:state",r)}),ke(()=>{typeof window<"u"&&window.removeEventListener("music-sidebar:state",r)});function o(){_.toggle()}function f(){_.prev()}function d(){_.next()}function p(){_.toggleMode()}function i(){de(c,!n(c))}function g(L){_.playIndex(L)}function m(L){_.seek(L)}function y(){_.toggleMute()}function b(L){_.setVolume(L)}var P=$e(),s=l(P),E=l(s);Xe(E,{get currentSong(){return n(t).currentSong},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading}});var h=x(E,2);Je(h,{get currentSong(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},onToggleMute:y,onSetVolume:b}),a(s);var V=x(s,2);We(V,{get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},onSeek:m});var C=x(V,2);Ue(C,{get isPlaying(){return n(t).isPlaying},get isShuffled(){return n(t).isShuffled},get repeatMode(){return n(t).isRepeating},onToggleMode:p,onPrev:f,onNext:d,onTogglePlay:o,onTogglePlaylist:i});var v=x(C,2);Ye(v,{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(c)},onClose:i,onPlaySong:g}),a(P),k(u,P),$()}var tt=S('<div class="flex-1 min-w-0"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div>'),nt=S('<div class="text-xs text-30 mt-1"> </div>'),it=S('<div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <!></div>');function ye(u,e){ee(e,!0);const t=Z(e,"showTime",3,!1),c=Z(e,"size",3,"mini");function r(i){return!Number.isFinite(i)||i<0?"0:00":`${Math.floor(i/60)}:${Math.floor(i%60).toString().padStart(2,"0")}`}var o=ne(),f=G(o),d=i=>{var g=tt(),m=l(g),y=l(m,!0);a(m);var b=x(m,2),P=l(b,!0);a(b),a(g),z(()=>{j(y,e.song.title),j(P,e.song.artist)}),k(i,g)},p=i=>{var g=it(),m=l(g),y=l(m,!0);a(m);var b=x(m,2),P=l(b,!0);a(b);var s=x(b,2),E=h=>{var V=nt(),C=l(V);a(V),z((v,L)=>j(C,`${v??""} / ${L??""}`),[()=>r(e.currentTime),()=>r(e.duration)]),k(h,V)};B(s,h=>{t()&&h(E)}),a(g),z(()=>{j(y,e.song.title),j(P,e.song.artist)}),k(i,g)};B(f,i=>{c()==="mini"?i(d):i(p,-1)}),k(u,o),$()}var rt=S('<!> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0"><!></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div>',1),at=S('<div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button><!></button></div>'),ot=S("<!> <!> <!>",1),lt=S("<div><!></div>");function Pe(u,e){ee(e,!0);const t=Z(e,"size",3,"mini"),c=Z(e,"showControls",3,!1),r=Z(e,"showPlaylist",3,!1);var o=lt(),f=l(o),d=i=>{var g=rt(),m=G(g);ge(m,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",interactive:!0,get onclick(){return e.onCoverClick}});var y=x(m,2),b=l(y);ye(b,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},size:"mini"}),a(y);var P=x(y,2),s=l(P),E=l(s);I(E,{icon:"material-symbols:visibility-off",class:"text-lg"}),a(s);var h=x(s,2),V=l(h);I(V,{icon:"material-symbols:expand-less",class:"text-lg"}),a(h),a(P),z((C,v)=>{H(y,"aria-label",C),H(s,"title",v)},[()=>Q(J.musicPlayerExpand),()=>Q(J.musicPlayerHide)]),D("click",y,function(...C){e.onInfoClick?.apply(this,C)}),D("keydown",y,C=>{(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),e.onInfoClick?.())}),D("click",s,C=>{C.stopPropagation(),e.onHideClick?.()}),D("click",h,C=>{C.stopPropagation(),e.onExpandClick?.()}),k(i,g)},p=i=>{var g=ot(),m=G(g);ge(m,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded"});var y=x(m,2);ye(y,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},showTime:!0,size:"expanded"});var b=x(y,2),P=s=>{var E=at(),h=l(E),V=l(h);I(V,{icon:"material-symbols:visibility-off",class:"text-lg"}),a(h);var C=x(h,2);let v;var L=l(C);I(L,{icon:"material-symbols:queue-music",class:"text-lg"}),a(C),a(E),z((q,le)=>{H(h,"title",q),v=F(C,1,"btn-plain w-8 h-8 rounded-lg flex items-center justify-center",null,v,{"text-[var(--primary)]":r()}),H(C,"title",le)},[()=>Q(J.musicPlayerHide),()=>Q(J.musicPlayerPlaylist)]),D("click",h,function(...q){e.onHideClick?.apply(this,q)}),D("click",C,function(...q){e.onPlaylistClick?.apply(this,q)}),k(s,E)};B(b,s=>{c()&&s(P)}),k(i,g)};B(f,i=>{t()==="mini"?i(d):i(p,-1)}),a(o),z(()=>F(o,1,qe(t()==="mini"?"flex items-center gap-3 mb-0":"flex items-center gap-4 mb-4"))),k(u,o),$()}Y(["click","keydown"]);var st=S("<div><!></div>");function ut(u,e){var t=st();let c;var r=l(t);Pe(r,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",get onCoverClick(){return e.onCoverClick},get onInfoClick(){return e.onInfoClick},get onHideClick(){return e.onHideClick},get onExpandClick(){return e.onExpandClick}}),a(t),z(()=>c=F(t,1,"mini-player card-base shadow-xl rounded-2xl p-3 absolute bottom-0 right-0 w-70 svelte-g9ac72",null,c,{"mini-enter":!e.isHidden,"mini-leave":e.isHidden,"pointer-events-none":e.isHidden})),k(u,t)}var be=S("<button><!></button>");function he(u,e){const t=Z(e,"repeatMode",3,0),c=Z(e,"disabled",3,!1);var r=ne(),o=G(r),f=p=>{var i=be();let g;var m=l(i);I(m,{icon:"material-symbols:shuffle",class:"text-lg"}),a(i),z(()=>{g=F(i,1,"w-10 h-10 rounded-lg",null,g,{"btn-regular":e.isActive,"btn-plain":!e.isActive}),i.disabled=c()}),D("click",i,function(...y){e.onclick?.apply(this,y)}),k(p,i)},d=p=>{var i=be();let g;var m=l(i),y=s=>{I(s,{icon:"material-symbols:repeat-one",class:"text-lg"})},b=s=>{I(s,{icon:"material-symbols:repeat",class:"text-lg"})},P=s=>{I(s,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};B(m,s=>{t()===1?s(y):t()===2?s(b,1):s(P,-1)}),a(i),z(()=>g=F(i,1,"w-10 h-10 rounded-lg",null,g,{"btn-regular":e.isActive,"btn-plain":!e.isActive})),D("click",i,function(...s){e.onclick?.apply(this,s)}),k(p,i)};B(o,p=>{e.mode==="shuffle"?p(f):p(d,-1)}),k(u,r)}Y(["click"]);var ct=S('<div class="controls flex items-center justify-center gap-2 mb-4"><!> <!> <!> <!> <!></div>');function dt(u,e){var t=ct(),c=l(t);he(c,{mode:"shuffle",get isActive(){return e.isShuffled},get onclick(){return e.onShuffleClick}});var r=x(c,2);Oe(r,{get onclick(){return e.onPrevClick},disabled:!1});var o=x(r,2);Ne(o,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get onclick(){return e.onPlayClick}});var f=x(o,2);je(f,{get onclick(){return e.onNextClick},disabled:!1});var d=x(f,2);{let p=oe(()=>e.isRepeating>0);he(d,{mode:"repeat",get isActive(){return n(p)},get repeatMode(){return e.isRepeating},get onclick(){return e.onRepeatClick}})}a(t),k(u,t)}var gt=S('<div class="progress-bar flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-(--primary) rounded-full transition-all duration-100"></div></div>');function mt(u,e){ee(e,!0);var t=gt(),c=l(t);a(t),z(r=>{H(t,"aria-label",r),H(t,"aria-valuenow",e.duration>0?e.currentTime/e.duration*100:0),_e(c,`width: ${e.duration>0?e.currentTime/e.duration*100:0}%`)},[()=>Q(J.musicPlayerProgress)]),D("click",t,function(...r){e.onclick?.apply(this,r)}),D("keydown",t,function(...r){e.onkeydown?.apply(this,r)}),k(u,t),$()}Y(["click","keydown"]);var vt=S('<div class="progress-section mb-4"><!></div>');function ft(u,e){var t=vt(),c=l(t);mt(c,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onclick(){return e.onProgressClick},get onkeydown(){return e.onProgressKeyDown}}),a(t),k(u,t)}var yt=S('<button class="btn-plain w-8 h-8 rounded-lg"><!></button>');function bt(u,e){var t=yt(),c=l(t),r=d=>{I(d,{icon:"material-symbols:volume-off",class:"text-lg"})},o=d=>{I(d,{icon:"material-symbols:volume-down",class:"text-lg"})},f=d=>{I(d,{icon:"material-symbols:volume-up",class:"text-lg"})};B(c,d=>{e.isMuted||e.volume===0?d(r):e.volume<.5?d(o,1):d(f,-1)}),a(t),D("click",t,function(...d){e.onclick?.apply(this,d)}),k(u,t)}Y(["click"]);var ht=S('<div class="flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer touch-none" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div></div></div>');function xt(u,e){var t=ht(),c=l(t);let r;a(t),Ae(t,o=>e.volumeBarRef?.(o)),z(()=>{H(t,"aria-label",e.ariaLabel),H(t,"aria-valuenow",e.volume*100),r=F(c,1,"h-full bg-(--primary) rounded-full transition-all",null,r,{"duration-100":!e.isVolumeDragging,"duration-0":e.isVolumeDragging}),_e(c,`width: ${e.volume*100}%`)}),D("pointerdown",t,function(...o){e.onpointerdown?.apply(this,o)}),D("keydown",t,function(...o){e.onkeydown?.apply(this,o)}),k(u,t)}Y(["pointerdown","keydown"]);var wt=S('<div class="bottom-controls flex items-center gap-2"><!> <!> <!></div>');function _t(u,e){var t=wt(),c=l(t);bt(c,{get volume(){return e.volume},get isMuted(){return e.isMuted},get onclick(){return e.onVolumeButtonClick}});var r=x(c,2);{let f=oe(()=>e.isMuted?0:e.volume);xt(r,{get volume(){return n(f)},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onpointerdown(){return e.onSliderPointerDown},get onkeydown(){return e.onSliderKeyDown},get ariaLabel(){return e.ariaLabel}})}var o=x(r,2);ze(o,()=>e.children??Be),a(t),k(u,t)}var kt=S('<button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button>'),pt=S("<div><!> <!> <!> <!></div>");function Pt(u,e){ee(e,!0);var t=pt();let c;var r=l(t);Pe(r,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded",showControls:!0,get showPlaylist(){return e.showPlaylist},get onHideClick(){return e.onHideClick},get onPlaylistClick(){return e.onPlaylistClick}});var o=x(r,2);ft(o,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onProgressClick(){return e.onProgressClick},get onProgressKeyDown(){return e.onProgressKeyDown}});var f=x(o,2);dt(f,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get isShuffled(){return e.isShuffled},get isRepeating(){return e.isRepeating},get canSkip(){return e.canSkip},get onPlayClick(){return e.onPlayClick},get onPrevClick(){return e.onPrevClick},get onNextClick(){return e.onNextClick},get onShuffleClick(){return e.onShuffleClick},get onRepeatClick(){return e.onRepeatClick}});var d=x(f,2);{let p=oe(()=>Q(J.musicPlayerVolume));_t(d,{get volume(){return e.volume},get isMuted(){return e.isMuted},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onVolumeButtonClick(){return e.onVolumeButtonClick},get onSliderPointerDown(){return e.onSliderPointerDown},get onSliderKeyDown(){return e.onSliderKeyDown},get ariaLabel(){return n(p)},children:(i,g)=>{var m=kt(),y=l(m);I(y,{icon:"material-symbols:expand-more",class:"text-lg"}),a(m),z(b=>H(m,"title",b),[()=>Q(J.musicPlayerCollapse)]),D("click",m,function(...b){e.onCollapseClick?.apply(this,b)}),k(i,m)},$$slots:{default:!0}})}a(t),z(()=>c=F(t,1,"expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80",null,c,{"opacity-0":e.isHidden,"scale-95":e.isHidden,"pointer-events-none":e.isHidden})),k(u,t),$()}Y(["click"]);var Ct=S('<span class="text-sm text-[var(--content-meta)]"> </span>'),St=S('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img decoding="async" class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>');function Tt(u,e){ee(e,!0);const t=Z(e,"lazy",3,!0);function c(v){return v.startsWith("http://")||v.startsWith("https://")||v.startsWith("/")?v:`/${v}`}var r=St();let o;var f=l(r),d=l(f),p=v=>{I(v,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},i=v=>{I(v,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},g=v=>{var L=Ct(),q=l(L,!0);a(L),z(()=>j(q,e.index+1)),k(v,L)};B(d,v=>{e.isCurrent&&e.isPlaying?v(p):e.isCurrent?v(i,1):v(g,-1)}),a(f);var m=x(f,2),y=l(m);a(m);var b=x(m,2),P=l(b);let s;var E=l(P,!0);a(P);var h=x(P,2);let V;var C=l(h,!0);a(h),a(b),a(r),z(v=>{o=F(r,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,o,{"bg-[var(--btn-plain-bg)]":e.isCurrent,"text-[var(--primary)]":e.isCurrent}),H(r,"aria-label",`播放 ${e.song.title??""} - ${e.song.artist??""}`),H(y,"src",v),H(y,"alt",e.song.title),H(y,"loading",t()?"lazy":"eager"),s=F(P,1,"font-medium truncate",null,s,{"text-[var(--primary)]":e.isCurrent,"text-90":!e.isCurrent}),j(E,e.song.title),V=F(h,1,"text-sm text-[var(--content-meta)] truncate",null,V,{"text-[var(--primary)]":e.isCurrent}),j(C,e.song.artist)},[()=>c(e.song.cover)]),D("click",r,function(...v){e.onclick?.apply(this,v)}),D("keydown",r,v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),e.onclick())}),k(u,r),$()}Y(["click","keydown"]);var Mt=S('<div class="playlist-panel card-base-transparent fixed bottom-70 right-4 w-80 max-h-96 overflow-hidden z-50 svelte-1v267om"><div class="playlist-header flex items-center justify-between p-4 border-b border-(--line-divider)"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80 hide-scrollbar" role="presentation"></div></div>');function Et(u,e){ee(e,!0);var t=ne(),c=G(t),r=o=>{var f=Mt(),d=l(f),p=l(d),i=l(p,!0);a(p);var g=x(p,2),m=l(g);I(m,{icon:"material-symbols:close",class:"text-lg"}),a(g),a(d);var y=x(d,2);Fe(y,21,()=>e.playlist,He,(b,P,s)=>{{let E=oe(()=>s===e.currentIndex);Tt(b,{get song(){return n(P)},index:s,get isCurrent(){return n(E)},get isPlaying(){return e.isPlaying},onclick:()=>e.onPlaySong(s),lazy:s!==0})}}),a(y),a(f),z(b=>j(i,b),[()=>Q(J.musicPlayerPlaylist)]),D("click",g,function(...b){e.onClose?.apply(this,b)}),we(3,f,()=>Ge,()=>({duration:300,axis:"y"})),k(o,f)};B(c,o=>{e.show&&o(r)}),k(u,t),$()}Y(["click"]);var Lt=S('<div class="fixed bottom-20 right-4 z-60 max-w-sm"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),Dt=S('<div class="music-player-fab-anchor fixed z-55"><div class="music-player-fab-shell"><!></div></div>'),zt=S("<div><div><!></div> <!> <!> <!></div>"),It=S(`<!> <!> <style>.music-player-fab-anchor {
			right: var(--fab-group-right, 1.5rem);
			bottom: calc(
				var(--fab-group-bottom, 10rem) +
					(
						var(--fab-button-size, 3rem) *
							var(--fab-visible-count, 1)
					) +
					(
						var(--fab-group-gap, 0.5rem) *
							(var(--fab-visible-count, 1) - 1)
					)
			);
			width: 0;
			height: 0;
			pointer-events: none;
		}

		.music-player-fab-shell {
			position: absolute;
			right: 0;
			bottom: 0.75rem;
			transform-origin: bottom right;
			pointer-events: auto;
			will-change: transform, opacity;
		}

		.orb-player-container {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		.orb-enter {
			animation: orbElasticIn 460ms cubic-bezier(0.22, 1.25, 0.36, 1)
				forwards;
		}

		.orb-leave {
			animation: orbElasticOut 360ms cubic-bezier(0.4, 0, 1, 1) forwards;
		}

		@keyframes orbElasticIn {
			0% {
				opacity: 0;
				transform: translateX(0) scale(0.55);
			}
			70% {
				opacity: 1;
				transform: translateX(0) scale(1.12);
			}
			100% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}

		@keyframes orbElasticOut {
			0% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
			100% {
				opacity: 0;
				transform: translateX(0) scale(0.6);
			}
		}

		.music-player.hidden-mode {
			width: 3rem;
			height: 3rem;
		}

		.music-player {
			width: 20rem;
			max-width: 20rem;
			min-width: 20rem;
			user-select: none;
		}

		:global(.mini-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.expanded-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.orb-player) {
			position: relative;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}

		:global(.orb-player::before) {
			content: "";
			position: absolute;
			inset: -0.125rem;
			background: linear-gradient(
				45deg,
				var(--primary),
				transparent,
				var(--primary)
			);
			border-radius: 50%;
			z-index: -1;
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		:global(.orb-player:hover::before) {
			opacity: 0.3;
			animation: rotate 2s linear infinite;
		}

		:global(.orb-player .animate-pulse) {
			animation: musicWave 1.5s ease-in-out infinite;
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes musicWave {
			0%,
			100% {
				transform: scaleY(0.5);
			}
			50% {
				transform: scaleY(1);
			}
		}

		:global(.animate-pulse) {
			animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		:global(.progress-section div:hover),
		:global(.bottom-controls > div:hover) {
			transform: scaleY(1.2);
			transition: transform 0.2s ease;
		}

		@media (width < 768px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.75rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 5rem) +
						(
							var(--fab-button-size, 2.75rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				bottom: 0.5rem !important;
				right: 0.5rem !important;
			}
			:global(.mini-player) {
				width: 280px !important;
			}
			:global(.expanded-player) {
				width: 280px !important;
				max-width: 280px !important;
			}
			.music-player.expanded {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				right: 0.5rem !important;
			}
			:global(.playlist-panel) {
				width: 280px !important;
				right: 0.5rem !important;
				max-width: 280px !important;
			}
			:global(.controls) {
				gap: 8px;
			}
			:global(.controls button) {
				width: 36px;
				height: 36px;
			}
			:global(.controls button:nth-child(3)) {
				width: 44px;
				height: 44px;
			}
		}

		@media (width < 480px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.5rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 4.5rem) +
						(
							var(--fab-button-size, 2.5rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 260px !important;
				min-width: 260px !important;
				max-width: 260px !important;
			}
			:global(.expanded-player) {
				width: 260px !important;
				max-width: 260px !important;
			}
			:global(.playlist-panel) {
				width: 260px !important;
				max-width: 260px !important;
				right: 0.5rem !important;
			}
			:global(.song-title) {
				font-size: 14px;
			}
			:global(.song-artist) {
				font-size: 12px;
			}
			:global(.controls) {
				gap: 6px;
				margin-bottom: 12px;
			}
			:global(.controls button) {
				width: 32px;
				height: 32px;
			}
			:global(.controls button:nth-child(3)) {
				width: 40px;
				height: 40px;
			}
			:global(.playlist-item) {
				padding: 8px 12px;
			}
			:global(.playlist-item .w-10) {
				width: 32px;
				height: 32px;
			}
		}

		@keyframes slide-up {
			from {
				transform: translateY(100%);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.animate-slide-up {
			animation: slide-up 0.3s ease-out;
		}

		@media (hover: none) and (pointer: coarse) {
			:global(.music-player button),
			:global(.playlist-item) {
				min-height: 44px;
			}
			:global(.progress-section > div),
			:global(.bottom-controls > div:nth-child(2)) {
				height: 12px;
			}
		}

		@keyframes spin-continuous {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		:global(.cover-container img) {
			animation: spin-continuous 3s linear infinite;
			animation-play-state: paused;
		}

		:global(.cover-container img.spinning) {
			animation-play-state: running;
		}

		:global(button.bg-\\\\[var\\\\(--primary\\\\)\\\\]) {
			box-shadow: 0 0 0 2px var(--primary);
			border: none;
		}</style>`,1);function Nt(u,e){ee(e,!1);let t=Ee(_.getState());const c=ce.showFloatingPlayer,r=(ce.floatingEntryMode??"default")==="fab",o=c&&ce.enable;let f;function d(){_.toggle()}function p(){_.prev()}function i(){_.next()}function g(){_.toggleShuffle()}function m(){_.toggleRepeat()}function y(w){_.playIndex(w)}function b(w){const T=w.currentTarget;if(!T)return;const W=T.getBoundingClientRect(),N=(w.clientX-W.left)/W.width;_.setProgress(N)}function P(w){(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),_.setProgress(.5))}function s(){_.toggleMute()}function E(){_.toggleMute()}function h(w){const T=w.currentTarget;if(!T)return;const W=M=>{const A=T.getBoundingClientRect();if(A.width<=0)return;const K=Math.max(0,Math.min(1,(M-A.left)/A.width));_.setVolume(K)};W(w.clientX);const N=w.pointerId;T.setPointerCapture(N);const ie=M=>{M.pointerId===N&&W(M.clientX)},re=()=>{T.removeEventListener("pointermove",ie),T.removeEventListener("pointerup",ae),T.removeEventListener("pointercancel",R),T.hasPointerCapture(N)&&T.releasePointerCapture(N)},ae=M=>{M.pointerId===N&&(W(M.clientX),re())},R=M=>{M.pointerId===N&&re()};T.addEventListener("pointermove",ie),T.addEventListener("pointerup",ae),T.addEventListener("pointercancel",R)}function V(w){const T=w.target;if(!(T?.tagName==="INPUT"||T?.tagName==="TEXTAREA"||T?.contentEditable==="true")){if(w.key==="ArrowLeft"||w.key==="ArrowDown"){w.preventDefault(),_.setVolume(n(t).volume-.05);return}if(w.key==="ArrowRight"||w.key==="ArrowUp"){w.preventDefault(),_.setVolume(n(t).volume+.05);return}(w.key==="Enter"||w.key===" "||w.key==="m"||w.key==="M")&&(w.preventDefault(),s())}}function C(){_.togglePlaylist()}function v(){_.toggleExpanded()}function L(){_.toggleHidden()}function q(){_.hideError()}function le(w){}function Ce(){return _.canSkip()}xe(()=>{f=_.subscribe(w=>{de(t,w)}),_.initialize()}),ke(()=>{f&&f(),_.destroy()}),Ke();var me=ne();De("keydown",Le,V);var Se=G(me),Te=w=>{var T=It(),W=G(T),N=R=>{var M=Lt(),A=l(M),K=l(A);I(K,{icon:"material-symbols:error",class:"text-xl shrink-0"});var U=x(K,2),O=l(U,!0);a(U);var X=x(U,2),te=l(X);I(te,{icon:"material-symbols:close",class:"text-lg"}),a(X),a(A),a(M),z(()=>j(O,n(t).errorMessage)),D("click",X,q),k(R,M)};B(W,R=>{n(t).showError&&R(N)});var ie=x(W,2),re=R=>{var M=ne(),A=G(M),K=U=>{var O=Dt(),X=l(O),te=l(X);et(te,{}),a(X),a(O),we(3,X,()=>Ze,()=>({y:16,duration:280,opacity:.12,easing:Qe})),k(U,O)};B(A,U=>{n(t).isExpanded&&U(K)}),k(R,M)},ae=R=>{var M=zt();let A;var K=l(M),U=l(K);ge(U,{get cover(){return n(t).currentSong.cover},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},size:"orb",onclick:L}),a(K);var O=x(K,2);{let se=ue(()=>n(t).isExpanded||n(t).isHidden);ut(O,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isHidden(){return n(se)},onCoverClick:d,onInfoClick:v,onHideClick:L,onExpandClick:v})}var X=x(O,2);{let se=ue(Ce),Me=ue(()=>!n(t).isExpanded);Pt(X,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isShuffled(){return n(t).isShuffled},get isRepeating(){return n(t).isRepeating},get showPlaylist(){return n(t).showPlaylist},get canSkip(){return n(se)},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},isVolumeDragging:!1,get isHidden(){return n(Me)},volumeBarRef:le,onPlayClick:d,onPrevClick:p,onNextClick:()=>i(),onShuffleClick:g,onRepeatClick:m,onProgressClick:b,onProgressKeyDown:P,onVolumeButtonClick:E,onSliderPointerDown:h,onSliderKeyDown:V,onHideClick:L,onPlaylistClick:C,onCollapseClick:v})}var te=x(X,2);Et(te,{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(t).showPlaylist},onClose:C,onPlaySong:y}),a(M),z(()=>{A=F(M,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,A,{expanded:n(t).isExpanded,"hidden-mode":n(t).isHidden}),F(K,1,`orb-player-container ${n(t).isHidden?"orb-enter pointer-events-auto":"orb-leave pointer-events-none"}`)}),k(R,M)};B(ie,R=>{r?R(re):R(ae,-1)}),Re(2),k(w,T)};B(Se,w=>{o&&w(Te)}),k(u,me),$()}Y(["click"]);export{Nt as default};
