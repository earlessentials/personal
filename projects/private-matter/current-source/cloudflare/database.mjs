// D1 is reachable only through the Worker binding. Every operation checks its role.
const fail=(error,_status=400)=>({_status,error});
const unpack=r=>r?{...r,tags:JSON.parse(r.tags||'[]')}:null;
const safePass=r=>{if(!r)return r;const {code_hash,...pass}=r;return pass};
export function createRpc(db){
 const stmt=(sql,args=[])=>db.prepare(sql).bind(...args);
 const one=(sql,args=[])=>stmt(sql,args).first();
 const many=async(sql,args=[])=>(await stmt(sql,args).all()).results;
 const run=(sql,args=[])=>stmt(sql,args).run();
 return async(op,d={},u={})=>{
 const now=new Date().toISOString(),reader=!!u.reader,admin=!!u.admin,actor=u.contributorId||null;
 const owns=p=>admin||!!(actor&&p.access_id===actor);
 if(op==='passes'){if(!admin)return fail('Curator access required.',403);return {passes:(await many('SELECT * FROM pm_reader_passes ORDER BY created_at DESC LIMIT 200')).map(safePass)}}
 if(op==='pass_create'){
  if(!admin)return fail('Curator access required.',403);
  if(!Number.isInteger(d.days)||d.days<1||d.days>3650||typeof d.label!=='string'||d.label.length>80)return fail('Choose a whole number from 1 to 3650 days and a label of up to 80 characters.');
  const expiry=new Date(Date.now()+d.days*86400000).toISOString();
  const r=await stmt('INSERT INTO pm_reader_passes(id,code_hash,suffix,label,duration_days,created_at,expires_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(code_hash) DO NOTHING RETURNING *',[d.id,d.hash,d.suffix,d.label,d.days,now,expiry]).first();
  return r?{pass:safePass(r)}:{collision:true};
 }
 if(op==='pass_revoke'){
  if(!admin)return fail('Curator access required.',403);
  const result=await db.batch([stmt('UPDATE pm_reader_passes SET revoked_at=coalesce(revoked_at,?) WHERE id=? RETURNING id',[now,d.id]),stmt('DELETE FROM pm_sessions WHERE access_id=?',['temporary:'+d.id])]);
  return result[0].results.length?{ok:true}:fail('Reader code not found.',404);
 }
 if(op==='pass_lookup'){const p=await one('SELECT id FROM pm_reader_passes WHERE code_hash=? AND revoked_at IS NULL AND expires_at>?',[d.hash,now]);return p?{id:'temporary:'+p.id,role:'reader',name:null}:null}
 if(op==='contributor_access'){const p=await one('SELECT value FROM pm_settings WHERE key=?',['contributor_reader:'+d.id]);return {readerAccess:p?.value==='true'}}
 if(op==='session'){
  const s=await one(`SELECT s.*,p.name,p.access_id AS profile_id,(SELECT value FROM pm_settings WHERE key='contributor_reader:'||s.access_id) AS reader_access FROM pm_sessions s LEFT JOIN pm_profiles p ON p.access_id=s.access_id WHERE s.token_hash=? AND s.scope=? AND s.expires_at>? AND (s.access_id NOT LIKE 'temporary:%' OR (s.scope='reader' AND EXISTS(SELECT 1 FROM pm_reader_passes t WHERE 'temporary:'||t.id=s.access_id AND t.revoked_at IS NULL AND t.expires_at>?)))`,[d.hash,d.scope,now,now]);
  return s?{readerAccess:s.reader_access==='true',accessId:s.access_id,name:s.name,hasProfile:!!s.profile_id,temporary:s.access_id.startsWith('temporary:'),expiresAt:s.expires_at}:null;
 }
 if(op==='rate'){
  const window=Math.floor(Date.now()/900000),expiry=new Date(Date.now()+1800000).toISOString();
  const rows=await db.batch([stmt('DELETE FROM pm_attempts WHERE expires_at<?',[now]),stmt('DELETE FROM pm_sessions WHERE expires_at<?',[now]),...['global:'+window,'client:'+d.key+':'+window].map(key=>stmt('INSERT INTO pm_attempts VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET hits=hits+1 RETURNING hits',[key,expiry]))]);
  return {allowed:rows[2].results[0].hits<=200&&rows[3].results[0].hits<=20};
 }
 if(op==='login'){
  const temporary=d.accessId.startsWith('temporary:');
  if(temporary&&d.sessions.some(s=>s.scope!=='reader'))return fail('Access not recognized.',401);
  const expiry=new Date(Date.now()+7*86400000).toISOString();
  const statements=d.sessions.map(s=>temporary?stmt(`INSERT INTO pm_sessions SELECT ?,?,? ,min(?,expires_at) FROM pm_reader_passes WHERE 'temporary:'||id=? AND revoked_at IS NULL AND expires_at>? RETURNING token_hash`,[s.hash,d.accessId,s.scope,expiry,d.accessId,now]):s.scope==='reader'&&/^contributor-[2-5]$/.test(d.accessId)?stmt("INSERT INTO pm_sessions SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM pm_settings WHERE key=? AND value='true') RETURNING token_hash",[s.hash,d.accessId,s.scope,expiry,'contributor_reader:'+d.accessId]):stmt('INSERT INTO pm_sessions VALUES(?,?,?,?) RETURNING token_hash',[s.hash,d.accessId,s.scope,expiry]));
  const results=await db.batch(statements);return results.every(r=>r.results.length)?{ok:true}:fail('Access not recognized.',401);
 }
 if(op==='logout'){if(d.hashes.length)await run(`DELETE FROM pm_sessions WHERE token_hash IN (${d.hashes.map(()=>'?').join(',')})`,d.hashes);return {ok:true}}
 if(op==='stories'){
  if(!d.publicOnly&&!d.catalog&&!reader&&!admin)return fail('Your reading session has closed.',401);
  const rows=(await many(`SELECT * FROM pm_posts WHERE status='published' AND (?=0 OR visibility='public') ORDER BY matter_number DESC`,[d.publicOnly?1:0])).map(unpack);
  const q=(d.q||'').toLowerCase();return {rows:rows.filter(p=>(!d.subject||p.tags.includes(d.subject))&&(!q||[p.title,p.subtitle,d.catalog?(p.visibility==='excerpt'?p.excerpt:''):p.body,p.author,p.category,...p.tags].join(' ').toLowerCase().includes(q)))};
 }
 if(op==='story'){
  const p=unpack(await one(`SELECT * FROM pm_posts WHERE status IN ('draft','published') AND (id=? OR slug=? OR CAST(matter_number AS TEXT)=?) LIMIT 1`,[d.id,d.id,d.id.replace(/^0+/, '')]));
  if(!p||(p.status!=='published'&&!owns(p)))return fail('This matter does not exist.',404);
  if(!reader&&!owns(p)&&p.visibility!=='public')return {row:p,locked:true,next:null};
  const next=await one(`SELECT matter_number AS number,slug FROM pm_posts WHERE status='published' AND matter_number>? AND (?=1 OR visibility='public') ORDER BY matter_number LIMIT 1`,[p.matter_number,reader||admin?1:0]);
  return {row:p,locked:false,next};
 }
 if(op==='studio'){if(!actor)return fail('Invitation required.',401);return {rows:(await many(`SELECT * FROM pm_posts WHERE status IN ('draft','published') AND (?=1 OR access_id=?) ORDER BY updated_at DESC`,[admin?1:0,actor])).map(unpack)}}
 if(op==='save'){
  if(!actor)return fail('Invitation required.',401);
  if(Object.hasOwn(d,'publicationDate')){
   if(!admin)return fail('Only Pearling can adjust publication dates.',403);
   if(typeof d.publicationDate!=='string'||d.publicationDate&&(!/^\d{4}-\d{2}-\d{2}$/.test(d.publicationDate)||!Number.isFinite(Date.parse(d.publicationDate))||new Date(d.publicationDate).toISOString().slice(0,10)!==d.publicationDate))return fail('Choose a valid publication date.');
  }
  if(d.author!==undefined&&(typeof d.author!=='string'||d.author.length>60||/[\u0000-\u001f\u007f]/.test(d.author)))return fail('Use a writer name of up to 60 characters.');
  const old=await one('SELECT * FROM pm_posts WHERE id=?',[d.id]);
  if(old&&!owns(old))return fail('This matter is not yours to edit.',403);
  if(old?.status==='published'&&d.action==='draft'&&old.visibility!==d.visibility)return fail('Use Publish revision to confirm a change to who can read this matter.');
  for(const id of d.mediaIds||[]){const m=await one('SELECT * FROM pm_media WHERE id=?',[id]);if(!m)return fail('An uploaded image or video is unavailable. Please upload it again.');if(!admin&&m.owner_id!==actor)return fail('Use images and videos uploaded with your own contributor code.',403)}
  const publish=d.action==='publish',columns=['id','slug','title','subtitle','category','body','author','access_id','created_at','updated_at','published_at','status','matter_number','tags','cover','caption','image_alt','image_mode','references_text','seo_description','visibility','excerpt','display_date'];
  // Skip existing allocations before INSERT: ON CONFLICT alone advances AUTOINCREMENT.
  // Allocation and upsert share one atomic batch, preserving numbers under concurrent publishes.
  const allocation=stmt(`INSERT INTO pm_numbers(post_id) SELECT ? WHERE ?=1 AND NOT EXISTS(SELECT 1 FROM pm_numbers WHERE post_id=?) AND NOT EXISTS(SELECT 1 FROM pm_posts WHERE id=? AND access_id<>? AND ?=0) ON CONFLICT(post_id) DO NOTHING`,[d.id,publish?1:0,d.id,d.id,actor,admin?1:0]);
  const number='(SELECT number FROM pm_numbers WHERE post_id=?)';
  const values=[d.id,d.slugBase,d.id,d.id,d.title.trim()||'Untitled matter',d.subtitle.trim(),d.category,d.body,d.author?.trim()||old?.author||u.name||'Contributor',actor,now,now,publish?now:null,publish?'published':'draft',d.id,JSON.stringify(d.tags),d.cover,d.caption,d.imageAlt,d.imageMode,d.references,d.seoDescription,d.visibility,d.excerpt,Object.hasOwn(d,'publicationDate')?d.publicationDate||null:old?.display_date||null];
  const update=columns.filter(k=>!['id','access_id','created_at','slug','matter_number','published_at','status'].includes(k)).map(k=>`${k}=excluded.${k}`).join(',');
  const sql=`INSERT INTO pm_posts(${columns.join(',')}) VALUES(?,?||'-'||coalesce(CAST(${number} AS TEXT),substr(?,1,6)),?,?,?,?,?,?,?,?,?,?,${number},?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET ${update},slug=CASE WHEN pm_posts.matter_number IS NULL THEN excluded.slug ELSE pm_posts.slug END,matter_number=coalesce(pm_posts.matter_number,excluded.matter_number),published_at=coalesce(pm_posts.published_at,excluded.published_at),status=CASE WHEN pm_posts.status='published' THEN 'published' ELSE excluded.status END WHERE (?=1 OR pm_posts.access_id=?) AND (pm_posts.status<>'published' OR ?='publish' OR pm_posts.visibility=excluded.visibility) RETURNING *`;
  const results=await db.batch([allocation,stmt(sql,[...values,admin?1:0,actor,d.action])]);
  return results[1].results.length?{row:unpack(results[1].results[0])}:fail('The matter changed. Refresh and try again.',409);
 }
 if(op==='delete'){if(!actor)return fail('Invitation required.',401);if(!admin)return fail('Only Pearling can delete a matter.',403);const row=await stmt('DELETE FROM pm_posts WHERE id=? RETURNING id',[d.id]).first();return row?{ok:true}:fail('This matter does not exist.',404)}
 if(op==='settings'){const p=await one("SELECT value FROM pm_settings WHERE key='payment_url'");return {paymentUrl:p?.value||null,...(admin?{readerAccess:Object.fromEntries((await many("SELECT key,value FROM pm_settings WHERE key LIKE 'contributor_reader:%'")).map(p=>[p.key.slice('contributor_reader:'.length),p.value==='true'])),profiles:Object.fromEntries((await many('SELECT * FROM pm_profiles')).map(p=>[p.access_id,p.name]))}:{})}}
 if(op==='settings_save'){
  if(!admin)return fail('Curator access required.',403);
  if(Object.hasOwn(d,'paymentUrl'))await run("INSERT INTO pm_settings VALUES('payment_url',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",[d.paymentUrl]);
  if(d.contributor){const c=d.contributor;if(!/^contributor-[2-5]$/.test(c.id))return fail('This assignment cannot be changed.');
   if(Object.hasOwn(c,'readerAccess')&&typeof c.readerAccess!=='boolean')return fail('Choose whether reader access is enabled.');
   const changes=[];
   if(Object.hasOwn(c,'name')){if(typeof c.name!=='string'||c.name.length>60)return fail('Use a name of up to 60 characters.');changes.push(stmt('INSERT INTO pm_profiles VALUES(?,?) ON CONFLICT(access_id) DO UPDATE SET name=excluded.name',[c.id,c.name.trim()||null]))}
   if(Object.hasOwn(c,'readerAccess')){changes.push(stmt('INSERT INTO pm_settings VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',['contributor_reader:'+c.id,String(c.readerAccess)]));if(!c.readerAccess)changes.push(stmt("DELETE FROM pm_sessions WHERE access_id=? AND scope='reader'",[c.id]))}
   if(changes.length)await db.batch(changes);
  }return {ok:true};
 }
 if(op==='media_add'){if(!actor)return fail('Invitation required.',401);await run('INSERT INTO pm_media VALUES(?,?,?,?,?)',[d.id,actor,d.contentType,d.size,now]);return {ok:true}}
 if(op==='media'){
  const m=await one('SELECT * FROM pm_media WHERE id=?',[d.id]);if(!m)return fail('This media does not exist.',404);
  if(!admin&&m.owner_id!==actor){const path='/api/media/'+m.id;const posts=await many("SELECT cover,body,references_text,excerpt,visibility FROM pm_posts WHERE status='published'");if(!posts.some(p=>((reader||p.visibility==='public')&&(p.cover===path||p.body.includes(path)||p.references_text.includes(path)))||(p.visibility==='excerpt'&&(p.cover===path||p.excerpt.includes(path)))))return fail('Reader access required.',401)}
  return {id:m.id,size:m.size,contentType:m.content_type};
 }
 return fail('Not found.',404);
 };
}
