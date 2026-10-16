import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHandler,sha} from '../supabase/functions/private-matter/handler.mjs';
import {regionForIp,regionForRequest} from '../supabase/functions/private-matter/checkout-region.mjs';

import {testDatabase} from './d1-test-database.mjs';
import {createRpc} from '../cloudflare/database.mjs';
const db=testDatabase();
const codes=await Promise.all(Array.from({length:15},async(_,i)=>({id:i<10?`reader-${i+1}`:`contributor-${i-9}`,
  role:i<10?'reader':'contributor',code:i>=10?String(100001+i):undefined,name:i===10?'Pearling':null,hash:await sha(String(100001+i))})));
const objects=new Map();const signed=[];
const storage={
  async upload(id,bytes,type){objects.set(id,{bytes,type})},async remove(id){objects.delete(id)},
  async sign(id,expires){assert.ok(objects.has(id));signed.push({id,expires});return `https://testing.supabase.co/storage/v1/object/sign/private-matter/${id}?token=one-object-only`},
};
const rpc=createRpc(db);
const handler=createHandler({rpc,storage,codes,origins:['https://pearlinglim.com','https://www.pearlinglim.com'],paymentUrl:'https://payments.example/checkout',internationalPaymentUrl:'https://international.example/checkout',resolveCheckoutRegion:regionForRequest});
const origin='https://pearlinglim.com';let client=0;
async function req(path,{method='GET',tokens={},body,raw,headers={},origin:requestOrigin=origin}={}){
  const h=new Headers(headers);if(requestOrigin)h.set('Origin',requestOrigin);
  for(const[scope,value]of Object.entries(tokens))h.set('X-PM-'+scope,value);
  if(!h.has('X-Forwarded-For'))h.set('X-Forwarded-For',String(client++));
  if(body!==undefined)h.set('Content-Type','application/json');
  const response=await handler(new Request('https://testing.supabase.co/functions/v1/private-matter'+path,{method,headers:h,body:body!==undefined?JSON.stringify(body):raw}));
  return {status:response.status,headers:response.headers,data:response.status===204?null:await response.json()};
}
const login=async(index,intent=index<10?'reader':'contributor')=>req('/session',{method:'POST',body:{code:String(100001+index),intent}});
const story=(visibility='private',extra={})=>({id:crypto.randomUUID(),action:'publish',title:'Test matter',subtitle:'',category:'',body:'An isolated test of publication permissions and authored writing. No live material.',tags:[],cover:'',caption:'',imageAlt:'',imageMode:'wide',references:'',seoDescription:'',visibility,excerpt:visibility==='excerpt'?'This excerpt may be shared.':'',...extra});
let reader,admin,contributor,other;
before(async()=>{
  db.exec(await readFile(new URL('../cloudflare/migrations/0001_backend.sql',import.meta.url),'utf8'));
  reader=(await login(0)).data.tokens;admin=(await login(10)).data.tokens;
  contributor=(await login(11)).data.tokens;other=(await login(12)).data.tokens;
});
after(async()=>db.close());

test('routing accepts the hosted gateway path and rejects lookalike prefixes',async()=>{
  const response=await handler(new Request('https://testing.supabase.co/private-matter/settings'));
  assert.equal(response.status,200);
  assert.equal((await response.json()).paymentUrl,'https://payments.example/checkout');
  assert.equal((await handler(new Request('https://testing.supabase.co/private-matter-other/settings'))).status,404);
});

test('all ten reader and five contributor slots work with strict roles',async()=>{
  for(let i=0;i<15;i++){
    const result=await login(i);assert.equal(result.status,200);
    assert.equal(result.data.admin,i===10);
    assert.deepEqual(Object.keys(result.data.tokens).sort(),i===10?['contributor','reader']:i<10?['reader']:['contributor']);
    const info=await req('/session',{tokens:result.data.tokens});
    assert.equal(info.data.admin,i===10);
    assert.ok(!JSON.stringify(info.data).includes('hash'));
    if(i!==10)assert.equal((await login(i,i<10?'contributor':'reader')).status,401);
  }
  const dual=await login(10,'reader');assert.deepEqual(Object.keys(dual.data.tokens).sort(),['contributor','reader']);
  assert.equal((await req('/session',{tokens:dual.data.tokens})).data.contributor.name,'Pearling');
  assert.equal((await req('/session',{method:'POST',body:{code:'wrong'}})).status,401);
  assert.equal((await req('/studio',{tokens:reader})).status,401);
  assert.equal((await req('/stories',{tokens:contributor})).status,401);
  assert.equal((await req('/session',{tokens:{reader:'f'.repeat(64)}})).data.reader,null);
  const rows=(await db.query('select token_hash from pm_sessions')).rows;
  assert.ok(rows.every(r=>/^[a-f0-9]{64}$/.test(r.token_hash)));
  assert.ok(!rows.some(r=>Object.values(reader).includes(r.token_hash)));
});

test('public articles, private articles, excerpts and drafts obey read permissions',async()=>{
  const publicPost=story('public',{title:'Public note'}),privatePost=story('private',{title:'Hidden title',body:'Hidden-search-phrase. '+ 'Private writing. '.repeat(5)}),excerpt=story('excerpt'),draft=story('public',{action:'draft'});
  for(const post of [publicPost,privatePost,excerpt,draft])assert.equal((await req('/studio',{method:'POST',tokens:contributor,body:post})).status,200);
  const list=(await req('/stories?scope=public')).data.stories;
  assert.equal(list.length,1);assert.equal(list[0].id,publicPost.id);assert.ok(!('body'in list[0]));
  assert.equal((await req('/stories?scope=public&q=Hidden-search-phrase')).data.stories.length,0);
  const locked=(await req('/stories/'+privatePost.id)).data.story;assert.equal(locked.locked,true);assert.ok(!('body' in locked));assert.equal(locked.excerpt,'');
  const catalog=(await req('/stories?scope=catalog')).data.stories;assert.equal(catalog.length,3);assert.ok(catalog.every(p=>!('body' in p)&&p.id!==draft.id));assert.equal((await req('/stories?scope=catalog&q=Hidden-search-phrase')).data.stories.length,0);
  assert.equal((await req('/stories/'+privatePost.id,{tokens:reader})).data.story.body,privatePost.body);
  assert.equal((await req('/stories/'+draft.id)).status,404);
  assert.equal((await req('/stories/'+draft.id,{tokens:contributor})).status,200);
  const limited=(await req('/stories/'+excerpt.id)).data.story;
  assert.equal(limited.excerpt,excerpt.excerpt);assert.equal(limited.locked,true);assert.ok(!('body'in limited));assert.ok(!('references'in limited));
  assert.equal((await req('/stories/'+publicPost.id)).data.next,null);
  assert.equal((await req('/stories',{tokens:reader})).data.stories.length,3);
});

test('publishing preserves ownership and permanent numbering',async()=>{
  const post=story('private');const created=await req('/studio',{method:'POST',tokens:contributor,body:post});assert.equal(created.status,200);
  assert.equal((await req('/studio',{method:'POST',tokens:other,body:{...post,title:'Stolen'}})).status,403);
  assert.equal((await req('/studio?id='+post.id,{method:'DELETE',tokens:other})).status,403);
  assert.equal((await req('/studio',{method:'POST',tokens:reader,body:post})).status,401);
  assert.equal((await req('/studio',{method:'POST',body:post})).status,401);
  assert.equal((await req('/studio',{method:'POST',tokens:contributor,body:{...post,action:'draft',visibility:'public'}})).status,400);
  const changed=await req('/studio',{method:'POST',tokens:contributor,body:{...post,title:'Changed title',visibility:'public'}});
  assert.equal(changed.status,200);assert.equal(changed.data.story.number,created.data.story.number);assert.equal(changed.data.story.slug,created.data.story.slug);assert.equal(changed.data.story.createdAt,created.data.story.createdAt);
  assert.equal((await req('/studio',{method:'POST',tokens:admin,body:{...post,visibility:'private'}})).status,200);
  assert.equal((await req('/stories/'+post.id)).data.story.locked,true);
  assert.equal((await req('/studio?id='+post.id,{method:'DELETE',tokens:contributor})).status,403);
  const draft=story('private',{action:'draft'});await req('/studio',{method:'POST',tokens:contributor,body:draft});
  assert.equal((await req('/studio?id='+draft.id,{method:'DELETE',tokens:admin})).status,200);
  assert.equal((await req('/stories/'+draft.id,{tokens:admin})).status,404);
  assert.equal((await req('/studio',{tokens:other})).data.stories.length,0);
  const articles=await Promise.all([1,2,3].map(()=>req('/studio',{method:'POST',tokens:other,body:story()})));
  assert.equal(new Set(articles.map(r=>r.data.story.number)).size,3);
});

test('media URLs are issued only after content and ownership checks',async()=>{
  const upload=async(tokens=contributor)=>{const fd=new FormData();fd.set('file',new File([new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0])],'test.png',{type:'image/png'}));return req('/media',{method:'POST',tokens,raw:fd});};
  assert.equal((await upload(reader)).status,401);
  const result=await upload();assert.equal(result.status,200);const path=result.data.url.slice(4);
  assert.equal((await req(path+'/url')).status,401);
  assert.equal((await req(path+'/url',{tokens:other})).status,401);
  assert.equal((await req(path+'/url',{tokens:contributor})).status,200);
  assert.equal(signed.at(-1).expires,900);
  const post=story('private',{cover:result.data.url});
  assert.equal((await req('/studio',{method:'POST',tokens:other,body:post})).status,403);
  assert.equal((await req('/studio',{method:'POST',tokens:contributor,body:post})).status,200);
  assert.equal((await req(path+'/url',{tokens:reader})).status,200);
  assert.equal((await req(path+'/url')).status,401);
  await req('/studio',{method:'POST',tokens:contributor,body:{...post,visibility:'public'}});
  assert.equal((await req(path+'/url')).status,200);
  await req('/studio',{method:'POST',tokens:contributor,body:{...post,visibility:'private'}});
  assert.equal((await req(path+'/url')).status,401);
  const invalid=new FormData();invalid.set('file',new File(['<svg/>'],'bad.png',{type:'image/png'}));
  assert.equal((await req('/media',{method:'POST',tokens:contributor,raw:invalid})).status,400);
  assert.equal((await req('/videos',{method:'POST',tokens:contributor,raw:'not a movie',headers:{'Content-Type':'video/mp4'}})).status,400);
  const videoBytes=new Uint8Array(64);videoBytes.set(new TextEncoder().encode('ftypisom'),4);
  const video=await req('/videos',{method:'POST',tokens:contributor,raw:videoBytes,headers:{'Content-Type':'video/mp4'}});assert.equal(video.status,200);
  const film=story('excerpt',{body:'Private writing and video. '.repeat(3)+`[Film](${video.data.url} "video")`,excerpt:'The public introduction.'});
  assert.equal((await req('/studio',{method:'POST',tokens:contributor,body:film})).status,200);
  assert.equal((await req(video.data.url.slice(4)+'/url')).status,401);
  assert.equal((await req(video.data.url.slice(4)+'/url',{tokens:reader})).status,200);
  await req('/studio',{method:'POST',tokens:contributor,body:{...film,excerpt:`A public clip. [Film](${video.data.url} "video")`}});
  assert.equal((await req(video.data.url.slice(4)+'/url')).status,200);
});

test('editable bylines preserve ownership, publication dates and admin-only deletion',async()=>{
  const post=story('public',{action:'draft',author:'  An Independent Writer  '});
  const draft=await req('/studio',{method:'POST',tokens:contributor,body:post});
  assert.equal(draft.status,200);assert.equal(draft.data.story.author,'An Independent Writer');assert.equal(draft.data.story.publishedAt,null);
  await db.query("update pm_posts set created_at='2000-01-01' where id=$1",[post.id]);
  const published=await req('/studio',{method:'POST',tokens:contributor,body:{...post,action:'publish'}});
  assert.equal(published.status,200);assert.ok(new Date(published.data.story.publishedAt).getFullYear()>2020);
  assert.equal(published.data.story.createdAt,published.data.story.publishedAt);
  const revised=await req('/studio',{method:'POST',tokens:contributor,body:{...post,action:'publish',author:'Pearling',admin:true}});
  assert.equal(revised.data.story.author,'Pearling');assert.equal(revised.data.story.publishedAt,published.data.story.publishedAt);
  assert.equal(revised.data.story.number,published.data.story.number);
  assert.equal((await req('/session',{tokens:contributor})).data.admin,false);
  for(const tokens of [contributor,other])assert.equal((await req('/studio?id='+post.id,{method:'DELETE',tokens})).status,403);
  assert.equal((await req('/studio?id='+post.id,{method:'DELETE',tokens:reader})).status,401);
  assert.equal((await req('/studio?id='+post.id,{method:'DELETE'})).status,401);
  assert.equal((await rpc('delete',{id:post.id},{contributorId:'contributor-2',admin:false}))._status,403);
  assert.equal((await req('/studio',{method:'POST',tokens:other,body:{...post,author:'Someone else'}})).status,403);
  assert.equal((await req('/studio?id='+post.id,{method:'DELETE',tokens:admin})).status,200);
  assert.equal((await req('/stories/'+post.id)).status,404);
  assert.ok(!(await req('/stories?scope=public')).data.stories.some(s=>s.id===post.id));
  const privateDraft=story('private',{action:'draft',author:'Draft Writer'});
  await req('/studio',{method:'POST',tokens:other,body:privateDraft});
  assert.equal((await req('/studio?id='+privateDraft.id,{method:'DELETE',tokens:other})).status,403);
  assert.equal((await req('/studio?id='+privateDraft.id,{method:'DELETE',tokens:admin})).status,200);
  for(const author of ['a'.repeat(61),'Line\nBreak',123])assert.equal((await req('/studio',{method:'POST',tokens:contributor,body:story('private',{author})})).status,400);
});

test('checkout follows IP country, handles unknown location, and never changes access',async()=>{
  for(const ip of ['1.178.19.0','1.178.19.255','2001:470:1a0e::','2001:0470:1A0E:ffff:ffff:ffff:ffff:ffff','::FFFF:01b2:1305'])assert.equal(regionForIp(ip),'indonesia');
  for(const ip of [undefined,'10.0.0.1','172.16.1.1','fe80::1','fe80::1%eth0','not an address','8.8.8.8:443'])assert.equal(regionForIp(ip),null);
  assert.equal(regionForRequest(new Request('https://test.invalid',{headers:{'x-forwarded-for':'8.8.8.8, 1.178.19.5'}})),'international');
  assert.equal(regionForRequest(new Request('https://test.invalid',{headers:{'cf-connecting-ip':'1.178.19.5'}})),'indonesia');
  for(const [ip,region]of [['1.178.19.5','indonesia'],['::ffff:1.178.19.5','indonesia'],['8.8.8.8','international'],['2606:4700:4700::1111','international'],['127.0.0.1',null],['192.168.1.1',null],['::1',null],['',null],['invalid',null]]){
    const r=await req('/settings',{headers:{'x-forwarded-for':ip}});
    assert.equal(r.status,200);assert.equal(r.data.checkout.region,region);
    assert.equal(r.data.checkout.indonesiaUrl,'https://payments.example/checkout');
    assert.equal(r.data.checkout.internationalUrl,'https://international.example/checkout');
    assert.equal(r.headers.get('cache-control'),'private, no-store');
    assert.ok(!('contributors'in r.data));
  }
  assert.equal((await req('/settings?country=ID')).data.checkout.region,null);
  assert.equal((await req('/settings',{headers:{'cf-ipcountry':'ID'}})).data.checkout.region,null);
  assert.equal((await req('/settings',{headers:{'accept-language':'id-ID'}})).data.checkout.region,null);
  assert.equal((await req('/stories',{headers:{'cf-ipcountry':'ID'}})).status,401);
  assert.equal((await req('/studio',{headers:{'cf-ipcountry':'US'}})).status,401);
  assert.equal((await req('/settings',{tokens:admin,headers:{'cf-ipcountry':'US'}})).data.paymentUrl,'https://payments.example/checkout');
});

test('curator settings and validation never grant contributor administration',async()=>{
  const publicSettings=await req('/settings');assert.equal(publicSettings.data.paymentUrl,'https://payments.example/checkout');assert.ok(!('contributors'in publicSettings.data));
  assert.equal((await req('/settings',{method:'POST',tokens:contributor,body:{paymentUrl:''}})).status,403);
  assert.equal((await req('/settings',{method:'POST',tokens:admin,body:{contributor:{id:'contributor-1',name:'Changed'}}})).status,400);
  assert.equal((await req('/settings',{method:'POST',tokens:admin,body:{contributor:{id:'contributor-2',name:'Assigned name'}}})).status,200);
  assert.equal((await req('/session',{tokens:contributor})).data.contributor.name,'Assigned name');
  for(const patch of [{body:'short'},{visibility:'unknown'},{id:'not-an-id'},{cover:'javascript:alert(1)'},{tags:[123]},{visibility:'excerpt',excerpt:''}])
    assert.equal((await req('/studio',{method:'POST',tokens:contributor,body:story('private',patch)})).status,400);
});

test('CORS, session revocation, expiry and global brute-force protection',async()=>{
  assert.equal((await req('/session',{method:'OPTIONS'})).status,204);
  const cors=await req('/session',{origin:'https://www.pearlinglim.com'});assert.equal(cors.headers.get('access-control-allow-origin'),'https://www.pearlinglim.com');
  const alien=await req('/session',{origin:'https://untrusted.example'});assert.equal(alien.status,403);assert.equal(alien.headers.get('access-control-allow-origin'),null);
  assert.equal((await req('/studio',{method:'POST',tokens:contributor,body:story(),origin:null})).status,403);
  const session=(await login(10)).data.tokens;
  assert.equal((await req('/session?scope=contributor',{method:'DELETE',tokens:session})).status,200);
  const remaining=(await req('/session',{tokens:session})).data;assert.equal(remaining.contributor,null);assert.ok(remaining.reader);
  await db.query('update pm_sessions set expires_at=now()-interval \'1 second\' where token_hash=$1',[await sha(session.reader)]);
  assert.equal((await req('/session',{tokens:session})).data.reader,null);
  await db.exec('delete from pm_attempts');
  for(let i=0;i<20;i++){client=9000;assert.equal((await req('/session',{method:'POST',body:{code:'000000'}})).status,401);}
  client=9000;assert.equal((await req('/session',{method:'POST',body:{code:'000000'}})).status,429);
  await db.exec('delete from pm_attempts');
  for(let i=0;i<200;i++)assert.equal((await req('/session',{method:'POST',body:{code:'000000'}})).status,401);
  const throttled=await req('/session',{method:'POST',body:{code:'000000'}});assert.equal(throttled.status,429);assert.equal(throttled.headers.get('retry-after'),'900');
});

test('temporary reader codes are administrator-only, expire, revoke, and never grant contribution',async()=>{
  await db.exec('delete from pm_attempts');
  for(const tokens of [{},reader,contributor]){
    assert.equal((await req('/reader-passes',{tokens})).status,403);
    assert.equal((await req('/reader-passes',{method:'POST',tokens,body:{action:'create',days:7,label:'Test'}})).status,403);
  }
  assert.equal((await rpc('pass_create',{days:7},{}))._status,403);
  assert.equal((await req('/reader-passes',{method:'POST',tokens:admin,body:{action:'create',days:0,label:''}})).status,400);
  for(const days of [1,7,28,45,90,180,3650]){
    const result=await req('/reader-passes',{method:'POST',tokens:admin,body:{action:'create',days,label:'Test invitation'}});
    assert.equal(result.status,200);const {code,pass}=result.data;
    assert.match(code,/^\d{6}$/);assert.equal(pass.duration_days,days);
    assert.equal(Date.parse(pass.expires_at)-Date.parse(pass.created_at),days*86400000);
    assert.ok(!codes.some(c=>c.hash===pass.code_hash));assert.equal(pass.code_hash,undefined);
    const list=await req('/reader-passes',{tokens:admin});assert.ok(!JSON.stringify(list.data).includes(code));assert.ok(!JSON.stringify(list.data).includes('code_hash'));
    const signIn=()=>req('/session',{method:'POST',body:{code,intent:'reader'}});
    const temporary=(await signIn()).data.tokens;
    assert.equal((await req('/session',{tokens:temporary})).data.reader.role,'reader');
    assert.equal((await req('/stories',{tokens:temporary})).status,200);
    assert.equal((await req('/studio',{tokens:temporary})).status,401);
    assert.equal((await req('/reader-passes',{tokens:temporary})).status,403);
    assert.equal((await req('/session',{method:'POST',body:{code,intent:'contributor'}})).status,401);
    assert.equal((await rpc('login',{accessId:'temporary:'+pass.id,sessions:[{scope:'contributor',hash:'a'.repeat(64)}]},{}))._status,401);
    if(days===7){
      await db.query('update pm_reader_passes set expires_at=now()-interval \'1 second\' where id=$1',[pass.id]);
    }else{
      assert.equal((await req('/reader-passes',{method:'POST',tokens:admin,body:{action:'revoke',id:pass.id}})).status,200);
    }
    assert.equal((await signIn()).status,401);
    assert.equal((await req('/stories',{tokens:temporary})).status,401);
  }
  // Permanent reader slots remain valid independently of temporary passes.
  for(let i=0;i<10;i++)assert.equal((await login(i)).status,200);
});

test('only administrator can change displayed dates without rewriting publication timestamps',async()=>{
  const input=story('public',{body:'A paragraph with **bold**, *italic*, and ***both together***.\n\nA second paragraph to preserve.'});
  const original=await req('/studio',{method:'POST',tokens:contributor,body:input});assert.equal(original.status,200);
  const originalDate=original.data.story.publishedAt;
  for(const date of ['2026-02-30','bad',null])assert.equal((await req('/studio',{method:'POST',tokens:admin,body:{...input,publicationDate:date}})).status,400);
  assert.equal((await req('/studio',{method:'POST',tokens:contributor,body:{...input,publicationDate:'2026-01-01'}})).status,403);
  assert.equal((await rpc('save',{...input,publicationDate:'2026-01-01'},{contributorId:'contributor-2'}))._status,403);
  const adjusted=await req('/studio',{method:'POST',tokens:admin,body:{...input,publicationDate:'2026-01-01'}});
  assert.equal(adjusted.status,200);assert.equal(adjusted.data.story.publishedAt,'2026-01-01T12:00:00+07:00');
  assert.equal(new Date((await db.query('select published_at from pm_posts where id=$1',[input.id])).rows[0].published_at).toISOString(),new Date(originalDate).toISOString());
  assert.equal((await req('/studio',{method:'POST',tokens:contributor,body:input})).data.story.publicationDate,'2026-01-01');
  const read=await req('/stories/'+input.id);assert.equal(read.data.story.body,input.body);assert.equal(read.data.story.publicationDate,'2026-01-01');
  const reset=await req('/studio',{method:'POST',tokens:admin,body:{...input,publicationDate:''}});assert.equal(reset.data.story.publishedAt,originalDate);
  const draft=await req('/studio',{method:'POST',tokens:admin,body:story('private',{action:'draft',publicationDate:'2026-01-02'})});
  assert.equal(draft.data.story.publishedAt,null);assert.equal(draft.data.story.publicationDate,'2026-01-02');
});

test('only master settings disclose contributor codes',async()=>{
 for(const tokens of [{},reader,contributor]){const response=await req('/settings',{tokens});assert.equal(response.status,200);assert.equal(response.data.contributors,undefined);assert.ok(!JSON.stringify(response.data).includes('100011'));}
 const response=await req('/settings',{tokens:admin});assert.equal(response.data.contributors.length,5);assert.deepEqual(response.data.contributors.map(c=>c.code),codes.slice(10).map(c=>c.code));assert.ok(!JSON.stringify(response.data).includes('hash'));
});

test('master controls contributor reading without changing writing or permanent reader codes',async()=>{
 const payload={contributor:{id:'contributor-2',readerAccess:true}};
 assert.equal((await login(11,'reader')).status,401);
 for(const tokens of [{},reader,contributor])assert.equal((await req('/settings',{method:'POST',tokens,body:payload})).status,403);
 assert.equal((await req('/settings',{method:'POST',tokens:admin,body:{contributor:{id:'contributor-1',readerAccess:false}}})).status,400);
 assert.equal((await req('/settings',{method:'POST',tokens:admin,body:{contributor:{id:'contributor-2',readerAccess:'true'}}})).status,400);
 assert.equal((await req('/settings',{method:'POST',tokens:admin,body:payload})).status,200);
 const settings=(await req('/settings',{tokens:admin})).data;
 assert.equal(settings.contributors.find(c=>c.id==='contributor-2').readerAccess,true);
 assert.equal(settings.contributors.find(c=>c.id==='contributor-1').readerAccess,true);
 const writing=(await login(11)).data.tokens,reading=(await login(11,'reader')).data.tokens;
 for(const tokens of [writing,reading]){assert.deepEqual(Object.keys(tokens).sort(),['contributor','reader']);assert.equal((await req('/stories',{tokens})).status,200);assert.equal((await req('/studio',{tokens})).status,200);assert.equal((await req('/session',{tokens})).data.admin,false)}
 assert.equal((await req('/settings',{method:'POST',tokens:admin,body:{contributor:{id:'contributor-2',readerAccess:false}}})).status,200);
 for(const tokens of [writing,reading]){assert.equal((await req('/stories',{tokens})).status,401);assert.equal((await req('/studio',{tokens})).status,200)}
 assert.equal((await login(11,'reader')).status,401);assert.equal((await req('/stories',{tokens:reader})).status,200);
 await req('/settings',{method:'POST',tokens:admin,body:payload});
 assert.equal((await req('/stories',{tokens:reading})).status,401,'revoked tokens stay revoked after re-enable');
 await req('/settings',{method:'POST',tokens:admin,body:{contributor:{id:'contributor-2',readerAccess:false}}});
});

test('revisions and repeated publish requests do not consume Matter numbers',async()=>{
 const post=story();const first=await req('/studio',{method:'POST',tokens:admin,body:post});assert.equal(first.status,200);
 for(let i=0;i<4;i++){const r=await req('/studio',{method:'POST',tokens:admin,body:{...post,title:'Revision '+i}});assert.equal(r.status,200);assert.equal(r.data.story.number,first.data.story.number);assert.equal(r.data.story.slug,first.data.story.slug)}
 const repeated=await Promise.all([1,2,3].map(()=>req('/studio',{method:'POST',tokens:admin,body:post})));assert.ok(repeated.every(r=>r.status===200&&r.data.story.number===first.data.story.number));
 const draft=story('private',{action:'draft'});await req('/studio',{method:'POST',tokens:admin,body:draft});
 const next=await req('/studio',{method:'POST',tokens:admin,body:{...draft,action:'publish'}});assert.equal(next.status,200);assert.equal(next.data.story.number,first.data.story.number+1);
 await req('/studio?id='+next.data.story.id,{method:'DELETE',tokens:admin});
 const afterDelete=await req('/studio',{method:'POST',tokens:admin,body:story()});assert.equal(afterDelete.data.story.number,next.data.story.number+1,'deleted numbers are never reused');
});
