// Independent of the deck module: failed imports can still show a useful retry.
(()=>{
 const root=document.getElementById('content-loading');if(!root)return;
 const id=new URLSearchParams(location.search).get('lang')==='id';
 const messages=id?{
  connecting:['Menyiapkan presentasi Anda','Menghubungkan ke materi presentasi yang aktif.'],
  waiting:['Sebentar lagi siap','Server sedang memulai. Tetap buka halaman ini; kami mencoba kembali secara otomatis.'],
  preparing:['Merapikan panggung','Menyiapkan slide, tampilan, dan huruf untuk presentasi.'],
  error:['Presentasi belum dapat dibuka','Periksa koneksi internet Anda, lalu coba kembali.']
 }:{
  connecting:['Preparing your presentation','Connecting to the active presentation.'],
  waiting:['Almost ready','The server is waking up. Keep this page open; we are retrying automatically.'],
  preparing:['Setting the stage','Preparing the slides, visuals and type for your presentation.'],
  error:['Unable to open the presentation','Check your internet connection, then try again.']
 };
 const button=root.querySelector('button');button.textContent=id?'Coba kembali':'Try again';button.onclick=()=>location.reload();
 root.querySelector('.loading-hint').textContent=id?'Materi yang aktif akan tampil otomatis.':'Your active presentation will appear automatically.';
 window.SIGNAL_LOADING={set(state){if(!root.isConnected)return;const copy=messages[state]||messages.connecting;root.dataset.state=state;root.querySelector('h1').textContent=copy[0];root.querySelector('[data-loading-message]').textContent=copy[1];button.hidden=state!=='error';if(state!=='error')button.onclick=()=>location.reload();}};
 window.SIGNAL_LOADING.set('connecting');
 const failed=(e)=>{
   console.error('Presentation loading encountered error:', e);
   if(root.isConnected)window.SIGNAL_LOADING.set('error');
 };
 window.addEventListener('error',failed);window.addEventListener('unhandledrejection',failed);
})();
