export const fullscreenGuideStrings={
 'Start with fullscreen':'Mulai dengan layar penuh',
 'Open fullscreen':'Aktifkan layar penuh',
 'For more room and clearer slides, use fullscreen.':'Gunakan layar penuh agar slide lebih lapang dan jelas.',
 'Move to the top edge, then choose Fullscreen at the top right.':'Arahkan kursor ke tepi atas, lalu pilih Fullscreen di kanan atas.',
 'Windows: press F11 (or Fn + F11) for browser fullscreen. Press it again to exit.':'Windows: tekan F11 (atau Fn + F11) untuk layar penuh browser. Tekan lagi untuk keluar.',
 'Deck shortcut: F. Exit deck fullscreen with Esc.':'Pintasan deck: F. Keluar dari layar penuh deck dengan Esc.',
 'Fullscreen is unavailable here. On Windows, try F11 or Fn + F11.':'Layar penuh tidak tersedia di sini. Di Windows, coba F11 atau Fn + F11.'
};
export function fullscreenGuide(){return `<aside class="fullscreen-guide"><div><strong>Start with fullscreen</strong><p>For more room and clearer slides, use fullscreen.</p></div><button type="button" data-enter-fullscreen>Open fullscreen</button><div class="fullscreen-guide-help"><p>Move to the top edge, then choose Fullscreen at the top right.</p><p>Windows: press F11 (or Fn + F11) for browser fullscreen. Press it again to exit.</p><p>Deck shortcut: F. Exit deck fullscreen with Esc.</p><p data-fullscreen-hint role="status" hidden></p></div></aside>`;}
export function installFullscreenGuide(stage,doc=document){
 const guide=stage.querySelector('[data-key="aib-deck-guide"] .rf-guide');
 if(guide&&!stage.querySelector('[data-enter-fullscreen]'))guide.insertAdjacentHTML('beforebegin',fullscreenGuide());
 stage.addEventListener('click',async event=>{const button=event.target.closest('[data-enter-fullscreen]');if(!button)return;
  event.preventDefault();if(doc.fullscreenElement)return;
  try{await doc.documentElement.requestFullscreen();}catch{
   const hint=button.closest('.fullscreen-guide').querySelector('[data-fullscreen-hint]');
   const message='Fullscreen is unavailable here. On Windows, try F11 or Fn + F11.';
   hint.textContent=doc.documentElement.lang==='id'?fullscreenGuideStrings[message]:message;hint.hidden=false;
  }
 });
}
