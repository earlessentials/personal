// GitHub Pages runtime. Hidden interpretation modules are requested only after the reveal is confirmed.
export function createBrowserSession({loadReading,storage,random=globalThis.crypto}={}){
 if(storage===undefined){try{storage=globalThis.localStorage}catch{storage=null}}
 const key='the-prologue.session.v1';let persistent=true,modulePromise;
 const integer=n=>{const limit=Math.floor(4294967296/n)*n;let value;do{value=random.getRandomValues(new Uint32Array(1))[0]}while(value>=limit);return value%n};
 const fresh=()=>({created:Date.now(),started:false,revealed:false,round:0,stage:'round',selections:Array(5).fill(null),orders:Array.from({length:5},()=>{const a=[0,1,2,3,4,5,6,7];for(let i=7;i>0;i--){const j=integer(i+1);[a[i],a[j]]=[a[j],a[i]]}return a})});
 const valid=s=>s&&Number.isFinite(s.created)&&Date.now()-s.created<120*86400000&&typeof s.started==='boolean'&&typeof s.revealed==='boolean'&&Number.isInteger(s.round)&&s.round>=0&&s.round<5&&['round','confirm'].includes(s.stage)&&Array.isArray(s.selections)&&s.selections.length===5&&s.selections.every(p=>p===null||(Number.isInteger(p)&&p>=0&&p<8))&&Array.isArray(s.orders)&&s.orders.length===5&&s.orders.every(a=>Array.isArray(a)&&a.length===8&&new Set(a).size===8&&a.every(n=>Number.isInteger(n)&&n>=0&&n<8))&&(!s.revealed||!s.selections.includes(null));
 let session;try{const stored=JSON.parse(storage.getItem(key));session=valid(stored)?stored:fresh()}catch{persistent=false;session=fresh()}
 const save=()=>{try{storage.setItem(key,JSON.stringify(session));persistent=true}catch{persistent=false}};
 const visible=()=>({started:session.started,revealed:session.revealed,round:session.round,stage:session.stage,selections:[...session.selections],persistent});
 const error=(en,id,l)=>{throw new Error(l==='id'?id:en)};
 async function book(lang){if(!modulePromise)modulePromise=loadReading().catch(e=>{modulePromise=null;throw e});const module=await modulePromise;const b=module.reading(session.selections.map((p,g)=>session.orders[g][p]),lang);b.cards=b.cards.map(card=>({...card,image:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(module.cuteArt(card.group*8+card.index))}));return b}
 return async function api(path,data={},lang='en'){
  if(path==='session'){save();return visible()}
  if(path==='restart'){session=fresh();save();return visible()}
  if(path==='begin'){session.started=true;save();return visible()}
  if(path==='reading'){if(!session.revealed)error('The story is still concealed.','Kisahnya masih tersembunyi.',lang);return {reading:await book(lang)}}
  if(path==='reveal'){if(!session.started||session.stage!=='confirm'||session.selections.includes(null))error('Complete all five selections before revealing.','Lengkapi kelima pilihan sebelum mengungkap kisahmu.',lang);const reading=await book(lang);session.revealed=true;save();return {state:visible(),reading}}
  if(!session.started||session.revealed)error('Selections are unavailable at this stage.','Pilihan tidak tersedia pada tahap ini.',lang);
  const r=data.round;
  if(path==='choose'){
   if(!Number.isInteger(r)||r<0||r>4||session.selections.slice(0,r).includes(null)||!Number.isInteger(data.position)||data.position<0||data.position>7)error('Invalid selection.','Pilihan tidak valid.',lang);
   session.selections[r]=data.position;session.round=r;session.stage='round';save();return visible()
  }
  if(path==='navigate'){
   if(data.stage==='confirm'){if(session.selections.includes(null))error('Complete every round before continuing.','Lengkapi semua putaran sebelum melanjutkan.',lang);session.stage='confirm'}
   else{if(!Number.isInteger(r)||r<0||r>4||session.selections.slice(0,r).includes(null))error('Complete the earlier rounds first.','Lengkapi putaran sebelumnya lebih dahulu.',lang);session.round=r;session.stage='round'}
   save();return visible()
  }
  error('Not found.','Tidak ditemukan.',lang)
 }
}
