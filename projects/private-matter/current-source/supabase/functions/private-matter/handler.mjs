const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const TOKEN=/^[a-f0-9]{64}$/;
const SCOPES=['reader','contributor'];
const MAX_VIDEO=25*1024*1024;
export const sha=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
const randomToken=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
class PublicError extends Error {constructor(message,status=400){super(message);this.status=status;}}
const deny=(message,status=400)=>{throw new PublicError(message,status)};

export function present(r,full=false){
  return {id:r.id,slug:r.slug,title:r.title,subtitle:r.subtitle,category:r.category,author:r.author,
    createdAt:r.published_at||r.created_at,publicationDate:r.display_date||'',publishedAt:r.published_at&&r.display_date?r.display_date+'T12:00:00+07:00':r.published_at,updatedAt:r.updated_at,status:r.status,number:r.matter_number,
    tags:r.tags,minutes:Math.max(1,Math.ceil(r.body.trim().split(/\s+/).length/180)),cover:r.cover,
    caption:r.caption,imageAlt:r.image_alt,imageMode:r.image_mode,visibility:r.visibility,
    ...(full?{body:r.body,references:r.references_text,seoDescription:r.seo_description,excerpt:r.excerpt}:{})};
}
async function limitedBytes(request,max){
  if(Number(request.headers.get('content-length')||0)>max)deny('This upload is too large.',413);
  const reader=request.body?.getReader();if(!reader)deny('Missing request body.');
  const chunks=[];let size=0;
  while(true){const{done,value}=await reader.read();if(done)break;size+=value.length;
    if(size>max){await reader.cancel();deny('This upload is too large.',413)}chunks.push(value);}
  const result=new Uint8Array(size);let offset=0;for(const c of chunks){result.set(c,offset);offset+=c.length}return result;
}
async function input(request,max){
  if(!request.headers.get('content-type')?.includes('application/json'))deny('Expected JSON.');
  try{const value=JSON.parse(new TextDecoder().decode(await limitedBytes(request,max)));
    if(!value||typeof value!=='object'||Array.isArray(value))deny('Invalid request.');return value;
  }catch(error){if(error instanceof PublicError)throw error;deny('Invalid request.');}
}
function validateStory(d){
  const text=(k,max)=>typeof d[k]==='string'&&d[k].length<=max;
  if(d.author!==undefined){
    if(!text('author',60)||/[\u0000-\u001f\u007f]/.test(d.author))deny('Use a writer name of up to 60 characters.');
    d.author=d.author.trim();
  }
  if(!UUID.test(d.id||'')||!['draft','publish'].includes(d.action)||!text('title',120)||!text('subtitle',240)||!text('body',100000)||!text('category',100)||
    !Array.isArray(d.tags)||d.tags.length>12||!d.tags.every(x=>typeof x==='string'&&x.length<=40)||
    !['private','excerpt','public'].includes(d.visibility)||!['inline','wide','full'].includes(d.imageMode)||
    !['cover','caption','imageAlt','references','seoDescription','excerpt'].every(k=>text(k,k==='references'?10000:k==='excerpt'?4000:1000)))deny('Please review the title and content.');
  if(d.cover&&!/^\/api\/media\/[a-f0-9-]{36}$/.test(d.cover)){
    try{const u=new URL(d.cover);if(u.protocol!=='https:'||u.username||u.password)throw Error()}catch{deny('Use an uploaded image or a complete HTTPS image address.')}
  }
  if(d.action==='publish'&&(d.title.trim().length<3||d.body.trim().length<50))deny('A title and at least 50 characters of writing are required.');
  if(d.visibility==='excerpt'&&d.action==='publish'&&!d.excerpt.trim())deny('Add the public excerpt you wish to share.');
  d.mediaIds=Array.from(new Set(Array.from((d.cover+' '+d.body+' '+d.excerpt+' '+d.references).matchAll(/\/api\/media\/([a-f0-9-]{36})/g),m=>m[1])));
  if(d.mediaIds.length>40||d.mediaIds.some(id=>!UUID.test(id)))deny('Keep a matter to 40 valid uploaded images and videos.');
  d.slugBase=d.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'untitled';
  return d;
}

// Dependencies are injected so the real PostgreSQL authorization and HTTP
// behavior can be tested without creating a hosted project or exposing secrets.
export function createHandler({rpc,storage,codes,paymentUrl='',internationalPaymentUrl='',resolveCheckoutRegion=()=>null,origins}){
  if(!Array.isArray(codes)||codes.length!==15||codes.filter(a=>a.role==='reader').length!==10||
    codes.filter(a=>a.role==='contributor').length!==5||new Set(codes.map(a=>a.id)).size!==15||
    new Set(codes.map(a=>a.hash)).size!==15||codes.some(a=>!TOKEN.test(a.hash))||
    !codes.some(a=>a.id==='contributor-1'&&a.role==='contributor'&&a.name==='Pearling'))throw Error('Invalid private access configuration');
  const allowed=new Set(origins);
  async function call(op,data={},user={}){
    const result=await rpc(op,data,user);
    if(result?._status)deny(result.error,result._status);return result;
  }
  async function member(request,scope){
    const value=request.headers.get('X-PM-'+scope)||'';if(!TOKEN.test(value))return null;
    const session=await call('session',{hash:await sha(value),scope});
    const access=session&&(session.temporary&&scope==='reader'?{id:session.accessId,role:'reader',name:null}:codes.find(a=>a.id===session.accessId));
    if(!access||(scope==='contributor'&&access.role!=='contributor')||
      (scope==='reader'&&access.role!=='reader'&&access.id!=='contributor-1'&&!session.readerAccess))return null;
    return {...access,expiresAt:session.expiresAt,temporary:!!session.temporary,name:session.hasProfile?session.name:access.name,admin:access.id==='contributor-1'};
  }
  return async request=>{
    const origin=request.headers.get('origin');
    const headers={'Cache-Control':'private, no-store','Vary':'Origin','X-Content-Type-Options':'nosniff',
      'X-Robots-Tag':'noindex, noarchive','Referrer-Policy':'no-referrer'};
    if(origin&&allowed.has(origin))Object.assign(headers,{'Access-Control-Allow-Origin':origin,
      'Access-Control-Allow-Headers':'content-type,x-pm-reader,x-pm-contributor',
      'Access-Control-Allow-Methods':'GET,POST,DELETE,OPTIONS','Access-Control-Max-Age':'600'});
    const reply=(data,status=200)=>Response.json(data,{status,headers});
    if(origin&&!allowed.has(origin))return reply({error:'Invalid request origin.'},403);
    if(request.method==='OPTIONS')return new Response(null,{status:origin&&allowed.has(origin)?204:403,headers});
    if(!['GET','POST','DELETE'].includes(request.method))return reply({error:'Method not allowed.'},405);
    if(request.method!=='GET'&&!origin)return reply({error:'Invalid request origin.'},403);
    try{
      // Hosted Supabase removes /functions/v1 before invoking the function.
      // Accept both that runtime path and the complete local test URL.
      const url=new URL(request.url),path=url.pathname.replace(/^(?:\/functions\/v1)?\/private-matter(?=\/|$)/,'');
      if(path==='/session'&&request.method==='POST'){
        // Client-provided forwarding headers are not our only rate-limit key.
        const rate=await call('rate',{key:await sha((request.headers.get('x-forwarded-for')||'unknown').slice(0,200))});
        if(!rate.allowed){headers['Retry-After']='900';deny('Please pause. Try again in 15 minutes.',429)}
        const d=await input(request,512),scope=d.intent==='contributor'?'contributor':'reader';
        if(typeof d.code!=='string'||!/^\d{6}$/.test(d.code))deny('Access not recognized.',401);
        const digest=await sha(d.code);
        const access=codes.find(a=>a.hash===digest)||(scope==='reader'?await call('pass_lookup',{hash:digest}):null),admin=access?.id==='contributor-1';
        const readerAccess=!!(access?.role==='contributor'&&!admin&&(await call('contributor_access',{id:access.id}))?.readerAccess);
        if(!access||(scope==='reader'&&access.role!=='reader'&&!admin&&!readerAccess)||(scope==='contributor'&&access.role!=='contributor'))deny(scope==='contributor'?'Invitation not recognized.':'Access not recognized.',401);
        const tokens={},sessions=[];
        for(const item of admin||readerAccess?SCOPES:[scope]){tokens[item]=randomToken();sessions.push({scope:item,hash:await sha(tokens[item])});}
        await call('login',{accessId:access.id,sessions});
        return reply({granted:true,admin,tokens});
      }
      if(path==='/session'&&request.method==='DELETE'){
        const scope=url.searchParams.get('scope'),hashes=[];
        for(const item of SCOPES)if(!scope||scope===item){const token=request.headers.get('X-PM-'+item)||'';if(TOKEN.test(token))hashes.push(await sha(token));}
        if(scope&&!SCOPES.includes(scope))deny('Invalid session scope.');
        await call('logout',{hashes});return reply({ok:true});
      }
      const [reader,contributor]=await Promise.all(SCOPES.map(scope=>member(request,scope)));
      const admin=!!(reader?.admin||contributor?.admin);
      const user={reader:!!reader,admin,contributorId:contributor?.id||null,name:contributor?.name||null};
      const safe=a=>a?{name:a.name,role:a.role,admin:a.admin}:null;
      if(path==='/session'&&request.method==='GET')return reply({reader:safe(reader),contributor:safe(contributor),admin});
      if(path==='/stories'&&request.method==='GET'){
        const result=await call('stories',{publicOnly:url.searchParams.get('scope')==='public',catalog:url.searchParams.get('scope')==='catalog',q:(url.searchParams.get('q')||'').slice(0,200),subject:(url.searchParams.get('subject')||'').slice(0,40)},user);
        return reply({stories:result.rows.map(r=>present(r))});
      }
      if(path.startsWith('/stories/')&&request.method==='GET'){
        const id=decodeURIComponent(path.slice('/stories/'.length));if(id.length>150)deny('This matter does not exist.',404);
        const result=await call('story',{id},user),r=result.row;
        return reply({story:{...present(r,!result.locked),...(result.locked?{excerpt:r.visibility==='excerpt'?r.excerpt:'',...(r.visibility==='private'?{cover:'',caption:'',imageAlt:''}:{})}:{}),locked:result.locked},next:result.next});
      }
      if(path==='/reader-passes'){
        if(!admin)deny('Curator access required.',403);
        if(request.method==='GET')return reply(await call('passes',{},user));
        if(request.method==='POST'){
          const d=await input(request,1024);
          if(d.action==='revoke'){
            if(!UUID.test(d.id||''))deny('Reader code not found.',404);
            return reply(await call('pass_revoke',{id:d.id},user));
          }
          if(d.action!=='create'||(!Number.isInteger(d.days)||d.days<1||d.days>3650)||typeof d.label!=='string'||d.label.length>80||/[\u0000-\u001f\u007f]/.test(d.label))deny('Choose a whole number from 1 to 3650 days and a label of up to 80 characters.');
          for(let attempt=0;attempt<20;attempt++){
            let value;do{value=crypto.getRandomValues(new Uint32Array(1))[0]}while(value>=4294000000);
            const code=String(value%1000000).padStart(6,'0'),hash=await sha(code);
            if(codes.some(c=>c.hash===hash))continue;
            const result=await call('pass_create',{id:crypto.randomUUID(),hash,suffix:code.slice(-2),days:d.days,label:d.label.trim()},user);
            if(!result.collision)return reply({...result,code});
          }
          deny('Could not create a code. Please try again.',503);
        }
      }
      if(path==='/studio'){
        if(!contributor)deny('Invitation required.',401);
        if(request.method==='GET'){const result=await call('studio',{},user);return reply({stories:result.rows.map(r=>present(r,true))});}
        if(request.method==='POST'){
          const d=validateStory(await input(request,660000));
          if(Object.hasOwn(d,'publicationDate')){
            if(!admin)deny('Only Pearling can adjust publication dates.',403);
            if(typeof d.publicationDate!=='string'||(d.publicationDate!==''&&(!/^\d{4}-\d{2}-\d{2}$/.test(d.publicationDate)||!Number.isFinite(Date.parse(d.publicationDate+'T12:00:00Z'))||new Date(d.publicationDate+'T12:00:00Z').toISOString().slice(0,10)!==d.publicationDate)))deny('Choose a valid publication date.');
          }
          const result=await call('save',d,user);return reply({story:present(result.row,true)});
        }
        if(request.method==='DELETE'){if(!admin)deny('Only Pearling can delete a matter.',403);const id=url.searchParams.get('id')||'';if(!UUID.test(id))deny('This matter does not exist.',404);return reply(await call('delete',{id},user));}
      }
      if(path==='/settings'){
        if(request.method==='GET'){
          const data=await call('settings',{},user),result={paymentUrl:data.paymentUrl??paymentUrl};
          // IP location suggests a checkout; it never grants reader/admin access.
          result.checkout={
            region:resolveCheckoutRegion(request),
            indonesiaUrl:result.paymentUrl,internationalUrl:internationalPaymentUrl,
          };
          if(admin)result.contributors=codes.filter(a=>a.role==='contributor').map(a=>({id:a.id,name:Object.hasOwn(data.profiles,a.id)?data.profiles[a.id]:a.name,admin:a.id==='contributor-1',readerAccess:a.id==='contributor-1'||!!data.readerAccess?.[a.id],code:typeof a.code==='string'&&/^\d{6}$/.test(a.code)?a.code:null}));
          return reply(result);
        }
        if(request.method==='POST'){
          if(!admin)deny('Curator access required.',403);
          const d=await input(request,4096);
          if(d.paymentUrl!==undefined){if(typeof d.paymentUrl!=='string'||d.paymentUrl.length>2000)deny('Use a complete payment address.');
            if(d.paymentUrl){try{const u=new URL(d.paymentUrl);if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error()}catch{deny('Use a complete payment address.')}}}
          if(d.contributor){const c=d.contributor;if(!codes.some(a=>a.id===c.id&&a.role==='contributor')||c.id==='contributor-1'||(!Object.hasOwn(c,'name')&&!Object.hasOwn(c,'readerAccess'))||(Object.hasOwn(c,'name')&&(typeof c.name!=='string'||c.name.length>60))||(Object.hasOwn(c,'readerAccess')&&typeof c.readerAccess!=='boolean'))deny('This assignment cannot be changed.');}
          return reply(await call('settings_save',d,user));
        }
      }
      if((path==='/media'||path==='/videos')&&request.method==='POST'){
        if(!contributor)deny('Invitation required.',401);
        let bytes,type;
        if(path==='/media'){
          const raw=await limitedBytes(request,8500000);
          let form;try{form=await new Response(raw,{headers:{'Content-Type':request.headers.get('content-type')||''}}).formData()}catch{deny('Choose a JPEG, PNG or WebP image.');}
          const file=form.get('file');if(!(file instanceof File)||!file.size||file.size>8000000)deny('Choose a JPEG, PNG or WebP image under 8 MB.');
          bytes=new Uint8Array(await file.arrayBuffer());type=file.type;
          const kind=bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'image/jpeg':bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71?'image/png':
            String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'?'image/webp':null;
          if(!kind||type!==kind)deny('Choose a valid JPEG, PNG or WebP image.');
        }else{
          type=request.headers.get('content-type')?.split(';')[0];if(!['video/mp4','video/webm'].includes(type))deny('Choose an MP4 or WebM video.');
          bytes=await limitedBytes(request,MAX_VIDEO);const head=new TextDecoder('latin1').decode(bytes.slice(0,4096));
          const mp4=bytes.length>16&&head.slice(4,8)==='ftyp'&&/^(isom|iso[2-9]|mp4[12]|avc1|M4V |dash)/.test(head.slice(8,12));
          const webm=bytes.length>16&&bytes[0]===0x1a&&bytes[1]===0x45&&bytes[2]===0xdf&&bytes[3]===0xa3&&head.includes('webm');
          if(!(type==='video/mp4'?mp4:webm))deny('This file is not a supported MP4 or WebM video.');
        }
        const id=crypto.randomUUID();await storage.upload(id,bytes,type);
        try{await call('media_add',{id,contentType:type,size:bytes.length},user)}catch(error){await storage.remove(id).catch(()=>{});throw error;}
        return reply({url:'/api/media/'+id});
      }
      const mediaMatch=/^\/media\/([a-f0-9-]{36})\/url$/.exec(path);
      if(mediaMatch&&request.method==='GET'&&UUID.test(mediaMatch[1])){
        await call('media',{id:mediaMatch[1]},user);
        // The URL exposes only one approved object for 15 minutes, never a
        // membership token. Range requests are handled by private Storage.
        const seconds=reader?.temporary&&!contributor?Math.max(1,Math.min(900,Math.floor((Date.parse(reader.expiresAt)-Date.now())/1000))):900;
        return reply({url:await storage.sign(mediaMatch[1],seconds),expiresIn:seconds});
      }
      return reply({error:'Not found.'},404);
    }catch(error){
      if(error instanceof PublicError)return reply({error:error.message},error.status);
      // Do not log headers, codes, credentials, database results or session IDs.
      console.error('PRIVATE MATTER backend request failed');
      return reply({error:'The room is temporarily unavailable. Please try again.'},503);
    }
  };
}
