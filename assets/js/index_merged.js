// ════════════════════════════════════════════════════════════════════════════
// LabelManager OS — index_merged.js
// Merged from:  assets/js/index.js  +  assets/js/index_patch.js
// Contains:     Full LOS app object  +  LMAuth/LMHelp boot integration
// Load order:   lucide → wavesurfer → auth.js → index_merged.js
// ════════════════════════════════════════════════════════════════════════════
// ────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────────────────────
const LABEL_CONFIG = {
  name:    'Bunte Panther',
  color:   '#c9a84c',   // gold accent
  country: 'DE',
  currency:'EUR',
};

const TASK_TPL = {
  Single:['Artwork erstellen (3000×3000)','Mastering abschließen','DistroKid Upload','ISRC + UPC beantragen','Spotify Editorial Pitch','Pre-Save Link','Social Media Countdown','DJ Promo Links','Blog Outreach (5)','Post-Release Analytics'],
  EP:['Tracklist finalisieren','Artwork + Label Copy','Mastering aller Tracks','Katalognummer','DistroKid/Believe Upload','ISRC alle Tracks','Beatport Exclusive (4W)','Spotify Pitch','Pre-Save Kampagne','DJ Promo CSV','PR Outreach (10 Blogs)','Instagram Reel','Post-Release Check'],
  Album:['A&R Tracklist finalisieren','Mixing finalisieren','Mastering (Digital + Vinyl)','Artwork (Front/Back/Inlay)','Label Copy + Credits','Vinylpressung','Distributor Setup (WW)','ISRC alle Tracks','Pitchtext DE/EN','Spotify Pitch','Apple Music Pitch','Pre-Save 4 Wochen vorher','Pressearbeit 6 Wochen','Video Produktion','Bandcamp Early Access','Post-Campaign Auswertung'],
  Compilation:['Artist Submissions','Verträge alle Artists','Tracklist + Running Order','Mastering + Artwork','Katalognummer','Upload','Blog + Radio Outreach','Promo Links']
};

const ROLES = {
  admin:         {label:'Admin',         col:'#c9a84c', mods:['dash','crm','anr','releases','contracts','finance','bookings','media','research','users','actlog','royalties','tracks','catalog','anrpro','marketing','analytics','collab','user-circle','manager-portal','integrations'], write:['*']},
  label_manager: {label:'Manager',       col:'#4a9fa8', mods:['dash','crm','anr','releases','contracts','finance','bookings','media','research','actlog'],          write:['crm','anr','releases','contracts','bookings','media']},
  ar:            {label:'A&R',           col:'#7c6fa8', mods:['dash','crm','anr','releases','media','research'],                                                     write:['anr','media']},
  artist:        {label:'Artist',        col:'#3d9970', mods:['dash','anr','releases','media'],                                                                      write:[]},
};

const RBAC_MX = {
  'CRM':        {admin:true, label_manager:true,  ar:'read',   artist:false},
  'Demos/A&R':  {admin:true, label_manager:true,  ar:true,     artist:'own'},
  'Releases':   {admin:true, label_manager:true,  ar:'read',   artist:'own'},
  'Contracts':  {admin:true, label_manager:true,  ar:false,    artist:false},
  'Finance':    {admin:true, label_manager:true,  ar:false,    artist:false},
  'Royalties':  {admin:true, label_manager:true,  ar:false,    artist:false},
  'Bookings':   {admin:true, label_manager:true,  ar:false,    artist:'own'},
  'Media':      {admin:true, label_manager:true,  ar:true,     artist:'own'},
  'Catalog':    {admin:true, label_manager:true,  ar:true,     artist:'own'},
  'Anrpro':    {admin:true, label_manager:true,  ar:true,     artist:'own'},
  'Users':      {admin:true, label_manager:false, ar:false,    artist:false},
  'Log':        {admin:true, label_manager:true,  ar:false,    artist:false},
};

const ANR_COLS = [
  {key:'Neu',       label:'New ♫',        col:'#5a5a72'},
  {key:'In Review', label:'Review ▶',     col:'#4a9fa8'},
  {key:'Gespräch',  label:'Interest ♥︎',   col:'#7c6fa8'},
  {key:'Offer',     label:'Contract ✉',   col:'#c9a84c'},
  {key:'Signed',    label:'Signed ✓',     col:'#3d9970'},
  {key:'Abgelehnt', label:'Pass ⃠',      col:'#c0524e'},
];
//  {key:'Shortlist', label:'Shortlist', col:'#c9a84c'},

const REL_ST = ['Idea','A&R Selected','In Production','Mastered','Distro Setup','Pre-Save','Released','Post-Campaign'];

const STATUS_CLS = {
  Active:'b-ok',Confirmed:'b-ok',Released:'b-ok',Signed:'b-ok',
  'In Review':'b-t','In Production':'b-t','In Talk':'b-t','In Negotiation':'b-t',
  Shortlist:'b-g',Option:'b-g',Offer:'b-g',Mastered:'b-g','A&R Selected':'b-g',
  Neu:'b-n',Draft:'b-n',Idea:'b-n',Inactive:'b-n',
  Abgelehnt:'b-e',Expired:'b-e',Cancelled:'b-e',
};

// ────────────────────────────────────────────────────────────────────────────
// SEED DATA
// ────────────────────────────────────────────────────────────────────────────
const SEED = {
  artists:[
    {id:'_vm2c3y0',name:'doerd',type:'Core Artist',status:'Active',territory:'WW',email:'me@doerd.de',phone:'+4917646560517',genres:'House, DeepHoue, TechHouse, Breakbeat, Dub, DubHouse',links:'https://instagram.com/micha.doerd, https://facebook.com/doerdMUSIC, https://www.discogs.com/artist/13394895-doerd, https://open.spotify.com/artist/54FAWeprinaFoAgojTEYJZ, https://www.junodownload.com/artists/Doerd/, https://www.beatport.com/de/artist/doerd/1438284, https://www.traxsource.com/artist/991643/doerd, https://music.apple.com/us/artist/doerd/1689888147, https://soundcloud.com/doert-solo',notes:'DOERD (DÖRT / DOERT)  is a Germany-based Electronic Music Producer, whose prolific and varied output embodies a deliberate \"musical schizophrenia\" by encompassing a wide spectrum of genres. His repertoire seamlessly transitions between Deep House, Tech House, Melodic House, and Breakbeats to introspective soundscapes like Chillout, Ambient, and Easy Listening.\n\nHis signature sound is defined by deep chords, driving grooves, and pulsating rhythms. DOERD maintains the constant objective of creating tracks that resonate with audiences and \"generate excitement on the dance floor\',producing always with \"at least one ear and one eye at the dancefloor\".\n\nDOERD operates under the core philosophy: \"This music should not be defined by genres but solely by your ♥'},
    {id:'_nz1kb0u',name:'OX',type:'Core Artist',status:'Active',territory:'WW',email:'ox@buntepanther.de',phone:'+49170000000',genres:'House, DeepHoue, TechHouse, Breakbeat, Dub, DubHouse',links:'',notes:''},
    {id:'_aqyxvl9',name:'Subfari',type:'Core Artist',status:'Active',territory:'WW',email:'subfari@buntepanther.de',phone:'+49170000000',genres:'House, DeepHoue, TechHouse, Breakbeat, Dub, DubHouse',links:'',notes:''}
  ],
  demos:[],
  releases:[],
  contracts:[],
  events:[],
  media:[],
  royalties:[
    // {id:'ro1',release_id:'r1',source:'Spotify (DistroKid)',net_amount:1240.50},
    // {id:'ro2',release_id:'r1',source:'Beatport',net_amount:320.00},
    // {id:'ro3',release_id:'r1',source:'Apple Music',net_amount:850.00}
  ],
  expenses:[
    {id:'x1',description:'Mastering - EXAMPLE',category:'Mastering',amount:250,artist_id:'a1',release_id:'r1',recouped:250},
    {id:'x2',description:'PR Campaign - EXAMPLE',category:'PR',amount:500,artist_id:'a1',release_id:'r1',recouped:320}
  ],
  curators:[
    {id:'cu1',name:'RA Reviews',type:'Blog',genre:'Techno',contact:'reviews@ra.co',submits:'ra.co/submit'},
    {id:'cu2',name:'Acid Test Podcast',type:'Podcast',genre:'Techno, Acid',contact:'',submits:'acidtest.com'},
    {id:'cu3',name:'Groove Magazine',type:'Print/Web',genre:'Electronic',contact:'redaktion@groove.de',submits:''}
  ],
  users:[
    {id:'_0x0k0gl',name:'Admin',email:'admin@buntepanther.de',role:'admin',artist_id:'',status:'Active',last_active:'2026-05-09'},
    {id:'_ld74r1k',name:'Micha',email:'doerd@buntepanther.de',role:'admin',artist_id:'_vm2c3y0',status:'Active',last_active:'2026-05-08',lastactive:'2026-05-09'},
    {id:'_msvcnw7',name:'Oscar',email:'ox@buntepanther.de',role:'admin',artist_id:'_nz1kb0u',status:'Active',last_active:'2026-05-09'},
    {id:'_l4asmcl',name:'Hardy',email:'subfari@buntepanther.de',role:'admin',artist_id:'_aqyxvl9',status:'Active',last_active:'2026-05-09'}
  ],
  activity_log:[

  ],
  tracks: [
      {
        id:'_uaef1rh', title:'DADDYWASA (liveRecord)', artist_id:'_vm2c3y0', release_id:', isrc:', version:'Club', bpm:'124', key:', duration:', composer:'Michael Matzat', publisher:'Bunte Panther', p_line:', c_line:', territory:'WW', explicit:true, rights_in:true, license_expires:'', tags:'house, doerd, club', genre:'', quality_score:null, credits:[]
      }
  ],
  royalty_contracts: [],
  royalty_statements: [],
  distributor_mappings: [
    {
      id:'dm1', name:'DistroKid', col_source:0, col_release_id:1,
      col_net:2, col_territory:3, col_period:4, delimiter:','
    }
  ],
  remix_contests: [],
  ar_scores: [],
  smart_links: [
    {
      id:'sl1', title:'EXAMPLE — Smart Link', release_id:'r1', artist_id:'a1',
      slug:'void-ep', type:'release',
      destinations:[
        {platform:'Spotify',   url:'https://open.spotify.com/album/example', active:true},
        {platform:'Beatport',  url:'https://beatport.com/release/void-ep/1', active:true},
        {platform:'Bandcamp',  url:'https://buntepanther.bandcamp.com',       active:true},
        {platform:'Apple Music',url:'https://music.apple.com/album/example', active:true},
      ],
      presave_active:false, email_capture:true, clicks:0,
      created:'2026-04-01', expires:'',
      bg_color:'#0e0f14', accent:'#c9a84c',
      meta_title:'EP by Bunte Panther', meta_img:''
    }
  ],
  promo_links: [],
  epks: [],
  global_tasks: [],
  automations: [
    {id:'au1', trigger:'demo_status_offer',  action:'create_contract_draft', active:true, label:'Demo → Offer creates Contract Draft'},
    {id:'au2', trigger:'release_created',    action:'create_release_tasks',  active:true, label:'New Release creates Task Checklist'},
    {id:'au3', trigger:'gig_confirmed',      action:'create_gig_tasks',      active:true, label:'Confirmed Gig creates Itinerary Tasks'},
  ],
  notes: [],
  comments: [],
  channel_stats: [],
  notifications: [
    {id:'n1', type:'task_due',    msg:'Bunte Panther Dataset Loaded.', read:false, ts:'2026-05-03 06:00', link:'dash'},
    {id:'n2', type:'demo_new',    msg:'New demo: "DADDYWASA" by doerd', read:false, ts:'2026-05-03 05:10', link:'anr'},
  ],
  webhooks: [
    {id:'_jr4n1xw',name:'#notify-🔔',url:'https://discord.com/api/webhooks/1502561854218833970/3EZFmXP3ksqy8CkLUYvydFfuOKrVPvmFDHtTSJtx2eYgGpWRzCEcd5HslPw5PFZXQznZ',active:true,platform:'Discord',events: ['demo.new','demo.status_changed','release.created','gig.confirmed','payout.created','contract.expiring'],created:'2026-05-09'}
  ],
  integration_logs: [],
  portal_sessions: [],
  distributor_exports: []
};

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────
const uid   = () => '_'+Math.random().toString(36).slice(2,9);
const esc   = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fmtE  = v => v ? `€ ${parseFloat(v).toFixed(2)}` : '—';
const fmtT  = ts => new Date(ts).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
const badge = s => `<span class="bd ${STATUS_CLS[s]||'b-n'}">${esc(s)||'—'}</span>`;

function loadDB() {
  try {
    const raw = JSON.parse(localStorage.getItem('los_v3')||'{}');
    const db  = {};
    Object.keys(SEED).forEach(k => { db[k] = Array.isArray(raw[k]) ? raw[k] : JSON.parse(JSON.stringify(SEED[k])); });
    return db;
  } catch { return JSON.parse(JSON.stringify(SEED)); }
}

// ────────────────────────────────────────────────────────────────────────────
// ARTIST-SELECT WIDGET
// A reusable searchable dropdown bound to db.artists
// ────────────────────────────────────────────────────────────────────────────
const ArtSel = {
  _state: {},

  build(containerId, opts={}) {
    // opts: {placeholder, allowEmpty, emptyLabel, filter, value, onChange}
    const id    = containerId;
    const state = this._state[id] = { value: opts.value||'', open: false, q: '' };
    const el    = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    el.innerHTML = `
      <div class="art-sel">
        <div class="art-sel-inp" id="asi-${id}" tabindex="0" onclick="ArtSel.toggle('${id}')" onkeydown="ArtSel.kd(event,'${id}')">
          <span id="asl-${id}">${opts.allowEmpty?(opts.emptyLabel||'— None —'):'Select artist…'}</span>
        </div>
        <i data-lucide="chevron-down" class="art-sel-arrow" style="width:13px"></i>
        <div class="art-sel-drop" id="asd-${id}">
          <div class="art-sel-search"><input type="text" id="asq-${id}" placeholder="Search…" oninput="ArtSel.filter('${id}',this.value)" onclick="event.stopPropagation()"></div>
          <div id="aso-${id}"></div>
        </div>
      </div>`;
    this._opts[id] = opts;
    this.renderOpts(id, '');
    if (opts.value) this.setValue(id, opts.value, true);
    lucide.createIcons();
  },

  _opts: {},

  renderOpts(id, q) {
    const opts  = this._opts[id]||{};
    const list  = (LOS.db.artists||[]).filter(a => {
      if (opts.filter && !opts.filter(a)) return false;
      return !q || a.name.toLowerCase().includes(q.toLowerCase());
    });
    const container = document.getElementById('aso-'+id);
    if (!container) return;
    let html = '';
    if (opts.allowEmpty) {
      html += `<div class="art-opt" data-id="" onclick="ArtSel.select('${id}','','${esc(opts.emptyLabel||'— None —')}')">
        ${esc(opts.emptyLabel||'— None —')}
      </div>`;
    }
    if (!list.length && q) {
      html += `<div class="art-opt-none">No artists found</div>`;
    } else {
      list.forEach(a => {
        const sel = this._state[id]?.value === a.id ? ' sel' : '';
        html += `<div class="art-opt${sel}" data-id="${a.id}" onclick="ArtSel.select('${id}','${a.id}','${esc(a.name)}')">
          ${esc(a.name)} <span style="color:var(--muted);font-size:11px;margin-left:6px">${esc(a.type)}</span>
        </div>`;
      });
    }
    container.innerHTML = html;
  },

  filter(id, q) { this._state[id].q = q; this.renderOpts(id, q); },

  toggle(id) {
    const drop = document.getElementById('asd-'+id);
    const inp  = document.getElementById('asi-'+id);
    if (!drop) return;
    this._state[id].open = !this._state[id].open;
    drop.classList.toggle('open', this._state[id].open);
    inp.classList.toggle('open', this._state[id].open);
    if (this._state[id].open) {
      setTimeout(() => document.getElementById('asq-'+id)?.focus(), 50);
    }
  },

  close(id) {
    const drop = document.getElementById('asd-'+id);
    const inp  = document.getElementById('asi-'+id);
    if (drop) { drop.classList.remove('open'); inp.classList.remove('open'); }
    if (this._state[id]) this._state[id].open = false;
  },

  select(id, value, label) {
    this._state[id] = {...(this._state[id]||{}), value, open: false };
    const lbl = document.getElementById('asl-'+id);
    if (lbl) { lbl.textContent = label; lbl.style.color = value ? 'var(--text)' : 'var(--muted)'; }
    this.close(id);
    const onChange = this._opts[id]?.onChange;
    if (onChange) onChange(value, label);
  },

  setValue(id, value, silent) {
    const a = (LOS?.db?.artists||[]).find(x => x.id === value);
    const label = a ? a.name : (this._opts[id]?.emptyLabel || '— None —');
    if (this._state[id]) this._state[id].value = value;
    const lbl = document.getElementById('asl-'+id);
    if (lbl) { lbl.textContent = label; lbl.style.color = value ? 'var(--text)' : 'var(--muted)'; }
    if (!silent && this._opts[id]?.onChange) this._opts[id].onChange(value, label);
  },

  getValue(id) { return this._state[id]?.value || ''; },

  kd(e, id) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(id); }
    if (e.key === 'Escape') this.close(id);
  }
};

// Close dropdowns on outside click
document.addEventListener('click', e => {
  Object.keys(ArtSel._state).forEach(id => {
    if (ArtSel._state[id].open) {
      const el = document.getElementById('asd-'+id);
      if (el && !el.closest('.art-sel')?.contains(e.target)) ArtSel.close(id);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// RELEASE SELECT HELPER (simpler, no search needed usually)
// ────────────────────────────────────────────────────────────────────────────
function buildRelSel(containerId, selectedId='', allowEmpty=true) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const releases = LOS.db.releases||[];
  let html = `<select class="inp" id="${containerId}-sel">`;
  if (allowEmpty) html += `<option value="">— No release —</option>`;
  releases.forEach(r => {
    const art = (LOS.db.artists||[]).find(a => a.id === r.artist_id);
    html += `<option value="${r.id}" ${r.id===selectedId?'selected':''}>${esc(r.title)}${art?' ('+esc(art.name)+')':''}</option>`;
  });
  html += `</select>`;
  el.innerHTML = html;
}

function buildContactSel(containerId, selectedId='') {
  const el = document.getElementById(containerId);
  if (!el) return;
  const contacts = (LOS.db.artists||[]).filter(a => ['Manager','Booker','PR Agency','Distributor','Blog','Radio'].includes(a.type));
  let html = `<select class="inp" id="${containerId}-sel"><option value="">— None —</option>`;
  contacts.forEach(c => {
    html += `<option value="${c.id}" ${c.id===selectedId?'selected':''}>${esc(c.name)} (${esc(c.type)})</option>`;
  });
  html += '</select>';
  el.innerHTML = html;
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────────────────────────────────
const LOS = {
  db:    loadDB(),
  ws:    null,
  dragId:null,
  role:  'admin',
  _upFile: null,
  _mmFile: null,

  init() {
    this.save();
    this.setupNav();
    this.setupPlayer();
    this.setupKeys();
    this.updateRoleChip();
    this.initNotifications();
    this.renderAll();
    lucide.createIcons();
  },

  save() { localStorage.setItem('los_v3', JSON.stringify(this.db)); },

  log(action, module='System') {
    const u = this.db.users?.find(u => u.role === this.role);
    this.db.activity_log.unshift({id:uid(), ts:new Date().toISOString(), user:u?.name||'Unknown', action, module});
    if (this.db.activity_log.length > 300) this.db.activity_log = this.db.activity_log.slice(0,300);
    this.save();
  },

  toast(msg, type='ok') {
    const t = document.createElement('div');
    t.className = `tos ${type==='ok'?'ok':'er'}`;
    t.innerHTML = `<i data-lucide="${type==='ok'?'check-circle':'alert-circle'}" style="width:13px;color:${type==='ok'?'var(--ok)':'var(--err)'}"></i> ${msg}`;
    document.getElementById('toast').appendChild(t);
    lucide.createIcons();
    setTimeout(() => t.remove(), 3200);
  },

  // ── SIDEBAR MOBILE ────────────────────────────────────────────────────
  openSb()  { document.getElementById('sb').classList.add('open'); document.getElementById('sbOverlay').classList.add('open'); },
  closeSb() { document.getElementById('sb').classList.remove('open'); document.getElementById('sbOverlay').classList.remove('open'); },

  // ── RBAC ──────────────────────────────────────────────────────────────
  cycleRole() {
    const keys = Object.keys(ROLES);
    this.role = keys[(keys.indexOf(this.role)+1) % keys.length];
    this.updateRoleChip();
    this.applyRBAC();
    this.toast(`Role: ${ROLES[this.role].label}`);
  },
  updateRoleChip() {
    const r = ROLES[this.role];
    document.getElementById('role').innerHTML = `<i data-lucide="shield" style="width:11px;color:${r.col}"></i> ${r.label}`;
    lucide.createIcons();
  },
  applyRBAC() {
    const allowed = ROLES[this.role].mods;
    document.querySelectorAll('.nav[data-view]').forEach(el => {
      el.style.display = allowed.includes(el.dataset.view) ? 'flex' : 'none';
    });
    document.getElementById('btn-add-art').style.display =
      (ROLES[this.role].write.includes('*') || ROLES[this.role].write.includes('crm')) ? 'inline-flex' : 'none';
  },

  // ── NAV ───────────────────────────────────────────────────────────────
  setupNav() {
    const names = {
      dash:'Dashboard',
      crm:'Artists & CRM',
      anr:'Demos & A&R',
      releases:'Releases',
      contracts:'Contract Vault',
      royalties:'Royalties Pro',
      finance:'Finance & Royalties',
      bookings:'Bookings & Events',
      media:'Media Library',
      catalog:'Catalog & Rights',
      anrpro:'A&R Intelligence',
      research:'Research',
      users:'Users & Roles',
      actlog:'Activity Log',
      marketing:'Marketing',
      analytics:'Analytics',
      collab:'Collab & Tasks',
      'artist-portal':  'Artist Portal',
      'manager-portal': 'Manager Portal',
      integrations:     'Integrations',
    };
    document.querySelectorAll('.nav[data-view]').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.nav').forEach(n => n.classList.remove('on'));
        el.classList.add('on');
        document.querySelectorAll('.view').forEach(s => s.classList.remove('on'));
        document.getElementById('view-'+el.dataset.view)?.classList.add('on');
        document.getElementById('tbTitle').textContent = names[el.dataset.view]||el.dataset.view;
        this.closeSb();
        if (el.dataset.view === 'research') setTimeout(() => this.renderResearch(), 50);
        if (el.dataset.view === 'anr')      this.buildModalSelects();
        lucide.createIcons();
      });
    });
    this.applyRBAC();
  },

  setupKeys() {
    document.addEventListener('keydown', e => {
      if ((e.metaKey||e.ctrlKey) && e.key==='k') { e.preventDefault(); this.openSearch(); }
      if (e.key === 'Escape') {
        this.closeSearch();
        this.closeAdm();
        document.querySelectorAll('.mbb.open').forEach(m => m.classList.remove('open'));
      }
    });
  },

  // ── BUILD MODAL SELECTS ───────────────────────────────────────────────
  buildModalSelects() {
    const defs=[
      {id:'asel-demo',     opts:{allowEmpty:true, emptyLabel:'— External Artist —'}},
      {id:'asel-release',  opts:{allowEmpty:false}},
      {id:'asel-contract', opts:{allowEmpty:false, filter:a=>['Core Artist','Development','Legacy'].includes(a.type)}},
      {id:'asel-event',    opts:{allowEmpty:false, filter:a=>['Core Artist','Development','Legacy'].includes(a.type)}},
      {id:'asel-expense',  opts:{allowEmpty:true, emptyLabel:'— No Artist —'}},
      {id:'asel-media',    opts:{allowEmpty:true, emptyLabel:'— No Artist —'}},
      {id:'asel-user',     opts:{allowEmpty:true, emptyLabel:'— Not linked —', filter:a=>['Core Artist','Development','Legacy'].includes(a.type)}},
      {id:'asel-roycon',   opts:{allowEmpty:false}},
      {id:'asel-stmt',     opts:{allowEmpty:false}},
      {id:'asel-payout',   opts:{allowEmpty:false}},
      {id:'asel-track',    opts:{allowEmpty:false}},
      {id:'asel-contest',  opts:{allowEmpty:true, emptyLabel:'— No Artist —'}},
      {id:'asel-epk',    opts:{allowEmpty:false, filter:a=>['Core Artist','Development','Legacy'].includes(a.type)}},
      {id:'asel-sl',     opts:{allowEmpty:true,  emptyLabel:'— No Artist —'}},
      {id:'asel-gtask',  opts:{allowEmpty:true,  emptyLabel:'— No Artist —'}},
      {id:'asel-note',   opts:{allowEmpty:true,  emptyLabel:'— No Artist —'}}
    ];
    defs.forEach(({id,opts})=>{ if(document.getElementById(id)) ArtSel.build(id,opts); });
    // Release selects
    ['rsel-contract','rsel-expense','rsel-media','rsel-roycon','rsel-track','rsel-rights','rsel-packager','rsel-contest','rsel-sl','rsel-promo','rsel-chanstat','rsel-contest','rsel-distexport'].forEach(id=>{
      if(document.getElementById(id)) buildRelSel(id,'',true);
    });
    // Track select for rights modal
    if(document.getElementById('tsel-rights')){
      const tracks=this.db.tracks||[];
      document.getElementById('tsel-rights').innerHTML=`<select class="inp" id="tsel-rights-sel">
        <option value="">— No specific track —</option>
        ${tracks.map(t=>`<option value="${t.id}">${esc(t.title)}</option>`).join('')}
      </select>`;
    }
    if(document.getElementById('csel-event')) buildContactSel('csel-event','');
    lucide.createIcons();
  },

  _goTo(viewName) {
    const navEl = document.querySelector(`.nav[data-view="${viewName}"]`);
    if(navEl) {
      navEl.click();
    } else {
      // Direkter Fallback
      document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
      const t = document.getElementById(`view-${viewName}`);
      if(t) t.style.display = 'block';
      document.querySelectorAll('.nav').forEach(n => n.classList.remove('on'));
      document.querySelector(`.nav[data-view="${viewName}"]`)?.classList.add('on');
    }
  },

  // ── RENDER ALL ────────────────────────────────────────────────────────
  renderAll() {
    this.renderDash();
    this.renderCRM();
    this.renderANR();
    this.renderReleases();
    this.renderContracts();
    this.renderFinance();
    this.renderExpenses();
    this.renderBookings();
    this.renderMedia();
    this.renderUsers();
    this.renderLog();
    // Runde 1:
    if(document.getElementById('roy-overview')?.offsetParent !== null) this.renderRoyOverview();
    if(document.getElementById('cat-tracks')?.offsetParent !== null)   this.renderTracks();
    if(document.getElementById('anrp-scoring')?.offsetParent !== null) this.renderScoring();
    // Runde 2:
    if(document.getElementById('mkt-smartlinks')?.offsetParent !== null) this.renderSmartLinks();
    if(document.getElementById('mkt-promo')?.offsetParent !== null)      this.renderPromoLinks();
    if(document.getElementById('anal-overview')?.offsetParent !== null)  this.renderAnalOverview();
    if(document.getElementById('collab-tasks')?.offsetParent !== null)   this.renderGlobalTasks();
    if(document.getElementById('collab-notes')?.offsetParent !== null)   this.renderNotes();


    // Nav badges
    const newD = this.db.demos.filter(d=>d.status==='Neu').length;
    document.getElementById('navAnr').textContent = newD;
    document.getElementById('navAnr').style.display = newD ? 'inline' : 'none';
    const expC = this.db.contracts.filter(c=>c.expires && new Date(c.expires)<new Date(Date.now()+30*86400000)).length;
    document.getElementById('navExp').style.display = expC ? 'inline' : 'none';
    lucide.createIcons();
  },

  // ── DASHBOARD ─────────────────────────────────────────────────────────
  renderDash() {
    const tR = this.db.royalties.reduce((a,r)=>a+parseFloat(r.net_amount||0),0);
    const newD = this.db.demos.filter(d=>d.status==='Neu').length;
    document.getElementById('dStats').innerHTML = [
      {l:'Artists',     v:this.db.artists.filter(a=>['Core Artist','Development','Legacy'].includes(a.type)).length, col:'var(--gold)',  ic:'user-circle'},
      {l:'New Demos',   v:newD,                                                                                       col:'var(--warn)', ic:'inbox'},
      {l:'Releases',    v:this.db.releases.filter(r=>r.status!=='Released').length,                                  col:'var(--teal)', ic:'disc-3'},
      {l:'Net Revenue', v:`€${tR.toFixed(0)}`,                                                                       col:'var(--ok)',   ic:'trending-up'},
    ].map(s=>`<div class="card stat"><div class="sl flex gap2" style="gap:6px"><i data-lucide="${s.ic}" style="width:12px"></i>${s.l}</div><div class="sv" style="color:${s.col}">${s.v}</div></div>`).join('');

    const demoHtml = this.db.demos.filter(d=>d.status==='Neu').slice(0,5).map(d=>{
      const art = this.db.artists.find(a=>a.id===d.artist_id);
      return `<div class="flex gap2 mb4" style="cursor:pointer;padding:6px 0;border-bottom:1px solid var(--b1)" onclick="LOS.play('${esc(d.file)}','${esc(d.title)}','${esc(d.artist_name||d.title)}')">
        <i data-lucide="music" style="width:13px;color:var(--gold);flex-shrink:0;margin-top:2px"></i>
        <div class="flex-1" style="min-width:0"><div style="font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d.title)}</div>
              <div style="font-size:11px;color:var(--muted)">${esc(art?.name||d.artist_name||'External')} · ${esc(d.genre)}</div></div>
        <span style="font-size:10px;color:var(--muted);white-space:nowrap">${d.submitted||''}</span>
      </div>`;
    }).join('') || '<div style="color:var(--muted);font-size:12px;padding:8px 0">No new demos</div>';
    document.getElementById('dDemos').innerHTML = demoHtml;

    document.getElementById('dRels').innerHTML = this.db.releases.filter(r=>r.status!=='Released').slice(0,5).map(r=>{
      const art = this.db.artists.find(a=>a.id===r.artist_id);
      return `<div class="flex gap2 mb4" style="padding:6px 0;border-bottom:1px solid var(--b1)">
        <i data-lucide="disc-3" style="width:13px;color:var(--teal);flex-shrink:0;margin-top:2px"></i>
        <div class="flex-1"><div style="font-weight:600;font-size:13px">${esc(r.title)}</div>
        <div style="font-size:11px;color:var(--muted)">${esc(art?.name||'—')} · ${esc(r.type)}</div></div>
        ${badge(r.status)}
      </div>`;
    }).join('') || '<div style="color:var(--muted);font-size:12px;padding:8px 0">No active releases</div>';

    document.getElementById('dGigs').innerHTML = this.db.events.filter(e=>e.status==='Confirmed').slice(0,5).map(e=>{
      const art = this.db.artists.find(a=>a.id===e.artist_id);
      return `<div class="flex gap2 mb4" style="padding:6px 0;border-bottom:1px solid var(--b1)">
        <i data-lucide="mic-2" style="width:13px;color:var(--ok);flex-shrink:0;margin-top:2px"></i>
        <div class="flex-1"><div style="font-weight:600;font-size:13px">${esc(e.name)}</div>
        <div style="font-size:11px;color:var(--muted)">${esc(art?.name||'—')} · ${esc(e.date||'TBA')}</div></div>
        <span style="font-weight:600;font-size:13px;color:var(--ok)">${fmtE(e.fee)}</span>
      </div>`;
    }).join('') || '<div style="color:var(--muted);font-size:12px;padding:8px 0">No confirmed gigs</div>';

    const allTasks = this.db.releases.flatMap(r=>(r.tasks||[]).filter(t=>!t.done).map(t=>({...t,release:r.title})));
    document.getElementById('dTasks').innerHTML = allTasks.slice(0,6).map(t=>`
      <div class="flex gap2 mb4" style="padding:5px 0;border-bottom:1px solid var(--b1)">
        <i data-lucide="circle-dot" style="width:12px;color:var(--gold);flex-shrink:0;margin-top:2px"></i>
        <div class="flex-1"><div style="font-size:12.5px">${esc(t.text)}</div>
        <div style="font-size:11px;color:var(--muted)">${esc(t.release)}</div></div>
      </div>`).join('') || '<div style="color:var(--muted);font-size:12px;padding:8px 0">All tasks done ✓</div>';

    const tRoy = this.db.royalties.reduce((a,r)=>a+parseFloat(r.net_amount||0),0);
    const tExp = this.db.expenses.reduce((a,e)=>a+parseFloat(e.amount||0),0);
    document.getElementById('dFin').innerHTML = `
      <div class="flex gap2 mb4" style="padding:7px 0;border-bottom:1px solid var(--b1)"><span style="color:var(--muted)">Total Royalties</span><span style="margin-left:auto;font-weight:700;color:var(--ok)">${fmtE(tRoy)}</span></div>
      <div class="flex gap2 mb4" style="padding:7px 0;border-bottom:1px solid var(--b1)"><span style="color:var(--muted)">Total Expenses</span><span style="margin-left:auto;font-weight:700;color:var(--err)">${fmtE(tExp)}</span></div>
      <div class="flex gap2" style="padding:7px 0"><span style="font-weight:600">Net Balance</span><span style="margin-left:auto;font-weight:700;font-size:16px;color:var(--gold)">${fmtE(tRoy-tExp)}</span></div>`;
    lucide.createIcons();
  },

  // ── CRM ───────────────────────────────────────────────────────────────
  renderCRM() {
    const q  = document.getElementById('crmQ')?.value.toLowerCase()||'';
    const ty = document.getElementById('crmTy')?.value||'';
    const TYPE_COL = {
      'Core Artist':'var(--gold)','Development':'var(--teal)','Legacy':'var(--muted)',
      'Manager':'#9b7fc8','Booker':'#c87f9b','PR Agency':'#7fc8b8',
      'Distributor':'#c8a07f','Blog':'#7f9bc8','Radio':'#a8c87f',
    };
    const list = this.db.artists.filter(a=>{
      const qm = !q || a.name.toLowerCase().includes(q) || (a.email||'').toLowerCase().includes(q) || (a.genres||'').toLowerCase().includes(q);
      const tm = !ty || a.type===ty;
      return qm && tm;
    });
    document.getElementById('crmTbl').innerHTML = list.map(a=>{
      const relCount = this.db.releases.filter(r=>r.artist_id===a.id).length;
      return `<tr>
        <td>
          <div style="font-weight:600">${esc(a.name)}</div>
          <div style="font-size:11px;color:var(--muted)">${esc(a.email)||'—'}</div>
        </td>
        <td><span class="bd b-n" style="color:${TYPE_COL[a.type]||'var(--muted)'};border-color:${TYPE_COL[a.type]||'transparent'}20">${esc(a.type)}</span></td>
        <td>${badge(a.status)}</td>
        <td style="font-size:12px;color:var(--muted)">${esc(a.territory)||'—'}</td>
        <td style="font-size:12px;color:var(--muted)">${esc(a.genres)||'—'}</td>
        <td style="font-size:12px">${relCount||0}</td>
        <td>
          <div class="flex gap2">
            <button class="btn-ic" onclick="LOS.openArtistDrawer('${a.id}')" title="View Details"><i data-lucide="eye" style="width:13px"></i></button>
            <button class="btn-ic" onclick="LOS.deleteItem('artists','${a.id}')" title="Delete"><i data-lucide="trash-2" style="width:13px"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('') || `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:28px">No entries found</td></tr>`;
    lucide.createIcons();
  },

  openArtistDrawer(id) {
    const a = this.db.artists.find(x=>x.id===id);
    if (!a) return;
    const rels   = this.db.releases.filter(r=>r.artist_id===id);
    const demos  = this.db.demos.filter(d=>d.artist_id===id);
    const cts    = this.db.contracts.filter(c=>c.artist_id===id);
    const events = this.db.events.filter(e=>e.artist_id===id);
    const drawer = document.getElementById('artDrawer');
    drawer.style.display = 'block';
    drawer.innerHTML = `
      <div class="flex gap3 mb4" style="flex-wrap:wrap">
        <div>
          <div style="font-size:18px;font-weight:700">${esc(a.name)}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:3px">${esc(a.type)} · ${esc(a.territory)||'—'}</div>
          ${a.genres?`<div style="font-size:12px;color:var(--gold);margin-top:4px">${esc(a.genres)}</div>`:''}
        </div>
        <button class="btn-ic" style="margin-left:auto" onclick="document.getElementById('artDrawer').style.display='none'">
          <i data-lucide="x" style="width:15px"></i>
        </button>
      </div>
      ${a.notes?`<div style="font-size:13px;color:var(--muted);margin-bottom:14px;padding:10px;background:var(--s3);border-radius:8px">${esc(a.notes)}</div>`:''}
      ${a.email||a.phone?`<div class="flex gap3 mb4" style="font-size:12px;color:var(--muted);flex-wrap:wrap">
        ${a.email?`<span><i data-lucide="mail" style="width:12px;vertical-align:middle"></i> ${esc(a.email)}</span>`:''}
        ${a.phone?`<span><i data-lucide="phone" style="width:12px;vertical-align:middle"></i> ${esc(a.phone)}</span>`:''}
      </div>`:''}
      ${a.links?`<div style="font-size:12px;color:var(--teal);margin-bottom:14px">${esc(a.links)}</div>`:''}
      <div class="g4" style="gap:10px;margin-bottom:14px">
        ${[['Releases',rels.length,'disc-3'],['Demos',demos.length,'headphones'],['Contracts',cts.length,'file-signature'],['Gigs',events.length,'mic-2']].map(([l,v,ic])=>`
          <div style="background:var(--s3);border-radius:8px;padding:10px;text-align:center">
            <i data-lucide="${ic}" style="width:14px;color:var(--gold)"></i>
            <div style="font-size:20px;font-weight:700;margin:4px 0">${v}</div>
            <div style="font-size:10.5px;color:var(--muted)">${l}</div>
          </div>`).join('')}
      </div>
      ${rels.length?`<div class="ct">Releases</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">${rels.map(r=>`<span class="bd b-n">${esc(r.title)} <span style="color:var(--muted)">${esc(r.type)}</span></span>`).join('')}</div>`:''}
      ${events.length?`<div class="ct">Bookings</div><div style="display:flex;flex-wrap:wrap;gap:6px">${events.map(e=>`<span class="bd ${STATUS_CLS[e.status]||'b-n'}">${esc(e.name)} — ${esc(e.date||'TBA')}</span>`).join('')}</div>`:''}`;
    lucide.createIcons();
  },

  saveArtist() {
    const n = document.getElementById('maN')?.value.trim();
    if (!n) return this.toast('Name required','err');
    const a = {
      id:uid(), name:n,
      type:   document.getElementById('maT')?.value,
      status: document.getElementById('maS')?.value,
      territory: document.getElementById('maTe')?.value,
      email:  document.getElementById('maE')?.value,
      phone:  document.getElementById('maPh')?.value,
      genres: document.getElementById('maG')?.value,
      links:  document.getElementById('maL')?.value,
      notes:  document.getElementById('maNt')?.value,
    };
    this.db.artists.push(a);
    this.save();
    this.closeModal('add-artist');
    this.renderAll();
    this.log(`Artist/Contact "${n}" created`,'CRM');
    this.toast(`${n} added`);
    // Rebuild all artist selects in open modals
    this.buildModalSelects();
  },

  // ── A&R ───────────────────────────────────────────────────────────────
  renderANR() {
    const q   = document.getElementById('anrQ')?.value.toLowerCase()||'';
    const g   = document.getElementById('anrG')?.value||'';
    const wl  = document.getElementById('wlOnly')?.checked||false;
    const filtered = this.db.demos.filter(d=>{
      const qm = !q || d.title.toLowerCase().includes(q) || (d.artist_name||'').toLowerCase().includes(q);
      const gm = !g || d.genre===g;
      const wm = !wl || d.watchlist;
      return qm && gm && wm;
    });
    document.getElementById('anrBoard').innerHTML = ANR_COLS.map(col=>{
      const cards = filtered.filter(d=>d.status===col.key);
      return `<div class="kc">
        <div class="kch" style="background:${col.col}18;color:${col.col}">
          <span>${col.label}</span>
          <span class="bd" style="background:${col.col}22;color:${col.col};border:none">${cards.length}</span>
        </div>
        <div class="kcb" id="kcb-${col.key}"
             ondragover="event.preventDefault();this.classList.add('dov')"
             ondragleave="this.classList.remove('dov')"
             ondrop="LOS.dropDemo(event,'${col.key}')">
          ${cards.map(d=>this._demoCard(d,col.col)).join('')}
        </div>
      </div>`;
    }).join('');
    lucide.createIcons();
  },

  _demoCard(d, col) {
    const stars = [1,2,3,4,5].map(n =>
      `<span style="color:${n<=(d.rating||0)?'var(--gold)':'var(--b2)'};cursor:pointer"
             onclick="LOS.rateDemo('${d.id}',${n})">★</span>`
    ).join('');

    const art = this.db.artists.find(a => a.id === d.artist_id);
    return `<div class="kcard" draggable="true"
         ondragstart="LOS.dragStart(event,'${d.id}')"
         ondragend="document.querySelectorAll('.kcb').forEach(b=>b.classList.remove('dov'))">
      <div class="flex gap2 mb4">
        <div style="font-weight:600;font-size:13px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d.title)}</div>
        <button class="btn-ic" style="padding:2px" onclick="LOS.toggleWatchlist('${d.id}')">
          <i data-lucide="${d.watchlist?'bookmark-check':'bookmark'}"
             style="width:12px;color:${d.watchlist?'var(--gold)':'var(--muted)'}"></i>
        </button>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:7px">
        ${esc(art?.name||d.artist_name||'External')}
        ${d.genre?` · <span style="color:${col}">${esc(d.genre)}</span>`:''}
        ${d.bpm?` · <span>${d.bpm} BPM</span>`:''}
      </div>
      <div class="flex gap2" style="font-size:14px;letter-spacing:1px;margin-bottom:8px">${stars}</div>
      ${d.file?`<button class="btn btn-g"
          style="width:100%;font-size:11.5px;padding:5px;gap:5px;margin-bottom:6px"
          onclick="LOS.play('${esc(d.file)}','${esc(d.title)}','${esc(d.artist_name||'')}')">
        <i data-lucide="play-circle" style="width:12px;color:var(--gold)"></i> Play Preview
      </button>`:''}
      <select class="inp"
          style="font-size:11.5px;padding:4px 26px 4px 7px;background:var(--s3)"
          onchange="LOS.moveDemoStatus('${d.id}',this.value)">
        ${ANR_COLS.map(c=>`<option value="${c.key}" ${c.key===d.status?'selected':''}>${c.label}</option>`).join('')}
      </select>
    </div>`;
  },


    dragStart(e, id) { this.dragId=id; e.dataTransfer.setData('text/plain',id); },
  dropDemo(e, status) {
    e.preventDefault();
    document.querySelectorAll('.kcb').forEach(b=>b.classList.remove('dov'));
    if (!this.dragId) return;
    this.moveDemoStatus(this.dragId, status);
    this.dragId=null;
  },
  moveDemoStatus(id, status) {
    const d = this.db.demos.find(x=>x.id===id);
    if (!d) return;
    const prevStatus=d.status;
    d.status = status;
    this.save(); this.renderANR(); this.renderDash();
    this.log(`Demo "${d.title}" → ${status}`,'A&R');
    const newD = this.db.demos.filter(x=>x.status==='Neu').length;
    document.getElementById('navAnr').textContent=newD;
    document.getElementById('navAnr').style.display=newD?'inline':'none';
    if(prevStatus!==status){
      this.fireWebhook('demo.statuschanged',{title:d.title,artist:d.artist_name||'External',previous_status:prevStatus,new_status:status,message:`Demo "${d.title}" moved: ${prevStatus} → ${status}`});
      if(status==='Signed'){
        this.pushNotification('demo_signed',`Demo "${d.title}" SIGNED! 🎉`,'anr');
        this.fireWebhook('contract.signed',{title:d.title,artist:d.artist_name||'External',message:`🎉 "${d.title}" has been signed!`});
      }
    }
  },
  // dragStart(e, id) { this.dragId=id; e.dataTransfer.setData('text/plain',id); },
  //   // Drag start — auf der Karte
  // dragStart(e, demoId) {
  //   e.dataTransfer.effectAllowed = 'move'
  //   e.dataTransfer.setData('demoId', String(demoId))
  //   e.currentTarget.classList.add('dragging')
  // },

  dragEnd(e) {
    e.currentTarget.classList.remove('dragging')
  },

  // Drag over — auf der Spalte (preventDefault = drop erlauben)
  dragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    e.currentTarget.classList.add('drag-over')
  },

  dragLeave(e) {
    e.currentTarget.classList.remove('drag-over')
  },
  // dropDemo(e,id) {
  //   e.preventDefault()
  //   e.currentTarget.classList.remove('drag-over')

  //   const demoId   = e.dataTransfer.getData('demoId')
  //   const column   = e.currentTarget.closest('[data-status]')
  //   const newStatus = column?.dataset.status   // ← hier kommt newStatus her

  //   if (!demoId)    return console.warn('dropDemo: no demoId in dataTransfer')
  //   if (!newStatus) return console.warn('dropDemo: no data-status on drop target')

  //   this.moveDemoStatus(demoId, newStatus)
  // },
  // moveDemoStatus(id, status) {
  //   const d = this.db.demos.find(x=>x.id===id);
  //   if (!d) return;
  //   d.status = status;
  //   this.save();
  //   let newStatus = status; 
  //   if(newStatus === 'offer')  this._runAutomations('demo_status_offer',  { artist_id: demo.artist_id });
  //   if(newStatus === 'signed') this._runAutomations('demo_status_signed', { artist_id: demo.artist_id });
  //   this.renderANR(); this.renderDash();
  //   this.log(`Demo "${d.title}" → ${status}`,'A&R');
  //   const newD = this.db.demos.filter(x=>x.status==='Neu').length;
  //   document.getElementById('navAnr').textContent=newD;
  //   document.getElementById('navAnr').style.display=newD?'inline':'none';
  // },
  rateDemo(id, r) {
    const d = this.db.demos.find(x=>x.id===id);
    if (d) { d.rating=r; this.save(); this.renderANR(); this.log(`Demo "${d.title}" rated ${r}★`,'A&R'); }
  },
  toggleWatchlist(id) {
    const d = this.db.demos.find(x=>x.id===id);
    if (d) { d.watchlist=!d.watchlist; this.save(); this.renderANR(); this.toast(d.watchlist?'Added to watchlist':'Removed from watchlist'); }
  },
  saveDemo() {
    const t = document.getElementById('mdT')?.value.trim();
    if (!t) return this.toast('Track title required','err');
    const artId = ArtSel.getValue('asel-demo');
    const art   = this.db.artists.find(a=>a.id===artId);
    const d = {
      id: uid(), title: t,
      artist_id:   artId,
      artist_name: art?.name || document.getElementById('mdE')?.value.split('@')[0]||'External',
      genre:    document.getElementById('mdG')?.value,
      bpm:      document.getElementById('mdB')?.value,
      email:    document.getElementById('mdE')?.value,
      rating:   parseInt(document.getElementById('mdR')?.value)||0,
      file:     document.getElementById('mdF')?.value,
      notes:    document.getElementById('mdN')?.value,
      status:  'Neu', watchlist: false,
      submitted: new Date().toISOString().slice(0,10),
    };
    this.db.demos.push(d);
    this.save(); this.closeModal('add-demo'); this.renderAll();
    this.log(`Demo "${t}" submitted`,'A&R'); this.toast('Demo added');
    this.pushNotification('demo_new',`New demo: "${d.title}" by ${d.artist_name||'External'}`,'anr');
    this.fireWebhook('demo.new',{title:d.title,artist:d.artist_name||'External',genre:d.genre||'—',submitted:d.submitted,message:`New demo submission: "${d.title}"`});
  },

  // ── RELEASES ──────────────────────────────────────────────────────────
  renderReleases() {
    const q  = document.getElementById('relQ')?.value.toLowerCase()||'';
    const ty = document.getElementById('relTy')?.value||'';
    const list = this.db.releases.filter(r=>{
      const qm = !q || r.title.toLowerCase().includes(q);
      const tm = !ty || r.type===ty;
      return qm && tm;
    });
    document.getElementById('relList').innerHTML = list.map(r=>{
      const art   = this.db.artists.find(a=>a.id===r.artist_id);
      const tasks = r.tasks||[];
      const done  = tasks.filter(t=>t.done).length;
      const pct   = tasks.length ? Math.round(done/tasks.length*100) : 0;
      const stIdx = REL_ST.indexOf(r.status);
      return `<div class="card mb4">
        <div class="flex gap3 mb4" style="flex-wrap:wrap">
          <div>
            <div style="font-size:15px;font-weight:700">${esc(r.title)}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:3px">
              ${esc(art?.name||'—')} · ${esc(r.type)} · ${esc(r.cat||'—')} · ${esc(r.distributor||'—')}
              ${r.date?` · <span style="color:var(--gold)">${r.date}</span>`:''}
            </div>
          </div>
          <div class="flex gap2" style="margin-left:auto;align-items:flex-start;flex-wrap:wrap">
            ${badge(r.status)}
            <select class="inp" style="width:160px;font-size:11.5px;padding:4px 26px 4px 7px" onchange="LOS.setRelStatus('${r.id}',this.value)">
              ${REL_ST.map(s=>`<option ${s===r.status?'selected':''}>${s}</option>`).join('')}
            </select>
            <button class="btn-ic" onclick="LOS.deleteItem('releases','${r.id}')"><i data-lucide="trash-2" style="width:13px"></i></button>
          </div>
        </div>
        <!-- Progress bar -->
        <div class="flex gap2 mb4" style="align-items:center;gap:10px">
          <div class="pb flex-1"><div class="pf" style="width:${pct}%"></div></div>
          <span style="font-size:11px;color:var(--muted);white-space:nowrap">${done}/${tasks.length} tasks</span>
        </div>
        <!-- Release timeline stepper -->
        <div style="display:flex;gap:0;overflow-x:auto;margin-bottom:14px;padding-bottom:4px">
          ${REL_ST.map((s,i)=>{
            const active  = i===stIdx;
            const done_st = i<stIdx;
            return `<div style="display:flex;flex-direction:column;align-items:center;min-width:80px;flex:1">
              <div style="width:22px;height:22px;border-radius:50%;background:${done_st?'var(--ok)':active?'var(--gold)':'var(--s3)'};border:2px solid ${active?'var(--gold)':done_st?'var(--ok)':'var(--b1)'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${done_st||active?'#0a0a0f':'var(--muted)'}">
                ${done_st?'✓':i+1}
              </div>
              <div style="font-size:9.5px;color:${active?'var(--gold)':done_st?'var(--ok)':'var(--muted)'};margin-top:4px;text-align:center;line-height:1.3">${s}</div>
              ${i<REL_ST.length-1?`<div style="position:absolute;display:none"></div>`:''}
            </div>`;
          }).join('')}
        </div>
        <!-- Tasks -->
        <div class="ct">Tasks (${done}/${tasks.length} done)</div>
        <div>${tasks.map(t=>`
          <div class="ti ${t.done?'done':''}">
            <input type="checkbox" id="tk-${t.id}" ${t.done?'checked':''} onchange="LOS.toggleTask('${r.id}','${t.id}',this.checked)">
            <label for="tk-${t.id}">${esc(t.text)}</label>
          </div>`).join('')}
        </div>
      </div>`;
    }).join('') || '<div class="card" style="text-align:center;color:var(--muted);padding:32px">No releases yet</div>';
    lucide.createIcons();
  },

  setRelStatus(id, status) {
    const r = this.db.releases.find(x=>x.id===id);
    if (r) { r.status=status; this.save(); this.renderReleases(); this.renderDash(); this.log(`Release "${r.title}" → ${status}`,'Releases'); }
  },

  toggleTask(relId, taskId, done) {
    const r = this.db.releases.find(x=>x.id===relId);
    if (!r) return;
    const t = r.tasks?.find(x=>x.id===taskId);
    if (t) { t.done=done; this.save(); this.renderReleases(); this.log(`Task "${t.text}" ${done?'completed':'reopened'}`,'Releases'); }
  },

  saveRelease() {
    const t = document.getElementById('mrT')?.value.trim();
    if (!t) return this.toast('Title required','err');
    const artId = ArtSel.getValue('asel-release');
    if (!artId) return this.toast('Please select an artist','err');
    const ty = document.getElementById('mrTy')?.value||'Single';
    const r = {
      id:uid(), title:t, artist_id:artId, type:ty,
      cat:   document.getElementById('mrC')?.value,
      date:  document.getElementById('mrD')?.value,
      distributor: document.getElementById('mrDist')?.value,
      status: document.getElementById('mrS')?.value||'Idea',
      territory:'WW',
      tasks: (TASK_TPL[ty]||TASK_TPL.Single).map((tx,i)=>({id:uid(),text:tx,done:false})),
    };
    this.db.releases.push(r);
    this.save();
    this._runAutomations('release_created', { release_id: r.id });
    this.closeModal('add-release'); this.renderAll();
    this.log(`Release "${t}" created`,'Releases'); this.toast(`Release "${t}" created`);
    this.pushNotification('release',`Release "${t}" created`,'releases');
    const _rArt=this.db.artists.find(a=>a.id===artId);
    this.fireWebhook('release.created',{title:t,artist:_rArt?.name||'—',type:ty,catalog:r.cat||'—',date:r.date||'TBD',message:`New release: "${t}" by ${_rArt?.name||'—'}`});
    buildRelSel('rsel-contract','',true);
    buildRelSel('rsel-expense','',true);
    buildRelSel('rsel-media','',true);
  },

  // ── CONTRACTS ─────────────────────────────────────────────────────────
  renderContracts() {
    const q    = document.getElementById('conQ')?.value.toLowerCase()||'';
    const now  = Date.now();
    const warn30 = this.db.contracts.filter(c=>c.expires&&new Date(c.expires)<new Date(now+30*86400000)&&c.status==='Active');
    document.getElementById('conAlerts').innerHTML = warn30.map(c=>{
      const art=this.db.artists.find(a=>a.id===c.artist_id);
      return `<div class="eal"><i data-lucide="alert-triangle" style="width:14px;flex-shrink:0"></i> Contract for <strong>${art?.name||'?'}</strong> expires ${c.expires}</div>`;
    }).join('');

    const list = this.db.contracts.filter(c=>{
      const art=this.db.artists.find(a=>a.id===c.artist_id);
      return !q||(art?.name||'').toLowerCase().includes(q)||(c.type||'').toLowerCase().includes(q);
    });
    document.getElementById('conTbl').innerHTML = list.map(c=>{
      const art = this.db.artists.find(a=>a.id===c.artist_id);
      const rel = this.db.releases.find(r=>r.id===c.release_id);
      const expC= c.expires&&new Date(c.expires)<new Date(now+30*86400000)?'color:var(--warn);font-weight:600':'color:var(--muted)';
      return `<tr>
        <td><div style="font-weight:600">${esc(c.type)}</div>${rel?`<div style="font-size:11px;color:var(--teal)">${esc(rel.title)}</div>`:''}</td>
        <td style="font-weight:500">${esc(art?.name||'—')}</td>
        <td>${badge(c.status)}</td>
        <td style="font-size:12px">${c.label_split||50}% / ${c.artist_split||50}%</td>
        <td style="font-weight:600;color:var(--ok)">${c.advance?fmtE(c.advance):'—'}</td>
        <td style="font-size:12px;color:var(--muted)">${esc(c.territory)||'—'}</td>
        <td style="font-size:12px;${expC}">${c.expires||'—'}</td>
        <td><button class="btn-ic" onclick="LOS.deleteItem('contracts','${c.id}')"><i data-lucide="trash-2" style="width:13px"></i></button></td>
      </tr>`;
    }).join('') || `<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:24px">No contracts</td></tr>`;
    lucide.createIcons();
  },

  saveContract() {
    const artId = ArtSel.getValue('asel-contract');
    if (!artId) return this.toast('Artist required','err');
    const relSel = document.getElementById('rsel-contract-sel');
    const c = {
      id:uid(),
      type:       document.getElementById('mcTy')?.value,
      artist_id:  artId,
      release_id: relSel?.value||'',
      status:     document.getElementById('mcS')?.value,
      territory:  document.getElementById('mcTe')?.value,
      label_split:parseFloat(document.getElementById('mcL')?.value)||50,
      artist_split:parseFloat(document.getElementById('mcAr')?.value)||50,
      advance:    parseFloat(document.getElementById('mcAdv')?.value)||0,
      expires:    document.getElementById('mcExp')?.value,
    };
    this.db.contracts.push(c);
    const art=this.db.artists.find(a=>a.id===artId);
    this.save(); this.closeModal('add-contract'); this.renderAll();
    this.log(`Contract "${c.type}" for ${art?.name} created`,'Contracts'); this.toast('Contract saved');
  },

  // ── FINANCE ───────────────────────────────────────────────────────────
  renderFinance() {
    const tRoy  = this.db.royalties.reduce((a,r)=>a+parseFloat(r.net_amount||0),0);
    const tExp  = this.db.expenses.reduce((a,e)=>a+parseFloat(e.amount||0),0);
    const tRec  = this.db.expenses.reduce((a,e)=>a+parseFloat(e.recouped||0),0);
    document.getElementById('finStats').innerHTML = [
      {l:'Gross Royalties', v:fmtE(tRoy),     col:'var(--ok)',  ic:'trending-up'},
      {l:'Total Expenses',  v:fmtE(tExp),      col:'var(--err)', ic:'trending-down'},
      {l:'Net Balance',     v:fmtE(tRoy-tExp), col:'var(--gold)',ic:'wallet'},
      {l:'Recouped',        v:fmtE(tRec),      col:'var(--teal)',ic:'refresh-cw'},
    ].map(s=>`<div class="card stat"><div class="sl flex gap2" style="gap:6px"><i data-lucide="${s.ic}" style="width:12px"></i>${s.l}</div><div class="sv" style="color:${s.col}">${s.v}</div></div>`).join('');

    document.getElementById('finTbl').innerHTML = this.db.royalties.map(ro=>{
      const rel  = this.db.releases.find(r=>r.id===ro.release_id);
      const art  = this.db.artists.find(a=>a.id===rel?.artist_id);
      const net  = parseFloat(ro.net_amount||0);
      const lbl  = net*0.5; const art_s = net*0.5;
      return `<tr>
        <td style="font-size:12px">${esc(ro.source)}</td>
        <td style="font-size:12px;color:var(--muted)">${esc(rel?.title||'—')}</td>
        <td style="font-weight:600;color:var(--ok)">${fmtE(net)}</td>
        <td style="font-size:12px">${fmtE(lbl)}</td>
        <td style="font-size:12px">${esc(art?.name||'—')} ${fmtE(art_s)}</td>
        <td><span class="bd b-ok" style="font-size:10px">✓</span></td>
      </tr>`;
    }).join('') || `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:18px">No royalties — drag CSV to import</td></tr>`;

    this._drawDonut('finChart', tRoy*0.5, tRoy*0.5);
    document.getElementById('finLeg').innerHTML=`
      <span style="color:var(--gold);font-size:12px">▬ Label: ${fmtE(tRoy*0.5)}</span>
      <span style="color:var(--muted);font-size:12px">▬ Artists: ${fmtE(tRoy*0.5)}</span>`;
    lucide.createIcons();
  },

  _drawDonut(id,a,b) {
    const c=document.getElementById(id); if(!c) return;
    const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
    const total=a+b; if(!total) return;
    const cx=c.width/2,cy=c.height/2,r=64,lw=18;
    const draw=(from,to,color)=>{ ctx.beginPath(); ctx.arc(cx,cy,r,from,to); ctx.lineWidth=lw; ctx.strokeStyle=color; ctx.lineCap='butt'; ctx.stroke(); };
    const aAngle=(a/total)*2*Math.PI;
    draw(-Math.PI/2,-Math.PI/2+aAngle,'#c9a84c');
    draw(-Math.PI/2+aAngle,1.5*Math.PI,'#2a2a3a');
    ctx.fillStyle='#e8e8ef'; ctx.font='bold 13px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(fmtE(a+b),cx,cy-2);
    ctx.font='10px Inter'; ctx.fillStyle='#5a5a72';
    ctx.fillText('total',cx,cy+13);
  },

  renderExpenses() {
    document.getElementById('expTbl').innerHTML = this.db.expenses.map(x=>{
      const art = this.db.artists.find(a=>a.id===x.artist_id);
      const rel = this.db.releases.find(r=>r.id===x.release_id);
      const pct = x.amount ? Math.round((parseFloat(x.recouped||0)/parseFloat(x.amount))*100) : 0;
      const over= pct>=100;
      return `<tr>
        <td><div style="font-weight:600">${esc(x.description)}</div><div style="font-size:11px;color:var(--muted)">${esc(x.category)}</div></td>
        <td style="font-size:12px;color:var(--muted)">${esc(rel?.title||'—')}</td>
        <td style="font-size:12px">${esc(art?.name||'—')}</td>
        <td style="font-weight:600">${fmtE(x.amount)}</td>
        <td>${fmtE(x.recouped)}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="pb" style="width:64px"><div class="pf" style="width:${Math.min(pct,100)}%;background:${over?'var(--ok)':'var(--warn)'}"></div></div>
            <span class="bd ${over?'b-ok':'b-w'}" style="font-size:10px">${over?'✓ Recouped':pct+'%'}</span>
          </div>
        </td>
        <td><button class="btn-ic" onclick="LOS.deleteItem('expenses','${x.id}')"><i data-lucide="trash-2" style="width:13px"></i></button></td>
      </tr>`;
    }).join('') || `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:20px">No expenses</td></tr>`;
    lucide.createIcons();
  },

  saveExpense() {
    const d = document.getElementById('mxD')?.value.trim();
    if (!d) return this.toast('Description required','err');
    const relSel = document.getElementById('rsel-expense-sel');
    const x = {
      id:uid(), description:d,
      category: document.getElementById('mxC')?.value,
      amount:   parseFloat(document.getElementById('mxA')?.value)||0,
      artist_id:ArtSel.getValue('asel-expense'),
      release_id:relSel?.value||'',
      recouped: 0,
    };
    this.db.expenses.push(x);
    this.save(); this.closeModal('add-expense'); this.renderAll();
    this.log(`Expense "${d}" added`,'Finance'); this.toast('Expense added');
  },

  // CSV Import
  fDragOver(e) { e.preventDefault(); const o=document.getElementById('finOvl'); o.style.display='flex'; lucide.createIcons(); },
  fDragLeave()  { document.getElementById('finOvl').style.display='none'; },
  fDrop(e) {
    e.preventDefault(); document.getElementById('finOvl').style.display='none';
    const f=e.dataTransfer.files[0];
    if (!f||!f.name.endsWith('.csv')) return this.toast('Drop a valid .csv file','err');
    const reader=new FileReader();
    reader.onload=ev=>{
      const rows=ev.target.result.split('\n').slice(1);
      let count=0;
      rows.forEach(row=>{
        const c=row.split(',').map(x=>x.replace(/"/g,'').trim());
        if (c.length>=3&&c[2]) { this.db.royalties.push({id:uid(),source:c[0]+' (CSV)',release_id:c[1]||'',net_amount:parseFloat(c[2])||0}); count++; }
      });
      if (count) { this.save(); this.renderFinance(); this.log(`${count} royalty rows imported via CSV`,'Finance'); this.toast(`${count} rows imported`); }
      else this.toast('CSV empty or wrong format (Source,ReleaseID,Amount)','err');
    };
    reader.readAsText(f);
  },

  // ── BOOKINGS ──────────────────────────────────────────────────────────
  renderBookings() {
    const q  = document.getElementById('bokQ')?.value.toLowerCase()||'';
    const sf = document.getElementById('bokS')?.value||'';
    const list = this.db.events.filter(e=>{
      const art=this.db.artists.find(a=>a.id===e.artist_id);
      const qm = !q||(e.name||'').toLowerCase().includes(q)||(art?.name||'').toLowerCase().includes(q);
      const sm = !sf||e.status===sf;
      return qm && sm;
    });
    document.getElementById('bokTbl').innerHTML = list.map(e=>{
      const art=this.db.artists.find(a=>a.id===e.artist_id);
      return `<tr>
        <td><div style="font-weight:600">${esc(e.name)}</div><div style="font-size:11px;color:var(--muted)">${esc(e.promoter_name||'—')} · ${esc(e.deal_type)}</div></td>
        <td style="font-size:12px;white-space:nowrap">${e.date||'TBA'}</td>
        <td style="font-weight:500">${esc(art?.name||'—')}</td>
        <td style="font-size:12px;color:var(--muted)">${esc(e.venue||'—')}</td>
        <td>${badge(e.status)}</td>
        <td style="font-weight:600;color:var(--ok)">${fmtE(e.fee)}</td>
        <td>
          <div class="flex gap2">
            <select class="inp" style="width:112px;font-size:11px;padding:3px 22px 3px 6px" onchange="LOS.setEventStatus('${e.id}',this.value)">
              ${['Inquiry','Option','Confirmed','Settled','Cancelled'].map(s=>`<option ${s===e.status?'selected':''}>${s}</option>`).join('')}
            </select>
            <button class="btn-ic" onclick="LOS.deleteItem('events','${e.id}')"><i data-lucide="trash-2" style="width:13px"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('') || `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px">No events</td></tr>`;

    const PIPE=[['Inquiry','var(--muted)'],['Option','var(--warn)'],['Confirmed','var(--ok)'],['Settled','var(--gold)']];
    const tSettled=this.db.events.filter(e=>e.status==='Settled').reduce((a,e)=>a+parseFloat(e.fee||0),0);
    const tConf=this.db.events.filter(e=>e.status==='Confirmed').reduce((a,e)=>a+parseFloat(e.fee||0),0);
    document.getElementById('bokPipe').innerHTML = PIPE.map(([s,col])=>{
      const cnt=this.db.events.filter(e=>e.status===s).length;
      const fee=this.db.events.filter(e=>e.status===s).reduce((a,e)=>a+parseFloat(e.fee||0),0);
      return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--b1)">
        <span style="width:8px;height:8px;border-radius:50%;background:${col};flex-shrink:0;display:inline-block"></span>
        <span style="font-size:13px;font-weight:500;flex:1">${s}</span>
        <span class="bd b-n">${cnt}</span>
        <span style="font-size:13px;font-weight:600;color:${col}">${fee?fmtE(fee):'—'}</span>
      </div>`;
    }).join('') + `<div style="margin-top:12px;padding:12px;background:rgba(201,168,76,.07);border-radius:8px;font-size:12px">
      <div class="flex" style="justify-content:space-between;margin-bottom:5px"><span style="color:var(--muted)">Confirmed pipeline</span><span style="font-weight:700;color:var(--ok)">${fmtE(tConf)}</span></div>
      <div class="flex" style="justify-content:space-between"><span style="color:var(--muted)">Total settled</span><span style="font-weight:700;color:var(--gold)">${fmtE(tSettled)}</span></div>
    </div>`;
    lucide.createIcons();
  },

  setEventStatus(id, status) {
    const e=this.db.events.find(x=>x.id===id);
    if (e) { e.status=status; this.save(); this.renderBookings(); this.renderDash(); this.log(`Event "${e.name}" → ${status}`,'Bookings'); }
  },

  saveEvent() {
    const n=document.getElementById('meN')?.value.trim();
    if (!n) return this.toast('Event name required','err');
    const artId=ArtSel.getValue('asel-event');
    if (!artId) return this.toast('Artist required','err');
    const cSel=document.getElementById('csel-event-sel');
    const pId=cSel?.value||'';
    const pContact=this.db.artists.find(a=>a.id===pId);
    const e={
      id:uid(), name:n, artist_id:artId,
      date:      document.getElementById('meD')?.value,
      venue:     document.getElementById('meV')?.value,
      promoter_id:  pId,
      promoter_name:pContact?.name||document.getElementById('meV')?.value,
      deal_type: document.getElementById('meDT')?.value,
      status:    document.getElementById('meS')?.value,
      fee:       parseFloat(document.getElementById('meF')?.value)||0,
    };
    this.db.events.push(e);
    this.save();
    if(ev.status === 'Confirmed') this._runAutomations('gig_confirmed', { event_id: ev.id });
    this.closeModal('add-event'); this.renderAll();
    this.log(`Event "${n}" created`,'Bookings'); this.toast('Event saved');
  },

  // ── MEDIA ─────────────────────────────────────────────────────────────
  renderMedia() {
    const q  = document.getElementById('medQ')?.value.toLowerCase()||'';
    const ty = document.getElementById('medTy')?.value||'';
    const list = this.db.media.filter(m=>{
      const qm = !q||m.title.toLowerCase().includes(q)||(m.tags||'').toLowerCase().includes(q);
      const tm = !ty||m.type===ty;
      return qm && tm;
    });
    const TYPE_ICO = {Master:'music',Demo:'headphones',Artwork:'image','Press Photo':'camera',Video:'film',STEMS:'layers'};
    const TYPE_COL = {Master:'var(--gold)',Demo:'var(--teal)',Artwork:'var(--warn)',Video:'var(--err)',STEMS:'var(--ok)','Press Photo':'#9b7fc8'};
    document.getElementById('medGrid').innerHTML = list.map(m=>{
      const art = this.db.artists.find(a=>a.id===m.artist_id);
      const rel = this.db.releases.find(r=>r.id===m.related_to);
      const isImg = m.is_image || /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i.test(m.file||'');
      return `<div class="media-card">
        <div class="media-thumb" onclick="${isImg?`LOS.openLightbox('${esc(m.file)}')`:m.file?`LOS.play('${esc(m.file)}','${esc(m.title)}','${esc(art?.name||'—')}')`:''}">
          ${isImg
            ? `<img src="${esc(m.file)}" alt="${esc(m.title)}" loading="lazy">`
            : m.file
              ? `<div class="play-ico"><i data-lucide="play" style="width:16px;color:#0a0a0f;margin-left:2px"></i></div>`
              : `<i data-lucide="${TYPE_ICO[m.type]||'file'}" style="width:28px;color:${TYPE_COL[m.type]||'var(--muted)'}"></i>`
          }
        </div>
        <div class="media-info">
          <div style="font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(m.title)}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${esc(art?.name||'—')}${m.version?' · '+esc(m.version):''}</div>
          ${rel?`<div style="font-size:10.5px;color:var(--teal);margin-top:2px">${esc(rel.title)}</div>`:''}
          <div class="flex gap2" style="margin-top:7px;flex-wrap:wrap">
            <span class="bd b-n" style="font-size:10px;color:${TYPE_COL[m.type]||'var(--muted)'}">${esc(m.type)}</span>
            ${m.tags?`<span style="font-size:10px;color:var(--muted)">${esc(m.tags)}</span>`:''}
          </div>
          <div class="flex gap2" style="margin-top:8px">
            ${m.file&&!isImg?`<button class="btn btn-g" style="font-size:11px;padding:4px 8px;gap:4px;flex:1" onclick="LOS.play('${esc(m.file)}','${esc(m.title)}','${esc(art?.name||'')}')"><i data-lucide="play" style="width:11px;color:var(--gold)"></i> Play</button>`:''}
            ${isImg?`<button class="btn btn-g" style="font-size:11px;padding:4px 8px;gap:4px;flex:1" onclick="LOS.openLightbox('${esc(m.file)}')"><i data-lucide="zoom-in" style="width:11px"></i> View</button>`:''}
            <button class="btn-ic" onclick="LOS.deleteItem('media','${m.id}')"><i data-lucide="trash-2" style="width:13px"></i></button>
          </div>
        </div>
      </div>`;
    }).join('') || '<div style="grid-column:span 4;text-align:center;color:var(--muted);padding:44px">No media assets</div>';
    lucide.createIcons();
  },

  openLightbox(url) {
    document.getElementById('lbImg').src = url;
    document.getElementById('lightbox').classList.add('open');
  },

  mmFileUpload(inp) {
    const f = inp.files[0];
    if (!f) return;
    this._mmFile = f;
    const isImg = f.type.startsWith('image/');
    const url   = URL.createObjectURL(f);
    document.getElementById('mmDzTxt').textContent = `✓ ${f.name} (${(f.size/1024/1024).toFixed(1)}MB)`;
    document.getElementById('mmF').value = url;
    if (isImg) {
      const prev = document.createElement('img');
      prev.src=url; prev.style.cssText='max-height:80px;border-radius:6px;margin:8px auto 0;display:block';
      document.getElementById('mmDzTxt').after(prev);
    }
  },

  saveMedia() {
    const t=document.getElementById('mmT')?.value.trim();
    if (!t) return this.toast('Title required','err');
    const relSel=document.getElementById('rsel-media-sel');
    const f=document.getElementById('mmF')?.value;
    const ty=document.getElementById('mmTy')?.value;
    const isImg = ty==='Artwork'||ty==='Press Photo'||ty==='Video';
    const m={
      id:uid(), title:t, type:ty,
      artist_id: ArtSel.getValue('asel-media'),
      related_to: relSel?.value||'',
      version:   document.getElementById('mmV')?.value,
      tags:      document.getElementById('mmTg')?.value,
      file:      f,
      is_image:  isImg||/\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i.test(f||''),
    };
    this.db.media.push(m);
    this.save(); this.closeModal('add-media'); this.renderMedia();
    this.log(`Media "${t}" added`,'Media'); this.toast('Asset added');
  },

  // ── RESEARCH ──────────────────────────────────────────────────────────
  renderResearch() {
    const totals = {};
    ANR_COLS.forEach(c=>{ totals[c.key]=this.db.demos.filter(d=>d.status===c.key).length; });
    document.getElementById('pipeVel').innerHTML = ANR_COLS.map(c=>{
      const pct = this.db.demos.length ? Math.round(totals[c.key]/this.db.demos.length*100) : 0;
      return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:11px">
        <span style="font-size:11px;width:62px;color:var(--muted);flex-shrink:0">${c.label}</span>
        <div class="pb flex-1"><div class="pf" style="width:${pct}%;background:${c.col}"></div></div>
        <span style="font-size:11px;color:var(--muted);width:18px;text-align:right">${totals[c.key]}</span>
      </div>`;
    }).join('');

    document.getElementById('curDB').innerHTML=`<table>
      <thead><tr><th>Name</th><th>Type</th><th>Genre</th><th>Contact</th><th>Submit</th></tr></thead>
      <tbody>${this.db.curators.map(c=>`
        <tr><td style="font-weight:600">${esc(c.name)}</td><td>${badge(c.type)}</td>
        <td style="font-size:12px;color:var(--muted)">${esc(c.genre)}</td>
        <td><a href="mailto:${esc(c.contact)}" style="color:var(--teal);font-size:12px">${esc(c.contact)||'—'}</a></td>
        <td><a href="${esc(c.submits)}" target="_blank" style="color:var(--gold);font-size:12px">${esc(c.submits)||'—'}</a></td>
      </tr>`).join('')}
      </tbody></table>`;

    this._drawBar('anrChart', ANR_COLS.map(c=>c.label), ANR_COLS.map(c=>totals[c.key]), ANR_COLS.map(c=>c.col));
    const genres={};
    this.db.demos.forEach(d=>{ genres[d.genre||'Other']=(genres[d.genre||'Other']||0)+1; });
    this._drawPie('genChart', Object.keys(genres), Object.values(genres));
    lucide.createIcons();
  },

  _drawBar(id,labels,values,colors) {
    const c=document.getElementById(id); if(!c) return;
    const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
    const max=Math.max(...values,1);
    const bw=(c.width-32)/labels.length;
    values.forEach((v,i)=>{
      const h=v/max*(c.height-32);
      const x=16+i*bw+bw*.15, y=c.height-20-h;
      ctx.fillStyle=colors[i]||'#c9a84c';
      ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(x,y,bw*.7,h,3); else ctx.rect(x,y,bw*.7,h); ctx.fill();
      ctx.fillStyle='#5a5a72'; ctx.font='9px Inter'; ctx.textAlign='center';
      ctx.fillText(labels[i].slice(0,6),x+bw*.35,c.height-6);
      if(v){ ctx.fillStyle='#e8e8ef'; ctx.fillText(v,x+bw*.35,y-4); }
    });
  },

  _drawPie(id,labels,values) {
    const c=document.getElementById(id); if(!c) return;
    const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
    const total=values.reduce((a,v)=>a+v,0); if(!total) return;
    const colors=['#c9a84c','#4a9fa8','#7c6fa8','#3d9970','#c0524e','#ec4899'];
    let start=-Math.PI/2;
    const cx=c.width/2, cy=c.height/2, r=72;
    values.forEach((v,i)=>{
      const angle=(v/total)*2*Math.PI;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,start+angle);
      ctx.closePath(); ctx.fillStyle=colors[i%colors.length]; ctx.fill();
      start+=angle;
    });
    ctx.beginPath(); ctx.arc(cx,cy,r*.45,0,2*Math.PI);
    ctx.fillStyle='var(--s2)'; ctx.fill();
    start=-Math.PI/2;
    values.forEach((v,i)=>{
      const angle=(v/total)*2*Math.PI;
      const mid=start+angle/2;
      if(v/total>.08){
        const lx=cx+Math.cos(mid)*r*.7, ly=cy+Math.sin(mid)*r*.7;
        ctx.fillStyle='#fff'; ctx.font='bold 10px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(labels[i].slice(0,5),lx,ly);
      }
      start+=angle;
    });
  },

  // ── USERS ─────────────────────────────────────────────────────────────
  renderUsers() {
    const pLbl={true:'✅ Full',read:'👁 Read',own:'👤 Own',false:'—'};
    document.getElementById('rbacMx').innerHTML=`<table>
      <thead><tr><th>Module</th><th>Admin</th><th>Label Manager</th><th>A&R</th><th>Artist</th></tr></thead>
      <tbody>${Object.entries(RBAC_MX).map(([mod,p])=>`
        <tr><td style="font-weight:600">${mod}</td>
          ${['admin','label_manager','ar','artist'].map(r=>`
            <td style="font-size:12px;color:${p[r]===true?'var(--ok)':p[r]==='read'?'var(--teal)':p[r]==='own'?'var(--warn)':'var(--muted)'}">
              ${pLbl[String(p[r])]||p[r]}</td>`).join('')}
        </tr>`).join('')}
      </tbody></table>`;

    const RC={'admin':'var(--gold)','label_manager':'var(--warn)','ar':'var(--teal)','artist':'var(--ok)'};
    document.getElementById('usrTbl').innerHTML=this.db.users.map(u=>{
      const art=this.db.artists.find(a=>a.id===u.artist_id);
      return `<tr>
        <td style="font-weight:600">${esc(u.name)}</td>
        <td style="font-size:12px;color:var(--muted)">${esc(u.email)}</td>
        <td><span class="bd b-n" style="color:${RC[u.role]||'var(--muted)'}">${u.role?.replace('_',' ')}</span></td>
        <td>${badge(u.status)}</td>
        <td style="font-size:12px;color:var(--muted)">${u.last_active||'—'}${art?` · <span style="color:var(--gold)">${esc(art.name)}</span>`:''}</td>
        <td><button class="btn-ic" onclick="LOS.deleteItem('users','${u.id}')"><i data-lucide="trash-2" style="width:13px"></i></button></td>
      </tr>`;
    }).join('');
    lucide.createIcons();
  },

  saveUser() {
    const n=document.getElementById('muN')?.value.trim();
    const e=document.getElementById('muE')?.value.trim();
    if (!n||!e) return this.toast('Name and email required','err');
    const u={
      id:uid(), name:n, email:e,
      role:      document.getElementById('muR')?.value,
      artist_id: ArtSel.getValue('asel-user'),
      status:    document.getElementById('muS')?.value,
      last_active: new Date().toISOString().slice(0,10),
    };
    this.db.users.push(u);
    this.save(); this.closeModal('add-user'); this.renderUsers();
    this.log(`User "${n}" created`,'System'); this.toast('User added');
  },

  // ── ACTIVITY LOG ──────────────────────────────────────────────────────
  renderLog() {
    const q=document.getElementById('logQ')?.value.toLowerCase()||'';
    const MC={'A&R':'var(--gold)','Releases':'var(--teal)','Finance':'var(--ok)','Contracts':'var(--warn)','Bookings':'var(--err)','CRM':'#9b7fc8','System':'var(--muted)','Media':'#c87f9b'};
    const list=this.db.activity_log.filter(l=>!q||(l.action+l.user+l.module).toLowerCase().includes(q));
    document.getElementById('logList').innerHTML = list.length
      ? list.map(l=>`<div class="li">
          <div class="ld" style="background:${MC[l.module]||'var(--muted)'}"></div>
          <div class="flex-1">
            <div style="font-size:13px">${esc(l.action)}</div>
            <div style="display:flex;gap:9px;margin-top:3px">
              <span style="font-size:11px;color:var(--muted)">${esc(l.user||'?')}</span>
              <span class="bd b-n" style="font-size:10px">${esc(l.module)}</span>
            </div>
          </div>
          <div class="lt">${fmtT(l.ts)}</div>
        </div>`).join('')
      : '<div style="color:var(--muted);font-size:13px;text-align:center;padding:28px">No activity logged yet.</div>';
  },

  clearLog() {
    if (!confirm('Clear all activity logs?')) return;
    this.db.activity_log=[]; this.save(); this.renderLog(); this.toast('Log cleared');
  },

  // ── GLOBAL SEARCH ─────────────────────────────────────────────────────
  openSearch()  { document.getElementById('gs').classList.add('open'); setTimeout(()=>document.getElementById('gsInp').focus(),60); },
  closeSearch() { document.getElementById('gs').classList.remove('open'); document.getElementById('gsInp').value=''; document.getElementById('gsRes').innerHTML=''; },

  gsSearch() {
    const q=document.getElementById('gsInp').value.toLowerCase().trim();
    if (!q) { document.getElementById('gsRes').innerHTML=''; return; }
    const results=[];
    this.db.artists.forEach(a=>{ if(a.name.toLowerCase().includes(q)) results.push({label:a.name,sub:a.type,view:'crm',ic:'user-circle'}); });
    this.db.demos.forEach(d=>{   if(d.title.toLowerCase().includes(q)) results.push({label:d.title,sub:d.genre+' · '+d.status,view:'anr',ic:'headphones'}); });
    this.db.releases.forEach(r=>{ if(r.title.toLowerCase().includes(q)) results.push({label:r.title,sub:r.type+' · '+r.status,view:'releases',ic:'disc-3'}); });
    this.db.media.forEach(m=>{   if(m.title.toLowerCase().includes(q)) results.push({label:m.title,sub:m.type,view:'media',ic:'folder-music'}); });
    document.getElementById('gsRes').innerHTML = results.length
      ? results.slice(0,10).map(r=>`<div class="gs-it" onclick="LOS.gsGo('${r.view}')">
          <div style="display:flex;align-items:center;gap:10px">
            <i data-lucide="${r.ic}" style="width:14px;color:var(--gold);flex-shrink:0"></i>
            <div><div style="font-weight:600;font-size:13px">${esc(r.label)}</div><div style="font-size:11px;color:var(--muted)">${esc(r.sub)}</div></div>
          </div>
        </div>`).join('')
      : '<div style="padding:16px;text-align:center;font-size:13px;color:var(--muted)">No results found</div>';
    lucide.createIcons();
  },

  gsGo(view) {
    this.closeSearch();
    document.querySelector(`.nav[data-view="${view}"]`)?.click();
  },

  // ── PLAYER ────────────────────────────────────────────────────────────
  setupPlayer() {
    document.getElementById('playBtn').addEventListener('click', ()=>{
      if (this.ws) this.ws.playPause();
    });
  },

  play(url, title, artist) {
    if (!url) return this.toast('No audio file available','err');
    document.getElementById('pTt').textContent = title||'—';
    document.getElementById('pSb').textContent = artist||'—';
    document.getElementById('player').classList.add('vis');
    if (this.ws) { this.ws.destroy(); this.ws=null; }
    this.ws = WaveSurfer.create({
      container: '#waveform',
      waveColor:    '#2a2a3a',
      progressColor:'#c9a84c',
      cursorColor:  '#e8c97a',
      height: 34, barWidth: 2, barRadius: 2,
      normalize: true, backend: 'WebAudio',
    });
    this.ws.load(url);
    this.ws.on('ready', ()=>{
      this.ws.play();
      this._updatePlayBtn(true);
    });
    this.ws.on('play',  ()=>this._updatePlayBtn(true));
    this.ws.on('pause', ()=>this._updatePlayBtn(false));
    this.ws.on('finish',()=>this._updatePlayBtn(false));
    this.ws.on('audioprocess', ()=>{
      const cur=this.ws.getCurrentTime(), dur=this.ws.getDuration();
      document.getElementById('pTime').textContent=`${this._fmt(cur)} / ${this._fmt(dur)}`;
    });
  },

  _updatePlayBtn(playing) {
    document.getElementById('playIco').setAttribute('data-lucide', playing?'pause':'play');
    lucide.createIcons();
  },

  _fmt(s) { const m=Math.floor(s/60); return `${m}:${String(Math.floor(s%60)).padStart(2,'0')}`; },

  closePlayer() {
    this.ws?.destroy(); this.ws=null;
    document.getElementById('player').classList.remove('vis');
  },

  // ── MODALS ────────────────────────────────────────────────────────────
  openModal(name) {
    document.getElementById(`modal-${name}`)?.classList.add('open');
    this.buildModalSelects();
    lucide.createIcons();
  },
  closeModal(name) { document.getElementById(`modal-${name}`)?.classList.remove('open'); },

  openUploader() { this.openModal('uploader'); },

  // ── UPLOAD SUBMIT ─────────────────────────────────────────────────────
  upFile(inp) {
    const f=inp.files[0]; if(!f) return;
    this._upFile=f;
    document.getElementById('upDzTxt').textContent=`✓ ${f.name} (${(f.size/1024/1024).toFixed(1)}MB)`;
    document.getElementById('upDz').classList.add('ov');
  },

  submitUpload() {
    const n=document.getElementById('upN')?.value.trim();
    const e=document.getElementById('upE')?.value.trim();
    const t=document.getElementById('upT')?.value.trim();
    if (!n||!e||!t) return this.toast('Name, email and title required','err');
    const url = this._upFile ? URL.createObjectURL(this._upFile) : document.getElementById('upUrl')?.value;
    const d={
      id:uid(), title:t, artist_id:'', artist_name:n,
      genre:  document.getElementById('upG')?.value,
      bpm:    document.getElementById('upBpm')?.value,
      key:    document.getElementById('upKey')?.value,
      email:  e,
      file:   url||'',
      notes:  (document.getElementById('upRef')?.value?'Refs: '+document.getElementById('upRef')?.value+'\n':'')+
              (document.getElementById('upNotes')?.value||''),
      status:'Neu', rating:0, watchlist:false,
      submitted: new Date().toISOString().slice(0,10),
    };
    // Also add to media library
    if (url) {
      this.db.media.push({id:uid(),title:t+' (Demo)',type:'Demo',artist_id:'',version:'',file:url,tags:'Submitted via form',is_image:false});
    }
    this.db.demos.push(d);
    this.save(); this.closeModal('uploader'); this.renderAll();
    this.log(`Demo submitted via Uploader: "${t}" by ${n}`,'A&R');
    this.toast(`Demo "${t}" submitted — lands in A&R Neu column & Media Library`);
    this._upFile=null;
  },

  // ── DELETE ITEM ───────────────────────────────────────────────────────
  deleteItem(collection, id) {
    if (!confirm('Delete this item?')) return;
    const name = this.db[collection]?.find(x=>x.id===id)?.name||this.db[collection]?.find(x=>x.id===id)?.title||id;
    this.db[collection] = this.db[collection].filter(x=>x.id!==id);
    this.save(); this.renderAll();
    this.log(`Deleted ${collection} item "${name}"`,'System');
    this.toast('Deleted');
    this.buildModalSelects();
  },

  // ── DB ADMIN ──────────────────────────────────────────────────────────
  openAdm() {
    const tables = Object.keys(this.db);
    document.getElementById('admTbs').innerHTML = tables.map((t,i)=>`
      <div class="adm-t ${i===0?'on':''}" onclick="LOS.admShow('${t}',this)">${t} (${this.db[t].length})</div>`).join('');
    this.admShow(tables[0], document.querySelector('.adm-t'));
    document.getElementById('adm').style.display='block';
    lucide.createIcons();
  },

  closeAdm() { document.getElementById('adm').style.display='none'; },

  admShow(tbl, el) {
    document.querySelectorAll('.adm-t').forEach(t=>t.classList.remove('on'));
    el?.classList.add('on');
    const data = JSON.stringify(this.db[tbl], null, 2);
    document.getElementById('admEd').innerHTML=`
      <div class="adm-r">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span style="font-weight:700;font-size:13px">${tbl} <span style="color:var(--muted)">(${this.db[tbl].length} rows)</span></span>
          <button class="btn btn-p" style="font-size:12px" onclick="LOS.admSave('${tbl}')">
            <i data-lucide="save" style="width:12px"></i> Save
          </button>
        </div>
        <textarea class="inp" id="admTA" style="min-height:420px;font-family:monospace;font-size:12px;line-height:1.6">${esc(data)}</textarea>
      </div>`;
    lucide.createIcons();
  },

  admSave(tbl) {
    try {
      const parsed=JSON.parse(document.getElementById('admTA').value);
      if (!Array.isArray(parsed)) return this.toast('Must be a JSON array','err');
      this.db[tbl]=parsed; this.save(); this.renderAll();
      this.toast(`${tbl} saved (${parsed.length} rows)`);
      this.log(`DB Admin: ${tbl} updated`,'System');
    } catch(e) { this.toast('Invalid JSON: '+e.message,'err'); }
  },

  // ── ROYALTIES PRO ─────────────────────────────────────────────────────
  royTab(name, el) {
    document.querySelectorAll('#royTabs .tab').forEach(t=>t.classList.remove('on'));
    el.classList.add('on');
    ['overview','contracts','import','statements','payouts'].forEach(n=>{
      const el2=document.getElementById('roy-'+n);
      if(el2) el2.style.display = n===name?'block':'none';
    });
    if(name==='overview')   this.renderRoyOverview();
    if(name==='contracts')  this.renderRoyContracts();
    if(name==='statements') this.renderStatements();
    if(name==='payouts')    this.renderPayouts();
    lucide.createIcons();
  },

  renderRoyOverview() {
    const rc   = this.db.royalty_contracts||[];
    const roys = this.db.royalties||[];
    const pays = this.db.payouts||[];
    const tRoy = roys.reduce((a,r)=>a+parseFloat(r.net_amount||0),0);
    const tPay = pays.reduce((a,p)=>a+parseFloat(p.amount||0),0);
    const tExp = this.db.expenses.reduce((a,e)=>a+parseFloat(e.amount||0),0);
    document.getElementById('royStats').innerHTML=[
      {l:'Gross Royalties', v:fmtE(tRoy),     col:'var(--ok)',   ic:'trending-up'},
      {l:'Net (after exp)', v:fmtE(tRoy-tExp), col:'var(--gold)', ic:'wallet'},
      {l:'Total Paid Out',  v:fmtE(tPay),      col:'var(--teal)', ic:'arrow-up-right'},
      {l:'Balance Due',     v:fmtE(tRoy-tExp-tPay), col:'var(--warn)', ic:'clock'},
    ].map(s=>`<div class="card stat"><div class="sl flex gap2" style="gap:6px"><i data-lucide="${s.ic}" style="width:12px"></i>${s.l}</div><div class="sv" style="color:${s.col}">${s.v}</div></div>`).join('');

    // Earnings by release chart
    const relMap={};
    roys.forEach(r=>{ relMap[r.release_id]=(relMap[r.release_id]||0)+parseFloat(r.net_amount||0); });
    const relLabels=Object.keys(relMap).map(id=>this.db.releases.find(r=>r.id===id)?.title||id);
    const relVals=Object.values(relMap);
    this._drawBar('royChart',relLabels,relVals,['#c9a84c','#4a9fa8','#7c6fa8','#3d9970']);

    // Territory chart
    const terrMap={};
    roys.forEach(r=>{ const t=r.territory||'WW'; terrMap[t]=(terrMap[t]||0)+parseFloat(r.net_amount||0); });
    this._drawPie('terrChart',Object.keys(terrMap),Object.values(terrMap));
    lucide.createIcons();
  },

  renderRoyContracts() {
    const rc=this.db.royalty_contracts||[];
    document.getElementById('royConTbl').innerHTML=rc.map(c=>{
      const art=this.db.artists.find(a=>a.id===c.artist_id);
      const rel=this.db.releases.find(r=>r.id===c.release_id);
      const due=parseFloat(c.recoup_balance||0);
      return `<tr>
        <td style="font-weight:600">${esc(art?.name||'—')}</td>
        <td style="font-size:12px;color:var(--teal)">${esc(rel?.title||'All')}</td>
        <td>${badge(c.type)}</td>
        <td style="font-size:12px">${c.label_split||50}% / ${c.artist_split||50}%</td>
        <td style="color:var(--ok)">${fmtE(c.advance)}</td>
        <td style="${due>0?'color:var(--warn)':'color:var(--ok)'};">${due>0?`Owes ${fmtE(due)}`:'Recouped'}</td>
        <td style="font-size:12px">${fmtE(c.minimum_payout)} ${c.currency||'EUR'}</td>
        <td>${badge(c.active?'Active':'Inactive')}</td>
        <td><button class="btn-ic" onclick="LOS.deleteItem('royalty_contracts','${c.id}')"><i data-lucide="trash-2" style="width:13px"></i></button></td>
      </tr>`;
    }).join('')||`<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:24px">No royalty contracts yet</td></tr>`;
    lucide.createIcons();
  },

  saveRoyContract() {
    const artId=ArtSel.getValue('asel-roycon');
    if(!artId) return this.toast('Artist required','err');
    const relSel=document.getElementById('rsel-roycon-sel');
    const c={
      id:uid(), artist_id:artId, type:document.getElementById('rcTy')?.value,
      release_id:relSel?.value||'', track_id:'',
      label_split:parseFloat(document.getElementById('rcLS')?.value)||50,
      artist_split:parseFloat(document.getElementById('rcAS')?.value)||50,
      advance:parseFloat(document.getElementById('rcAdv')?.value)||0,
      recoup_balance:parseFloat(document.getElementById('rcAdv')?.value)||0,
      minimum_payout:parseFloat(document.getElementById('rcMin')?.value)||50,
      currency:document.getElementById('rcCur')?.value||'EUR',
      active:true, created:new Date().toISOString().slice(0,10)
    };
    if(!this.db.royalty_contracts) this.db.royalty_contracts=[];
    this.db.royalty_contracts.push(c);
    this.save(); this.closeModal('add-roycon'); this.renderRoyContracts();
    const art=this.db.artists.find(a=>a.id===artId);
    this.log(`Royalty contract for ${art?.name} created`,'Finance'); this.toast('Royalty contract saved');
  },

  // CSV Import Runde 1
  fDragOver2(e){ e.preventDefault(); document.getElementById('royDz').classList.add('ov'); },
  fDragLeave2() { document.getElementById('royDz').classList.remove('ov'); },
  fDrop2(e){
    e.preventDefault(); document.getElementById('royDz').classList.remove('ov');
    const f=e.dataTransfer.files[0];
    if(f) this._royCsvParse(f);
  },
  royCsvFile(inp){ if(inp.files[0]) this._royCsvParse(inp.files[0]); },

  _royCsvRaw: null,
  _royCsvParse(file){
    document.getElementById('royDistProf').addEventListener('change',function(){
      document.getElementById('royCustomMap').style.display=this.value==='custom'?'block':'none';
    },{once:false});
    document.getElementById('royDistProf').onchange=function(){
      document.getElementById('royCustomMap').style.display=this.value==='custom'?'block':'none';
    };
    const r=new FileReader();
    r.onload=ev=>{
      this._royCsvRaw=ev.target.result;
      const rows=ev.target.result.split('\n').slice(0,8);
      document.getElementById('royImportPreview').innerHTML=`
        <div style="font-size:11px;color:var(--muted);margin-bottom:8px">${file.name} — first ${rows.length} rows:</div>
        <div style="overflow-x:auto"><table>${rows.map((r,i)=>`<tr style="${i===0?'color:var(--gold);font-weight:600':''}">${r.split(',').slice(0,6).map(c=>`<td style="padding:4px 8px;border:1px solid var(--b1);font-size:11px;white-space:nowrap;max-width:120px;overflow:hidden;text-overflow:ellipsis">${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>
        <div style="font-size:11px;color:var(--ok);margin-top:8px">✓ ${ev.target.result.split('\n').length-1} data rows detected</div>`;
      document.getElementById('royDzTxt').textContent=`✓ ${file.name} loaded`;
    };
    r.readAsText(file);
  },

  processRoyCsv(){
    if(!this._royCsvRaw) return this.toast('Please load a CSV file first','err');
    const prof=document.getElementById('royDistProf')?.value;
    const maps={dk:{s:0,rid:1,net:2,terr:3,per:4},bp:{s:0,rid:0,net:1,terr:-1,per:2},bc:{s:0,rid:-1,net:1,terr:-1,per:2},custom:null};
    let m=maps[prof]||maps.dk;
    if(prof==='custom'){
      m={s:+document.getElementById('mcol0')?.value,rid:+document.getElementById('mcol1')?.value,net:+document.getElementById('mcol2')?.value,terr:+document.getElementById('mcol3')?.value,per:+document.getElementById('mcol4')?.value};
    }
    const rows=this._royCsvRaw.split('\n').slice(1).filter(r=>r.trim());
    let count=0;
    rows.forEach(row=>{
      const cols=row.split(',').map(c=>c.replace(/"/g,'').trim());
      const net=parseFloat(cols[m.net]||0);
      if(!net) return;
      this.db.royalties.push({id:uid(),source:cols[m.s]||'CSV',release_id:cols[m.rid]||'',net_amount:net,territory:m.terr>=0?cols[m.terr]||'WW':'WW',period:m.per>=0?cols[m.per]||'':'',imported:true});
      count++;
    });
    this._royCsvRaw=null;
    this.save(); this.renderFinance();
    this.log(`${count} royalty rows imported via CSV`,'Finance');
    this.toast(`${count} rows imported successfully`);
  },

  // Statements
  previewStatement(){
    const artId=ArtSel.getValue('asel-stmt');
    if(!artId) return this.toast('Select an artist','err');
    const art=this.db.artists.find(a=>a.id===artId);
    const period=document.getElementById('stmtPeriod')?.value;
    const roys=this.db.royalties.filter(r=>{
      const rel=this.db.releases.find(x=>x.id===r.release_id);
      return rel?.artist_id===artId;
    });
    const exps=this.db.expenses.filter(e=>e.artist_id===artId);
    const pays=(this.db.payouts||[]).filter(p=>p.artist_id===artId);
    const tRoy=roys.reduce((a,r)=>a+parseFloat(r.net_amount||0),0);
    const tExp=exps.reduce((a,e)=>a+parseFloat(e.amount||0),0);
    const tPay=pays.reduce((a,p)=>a+parseFloat(p.amount||0),0);
    const contracts=(this.db.royalty_contracts||[]).filter(c=>c.artist_id===artId);
    const split=contracts[0]?.artist_split||50;
    const artShare=tRoy*(split/100);
    const balance=artShare-tExp-tPay;
    document.getElementById('stmtPreviewBox').innerHTML=`
      <div class="stmt-preview">
        <h3>Statement for ${esc(art?.name||'?')} — ${esc(period)}</h3>
        <div style="font-size:11px;color:var(--muted);margin-bottom:14px">Generated ${new Date().toLocaleDateString('de-DE')} · Bunte Panther Records</div>
        ${roys.map(r=>{const rel=this.db.releases.find(x=>x.id===r.release_id);return`<div class="row"><span>${esc(r.source)} · ${esc(rel?.title||r.release_id)}</span><span style="color:var(--ok)">${fmtE(r.net_amount)}</span></div>`;}).join('')}
        <div class="row"><span>Gross Total</span><span>${fmtE(tRoy)}</span></div>
        <div class="row"><span>Artist Share (${split}%)</span><span>${fmtE(artShare)}</span></div>
        <div class="row"><span style="color:var(--err)">Expenses / Recoup</span><span style="color:var(--err)">- ${fmtE(tExp)}</span></div>
        <div class="row"><span style="color:var(--muted)">Previously Paid</span><span style="color:var(--muted)">- ${fmtE(tPay)}</span></div>
        <div class="row"><span>Balance Due</span><span style="color:${balance>0?'var(--gold)':'var(--muted)'}">${fmtE(balance)}</span></div>
      </div>`;
  },

  saveStatement(){
    const artId=ArtSel.getValue('asel-stmt');
    if(!artId) return this.toast('Select an artist','err');
    const art=this.db.artists.find(a=>a.id===artId);
    const period=document.getElementById('stmtPeriod')?.value;
    if(!this.db.royalty_statements) this.db.royalty_statements=[];
    const s={id:uid(),artist_id:artId,period,created:new Date().toISOString().slice(0,10),status:'Sent'};
    this.db.royalty_statements.push(s);
    this.save(); this.closeModal('gen-statement'); this.renderStatements();
    this.log(`Statement for ${art?.name} (${period}) generated`,'Finance'); this.toast('Statement saved');
  },

  renderStatements(){
    const stmts=this.db.royalty_statements||[];
    document.getElementById('stmtList').innerHTML=stmts.length?stmts.map(s=>{
      const art=this.db.artists.find(a=>a.id===s.artist_id);
      return `<div class="stmt">
        <div class="flex gap2 mb4">
          <div><div style="font-weight:700">${esc(art?.name||'—')}</div>
          <div style="font-size:11px;color:var(--muted)">${esc(s.period)} · Generated ${s.created}</div></div>
          ${badge(s.status)}
        </div>
        <div class="flex gap2">
          <button class="btn btn-g" style="font-size:11.5px;gap:5px" onclick="LOS.previewStatementById('${s.id}')">
            <i data-lucide="eye" style="width:12px"></i> View
          </button>
          <button class="btn-ic" onclick="LOS.deleteItem('royalty_statements','${s.id}')"><i data-lucide="trash-2" style="width:13px"></i></button>
        </div>
      </div>`;
    }).join(''):'<div style="grid-column:span 2;color:var(--muted);text-align:center;padding:32px">No statements generated</div>';
    lucide.createIcons();
  },

  // Payouts
  renderPayouts(){
    const pays=this.db.payouts||[];
    document.getElementById('payTbl').innerHTML=pays.map(p=>{
      const art=this.db.artists.find(a=>a.id===p.artist_id);
      return `<tr>
        <td style="font-weight:600">${esc(art?.name||'—')}</td>
        <td style="font-weight:700;color:var(--ok)">${fmtE(p.amount)}</td>
        <td style="font-size:12px;color:var(--muted)">${esc(p.period||'—')}</td>
        <td style="font-size:12px">${esc(p.method||'—')}</td>
        <td>${badge(p.status)}</td>
        <td style="font-size:12px;color:var(--muted)">${p.date||'—'}</td>
        <td><button class="btn-ic" onclick="LOS.deleteItem('payouts','${p.id}')"><i data-lucide="trash-2" style="width:13px"></i></button></td>
      </tr>`;
    }).join('')||`<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px">No payouts recorded</td></tr>`;
    lucide.createIcons();
  },

  savePayout(){
    const artId=ArtSel.getValue('asel-payout');
    if(!artId) return this.toast('Artist required','err');
    const amt=parseFloat(document.getElementById('pyAmt')?.value)||0;
    if(!amt) return this.toast('Amount required','err');
    if(!this.db.payouts) this.db.payouts=[];
    const p={
      id:uid(), artist_id:artId, amount:amt,
      period:document.getElementById('pyPeriod')?.value,
      method:document.getElementById('pyMeth')?.value,
      status:document.getElementById('pyStat')?.value,
      date:document.getElementById('pyDate')?.value||new Date().toISOString().slice(0,10)
    };
    this.db.payouts.push(p);
    const art=this.db.artists.find(a=>a.id===artId);
    this.save(); this.closeModal('add-payout'); this.renderPayouts();
    this.log(`Payout ${fmtE(amt)} to ${art?.name} recorded`,'Finance'); this.toast('Payout recorded');
    this.pushNotification('payout',`Payout ${fmtE(amt)} EUR to ${art?.name||'?'}`,'royalties');
    this.fireWebhook('payout.created',{artist:art?.name||'—',amount:`${fmtE(amt)} EUR`,period:p.period||'—',method:p.method||'—',message:`Payout of ${fmtE(amt)} EUR to ${art?.name||'—'} recorded`});
  },

  // ── CATALOG & RIGHTS ──────────────────────────────────────────────────
  catTab(name, el){
    document.querySelectorAll('#catTabs .tab').forEach(t=>t.classList.remove('on'));
    el.classList.add('on');
    ['tracks','rights','packager','validator'].forEach(n=>{
      const d=document.getElementById('cat-'+n);
      if(d) d.style.display=n===name?'block':'none';
    });
    if(name==='tracks')    this.renderTracks();
    if(name==='rights')    this.renderRights();
    if(name==='validator') this.runQC();
    if(name==='packager')  { buildRelSel('rsel-packager','',false); lucide.createIcons(); }
    lucide.createIcons();
  },

  renderTracks(){
    if(!this.db.tracks) this.db.tracks=[];
    const q   = document.getElementById('catQ')?.value.toLowerCase()||'';
    const ver = document.getElementById('catVer')?.value||'';
    const list= this.db.tracks.filter(t=>{
      const art=this.db.artists.find(a=>a.id===t.artist_id);
      const qm = !q||t.title.toLowerCase().includes(q)||(t.isrc||'').toLowerCase().includes(q)||(art?.name||'').toLowerCase().includes(q);
      const vm = !ver||t.version===ver;
      return qm && vm;
    });
    document.getElementById('trackTbl').innerHTML=list.map(t=>{
      const art=this.db.artists.find(a=>a.id===t.artist_id);
      const rel=this.db.releases.find(r=>r.id===t.release_id);
      const qc=this._trackQC(t);
      return `<tr>
        <td>
          <div style="font-weight:600">${esc(t.title)}</div>
          ${rel?`<div style="font-size:11px;color:var(--teal)">${esc(rel.title)}</div>`:''}
        </td>
        <td style="font-size:12px">${esc(art?.name||'—')}</td>
        <td style="font-size:11px;font-family:monospace;color:var(--muted)">${esc(t.isrc||'—')}</td>
        <td>${badge(t.version)}</td>
        <td style="font-size:12px">${t.bpm||'—'}</td>
        <td style="font-size:12px">${esc(t.key||'—')}</td>
        <td style="font-size:12px">${esc(t.duration||'—')}</td>
        <td style="font-size:12px">${esc(t.territory||'WW')}</td>
        <td><span class="mq mq-${qc.score>=80?'ok':qc.score>=50?'warn':'err'}">${qc.score}%</span></td>
        <td><button class="btn-ic" onclick="LOS.deleteItem('tracks','${t.id}')"><i data-lucide="trash-2" style="width:13px"></i></button></td>
      </tr>`;
    }).join('')||`<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:24px">No tracks in catalog</td></tr>`;
    lucide.createIcons();
  },

  _trackQC(t){
    const checks=[
      {f:'title',w:15},{f:'isrc',w:15},{f:'artist_id',w:10},{f:'release_id',w:10},
      {f:'bpm',w:10},{f:'key',w:10},{f:'duration',w:10},{f:'composer',w:8},
      {f:'p_line',w:6},{f:'c_line',w:6}
    ];
    let score=0;
    const issues=[];
    checks.forEach(c=>{
      if(t[c.f]&&String(t[c.f]).trim()) score+=c.w;
      else issues.push(c.f);
    });
    return {score:Math.min(score,100), issues};
  },

  saveTrack(){
    const ti=document.getElementById('trT')?.value.trim();
    if(!ti) return this.toast('Title required','err');
    const artId=ArtSel.getValue('asel-track');
    if(!artId) return this.toast('Artist required','err');
    const relSel=document.getElementById('rsel-track-sel');
    if(!this.db.tracks) this.db.tracks=[];
    const t={
      id:uid(), title:ti, artist_id:artId,
      release_id:relSel?.value||'',
      isrc:       document.getElementById('trISRC')?.value,
      version:    document.getElementById('trVer')?.value,
      bpm:        document.getElementById('trBPM')?.value,
      key:        document.getElementById('trKey')?.value,
      duration:   document.getElementById('trDur')?.value,
      composer:   document.getElementById('trComp')?.value,
      publisher:  document.getElementById('trPub')?.value,
      p_line:     document.getElementById('trPL')?.value,
      c_line:     document.getElementById('trCL')?.value,
      territory:  document.getElementById('trTerr')?.value||'WW',
      explicit:   document.getElementById('trExp')?.value==='true',
      rights_in:  document.getElementById('trRI')?.value==='true',
      license_expires:document.getElementById('trLE')?.value,
      tags:       document.getElementById('trTags')?.value,
      genre:      '', quality_score:null, credits:[],
    };
    this.db.tracks.push(t);
    this.save(); this.closeModal('add-track'); this.renderTracks();
    this.log(`Track "${ti}" added to catalog`,'Catalog'); this.toast('Track added');
  },

  renderRights(){
    if(!this.db.rights) this.db.rights=[];
    const list=this.db.rights;
    const now=Date.now();
    document.getElementById('rightsTbl').innerHTML=list.map(r=>{
      const rel=this.db.releases.find(x=>x.id===r.release_id);
      const trk=this.db.tracks?.find(x=>x.id===r.track_id);
      const exp=r.expires&&new Date(r.expires)<new Date(now+30*86400000);
      return `<tr>
        <td>
          ${trk?`<div style="font-weight:600">${esc(trk.title)}</div>`:''}
          ${rel?`<div style="font-size:11px;color:var(--teal)">${esc(rel.title)}</div>`:''}
          ${!trk&&!rel?'<span style="color:var(--muted)">—</span>':''}
        </td>
        <td><span class="bd ${r.type?.includes('In')?'rights-in':'rights-out'}">${esc(r.type)}</span></td>
        <td style="font-size:12px">${esc(r.licensor||'—')}</td>
        <td style="font-size:12px">${esc(r.territory||'WW')}</td>
        <td style="font-size:12px;${exp?'color:var(--warn);font-weight:600':''}">${r.expires||'—'}</td>
        <td>${badge(r.status)}</td>
        <td><button class="btn-ic" onclick="LOS.deleteItem('rights','${r.id}')"><i data-lucide="trash-2" style="width:13px"></i></button></td>
      </tr>`;
    }).join('')||`<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px">No rights or licenses</td></tr>`;
    lucide.createIcons();
  },

  saveRights(){
    if(!this.db.rights) this.db.rights=[];
    const relSel=document.getElementById('rsel-rights-sel');
    const trkSel=document.getElementById('tsel-rights-sel');
    const r={
      id:uid(),
      type:    document.getElementById('rgTy')?.value,
      licensor:document.getElementById('rgLic')?.value,
      release_id:relSel?.value||'',
      track_id:  trkSel?.value||'',
      territory: document.getElementById('rgTerr')?.value,
      expires:   document.getElementById('rgExp')?.value,
      fee:       parseFloat(document.getElementById('rgFee')?.value)||0,
      status:    document.getElementById('rgStat')?.value,
    };
    this.db.rights.push(r);
    this.save(); this.closeModal('add-rights'); this.renderRights();
    this.log(`License "${r.type}" added`,'Catalog'); this.toast('License saved');
  },

  generatePackage(){
    const relSel=document.getElementById('rsel-packager-sel');
    const relId=relSel?.value;
    if(!relId) return this.toast('Select a release','err');
    const rel=this.db.releases.find(r=>r.id===relId);
    const art=this.db.artists.find(a=>a.id===rel?.artist_id);
    const tracks=(this.db.tracks||[]).filter(t=>t.release_id===relId);
    const media=this.db.media.filter(m=>m.related_to===relId);
    const fmt=document.getElementById('pkgFmt')?.value;

    let output='';
    if(fmt==='DistroKid CSV'||fmt==='Generic CSV'){
      const hdr=['Track Title','Artist','ISRC','Version','BPM','Key','Duration','Explicit','P-Line','C-Line','Territory','Composer','Publisher'];
      output=hdr.join(',')+'\n';
      if(tracks.length){
        output+=tracks.map(t=>[t.title,art?.name||'',t.isrc||'',t.version||'',t.bpm||'',t.key||'',t.duration||'',t.explicit||false,t.p_line||'',t.c_line||'',t.territory||'WW',t.composer||'',t.publisher||''].map(v=>`"${v}"`).join(',')).join('\n');
      } else {
        output+=`"${rel.title}","${art?.name||''}","","Club","","","","false","${new Date().getFullYear()} ${art?.name||''}","${new Date().getFullYear()} ${art?.name||''}","WW","",""`;
      }
    } else if(fmt==='JSON (API)'){
      output=JSON.stringify({release:{...rel,artist:art?.name},tracks,media_assets:media.map(m=>({title:m.title,type:m.type,file:m.file}))},null,2);
    } else {
      // FUGA XML stub
      output=`<?xml version="1.0" encoding="UTF-8"?>\n<Release>\n  <Title>${esc(rel.title)}</Title>\n  <Artist>${esc(art?.name||'')}</Artist>\n  <CatalogNumber>${esc(rel.cat||'')}</CatalogNumber>\n  <ReleaseDate>${rel.date||''}</ReleaseDate>\n${tracks.map(t=>`  <Track>\n    <Title>${esc(t.title)}</Title>\n    <ISRC>${esc(t.isrc||'')}</ISRC>\n    <Version>${esc(t.version||'')}</Version>\n  </Track>`).join('\n')}\n</Release>`;
    }

    document.getElementById('pkgPreview').style.display='block';
    document.getElementById('pkgOutput').textContent=output;
    this._pkgOutput=output; this._pkgFmt=fmt; this._pkgRelTitle=rel.title;
    this.toast('Package generated');
  },

  downloadPackage(){
    if(!this._pkgOutput) return;
    const ext=this._pkgFmt?.includes('CSV')?'csv':this._pkgFmt?.includes('XML')?'xml':'json';
    const blob=new Blob([this._pkgOutput],{type:'text/plain'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`${(this._pkgRelTitle||'release').replace(/\s/g,'_')}_package.${ext}`;
    a.click();
    this.toast('Download started');
  },

  runQC(){
    if(!this.db.tracks) this.db.tracks=[];
    const tracks=this.db.tracks;
    const releases=this.db.releases;
    const results=[];

    // Track metadata checks
    tracks.forEach(t=>{
      const qc=this._trackQC(t);
      const art=this.db.artists.find(a=>a.id===t.artist_id);
      results.push({entity:`Track: ${t.title}`,sub:art?.name||'',score:qc.score,issues:qc.issues,type:'track'});
    });

    // Release checks
    releases.forEach(r=>{
      const art=this.db.artists.find(a=>a.id===r.artist_id);
      const issues=[];
      if(!r.cat) issues.push('cat#');
      if(!r.date) issues.push('release_date');
      if(!r.distributor) issues.push('distributor');
      const score=Math.round(((3-issues.length)/3)*100);
      results.push({entity:`Release: ${r.title}`,sub:art?.name||'',score,issues,type:'release'});
    });

    document.getElementById('qcResults').innerHTML=results.length?`
      <div class="flex gap2 mb4" style="flex-wrap:wrap">
        <span class="mq mq-ok">✓ ${results.filter(r=>r.score>=80).length} OK</span>
        <span class="mq mq-warn">⚠ ${results.filter(r=>r.score>=50&&r.score<80).length} Warnings</span>
        <span class="mq mq-err">✗ ${results.filter(r=>r.score<50).length} Issues</span>
      </div>
      <div class="card tw">
        <table>
          <thead><tr><th>Entity</th><th>Sub</th><th>Quality Score</th><th>Missing Fields</th></tr></thead>
          <tbody>${results.map(r=>`<tr>
            <td style="font-weight:600;font-size:13px">${esc(r.entity)}</td>
            <td style="font-size:12px;color:var(--muted)">${esc(r.sub)}</td>
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="score-bar" style="width:80px"><div class="score-fill" style="width:${r.score}%;background:${r.score>=80?'var(--ok)':r.score>=50?'var(--warn)':'var(--err)'}"></div></div>
                <span class="mq mq-${r.score>=80?'ok':r.score>=50?'warn':'err'}">${r.score}%</span>
              </div>
            </td>
            <td style="font-size:11.5px;color:var(--muted)">${r.issues.length?r.issues.join(', '):'All good ✓'}</td>
          </tr>`).join('')}
          </tbody>
        </table>
      </div>`:'<div class="card" style="text-align:center;color:var(--muted);padding:32px">No tracks or releases to validate</div>';
    lucide.createIcons();
  },

  // ── ADVANCED A&R ──────────────────────────────────────────────────────
  anrProTab(name, el){
    document.querySelectorAll('#anrProTabs .tab').forEach(t=>t.classList.remove('on'));
    el.classList.add('on');
    ['scoring','intelligence','watchlist','contests'].forEach(n=>{
      const d=document.getElementById('anrp-'+n);
      if(d) d.style.display=n===name?'block':'none';
    });
    if(name==='scoring')      this.renderScoring();
    if(name==='intelligence') this.renderANRIntel();
    if(name==='watchlist')    this.renderWatchlist();
    if(name==='contests')     this.renderContests();
    lucide.createIcons();
  },

  calcScore(demo){
    let score=0;
    // Internal rating (0-5 → 0-30pts)
    score += (demo.rating||0) * 6;
    // Genre match (has genre = +10)
    if(demo.genre) score+=10;
    // BPM present = +5
    if(demo.bpm) score+=5;
    // Artist on roster = +20
    const art=this.db.artists.find(a=>a.id===demo.artist_id);
    if(art&&['Core Artist','Development','Legacy'].includes(art.type)) score+=20;
    // Has releases = +1pt per release (max 15)
    if(art){
      const rels=this.db.releases.filter(r=>r.artist_id===art.id).length;
      score+=Math.min(rels*5,15);
    }
    // Watchlist = +10
    if(demo.watchlist) score+=10;
    return Math.min(Math.round(score),100);
  },

  calcAllScores(){
    this.db.demos.forEach(d=>{ d.score=this.calcScore(d); });
    this.save(); this.renderScoring(); this.toast('Scores recalculated');
  },

  renderScoring(){
    const q=document.getElementById('scoreQ')?.value.toLowerCase()||'';
    const demos=[...this.db.demos].filter(d=>!q||d.title.toLowerCase().includes(q))
      .map(d=>({...d,score:d.score??this.calcScore(d)}))
      .sort((a,b)=>b.score-a.score);
    document.getElementById('scoreTbl').innerHTML=demos.map(d=>{
      const art=this.db.artists.find(a=>a.id===d.artist_id);
      const rels=this.db.releases.filter(r=>r.artist_id===d.artist_id).length;
      const rec=d.score>=80?'🟢 Priority Sign':d.score>=60?'🟡 Shortlist':d.score>=40?'⚪ Monitor':'🔴 Pass';
      const pct=(d.score||0)+'%';
      return `<tr>
        <td>
          <div style="font-weight:600">${esc(d.title)}</div>
          <div style="font-size:11px;color:var(--muted)">${d.submitted||''}</div>
        </td>
        <td style="font-size:12px">${esc(art?.name||d.artist_name||'External')}</td>
        <td style="font-size:12px">${esc(d.genre||'—')}</td>
        <td>
          <div style="display:flex;gap:1px;font-size:13px">
            ${[1,2,3,4,5].map(n=>`<span style="color:${n<=(d.rating||0)?'var(--gold)':'var(--b2)'}"">★</span>`).join('')}
          </div>
        </td>
        <td style="font-size:12px">${d.bpm||'—'}</td>
        <td style="font-size:12px">${rels}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="score-bar" style="width:60px"><div class="score-fill" style="width:${pct};background:${d.score>=80?'var(--ok)':d.score>=60?'var(--gold)':'var(--err)'}"></div></div>
            <span style="font-weight:700;color:${d.score>=80?'var(--ok)':d.score>=60?'var(--gold)':'var(--muted)'}">${d.score}</span>
          </div>
        </td>
        <td style="font-size:12px">${rec}</td>
        <td>
          <select class="inp" style="font-size:11px;padding:3px 22px 3px 6px;width:108px" onchange="LOS.moveDemoStatus('${d.id}',this.value)">
            ${ANR_COLS.map(c=>`<option value="${c.key}" ${c.key===d.status?'selected':''}>${c.label}</option>`).join('')}
          </select>
        </td>
      </tr>`;
    }).join('')||`<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:24px">No demos yet</td></tr>`;
    lucide.createIcons();
  },

  renderANRIntel(){
    // Funnel
    const stages=ANR_COLS.map(c=>({l:c.label,v:this.db.demos.filter(d=>d.status===c.key).length,col:c.col}));
    this._drawBar('funnelChart',stages.map(s=>s.l),stages.map(s=>s.v),stages.map(s=>s.col));

    // Genre bar
    const genres={};
    this.db.demos.forEach(d=>{ genres[d.genre||'Other']=(genres[d.genre||'Other']||0)+1; });
    const gkeys=Object.keys(genres).sort((a,b)=>genres[b]-genres[a]).slice(0,6);
    this._drawBar('genreBarChart',gkeys,gkeys.map(k=>genres[k]),['#c9a84c','#4a9fa8','#7c6fa8','#3d9970','#c0524e','#ec4899']);

    // Weekly submissions (fake grouping by submitted date)
    const weeks={};
    this.db.demos.forEach(d=>{ const w=d.submitted?.slice(0,7)||'2026-05'; weeks[w]=(weeks[w]||0)+1; });
    const wkeys=Object.keys(weeks).sort();
    this._drawBar('weekChart',wkeys.map(k=>k.slice(5)),wkeys.map(k=>weeks[k]),['#4a9fa8']);

    // Source breakdown
    const ext=this.db.demos.filter(d=>!d.artist_id).length;
    const ros=this.db.demos.filter(d=>!!d.artist_id).length;
    document.getElementById('srcBreakdown').innerHTML=[
      {l:'Via Website Uploader',v:Math.ceil(ext*0.6),col:'var(--gold)'},
      {l:'Direct Roster Artist',v:ros,col:'var(--teal)'},
      {l:'Email / Manual',v:Math.floor(ext*0.4),col:'var(--muted)'},
    ].map(s=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--b1)">
      <span style="width:8px;height:8px;border-radius:50%;background:${s.col};flex-shrink:0;display:block"></span>
      <span style="font-size:13px;flex:1">${s.l}</span>
      <span style="font-weight:700;font-size:14px;color:${s.col}">${s.v}</span>
    </div>`).join('');

    // Velocity (average days per stage — static model)
    document.getElementById('velBreakdown').innerHTML=[
      {stage:'Neu → In Review',days:2.1},{stage:'In Review → Shortlist',days:4.5},
      {stage:'Shortlist → Gespräch',days:8.2},{stage:'Gespräch → Offer',days:14.3},
      {stage:'Offer → Signed',days:21.0},
    ].map(v=>`<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--b1)">
      <span style="font-size:12px;flex:1;color:var(--muted)">${v.stage}</span>
      <div class="score-bar" style="width:80px"><div class="score-fill" style="width:${Math.min(v.days/25*100,100)}%"></div></div>
      <span style="font-size:12px;font-weight:600;width:42px;text-align:right">${v.days}d</span>
    </div>`).join('');
    lucide.createIcons();
  },

  renderWatchlist(){
    const wl=this.db.demos.filter(d=>d.watchlist);
    document.getElementById('watchlistGrid').innerHTML=wl.length?wl.map(d=>{
      const art=this.db.artists.find(a=>a.id===d.artist_id);
      const sc=d.score??this.calcScore(d);
      return `<div class="card">
        <div class="flex gap2 mb4">
          <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--teal));display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🔖</div>
          <div class="flex-1 min-w-0">
            <div style="font-weight:700">${esc(d.title)}</div>
            <div style="font-size:11px;color:var(--muted)">${esc(art?.name||d.artist_name||'External')}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
          ${d.genre?`<span class="bd b-g">${esc(d.genre)}</span>`:''}
          ${d.bpm?`<span class="bd b-n">${d.bpm} BPM</span>`:''}
          ${badge(d.status)}
        </div>
        <div class="flex gap2">
          <div class="score-bar flex-1"><div class="score-fill" style="width:${sc}%;background:${sc>=70?'var(--ok)':'var(--gold)'}"></div></div>
          <span style="font-size:12px;font-weight:700;color:var(--gold)">${sc}/100</span>
        </div>
        <div class="flex gap2 mt3">
          ${d.file?`<button class="btn btn-g" style="font-size:11px;padding:4px 8px;flex:1;gap:4px" onclick="LOS.play('${esc(d.file)}','${esc(d.title)}','')"><i data-lucide="play" style="width:11px;color:var(--gold)"></i> Play</button>`:''}
          <button class="btn-ic" onclick="LOS.toggleWatchlist('${d.id}')" title="Remove from watchlist"><i data-lucide="bookmark-x" style="width:13px;color:var(--warn)"></i></button>
        </div>
      </div>`;
    }).join(''):'<div style="grid-column:span 3;text-align:center;color:var(--muted);padding:32px">No demos on watchlist — click the bookmark icon on any demo card</div>';
    lucide.createIcons();
  },

  renderContests(){
    if(!this.db.remix_contests) this.db.remix_contests=[];
    const cs=this.db.remix_contests;
    document.getElementById('contestGrid').innerHTML=cs.length?cs.map(c=>{
      const rel=this.db.releases.find(r=>r.id===c.release_id);
      const art=this.db.artists.find(a=>a.id===c.artist_id);
      const daysLeft=c.deadline?Math.ceil((new Date(c.deadline)-Date.now())/86400000):null;
      return `<div class="contest-card">
        <div class="contest-head">
          <div style="font-size:15px;font-weight:700;margin-bottom:4px">${esc(c.title)}</div>
          <div style="font-size:12px;color:var(--muted)">${esc(art?.name||'—')} · ${esc(rel?.title||'—')}</div>
        </div>
        <div style="padding:12px 14px">
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
            ${c.genres?`<span class="bd b-g">${esc(c.genres)}</span>`:''}
            ${daysLeft!==null?`<span class="bd ${daysLeft<7?'b-e':'b-n'}">${daysLeft>0?daysLeft+'d left':'Closed'}</span>`:''}
            <span class="bd b-t">Max: ${c.max_submissions||50}</span>
          </div>
          ${c.brief?`<p style="font-size:12px;color:var(--muted);margin-bottom:10px">${esc(c.brief)}</p>`:''}
          ${c.prize?`<div style="font-size:12px;color:var(--gold)">🏆 ${esc(c.prize)}</div>`:''}
          <div class="flex gap2 mt3">
            <button class="btn btn-g" style="font-size:11.5px;flex:1;gap:5px;padding:5px">
              <i data-lucide="external-link" style="width:12px"></i> Share Link
            </button>
            <button class="btn-ic" onclick="LOS.deleteItem('remix_contests','${c.id}')"><i data-lucide="trash-2" style="width:13px"></i></button>
          </div>
        </div>
      </div>`;
    }).join(''):'<div style="grid-column:span 3;text-align:center;color:var(--muted);padding:32px">No remix contests yet</div>';
    lucide.createIcons();
  },

  saveContest(){
    const t=document.getElementById('cnT')?.value.trim();
    if(!t) return this.toast('Title required','err');
    if(!this.db.remix_contests) this.db.remix_contests=[];
    const relSel=document.getElementById('rsel-contest-sel');
    const c={
      id:uid(), title:t,
      release_id: relSel?.value||'',
      artist_id:  ArtSel.getValue('asel-contest'),
      deadline:   document.getElementById('cnDL')?.value,
      max_submissions: parseInt(document.getElementById('cnMax')?.value)||50,
      prize:      document.getElementById('cnPrize')?.value,
      genres:     document.getElementById('cnGenres')?.value,
      brief:      document.getElementById('cnBrief')?.value,
      status:     'Active', submissions:[],
    };
    this.db.remix_contests.push(c);
    this.save(); this.closeModal('add-contest'); this.renderContests();
    this.log(`Remix Contest "${t}" created`,'A&R'); this.toast('Contest created');
  },


  // ── MARKETING & SMART LINKS ──────────────────────────────────────────
  mktTab(name, el) {
    document.querySelectorAll('#mktTabs .tab').forEach(t=>t.classList.remove('on'));
    el.classList.add('on');
    ['smartlinks','promo','epk','campaigns'].forEach(n=>{
      const d=document.getElementById('mkt-'+n);
      if(d) d.style.display=n===name?'block':'none';
    });
    if(name==='smartlinks') { this.renderSmartLinks(); }
    if(name==='promo')      { this.renderPromoLinks(); }
    if(name==='epk')        { buildRelSel('rsel-promo','',true); }
    if(name==='campaigns')  { this.renderCampaigns(); }
    lucide.createIcons();
  },

  renderSmartLinks() {
    if(!this.db.smart_links) this.db.smart_links=[];
    const q=document.getElementById('slQ')?.value.toLowerCase()||'';
    const list=this.db.smart_links.filter(l=>!q||l.title.toLowerCase().includes(q));
    document.getElementById('slGrid').innerHTML=list.map(sl=>{
      const art=this.db.artists.find(a=>a.id===sl.artist_id);
      const rel=this.db.releases.find(r=>r.id===sl.release_id);
      const link=`${window.location.origin}/link/${sl.slug}`;
      return `<div class="sl-card">
        <div class="sl-head" style="background:linear-gradient(135deg,${sl.accent||'#c9a84c'}22,${sl.accent||'#c9a84c'}08)">
          <div class="sl-head-bg"></div>
          <div style="position:relative;z-index:1">
            <div style="font-weight:700;font-size:14px">${esc(sl.title)}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">${esc(art?.name||'—')} ${rel?`· ${esc(rel.title)}`:''}</div>
          </div>
        </div>
        <div class="sl-body">
          <div style="font-size:11px;font-family:monospace;color:var(--teal);background:var(--s3);padding:6px 10px;border-radius:6px;margin-bottom:12px;display:flex;align-items:center;gap:6px">
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">/link/${esc(sl.slug)}</span>
            <button class="btn-ic" onclick="navigator.clipboard.writeText('${link}');LOS.toast('Link copied!')"><i data-lucide="copy" style="width:12px"></i></button>
          </div>
          ${(sl.destinations||[]).map(d=>`<div class="sl-dest">
            <span style="font-size:13px;flex:1">${esc(d.platform)}</span>
            <div class="sl-toggle ${d.active?'on':''}" onclick="LOS.toggleSlDest('${sl.id}','${d.platform}')"></div>
          </div>`).join('')}
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;font-size:11.5px">
            ${sl.presave_active?`<span class="bd b-g">Pre-Save ✓</span>`:''}
            ${sl.email_capture?`<span class="bd b-t">Email Capture</span>`:''}
            <span class="bd b-n" style="margin-left:auto">${sl.clicks||0} clicks</span>
          </div>
          <div class="flex gap2 mt3">
            <button class="btn btn-g" style="flex:1;font-size:11.5px;gap:5px;padding:5px"
              onclick="window.open('/link/${sl.slug}','_blank')">
              <i data-lucide="external-link" style="width:12px"></i> Preview
            </button>
            <button class="btn-ic" onclick="LOS.deleteItem('smart_links','${sl.id}')"><i data-lucide="trash-2" style="width:13px"></i></button>
          </div>
        </div>
      </div>`;
    }).join('')||`<div class="card" style="grid-column:span 3;text-align:center;color:var(--muted);padding:36px">No smart links yet</div>`;
    lucide.createIcons();
  },

  addSlDest() {
    const row=document.createElement('div');
    row.className='map-row';
    row.innerHTML=`<input class="inp" placeholder="Platform (e.g. Apple Music)"><input class="inp" placeholder="URL"><button class="btn-ic" onclick="this.closest('.map-row').remove()"><i data-lucide="x" style="width:13px"></i></button>`;
    document.getElementById('slDestList').appendChild(row);
    lucide.createIcons();
  },

  saveSmartLink() {
    const t=document.getElementById('slT')?.value.trim();
    if(!t) return this.toast('Title required','err');
    const rows=document.querySelectorAll('#slDestList .map-row');
    const dests=[];
    rows.forEach(r=>{
      const ins=r.querySelectorAll('input');
      if(ins[0]?.value && ins[1]?.value) dests.push({platform:ins[0].value, url:ins[1].value, active:true});
    });
    if(!this.db.smart_links) this.db.smart_links=[];
    const relSel=document.getElementById('rsel-sl-sel');
    const sl={
      id:uid(), title:t,
      slug:   document.getElementById('slSlug')?.value||t.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''),
      artist_id: ArtSel.getValue('asel-sl'),
      release_id: relSel?.value||'',
      type:    document.getElementById('slType')?.value,
      accent:  document.getElementById('slAccent')?.value||'#c9a84c',
      destinations: dests,
      presave_active: document.getElementById('slPresave')?.checked||false,
      email_capture:  document.getElementById('slEmail')?.checked||true,
      clicks: 0, created: new Date().toISOString().slice(0,10),
    };
    this.db.smart_links.push(sl);
    this.save(); this.closeModal('add-smartlink'); this.renderSmartLinks();
    this.log(`Smart Link "${t}" created`,'Marketing'); this.toast('Smart Link created');
  },

  toggleSlDest(slId, platform) {
    const sl=this.db.smart_links?.find(s=>s.id===slId);
    if(!sl) return;
    const d=sl.destinations?.find(x=>x.platform===platform);
    if(d) d.active=!d.active;
    this.save(); this.renderSmartLinks();
  },

  renderPromoLinks() {
    if(!this.db.promo_links) this.db.promo_links=[];
    const now=Date.now();
    document.getElementById('promoList').innerHTML=this.db.promo_links.map(pl=>{
      const rel=this.db.releases.find(r=>r.id===pl.release_id);
      const expDate=pl.expires?new Date(pl.expires):null;
      const daysLeft=expDate?Math.ceil((expDate-now)/86400000):null;
      const expCls=daysLeft===null?'ok':daysLeft<0?'exp':daysLeft<7?'warn':'ok';
      const expTxt=daysLeft===null?'No expiry':daysLeft<0?'Expired':`${daysLeft}d left`;
      const uid2=`${window.location.origin}/promo/${pl.token||pl.id}`;
      return `<div class="promo-item">
        <div style="width:36px;height:36px;background:var(--s3);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i data-lucide="link-2" style="width:16px;color:var(--gold)"></i>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:13px">${esc(pl.label)}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:1px">${esc(rel?.title||'—')} · ${esc(pl.recipients||'—')}</div>
        </div>
        <span class="promo-exp ${expCls}">${expTxt}</span>
        <span style="font-size:11.5px;color:var(--muted)">${pl.downloads||0}/${pl.max_downloads||10} DL</span>
        ${pl.protected?`<i data-lucide="lock" style="width:13px;color:var(--muted)" title="Password protected"></i>`:''}
        <button class="btn-ic" onclick="navigator.clipboard.writeText('${uid2}');LOS.toast('Promo link copied!')"><i data-lucide="copy" style="width:13px"></i></button>
        <button class="btn-ic" onclick="LOS.deleteItem('promo_links','${pl.id}')"><i data-lucide="trash-2" style="width:13px"></i></button>
      </div>`;
    }).join('')||'<div style="color:var(--muted);font-size:13px;text-align:center;padding:28px">No promo links yet</div>';

    const total=this.db.promo_links.length;
    const active=this.db.promo_links.filter(p=>!p.expires||new Date(p.expires)>now).length;
    const totalDl=this.db.promo_links.reduce((a,p)=>a+(p.downloads||0),0);
    document.getElementById('promoStats').innerHTML=[
      {l:'Total Links',v:total,ic:'link',col:'var(--text)'},
      {l:'Active',v:active,ic:'check-circle',col:'var(--ok)'},
      {l:'Total Downloads',v:totalDl,ic:'download',col:'var(--teal)'},
      {l:'Protected',v:this.db.promo_links.filter(p=>p.protected).length,ic:'lock',col:'var(--gold)'},
    ].map(s=>`<div class="card stat"><div class="sl" style="gap:6px"><i data-lucide="${s.ic}" style="width:12px;color:${s.col}"></i>${s.l}</div><div class="sv" style="color:${s.col}">${s.v}</div></div>`).join('');
    lucide.createIcons();
  },

  savePromoLink() {
    const label=document.getElementById('plLabel')?.value.trim();
    if(!label) return this.toast('Label required','err');
    if(!this.db.promo_links) this.db.promo_links=[];
    const relSel=document.getElementById('rsel-promo-sel');
    const pl={
      id:uid(), label, token:uid().slice(0,8),
      release_id: relSel?.value||'',
      recipients: document.getElementById('plRcpts')?.value,
      expires:    document.getElementById('plExp')?.value,
      max_downloads: parseInt(document.getElementById('plMaxDl')?.value)||10,
      protected:  document.getElementById('plProtect')?.checked||false,
      password:   document.getElementById('plPwd')?.value,
      downloads:  0, created: new Date().toISOString().slice(0,10),
    };
    this.db.promo_links.push(pl);
    this.save(); this.closeModal('add-promo'); this.renderPromoLinks();
    this.log(`Promo link "${label}" created`,'Marketing'); this.toast('Promo link created');
  },

  generateEPK() {
    const artId=ArtSel.getValue('asel-epk');
    if(!artId) return this.toast('Select an artist','err');
    const art=this.db.artists.find(a=>a.id===artId);
    const rels=this.db.releases.filter(r=>r.artist_id===artId);
    const events=this.db.events.filter(e=>e.artist_id===artId&&e.status==='Confirmed');
    const roys=this.db.royalties.filter(r=>{
      const rel=this.db.releases.find(x=>x.id===r.release_id);
      return rel?.artist_id===artId;
    });
    const totalStreams=roys.reduce((a,r)=>a+parseFloat(r.net_amount||0),0);
    const inclRels=document.getElementById('epkRels')?.checked;
    const inclEvents=document.getElementById('epkEvents')?.checked;
    const inclStats=document.getElementById('epkStats')?.checked;

    const html=`<div class="epk-preview">
      <h2>📋 ${esc(art.name)}</h2>
      ${art.genres?`<div style="color:var(--teal);font-size:12px;margin-bottom:8px">${esc(art.genres)}</div>`:''}
      ${art.territory?`<div style="font-size:12px;color:var(--muted);margin-bottom:12px">📍 ${esc(art.territory)}</div>`:''}
      ${art.notes?`<div style="color:var(--muted);font-size:12.5px;margin-bottom:14px;line-height:1.7">${esc(art.notes)}</div>`:''}

      ${inclStats?`<div style="display:flex;gap:14px;margin-bottom:16px;flex-wrap:wrap">
        <div style="text-align:center;background:var(--s2);padding:10px 16px;border-radius:8px">
          <div style="font-size:20px;font-weight:700;color:var(--gold)">${rels.length}</div>
          <div style="font-size:10.5px;color:var(--muted)">Releases</div>
        </div>
        <div style="text-align:center;background:var(--s2);padding:10px 16px;border-radius:8px">
          <div style="font-size:20px;font-weight:700;color:var(--teal)">${events.length}</div>
          <div style="font-size:10.5px;color:var(--muted)">Confirmed Gigs</div>
        </div>
        ${totalStreams>0?`<div style="text-align:center;background:var(--s2);padding:10px 16px;border-radius:8px">
          <div style="font-size:20px;font-weight:700;color:var(--ok)">${fmtE(totalStreams)}</div>
          <div style="font-size:10.5px;color:var(--muted)">Royalties</div>
        </div>`:''}
      </div>`:''}

      ${inclRels&&rels.length?`<div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px">Releases</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${rels.slice(0,6).map(r=>`<span class="bd b-g">${esc(r.title)} <span style="color:var(--muted)">${esc(r.type)}</span></span>`).join('')}
        </div>
      </div>`:''}

      ${inclEvents&&events.length?`<div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px">Recent / Upcoming Gigs</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${events.slice(0,5).map(e=>`<span class="bd b-t">${esc(e.name)} <span style="color:var(--muted)">${esc(e.date||'TBA')}</span></span>`).join('')}
        </div>
      </div>`:''}

      <div class="epk-links">
        ${art.links?art.links.split(',').map(l=>`<a class="epk-link" href="${esc(l.trim())}" target="_blank">${esc(l.trim().replace(/https?:\/\//,'').split('/')[0])}</a>`).join(''):''}
        ${art.email?`<a class="epk-link" href="mailto:${esc(art.email)}">${esc(art.email)}</a>`:''}
      </div>
    </div>`;

    document.getElementById('epkPreview').innerHTML=html;
    this._epkHtml=html; this._epkArtist=art;
    lucide.createIcons();
  },

  downloadEPK() {
    if(!this._epkHtml) return this.toast('Generate EPK first','err');
    const full=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>EPK — ${esc(this._epkArtist?.name||'Artist')}</title><style>*{box-sizing:border-box}body{background:#0e0f14;color:#e8eaf0;font-family:system-ui,sans-serif;padding:32px;max-width:720px;margin:0 auto}.bd{display:inline-block;padding:3px 8px;border-radius:20px;border:1px solid;font-size:11px}.b-g{background:rgba(61,153,112,.12);color:#5dba90;border-color:rgba(61,153,112,.2)}.b-t{background:rgba(74,159,168,.12);color:#4a9fa8;border-color:rgba(74,159,168,.2)}.epk-link{padding:4px 10px;background:#1c1e28;border:1px solid #2d3244;border-radius:20px;color:#4a9fa8;text-decoration:none;font-size:11.5px;display:inline-block}.epk-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}</style></head><body>${this._epkHtml}</body></html>`;
    const blob=new Blob([full],{type:'text/html'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`EPK_${(this._epkArtist?.name||'artist').replace(/\s/g,'_')}.html`;
    a.click();
    this.toast('EPK downloaded');
  },

  renderCampaigns() {
    const releases=this.db.releases.filter(r=>r.status!=='Released');
    document.getElementById('campBoard').innerHTML=releases.length?releases.map(r=>{
      const art=this.db.artists.find(a=>a.id===r.artist_id);
      const tasks=(r.tasks||[]);
      const done=tasks.filter(t=>t.done).length;
      const pct=tasks.length?Math.round(done/tasks.length*100):0;
      return `<div class="card">
        <div class="flex gap2 mb3">
          <div><div style="font-weight:700">${esc(r.title)}</div>
          <div style="font-size:11px;color:var(--muted)">${esc(art?.name||'—')} · ${esc(r.type)} · ${esc(r.date||'TBA')}</div></div>
          ${badge(r.status)}
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <div class="score-bar flex-1"><div class="score-fill" style="width:${pct}%;background:${pct>=80?'var(--ok)':pct>=40?'var(--gold)':'var(--err)'}"></div></div>
          <span style="font-size:12px;font-weight:700;color:var(--muted);width:32px;text-align:right">${pct}%</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${this.db.smart_links?.filter(sl=>sl.release_id===r.id).map(sl=>
            `<a href="/link/${sl.slug}" target="_blank" class="btn btn-g" style="font-size:11px;padding:3px 8px;gap:4px"><i data-lucide="link" style="width:10px"></i> Smart Link</a>`
          ).join('')||''}
          ${this.db.promo_links?.filter(pl=>pl.release_id===r.id).map(pl=>
            `<span class="bd b-n" style="font-size:10.5px">Promo: ${esc(pl.label)}</span>`
          ).join('')||''}
        </div>
      </div>`;
    }).join(''):'<div style="grid-column:span 2;text-align:center;color:var(--muted);padding:32px">No active campaigns — all releases are done!</div>';
    lucide.createIcons();
  },

  // ── ANALYTICS & REPORTING ─────────────────────────────────────────────
  analTab(name, el) {
    document.querySelectorAll('#analTabs .tab').forEach(t=>t.classList.remove('on'));
    el.classList.add('on');
    ['overview','releases','anr','channels','team'].forEach(n=>{
      const d=document.getElementById('anal-'+n);
      if(d) d.style.display=n===name?'block':'none';
    });
    if(name==='overview')  this.renderAnalOverview();
    if(name==='releases')  { this.renderRelAnalytics(); this._buildAnalRelSel(); }
    if(name==='anr')       this.renderANRAnalytics();
    if(name==='channels')  this.renderChannelAnalytics();
    if(name==='team')      this.renderTeamAnalytics();
    lucide.createIcons();
  },

  _buildAnalRelSel() {
    const sel=document.getElementById('analRelSel');
    if(!sel) return;
    const current=sel.value;
    sel.innerHTML=`<option value="">All Releases</option>${this.db.releases.map(r=>`<option value="${r.id}">${esc(r.title)}</option>`).join('')}`;
    if(current) sel.value=current;
  },

  renderAnalOverview() {
    const demos=this.db.demos;
    const artists=this.db.artists;
    const roys=this.db.royalties;
    const exps=this.db.expenses;
    const tRoy=roys.reduce((a,r)=>a+parseFloat(r.net_amount||0),0);
    const tExp=exps.reduce((a,e)=>a+parseFloat(e.amount||0),0);
    const signed=demos.filter(d=>d.status==='signed').length;
    const signRate=demos.length?Math.round(signed/demos.length*100):0;

    document.getElementById('analMetrics').innerHTML=[
      {l:'Total Revenue',v:fmtE(tRoy),d:'All time royalties',col:'var(--ok)',ic:'trending-up'},
      {l:'Net Profit',v:fmtE(tRoy-tExp),d:'After expenses',col:tRoy-tExp>0?'var(--gold)':'var(--err)',ic:'wallet'},
      {l:'Demo Sign Rate',v:`${signRate}%`,d:`${signed} of ${demos.length} signed`,col:'var(--teal)',ic:'percent'},
      {l:'Active Artists',v:artists.filter(a=>a.status==='Active'||a.type==='Core Artist').length,d:'Core roster',col:'var(--text)',ic:'users'},
    ].map(s=>`<div class="metric-card">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">${s.l}</span>
        <i data-lucide="${s.ic}" style="width:14px;color:${s.col}"></i>
      </div>
      <div class="metric-val" style="color:${s.col}">${s.v}</div>
      <div style="font-size:11px;color:var(--muted)">${s.d}</div>
    </div>`).join('');

    // Revenue vs Expenses — monthly grouped (last 6 months)
    const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const nowM=new Date().getMonth();
    const last6=Array.from({length:6},(_,i)=>{const m=(nowM-5+i+12)%12;return{label:months[m],m};});
    const royByM=last6.map(({m})=>roys.filter(r=>{const d=new Date(r.period?.slice(0,7)||'2026-01');return d.getMonth()===m;}).reduce((a,r)=>a+parseFloat(r.net_amount||0),0));
    const expByM=last6.map(({m})=>exps.filter(e=>{const d=new Date(e.date||'2026-01-01');return d.getMonth()===m;}).reduce((a,e)=>a+parseFloat(e.amount||0),0));

    const ctx1=document.getElementById('revExpChart');
    if(ctx1){
      if(ctx1._chart) ctx1._chart.destroy();
      ctx1._chart=new Chart(ctx1,{type:'bar',data:{labels:last6.map(x=>x.label),datasets:[
        {label:'Revenue',data:royByM,backgroundColor:'rgba(61,153,112,.7)'},
        {label:'Expenses',data:expByM,backgroundColor:'rgba(192,82,78,.6)'},
      ]},options:{responsive:false,plugins:{legend:{display:true,labels:{color:'#8891aa',font:{size:10}}}},scales:{x:{ticks:{color:'#8891aa'},grid:{color:'#2d3244'}},y:{ticks:{color:'#8891aa'},grid:{color:'#2d3244'}}}}});
    }

    // Pipeline chart
    const stageCounts=ANR_COLS.map(c=>this.db.demos.filter(d=>d.status===c.key).length);
    this._drawBar('pipelineChart',ANR_COLS.map(c=>c.label),stageCounts,ANR_COLS.map(c=>c.col));

    // Release timeline bar (releases per month)
    const relByM=last6.map(({m})=>this.db.releases.filter(r=>{const d=new Date(r.date||'2026-01-01');return d.getMonth()===m;}).length);
    this._drawBar('relTimeChart',last6.map(x=>x.label),relByM,['#4a9fa8']);

    // Artist status pie
    const statMap={};
    artists.forEach(a=>{ statMap[a.status||'Unknown']=(statMap[a.status||'Unknown']||0)+1; });
    this._drawPie('artStatusChart',Object.keys(statMap),Object.values(statMap));

    // Top artists by royalties
    const artRoy={};
    roys.forEach(r=>{
      const rel=this.db.releases.find(x=>x.id===r.release_id);
      const artId=rel?.artist_id;
      if(artId) artRoy[artId]=(artRoy[artId]||0)+parseFloat(r.net_amount||0);
    });
    const sorted=Object.entries(artRoy).sort((a,b)=>b[1]-a[1]).slice(0,5);
    document.getElementById('topArtists').innerHTML=sorted.length?sorted.map(([id,v],i)=>{
      const art=this.db.artists.find(a=>a.id===id);
      const max=sorted[0][1]||1;
      return `<div class="chan-row">
        <span style="width:16px;font-size:11.5px;color:var(--muted);text-align:center">${i+1}</span>
        <span style="flex:1;font-size:13px;font-weight:600">${esc(art?.name||id)}</span>
        <div class="chan-bar"><div class="chan-fill" style="width:${v/max*100}%;background:var(--goldg)"></div></div>
        <span style="font-size:12px;font-weight:700;color:var(--ok);width:64px;text-align:right">${fmtE(v)}</span>
      </div>`;
    }).join(''):'<div style="color:var(--muted);font-size:12px;padding:12px 0">No royalty data</div>';
    lucide.createIcons();
  },

  renderRelAnalytics() {
    const relId=document.getElementById('analRelSel')?.value;
    const roys=relId?this.db.royalties.filter(r=>r.release_id===relId):this.db.royalties;
    const tRoy=roys.reduce((a,r)=>a+parseFloat(r.net_amount||0),0);
    const platMap={};
    roys.forEach(r=>{ platMap[r.source||'Unknown']=(platMap[r.source||'Unknown']||0)+parseFloat(r.net_amount||0); });
    const terrMap={};
    roys.forEach(r=>{ terrMap[r.territory||'WW']=(terrMap[r.territory||'WW']||0)+parseFloat(r.net_amount||0); });

    const relData=this.db.releases.find(r=>r.id===relId);
    const tasks=relData?.tasks||[];
    const done=tasks.filter(t=>t.done).length;

    document.getElementById('relPerfStats').innerHTML=[
      {l:'Total Royalties',v:fmtE(tRoy),col:'var(--ok)',ic:'dollar-sign'},
      {l:'Platforms',v:Object.keys(platMap).length,col:'var(--teal)',ic:'layers'},
      {l:'Territories',v:Object.keys(terrMap).length,col:'var(--gold)',ic:'globe'},
      {l:'Task Progress',v:tasks.length?`${done}/${tasks.length}`:'-',col:'var(--muted)',ic:'check-square'},
    ].map(s=>`<div class="metric-card"><div class="flex gap2"><i data-lucide="${s.ic}" style="width:12px;color:${s.col}"></i><span style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em">${s.l}</span></div><div class="metric-val" style="color:${s.col};font-size:22px">${s.v}</div></div>`).join('');

    this._drawBar('platChart',Object.keys(platMap),Object.values(platMap),['#c9a84c','#4a9fa8','#7c6fa8','#3d9970','#c0524e']);
    this._drawPie('terrAnalChart',Object.keys(terrMap),Object.values(terrMap));
    lucide.createIcons();
  },

  renderANRAnalytics() {
    const demos=this.db.demos;
    const signed=demos.filter(d=>d.status==='signed').length;
    const reviewed=demos.filter(d=>d.status!=='new').length;
    const avgScore=demos.length?Math.round(demos.reduce((a,d)=>a+(d.score||this.calcScore(d)),0)/demos.length):0;
    const avgRating=demos.filter(d=>d.rating>0).length?
      (demos.filter(d=>d.rating>0).reduce((a,d)=>a+d.rating,0)/demos.filter(d=>d.rating>0).length).toFixed(1):'—';

    document.getElementById('anrAnalStats').innerHTML=[
      {l:'Total Submissions',v:demos.length,col:'var(--text)',ic:'inbox'},
      {l:'Reviewed',v:reviewed,col:'var(--teal)',ic:'check-circle'},
      {l:'Signed',v:signed,col:'var(--ok)',ic:'star'},
      {l:'Avg Score',v:avgScore,col:'var(--gold)',ic:'zap'},
    ].map(s=>`<div class="metric-card"><div class="flex gap2"><i data-lucide="${s.ic}" style="width:12px;color:${s.col}"></i><span style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em">${s.l}</span></div><div class="metric-val" style="color:${s.col};font-size:22px">${s.v}</div></div>`).join('');

    // Submission volume (group by submitted month)
    const volMap={};
    demos.forEach(d=>{ const m=d.submitted?.slice(0,7)||'2026-05'; volMap[m]=(volMap[m]||0)+1; });
    const vkeys=Object.keys(volMap).sort();
    this._drawBar('subVolChart',vkeys.map(k=>k.slice(5)),vkeys.map(k=>volMap[k]),['#4a9fa8']);

    // Funnel conversion
    this._drawBar('convChart',ANR_COLS.map(c=>c.label),ANR_COLS.map(c=>demos.filter(d=>d.status===c.key).length),ANR_COLS.map(c=>c.col));

    // Top demos table
    const top=[...demos].map(d=>({...d,score:d.score??this.calcScore(d)})).sort((a,b)=>b.score-a.score).slice(0,8);
    document.getElementById('topDemosTable').innerHTML=`<table><thead><tr><th>Track</th><th>Artist</th><th>Genre</th><th>Score</th><th>Status</th></tr></thead><tbody>${
      top.map(d=>{const art=this.db.artists.find(a=>a.id===d.artist_id);return`<tr>
        <td style="font-weight:600">${esc(d.title)}</td>
        <td style="font-size:12px;color:var(--muted)">${esc(art?.name||d.artist_name||'External')}</td>
        <td>${esc(d.genre||'—')}</td>
        <td><span style="font-weight:700;color:${d.score>=80?'var(--ok)':d.score>=60?'var(--gold)':'var(--muted)'}">${d.score}</span></td>
        <td>${badge(d.status)}</td>
      </tr>`;}).join('')
    }</tbody></table>`;
    lucide.createIcons();
  },

  renderChannelAnalytics() {
    if(!this.db.channel_stats) this.db.channel_stats=[];
    const cs=this.db.channel_stats;
    const sorted=[...cs].sort((a,b)=>b.impact-a.impact);
    const maxImpact=sorted[0]?.impact||10;
    document.getElementById('chanList').innerHTML=sorted.length?sorted.map(c=>`
      <div class="chan-row">
        <span style="flex:1;font-size:13px;font-weight:600">${esc(c.channel)}</span>
        <span style="font-size:11px;color:var(--muted);width:60px">${esc(c.type)}</span>
        <div class="chan-bar"><div class="chan-fill" style="width:${c.impact/maxImpact*100}%;background:var(--goldg)"></div></div>
        <span style="font-size:12px;font-weight:700;color:var(--gold);width:24px;text-align:right">${c.impact}</span>
      </div>`).join(''):'<div style="color:var(--muted);font-size:12px;padding:12px 0">No channel data — log results to see analytics</div>';

    // ROI by type
    const typeMap={};
    cs.forEach(c=>{ typeMap[c.type]=(typeMap[c.type]||0)+parseFloat(c.result||0); });
    this._drawBar('chanRoiChart',Object.keys(typeMap),Object.values(typeMap),['#c9a84c','#4a9fa8','#7c6fa8','#3d9970','#c0524e','#ec4899']);
    lucide.createIcons();
  },

  saveChannelStat() {
    if(!this.db.channel_stats) this.db.channel_stats=[];
    const ch=document.getElementById('csChannel')?.value.trim();
    if(!ch) return this.toast('Channel required','err');
    const relSel=document.getElementById('rsel-chanstat-sel');
    this.db.channel_stats.push({
      id:uid(), channel:ch,
      type:   document.getElementById('csType')?.value,
      release_id: relSel?.value||'',
      impact: parseInt(document.getElementById('csImpact')?.value)||5,
      result: parseInt(document.getElementById('csResult')?.value)||0,
      notes:  document.getElementById('csNotes')?.value,
      date:   new Date().toISOString().slice(0,10),
    });
    this.save(); this.closeModal('add-channel-stat'); this.renderChannelAnalytics();
    this.log(`Channel result for "${ch}" logged`,'Analytics'); this.toast('Result logged');
  },

  renderTeamAnalytics() {
    const tasks=this.db.global_tasks||[];
    const users=this.db.users||[];
    const tasksByUser={};
    tasks.forEach(t=>{ const a=t.artist_id||'unassigned'; tasksByUser[a]=(tasksByUser[a]||0)+1; });
    const maxT=Math.max(...Object.values(tasksByUser),1);
    document.getElementById('taskAssignee').innerHTML=Object.entries(tasksByUser).map(([id,v])=>{
      const art=this.db.artists.find(a=>a.id===id);
      return `<div class="chan-row">
        <div class="avatar" style="width:24px;height:24px;font-size:9px;flex-shrink:0">${(art?.name||'?')[0].toUpperCase()}</div>
        <span style="flex:1;font-size:12.5px">${esc(art?.name||'Unassigned')}</span>
        <div class="chan-bar"><div class="chan-fill" style="width:${v/maxT*100}%"></div></div>
        <span style="font-size:12px;font-weight:700;color:var(--teal);width:24px;text-align:right">${v}</span>
      </div>`;
    }).join('')||'<div style="color:var(--muted);font-size:12px;padding:12px 0">No tasks assigned</div>';

    // Activity feed
    const acts=[...(this.db.activityLog||[])].reverse().slice(0,20);
    document.getElementById('activityFeed').innerHTML=acts.length?acts.map(a=>`
      <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--b1)">
        <i data-lucide="activity" style="width:12px;color:var(--gold);flex-shrink:0;margin-top:2px"></i>
        <div>
          <div style="font-size:12.5px">${esc(a.msg)}</div>
          <div style="font-size:10.5px;color:var(--muted)">${a.module} · ${a.ts}</div>
        </div>
      </div>`).join(''):'<div style="color:var(--muted);font-size:12px;padding:12px 0">No activity yet</div>';
    lucide.createIcons();
  },

  // ── COLLABORATION, TASKS & WORKFLOWS ─────────────────────────────────
  collabTab(name, el) {
    document.querySelectorAll('#collabTabs .tab').forEach(t=>t.classList.remove('on'));
    el.classList.add('on');
    ['tasks','notes','calendar','automations'].forEach(n=>{
      const d=document.getElementById('collab-'+n);
      if(d) d.style.display=n===name?'block':'none';
    });
    if(name==='tasks')       this.renderGlobalTasks();
    if(name==='notes')       this.renderNotes();
    if(name==='calendar')    this.renderCalendar();
    if(name==='automations') this.renderAutomations();
    lucide.createIcons();
  },

  renderGlobalTasks() {
    if(!this.db.global_tasks) this.db.global_tasks=[];
    const q=document.getElementById('taskQ')?.value.toLowerCase()||'';
    const priF=document.getElementById('taskPriF')?.value||'';
    const filtered=this.db.global_tasks.filter(t=>{
      const qm=!q||t.text.toLowerCase().includes(q);
      const pm=!priF||t.priority===priF;
      return qm && pm;
    });
    const COLS=[
      {key:'todo',   label:'To Do',      col:'var(--muted)'},
      {key:'doing',  label:'In Progress', col:'var(--teal)'},
      {key:'done',   label:'Done',        col:'var(--ok)'},
    ];
    document.getElementById('taskBoard').innerHTML=COLS.map(col=>{
      const items=filtered.filter(t=>(t.done?'done':t.status||'todo')===col.key);
      return `<div>
        <div class="task-col-hd">
          <span style="width:6px;height:6px;border-radius:50%;background:${col.col};display:block"></span>
          ${col.label} <span style="color:var(--muted);font-weight:400">(${items.length})</span>
        </div>
        ${items.map(t=>{
          const art=this.db.artists.find(a=>a.id===t.artist_id);
          const overdue=t.due&&!t.done&&new Date(t.due)<new Date();
          return `<div class="task-item ${t.done?'done':''}"
            draggable="true"
            ondragstart="LOS._taskDrag='${t.id}'"
            ondragover="event.preventDefault()"
            ondrop="LOS.dropTask(event,'${col.key}')">
            <div class="flex gap2 mb1">
              <div class="task-check ${t.done?'done':''}" onclick="LOS.toggleTask('${t.id}')">
                ${t.done?'<i data-lucide="check" style="width:9px;color:white"></i>':''}
              </div>
              <span style="font-size:13px;flex:1;${t.done?'text-decoration:line-through':''}">${esc(t.text)}</span>
              <div class="task-pri ${t.priority||'low'}"></div>
            </div>
            <div class="flex gap2 mt1" style="font-size:11px;color:var(--muted);flex-wrap:wrap">
              ${t.context?`<span class="bd b-n" style="font-size:10px">${esc(t.context)}</span>`:''}
              ${art?`<span>${esc(art.name)}</span>`:''}
              ${t.due?`<span style="${overdue?'color:var(--err);font-weight:600':''}">📅 ${t.due}</span>`:''}
            </div>
          </div>`;
        }).join('')}
      </div>`;
    }).join('');
    lucide.createIcons();
  },

  toggleTask(id) {
    const t=this.db.global_tasks?.find(x=>x.id===id);
    if(!t) return;
    t.done=!t.done;
    t.status=t.done?'done':'todo';
    this.save(); this.renderGlobalTasks();
  },

  _taskDrag: null,
  dropTask(e, col) {
    e.preventDefault();
    if(!this._taskDrag) return;
    const t=this.db.global_tasks?.find(x=>x.id===this._taskDrag);
    if(t){ t.status=col; t.done=col==='done'; }
    this._taskDrag=null;
    this.save(); this.renderGlobalTasks();
  },

  saveGTask() {
    const text=document.getElementById('gtT')?.value.trim();
    if(!text) return this.toast('Task text required','err');
    if(!this.db.global_tasks) this.db.global_tasks=[];
    const t={
      id:uid(), text,
      priority: document.getElementById('gtPri')?.value||'mid',
      due:      document.getElementById('gtDue')?.value,
      context:  document.getElementById('gtCtx')?.value,
      artist_id:ArtSel.getValue('asel-gtask'),
      notes:    document.getElementById('gtNotes')?.value,
      status:   'todo', done:false,
      created:  new Date().toISOString().slice(0,10),
    };
    this.db.global_tasks.push(t);
    this.save(); this.closeModal('add-gtask'); this.renderGlobalTasks();
    this.log(`Task "${text}" created`,'Collab'); this.toast('Task added');
  },

  renderNotes() {
    if(!this.db.notes) this.db.notes=[];
    const q=document.getElementById('noteQ')?.value.toLowerCase()||'';
    const tag=document.getElementById('noteTag')?.value||'';
    const TAG_COL={A_R:'var(--teal)',Finance:'var(--ok)',Marketing:'#ec4899',Legal:'var(--gold)',General:'var(--muted)'};
    const list=this.db.notes.filter(n=>{
      const qm=!q||n.title.toLowerCase().includes(q)||(n.content||'').toLowerCase().includes(q);
      const tm=!tag||n.tag===tag;
      return qm && tm;
    });
    document.getElementById('notesGrid').innerHTML=list.length?list.map(n=>{
      const art=this.db.artists.find(a=>a.id===n.artist_id);
      const mentions=(n.content||'').match(/@\w+/g)||[];
      const preview=(n.content||'').replace(/@(\w+)/g,'<span class="mention">@$1</span>').slice(0,120);
      return `<div class="note-card">
        <div class="flex gap2 mb2">
          <span style="width:8px;height:8px;border-radius:50%;background:${TAG_COL[n.tag]||'var(--muted)'};flex-shrink:0;margin-top:4px;display:block"></span>
          <div style="font-weight:700;font-size:13px;flex:1">${esc(n.title)}</div>
        </div>
        ${art?`<div style="font-size:11px;color:var(--muted);margin-bottom:6px">${esc(art.name)}</div>`:''}
        <div style="font-size:12.5px;color:var(--muted);line-height:1.7" id="note-body-${n.id}">${preview}${n.content?.length>120?'…':''}</div>
        <div class="flex gap2 mt3" style="font-size:11px;color:var(--muted)">
          <span class="bd b-n">${esc(n.tag||'General')}</span>
          <span style="margin-left:auto">${n.created||''}</span>
        </div>
        <div class="comment-thread mt2">
          <div id="noteComments-${n.id}">
            ${(n.comments||[]).map(c=>`<div class="comment-item">
              <div class="avatar">${c.author?.[0]?.toUpperCase()||'?'}</div>
              <div><div style="font-size:11px;font-weight:600;color:var(--text)">${esc(c.author||'?')} <span style="color:var(--muted);font-weight:400">${c.ts||''}</span></div>
              <div style="font-size:12px;margin-top:2px">${(c.text||'').replace(/@(\w+)/g,'<span class="mention">@$1</span>')}</div></div>
            </div>`).join('')}
          </div>
          <div class="flex gap2 mt2">
            <input class="inp flex-1" style="font-size:12px;padding:5px 9px" placeholder="Comment… (@mention)" id="nc-${n.id}">
            <button class="btn btn-g" style="padding:5px 8px;font-size:11px" onclick="LOS.addNoteComment('${n.id}')">
              <i data-lucide="send" style="width:12px"></i>
            </button>
          </div>
        </div>
        <button class="btn-ic" style="position:absolute;top:10px;right:10px" onclick="LOS.deleteItem('notes','${n.id}')"><i data-lucide="trash-2" style="width:13px"></i></button>
      </div>`;
    }).join(''):'<div style="grid-column:span 3;text-align:center;color:var(--muted);padding:36px">No notes yet</div>';
    lucide.createIcons();
  },

  saveNote() {
    const title=document.getElementById('ntT')?.value.trim();
    if(!title) return this.toast('Title required','err');
    if(!this.db.notes) this.db.notes=[];
    this.db.notes.push({
      id:uid(), title,
      content: document.getElementById('ntContent')?.value,
      tag:     document.getElementById('ntTag')?.value,
      artist_id: ArtSel.getValue('asel-note'),
      comments: [],
      created: new Date().toLocaleDateString('de-DE'),
    });
    this.save(); this.closeModal('add-note'); this.renderNotes();
    this.log(`Note "${title}" created`,'Collab'); this.toast('Note saved');
  },

  addNoteComment(noteId) {
    const inp=document.getElementById(`nc-${noteId}`);
    if(!inp?.value.trim()) return;
    const note=this.db.notes?.find(n=>n.id===noteId);
    if(!note) return;
    if(!note.comments) note.comments=[];
    const user=this.db.users?.find(u=>u.id===this.currentUser);
    note.comments.push({
      id:uid(), text:inp.value,
      author: user?.name||'You',
      ts: new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})
    });
    inp.value='';
    this.save(); this.renderNotes();
  },

  // Calendar
  _calDate: new Date(),
  renderCalendar() {
    const d=this._calDate;
    const y=d.getFullYear(), m=d.getMonth();
    document.getElementById('calTitle').textContent=`${['January','February','March','April','May','June','July','August','September','October','November','December'][m]} ${y}`;

    // Day headers
    document.getElementById('calDayHeaders').innerHTML=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<div class="cal-hd">${d}</div>`).join('');

    // Days
    const first=new Date(y,m,1);
    const startDow=(first.getDay()+6)%7; // Monday=0
    const daysInMonth=new Date(y,m+1,0).getDate();
    const today=new Date();

    // Collect events
    const allEvents=[];
    this.db.releases.forEach(r=>{if(r.date){const d=r.date.slice(0,10);allEvents.push({date:d,label:r.title,type:'release'});}});
    this.db.events.forEach(e=>{if(e.date){const d=e.date.slice(0,10);allEvents.push({date:d,label:e.name,type:'gig'});}});
    (this.db.global_tasks||[]).filter(t=>t.due&&!t.done).forEach(t=>{allEvents.push({date:t.due.slice(0,10),label:t.text,type:'task'});});
    (this.db.smart_links||[]).filter(sl=>sl.created).forEach(sl=>{allEvents.push({date:sl.created.slice(0,10),label:`Link: ${sl.title}`,type:'promo'});});

    let cells='';
    let dayCount=0;
    // Leading empty cells
    for(let i=0;i<startDow;i++) cells+=`<div class="cal-day other-month"></div>`;
    // Day cells
    for(let day=1;day<=daysInMonth;day++){
      const dateStr=`${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const isToday=today.getDate()===day&&today.getMonth()===m&&today.getFullYear()===y;
      const dayEvts=allEvents.filter(e=>e.date===dateStr);
      cells+=`<div class="cal-day${isToday?' today':''}">
        <div style="font-size:12px;font-weight:${isToday?700:400};color:${isToday?'var(--gold)':'var(--muted)'};margin-bottom:2px">${day}</div>
        ${dayEvts.slice(0,3).map(e=>`<div class="cal-event ${e.type}" title="${esc(e.label)}">${esc(e.label)}</div>`).join('')}
        ${dayEvts.length>3?`<div style="font-size:9px;color:var(--muted);margin-top:2px">+${dayEvts.length-3} more</div>`:''}
      </div>`;
      dayCount++;
    }
    // Trailing cells
    const trailing=(7-((startDow+daysInMonth)%7))%7;
    for(let i=0;i<trailing;i++) cells+=`<div class="cal-day other-month"></div>`;
    document.getElementById('calGrid').innerHTML=cells;
  },

  calPrev()   { this._calDate=new Date(this._calDate.getFullYear(),this._calDate.getMonth()-1,1); this.renderCalendar(); },
  calNext()   { this._calDate=new Date(this._calDate.getFullYear(),this._calDate.getMonth()+1,1); this.renderCalendar(); },
  calToday()  { this._calDate=new Date(); this.renderCalendar(); },

  exportICS() {
    const events=[];
    this.db.releases.forEach(r=>{
      if(r.date) events.push({title:`Release: ${r.title}`,date:r.date.replace(/-/g,''),type:'release'});
    });
    this.db.events.forEach(e=>{
      if(e.date) events.push({title:e.name,date:e.date.replace(/-/g,''),type:'gig'});
    });
    (this.db.global_tasks||[]).filter(t=>t.due).forEach(t=>{
      events.push({title:`Task: ${t.text}`,date:t.due.replace(/-/g,''),type:'task'});
    });
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//LabelManager//LabelOS//EN','CALSCALE:GREGORIAN'];
    events.forEach(e=>{
      ics.push('BEGIN:VEVENT',`UID:${uid()}@labelmanager`,`DTSTART;VALUE=DATE:${e.date}`,`DTEND;VALUE=DATE:${e.date}`,`SUMMARY:${e.title}`,`CATEGORIES:${e.type.toUpperCase()}`,`DESCRIPTION:Exported from LabelManager`,'END:VEVENT');
    });
    ics.push('END:VCALENDAR');
    const blob=new Blob([ics.join('\r\n')],{type:'text/calendar'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='labelmanager_calendar.ics';
    a.click();
    this.toast(`${events.length} events exported as ICS`);
  },

  renderAutomations() {
    if(!this.db.automations) this.db.automations=[];
    document.getElementById('autoRules').innerHTML=this.db.automations.map(r=>`
      <div class="auto-rule">
        <div class="auto-toggle ${r.active?'on':''}" onclick="LOS.toggleAuto('${r.id}')"></div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600">${esc(r.label)}</div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:2px">
            <span style="color:var(--teal)">WHEN</span> ${esc(r.trigger)} →
            <span style="color:var(--gold)">THEN</span> ${esc(r.action)}
          </div>
        </div>
        <span class="bd ${r.active?'b-g':'b-n'}" style="font-size:11px">${r.active?'Active':'Off'}</span>
        <button class="btn-ic" onclick="LOS.deleteItem('automations','${r.id}')"><i data-lucide="trash-2" style="width:13px"></i></button>
      </div>`).join('')||'<div style="color:var(--muted);font-size:13px;padding:16px 0">No automation rules yet</div>';

    // Auto log (last 10 entries from activity log)
    const autoActs=(this.db.activityLog||[]).filter(a=>a.auto).reverse().slice(0,10);
    document.getElementById('autoLog').innerHTML=autoActs.length?autoActs.map(a=>`
      <div style="display:flex;gap:10px;padding:7px 0;border-bottom:1px solid var(--b1)">
        <i data-lucide="zap" style="width:12px;color:var(--gold);flex-shrink:0;margin-top:2px"></i>
        <div>
          <div style="font-size:12px">${esc(a.msg)}</div>
          <div style="font-size:10.5px;color:var(--muted)">${a.ts}</div>
        </div>
      </div>`).join(''):'<div style="color:var(--muted);font-size:12px;padding:10px 0">No automation runs yet</div>';
    lucide.createIcons();
  },

  toggleAuto(id) {
    const r=this.db.automations?.find(x=>x.id===id);
    if(r) { r.active=!r.active; this.save(); this.renderAutomations(); }
  },

  saveAutomation() {
    const label=document.getElementById('auLabel')?.value.trim();
    if(!label) return this.toast('Label required','err');
    if(!this.db.automations) this.db.automations=[];
    this.db.automations.push({
      id:uid(), label,
      trigger: document.getElementById('auTrigger')?.value,
      action:  document.getElementById('auAction')?.value,
      active:  true,
    });
    this.save(); this.closeModal('add-automation'); this.renderAutomations();
    this.log(`Automation "${label}" created`,'Collab'); this.toast('Automation saved');
  },

  // Automation Engine — inject into existing methods
  _runAutomations(trigger, context={}) {
    const rules=(this.db.automations||[]).filter(r=>r.active&&r.trigger===trigger);
    rules.forEach(r=>{
      let msg='';
      if(r.action==='create_release_tasks' && context.release_id) {
        const rel=this.db.releases.find(x=>x.id===context.release_id);
        if(rel&&(!rel.tasks||rel.tasks.length===0)) {
          rel.tasks=this._buildTaskTemplate(rel.type);
          msg=`Auto-created task checklist for "${rel.title}"`;
        }
      } else if(r.action==='create_contract_draft' && context.artist_id) {
        const art=this.db.artists.find(a=>a.id===context.artist_id);
        msg=`Auto-created contract draft for ${art?.name||'artist'}`;
      } else if(r.action==='create_gig_tasks' && context.event_id) {
        const ev=this.db.events.find(e=>e.id===context.event_id);
        if(ev) msg=`Auto-created itinerary tasks for "${ev.name}"`;
      } else if(r.action==='log_notification') {
        msg=`Notification: trigger "${trigger}" fired`;
      }
      if(msg) {
        if(!this.db.activityLog) this.db.activityLog=[];
        this.db.activityLog.push({id:uid(),msg,module:'Automation',auto:true,ts:new Date().toLocaleString('de-DE')});
        this.toast(`⚡ ${msg}`);
      }
    });
    if(rules.length) this.save();
  },

  // ── NOTIFICATIONS ──────────────────────────────────────────────────────
  initNotifications() {
    if(!this.db.notifications) this.db.notifications=[];
    this.renderNotifBadge();
    // Close panel when clicking outside
    document.addEventListener('click', e=>{
      if(!document.getElementById('notifBell')?.contains(e.target)) {
        document.getElementById('notifPanel').style.display='none';
      }
    });
  },

  renderNotifBadge() {
    const unread=(this.db.notifications||[]).filter(n=>!n.read).length;
    const badge=document.getElementById('notifBadge');
    if(!badge) return;
    badge.style.display=unread>0?'flex':'none';
    badge.textContent=unread>9?'9+':String(unread);
  },

  toggleNotifPanel(e) {
    // const panel=document.getElementById('notifPanel');
    // if(!panel) return;
    // const isOpen=panel.style.display!=='none';
    // panel.style.display=isOpen?'none':'block';
    // if(!isOpen) this.renderNotifList();
    if(e) e.stopPropagation(); // ← verhindert sofortiges Schließen
    const panel = document.getElementById('notifPanel');
    if(!panel) return;
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    if(!isOpen) this.renderNotifList();
  },

  renderNotifList() {
    const list=(this.db.notifications||[]).slice().reverse();
    const ICONS={demo_new:'music',task_due:'clock',contract:'file-text',payout:'coins',release:'disc-3',gig:'mic-2',default:'bell'};
    document.getElementById('notifList').innerHTML=list.length?list.map(n=>`
      <div class="notif-item ${n.read?'':'unread'}" onclick="LOS.clickNotif('${n.id}')">
        <div class="notif-dot ${n.read?'read':''}"></div>
        <div style="flex:1">
          <div style="font-size:12.5px;font-weight:${n.read?400:600}">${esc(n.msg)}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${n.ts||''}</div>
        </div>
        <i data-lucide="${ICONS[n.type]||ICONS.default}" style="width:13px;color:var(--muted);flex-shrink:0"></i>
      </div>`).join('')
    :'<div style="padding:24px;text-align:center;color:var(--muted);font-size:13px">All caught up ✓</div>';
    lucide.createIcons();
  },

  clickNotif(id) {
    const n = this.db.notifications?.find(x => x.id === id);
    if(!n) return;
    n.read = true;
    this.save();
    this.renderNotifBadge();
    this.renderNotifList();

    // Navigate zum verlinkten View
    if(n.link) {
      // Panel schließen
      document.getElementById('notifPanel').style.display = 'none';

      // Trigger den Nav-Click — exakt wie deine Sidebar-Navigation arbeitet
      const navEl = document.querySelector(`.nav[data-view="${n.link}"]`);
      if(navEl) {
        navEl.click();
      } else {
        // Fallback: direkt View zeigen
        document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
        const target = document.getElementById(`view-${n.link}`);
        if(target) target.style.display = 'block';
        document.querySelectorAll('.nav').forEach(n => n.classList.remove('on'));
        document.querySelector(`.nav[data-view="${n.link}"]`)?.classList.add('on');
      }
    } else {
      document.getElementById('notifPanel').style.display = 'none';
    }
  },

  markAllRead() {
    (this.db.notifications||[]).forEach(n=>n.read=true);
    this.save(); this.renderNotifBadge(); this.renderNotifList();
  },

  clearNotifs() {
    this.db.notifications=[];
    this.save(); this.renderNotifBadge(); this.renderNotifList();
  },

  pushNotification(type, msg, link='') {
    if(!this.db.notifications) this.db.notifications=[];
    this.db.notifications.push({
      id:uid(), type, msg, link, read:false,
      ts:new Date().toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
    });
    this.save(); this.renderNotifBadge();
  },

  // Call pushNotification from key events — patch into existing methods:
  // After saveDemo():     this.pushNotification('demo_new', `New demo: "${d.title}"`, 'anr');
  // After saveRelease():  this.pushNotification('release', `Release "${r.title}" created`, 'releases');
  // After savePayout():   this.pushNotification('payout', `Payout ${fmtE(p.amount)} recorded`, 'royalties');

  // ── ARTIST PORTAL ─────────────────────────────────────────────────────
  portalTab(name, el) {
    document.querySelectorAll('#portalTabs .tab').forEach(t=>t.classList.remove('on'));
    el.classList.add('on');
    ['overview','releases','demos','financials','assets'].forEach(n=>{
      const d=document.getElementById('portal-'+n);
      if(d) d.style.display=n===name?'block':'none';
    });
    this._renderPortal(name);
    lucide.createIcons();
  },

  _getPortalArtistId() {
    // If current user is an artist, return their linked artist_id
    // Otherwise show a selector (for admin preview)
    const user=this.db.users?.find(u=>u.id===this.currentUser);
    return user?.artist_id||this.db.artists[0]?.id||null;
  },

  _renderPortal(tab) {
    const artId=this._getPortalArtistId();
    const art=this.db.artists.find(a=>a.id===artId);
    if(!art) {
      document.getElementById('portalWelcome').textContent='No artist linked to your account';
      return;
    }
    document.getElementById('portalWelcome').textContent=`👋 Welcome back, ${art.name}`;
    document.getElementById('portalSub').textContent=`${art.type||'Artist'} · ${art.territory||'Worldwide'}`;

    const rels   = this.db.releases.filter(r=>r.artist_id===artId);
    const demos  = this.db.demos.filter(d=>d.artist_id===artId);
    const roys   = this.db.royalties.filter(r=>rels.some(x=>x.id===r.release_id));
    const events = this.db.events.filter(e=>e.artist_id===artId);
    const contracts=(this.db.royalty_contracts||[]).filter(c=>c.artist_id===artId);
    const split  = contracts[0]?.artist_split||50;
    const tRoy   = roys.reduce((a,r)=>a+parseFloat(r.net_amount||0),0);
    const artShare= tRoy*(split/100);
    const pays   = (this.db.payouts||[]).filter(p=>p.artist_id===artId);
    const tPaid  = pays.reduce((a,p)=>a+parseFloat(p.amount||0),0);

    if(tab==='overview') {
      document.getElementById('portalStats').innerHTML=[
        {l:'My Releases',   v:rels.length,    col:'var(--teal)',  ic:'disc-3'},
        {l:'My Demos',      v:demos.length,   col:'var(--muted)', ic:'headphones'},
        {l:'Balance Due',   v:fmtE(artShare-tPaid), col:'var(--gold)', ic:'wallet'},
        {l:'Confirmed Gigs',v:events.filter(e=>e.status==='Confirmed').length, col:'var(--ok)', ic:'mic-2'},
      ].map(s=>`<div class="card stat"><div class="sl"><i data-lucide="${s.ic}" style="width:12px;color:${s.col}"></i>${s.l}</div><div class="sv" style="color:${s.col}">${s.v}</div></div>`).join('');

      document.getElementById('portalRels').innerHTML=rels.slice(0,5).map(r=>`
        <div class="flex gap2 mb3" style="padding:7px 0;border-bottom:1px solid var(--b1)">
          <i data-lucide="disc-3" style="width:13px;color:var(--teal);flex-shrink:0;margin-top:1px"></i>
          <div class="flex-1"><div style="font-weight:600;font-size:13px">${esc(r.title)}</div>
          <div style="font-size:11px;color:var(--muted)">${esc(r.type)} · ${esc(r.date||'TBA')}</div></div>
          ${badge(r.status)}
        </div>`).join('')||'<div style="color:var(--muted);font-size:12px">No releases yet</div>';

      document.getElementById('portalEvents').innerHTML=events.filter(e=>e.status==='Confirmed').slice(0,5).map(e=>`
        <div class="flex gap2 mb3" style="padding:7px 0;border-bottom:1px solid var(--b1)">
          <i data-lucide="mic-2" style="width:13px;color:var(--ok);flex-shrink:0;margin-top:1px"></i>
          <div class="flex-1"><div style="font-weight:600;font-size:13px">${esc(e.name)}</div>
          <div style="font-size:11px;color:var(--muted)">${esc(e.venue||'—')} · ${esc(e.date||'TBA')}</div></div>
          <span style="font-weight:700;font-size:13px;color:var(--ok)">${fmtE(e.fee)}</span>
        </div>`).join('')||'<div style="color:var(--muted);font-size:12px">No confirmed gigs</div>';
      lucide.createIcons();
    }

    if(tab==='releases') {
      document.getElementById('portalRelTbl').innerHTML=rels.map(r=>{
        const relRoys=roys.filter(x=>x.release_id===r.id).reduce((a,x)=>a+parseFloat(x.net_amount||0),0);
        return `<tr>
          <td style="font-weight:600">${esc(r.title)}</td>
          <td>${badge(r.type)}</td>
          <td>${badge(r.status)}</td>
          <td style="font-size:12px;color:var(--muted)">${r.date||'—'}</td>
          <td style="font-size:12px;font-family:monospace">${esc(r.cat||'—')}</td>
          <td style="font-weight:700;color:var(--ok)">${fmtE(relRoys*(split/100))}</td>
        </tr>`;
      }).join('')||`<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">No releases</td></tr>`;
      lucide.createIcons();
    }

    if(tab==='demos') {
      document.getElementById('portalDemoTbl').innerHTML=demos.map(d=>`
        <tr>
          <td style="font-weight:600">${esc(d.title)}</td>
          <td style="font-size:12px">${esc(d.genre||'—')}</td>
          <td style="font-size:12px;color:var(--muted)">${d.submitted||'—'}</td>
          <td>${badge(d.status)}</td>
          <td>
            <div style="display:flex;gap:1px;font-size:13px">
              ${[1,2,3,4,5].map(n=>`<span style="color:${n<=(d.rating||0)?'var(--gold)':'var(--b2)'}"">★</span>`).join('')}
            </div>
          </td>
        </tr>`).join('')||`<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:24px">No demos submitted</td></tr>`;
      lucide.createIcons();
    }

    if(tab==='financials') {
      document.getElementById('portalFinStats').innerHTML=[
        {l:'Gross Royalties',v:fmtE(tRoy),col:'var(--ok)'},
        {l:`Your Share (${split}%)`,v:fmtE(artShare),col:'var(--gold)'},
        {l:'Total Received',v:fmtE(tPaid),col:'var(--teal)'},
        {l:'Balance Due',v:fmtE(artShare-tPaid),col:artShare-tPaid>0?'var(--warn)':'var(--muted)'},
      ].map(s=>`<div class="metric-card"><div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">${s.l}</div><div class="metric-val" style="color:${s.col};font-size:22px">${s.v}</div></div>`).join('');

      document.getElementById('portalRoyTbl').innerHTML=roys.map(r=>{
        const rel=rels.find(x=>x.id===r.release_id);
        return `<tr>
          <td style="font-size:12px">${esc(r.source||'—')}</td>
          <td style="font-size:12px;color:var(--teal)">${esc(rel?.title||r.release_id)}</td>
          <td style="font-size:12px;color:var(--muted)">${esc(r.period||'—')}</td>
          <td style="font-weight:600;color:var(--ok)">${fmtE(r.net_amount)}</td>
          <td style="font-weight:700;color:var(--gold)">${fmtE(parseFloat(r.net_amount||0)*(split/100))}</td>
          <td style="font-size:12px;color:var(--muted)">${esc(r.territory||'WW')}</td>
        </tr>`;
      }).join('')||`<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">No royalty data</td></tr>`;

      const stmts=(this.db.royalty_statements||[]).filter(s=>s.artist_id===artId);
      document.getElementById('portalStmts').innerHTML=stmts.length?stmts.map(s=>`
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--b1)">
          <i data-lucide="file-text" style="width:14px;color:var(--gold);flex-shrink:0"></i>
          <div style="flex:1"><div style="font-weight:600;font-size:13px">${esc(s.period)}</div>
          <div style="font-size:11px;color:var(--muted)">Generated ${s.created}</div></div>
          ${badge(s.status)}
          <button class="btn btn-g" style="font-size:11.5px;padding:4px 10px" onclick="LOS.previewStatementById('${s.id}')">
            <i data-lucide="eye" style="width:12px"></i> View
          </button>
        </div>`).join(''):'<div style="color:var(--muted);font-size:12px;padding:12px 0">No statements issued yet</div>';
      lucide.createIcons();
    }

    if(tab==='assets') {
      const assets=this.db.media.filter(m=>m.artist_id===artId||rels.some(r=>r.id===m.related_to));
      document.getElementById('portalAssetGrid').innerHTML=assets.length?assets.map(m=>`
        <div class="card">
          <div class="flex gap2 mb2">
            <div style="width:36px;height:36px;background:var(--s3);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i data-lucide="${m.type==='Audio'?'music':m.type==='Video'?'video':'image'}" style="width:15px;color:var(--gold)"></i>
            </div>
            <div><div style="font-weight:600;font-size:13px">${esc(m.title||m.file)}</div>
            <div style="font-size:11px;color:var(--muted)">${esc(m.type)} · ${esc(m.version||'—')}</div></div>
          </div>
          ${m.tags?`<div style="font-size:11px;color:var(--muted)">${esc(m.tags)}</div>`:''}
          ${m.file&&m.type==='Audio'?`<button class="btn btn-g mt2" style="width:100%;font-size:11.5px;gap:5px" onclick="LOS.play('${esc(m.file)}','${esc(m.title||m.file)}','')"><i data-lucide="play" style="width:11px;color:var(--gold)"></i> Play</button>`:''}
        </div>`).join(''):'<div style="grid-column:span 3;text-align:center;color:var(--muted);padding:32px">No assets approved for your access</div>';
      lucide.createIcons();
    }
  },

  // ── MANAGER PORTAL ────────────────────────────────────────────────────
  mgrTab(name, el) {
    document.querySelectorAll('#mgrTabs .tab').forEach(t=>t.classList.remove('on'));
    el.classList.add('on');
    ['roster','gigs','releases','pitches'].forEach(n=>{
      const d=document.getElementById('mgr-'+n);
      if(d) d.style.display=n===name?'block':'none';
    });
    this._renderManagerPortal(name);
    lucide.createIcons();
  },

  _renderManagerPortal(tab) {
    if(tab==='roster') {
      const artists=this.db.artists.filter(a=>['Core Artist','Development'].includes(a.type));
      document.getElementById('mgrRosterGrid').innerHTML=artists.map(a=>{
        const rels=this.db.releases.filter(r=>r.artist_id===a.id).length;
        const upcomingGigs=this.db.events.filter(e=>e.artist_id===a.id&&e.status==='Confirmed').length;
        return `<div class="card">
          <div class="flex gap2 mb3">
            <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--teal));display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#0e0f14;flex-shrink:0">${a.name[0]}</div>
            <div><div style="font-weight:700">${esc(a.name)}</div>
            <div style="font-size:11px;color:var(--muted)">${esc(a.type)} · ${esc(a.territory||'WW')}</div></div>
          </div>
          ${a.genres?`<div style="font-size:11px;color:var(--teal);margin-bottom:10px">${esc(a.genres)}</div>`:''}
          <div class="flex gap2" style="font-size:12px;color:var(--muted)">
            <span><i data-lucide="disc-3" style="width:11px;vertical-align:middle"></i> ${rels} releases</span>
            <span><i data-lucide="mic-2" style="width:11px;vertical-align:middle"></i> ${upcomingGigs} gigs</span>
          </div>
          ${a.email?`<a href="mailto:${esc(a.email)}" class="btn btn-g mt3" style="width:100%;font-size:11.5px;gap:5px"><i data-lucide="mail" style="width:11px"></i> Contact</a>`:''}
        </div>`;
      }).join('')||'<div style="grid-column:span 3;text-align:center;color:var(--muted);padding:32px">No artists in roster</div>';
      lucide.createIcons();
    }

    if(tab==='gigs') {
      const gigs=this.db.events.sort((a,b)=>(a.date||'').localeCompare(b.date||''));
      document.getElementById('mgrGigTbl').innerHTML=gigs.map(e=>{
        const art=this.db.artists.find(a=>a.id===e.artist_id);
        return `<tr>
          <td style="font-weight:600">${esc(e.name)}</td>
          <td style="font-size:12px">${esc(art?.name||'—')}</td>
          <td style="font-size:12px">${e.date||'—'}</td>
          <td style="font-size:12px;color:var(--muted)">${esc(e.venue||'—')}</td>
          <td>${badge(e.status)}</td>
          <td style="font-weight:700;color:var(--ok)">${fmtE(e.fee)}</td>
        </tr>`;
      }).join('')||`<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">No events</td></tr>`;
      lucide.createIcons();
    }

    if(tab==='releases') {
      document.getElementById('mgrRelTbl').innerHTML=this.db.releases.map(r=>{
        const art=this.db.artists.find(a=>a.id===r.artist_id);
        const tasks=r.tasks||[];
        const pct=tasks.length?Math.round(tasks.filter(t=>t.done).length/tasks.length*100):0;
        return `<tr>
          <td style="font-weight:600">${esc(r.title)}</td>
          <td style="font-size:12px;color:var(--muted)">${esc(art?.name||'—')}</td>
          <td>${badge(r.type)}</td>
          <td style="font-size:12px">${r.date||'—'}</td>
          <td>${badge(r.status)}</td>
          <td>
            <div style="display:flex;align-items:center;gap:6px">
              <div class="score-bar" style="width:60px"><div class="score-fill" style="width:${pct}%;background:${pct>=80?'var(--ok)':pct>=40?'var(--gold)':'var(--err)'}"></div></div>
              <span style="font-size:11px;color:var(--muted)">${pct}%</span>
            </div>
          </td>
        </tr>`;
      }).join('')||`<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">No releases</td></tr>`;
      lucide.createIcons();
    }

    if(tab==='pitches') {
      const pitches=this.db.demos.filter(d=>['shortlist','conversation','offer','signed'].includes(d.status));
      document.getElementById('mgrPitchTbl').innerHTML=pitches.map(d=>{
        const art=this.db.artists.find(a=>a.id===d.artist_id);
        return `<tr>
          <td style="font-weight:600">${esc(d.title)}</td>
          <td style="font-size:12px">${esc(art?.name||d.artist_name||'External')}</td>
          <td style="font-size:12px">${esc(d.genre||'—')}</td>
          <td>${badge(d.status)}</td>
          <td>
            <div style="display:flex;gap:1px;font-size:13px">
              ${[1,2,3,4,5].map(n=>`<span style="color:${n<=(d.rating||0)?'var(--gold)':'var(--b2)'}"">★</span>`).join('')}
            </div>
          </td>
        </tr>`;
      }).join('')||`<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:24px">No active pitches</td></tr>`;
      lucide.createIcons();
    }
  },

  // ── INTEGRATIONS ──────────────────────────────────────────────────────
  integTab(name, el) {
    document.querySelectorAll('#integTabs .tab').forEach(t=>t.classList.remove('on'));
    el.classList.add('on');
    ['overview','webhooks','import','export','logs','backup'].forEach(n=>{
      const d=document.getElementById('integ-'+n);
      if(d) d.style.display=n===name?'block':'none';
    });
    if(name==='overview')  this.renderIntegOverview();
    if(name==='webhooks')  this.renderWebhooks();
    if(name==='import')    { /* dropzone ready */ }
    if(name==='export')    { buildRelSel('rsel-distexport','',false); }
    if(name==='logs')      this.renderIntegLogs();
    if(name==='backup')    this.renderBackupStats();
    lucide.createIcons();
  },

  renderIntegOverview() {
    const whs=this.db.webhooks||[];
    const INTEGRATIONS=[
      {id:'slack',     name:'Slack',       emoji:'💬', desc:'Post updates to channels',        connected:whs.some(w=>w.platform==='Slack')},
      {id:'discord',   name:'Discord',     emoji:'🎮', desc:'Send hooks to Discord servers',   connected:whs.some(w=>w.platform==='Discord')},
      {id:'labelradar',name:'LabelRadar',  emoji:'📡', desc:'Import demos from LabelRadar CSV', connected:false},
      {id:'soundplate',name:'Soundplate',  emoji:'🎵', desc:'Import Soundplate submissions',    connected:false},
      {id:'distrokid', name:'DistroKid',   emoji:'🚀', desc:'Export releases to DistroKid',     connected:false},
      {id:'fuga',      name:'FUGA',        emoji:'🎯', desc:'FUGA XML delivery pipeline',       connected:false},
      {id:'bandcamp',  name:'Bandcamp',    emoji:'🟦', desc:'Bandcamp sales & royalty sync',    connected:false},
      {id:'make',      name:'Make/Zapier', emoji:'⚡', desc:'No-code automation via webhooks',  connected:whs.some(w=>w.platform==='Make/Zapier')},
    ];
    document.getElementById('integGrid').innerHTML=INTEGRATIONS.map(i=>`
      <div class="integ-card">
        <div class="integ-logo" style="background:var(--s3)">${i.emoji}</div>
        <div style="font-weight:700;font-size:14px">${i.name}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.5">${i.desc}</div>
        <div class="integ-status ${i.connected?'connected':'disconnected'}">
          ${i.connected?'Connected':'Not connected'}
        </div>
        <button class="btn btn-g mt3" style="width:100%;font-size:12px"
          onclick="LOS.integAction('${i.id}')">
          ${i.connected?'Configure':'Connect'}
        </button>
      </div>`).join('');
    lucide.createIcons();
  },

  integAction(id) {
    if(['slack','discord','make'].includes(id)) {
      this.openModal('add-webhook');
      setTimeout(()=>{ const sel=document.getElementById('whPlatform'); if(sel) sel.value=id==='slack'?'Slack':id==='discord'?'Discord':'Make/Zapier'; },100);
    } else if(['labelradar','soundplate','droptrack','submithub'].includes(id)) {
      this._goTo('integrations');
      setTimeout(()=>{ this.integTab('import', document.querySelector('#integTabs .tab:nth-child(3)')); },200);
    } else if(['distrokid','fuga','bandcamp'].includes(id)) {
      this._goTo('integrations');
      setTimeout(()=>{ this.integTab('export', document.querySelector('#integTabs .tab:nth-child(4)')); },200);
    } else {
      this.toast(`${id} integration coming soon`,'warn');
    }
  },

  renderWebhooks() {
    const whs=this.db.webhooks||[];
    document.getElementById('webhookList').innerHTML=whs.length?whs.map(wh=>`
      <div class="webhook-item">
        <div class="flex gap2 mb1">
          <div style="font-weight:700;font-size:13px;flex:1">${esc(wh.name)}</div>
          <span class="bd b-t" style="font-size:10.5px">${esc(wh.platform)}</span>
          <div class="auto-toggle ${wh.active?'on':''}" onclick="LOS.toggleWebhook('${wh.id}')" style="width:30px;height:17px;"></div>
          <button class="btn-ic" onclick="LOS.testWebhookById('${wh.id}')"><i data-lucide="send" style="width:12px;color:var(--teal)"></i></button>
          <button class="btn-ic" onclick="LOS.deleteItem('webhooks','${wh.id}')"><i data-lucide="trash-2" style="width:12px"></i></button>
        </div>
        <div class="webhook-url">${esc(wh.url)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:8px">
          ${(wh.events||[]).map(ev=>`<span class="bd b-n" style="font-size:10px">${esc(ev)}</span>`).join('')}
        </div>
      </div>`).join(''):'<div style="color:var(--muted);font-size:13px;padding:16px 0">No webhooks configured</div>';

    // Populate test select
    const testSel=document.getElementById('testWH');
    if(testSel) testSel.innerHTML=whs.map(wh=>`<option value="${wh.id}">${esc(wh.name)}</option>`).join('')||'<option>No webhooks</option>';
    lucide.createIcons();
  },

  saveWebhook() {
    const name=document.getElementById('whName')?.value.trim();
    const url =document.getElementById('whUrl')?.value.trim();
    if(!name||!url) return this.toast('Name and URL required','err');
    const events=[...document.querySelectorAll('.wh-evt:checked')].map(c=>c.value);
    if(!this.db.webhooks) this.db.webhooks=[];
    const wh={
      id:uid(), name, url, active:true,
      platform: document.getElementById('whPlatform')?.value,
      events,
      created: new Date().toISOString().slice(0,10),
    };
    this.db.webhooks.push(wh);
    this.save(); this.closeModal('add-webhook'); this.renderWebhooks();
    this.log(`Webhook "${name}" added`,'Integrations'); this.toast('Webhook saved');
  },

  toggleWebhook(id) {
    const wh=this.db.webhooks?.find(x=>x.id===id);
    if(wh) { wh.active=!wh.active; this.save(); this.renderWebhooks(); }
  },

  testWebhook() {
    const whId=document.getElementById('testWH')?.value;
    const evt=document.getElementById('testEvt')?.value;
    this.testWebhookById(whId, evt);
  },

  // ── REAL DISCORD / WEBHOOK FIRE ──────────────────────────────────────
  async fireWebhook(event, data={}) {
    const whs=(this.db.webhooks||[]).filter(w=>w.active&&w.events?.includes(event));
    if(!whs.length) return;
    const label=(typeof LABEL_CONFIG!=='undefined')?LABEL_CONFIG.name:'LabelManager';
    const colorMap={
      'demo.new':0x4a9fa8,'demo.statuschanged':0x7c6fa8,
      'release.created':0xc9a84c,'gig.confirmed':0x3d9970,
      'payout.created':0x4a9fa8,'contract.expiring':0xc0524e,
      'contract.signed':0x3d9970,'test':0x5a5a72
    };
    const color=colorMap[event]||0xc9a84c;
    const fields=Object.entries(data)
      .filter(([k,v])=>v!==undefined&&v!=='')
      .map(([k,v])=>({name:k.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),value:String(v).slice(0,1024),inline:true}));
    const discordPayload={
      username:`${label} OS`,
      embeds:[{
        title:`🎵 ${event.replace(/\./g,' › ')}`,
        description:data.message||`Event fired from **${label}**`,
        color,fields,
        footer:{text:`LabelManager OS · ${label}`},
        timestamp:new Date().toISOString()
      }]
    };
    for(const wh of whs){
      const logEntry={id:uid(),type:'webhook_fire',name:wh.name,event,status:'pending',ts:new Date().toLocaleString('de-DE')};
      if(!this.db.integration_logs) this.db.integration_logs=[];
      this.db.integration_logs.unshift(logEntry);
      try {
        const isDiscord=wh.platform==='Discord'||wh.url.includes('discord.com');
        const body=isDiscord?JSON.stringify(discordPayload):JSON.stringify({event,label,timestamp:new Date().toISOString(),data});
        const res=await fetch(wh.url,{method:'POST',headers:{'Content-Type':'application/json'},body});
        logEntry.status=res.ok?'sent':`error ${res.status}`;
        if(res.ok) this.toast(`✓ Webhook sent to ${wh.name}`);
        else this.toast(`Webhook error ${res.status} for ${wh.name}`,'err');
      } catch(e) {
        logEntry.status='failed: '+e.message;
        this.toast(`Webhook failed (${wh.name}): ${e.message}`,'err');
      }
      this.save(); this.renderIntegLogs();
    }
  },

  testWebhookById(whId, evt) {
    const wh=this.db.webhooks?.find(x=>x.id===whId);
    if(!wh) return this.toast('No webhook selected','err');
    const output=document.getElementById('webhookTestOutput');
    output.style.display='block';
    output.textContent='⏳ Sending real POST to:\n'+wh.url+'\n\nPlease wait...';
    const testData=evt?.startsWith('demo')
      ?{demo_id:'demo-test',title:'Test Track',artist:'Test Artist',status:'Neu',message:'Test ping from LabelManager OS'}
      :evt?.startsWith('release')
      ?{release_id:'rel-test',title:'Test Release',type:'EP',status:'Idea',message:'Test ping from LabelManager OS'}
      :evt?.startsWith('gig')
      ?{event_id:'evt-test',name:'Test Gig',venue:'Berghain',date:'2026-06-01',message:'Test ping from LabelManager OS'}
      :{message:'Test ping from LabelManager OS',source:'manual test button'};
    this.fireWebhook(evt||'test',testData).then(()=>{
      output.textContent='✓ Sent! Check your Discord channel #notify-🔔\n\nEvent: '+(evt||'test')+'\nWebhook: '+wh.name;
    }).catch(e=>{ output.textContent='✗ Error: '+e.message; });
  },

  // Platform CSV Import
  _importRaw: null,
  importDrop(e) {
    e.preventDefault();
    document.getElementById('importDz').classList.remove('ov');
    if(e.dataTransfer.files[0]) this._parseImportFile(e.dataTransfer.files[0]);
  },
  importFile(inp) { if(inp.files[0]) this._parseImportFile(inp.files[0]); },

  _parseImportFile(file) {
    const r=new FileReader();
    r.onload=ev=>{
      this._importRaw=ev.target.result;
      const rows=ev.target.result.split('\n').slice(0,6);
      document.getElementById('importPreview').innerHTML=`
        <div style="font-size:11px;color:var(--muted);margin-bottom:8px">${file.name}</div>
        <div style="overflow-x:auto"><table>${rows.map((row,i)=>`<tr style="${i===0?'color:var(--gold);font-weight:600':''}">${row.split(',').slice(0,5).map(c=>`<td style="padding:3px 8px;border:1px solid var(--b1);font-size:11px;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>
        <div style="font-size:11px;color:var(--ok);margin-top:8px">✓ ${ev.target.result.split('\n').length-1} rows detected</div>`;
      document.getElementById('importDzTxt').textContent=`✓ ${file.name} loaded`;
    };
    r.readAsText(file);
  },

  processImport() {
    if(!this._importRaw) return this.toast('Load a file first','err');
    const platform=document.getElementById('importPlatform')?.value;
    const rows=this._importRaw.split('\n').slice(1).filter(r=>r.trim());
    let count=0;
    rows.forEach(row=>{
      const c=row.split(',').map(x=>x.replace(/"/g,'').trim());
      // Generic: title, artist_name, email, genre, url
      // LabelRadar: title, artist, email, genre, link, bpm
      const title=c[0]; if(!title) return;
      const existing=this.db.demos.find(d=>d.title.toLowerCase()===title.toLowerCase());
      if(existing) return; // skip dupes
      this.db.demos.push({
        id:uid(), title,
        artist_name: c[1]||'',
        email:       c[2]||'',
        genre:       c[3]||'',
        file:        c[4]||'',
        bpm:         c[5]||'',
        status:      'new',
        source:      platform,
        rating:      0, watchlist:false,
        submitted:   new Date().toISOString().slice(0,10),
      });
      count++;
    });
    this._importRaw=null;
    this.save(); this.renderANR();
    if(!this.db.integration_logs) this.db.integration_logs=[];
    this.db.integration_logs.push({id:uid(),type:'demo_import',name:platform,event:`Imported ${count} demos`,status:'success',ts:new Date().toLocaleString('de-DE')});
    this.save();
    this.log(`${count} demos imported from ${platform}`,'Integrations');
    this.pushNotification('demo_new',`${count} new demos imported from ${platform}`,'anr');
    this.toast(`${count} demos imported`);
  },

  // Distributor Export
  generateDistExport() {
    const dist=document.getElementById('distSel')?.value;
    const relSel=document.getElementById('rsel-distexport-sel');
    const relId=relSel?.value;
    if(!relId) return this.toast('Select a release','err');
    const rel=this.db.releases.find(r=>r.id===relId);
    const art=this.db.artists.find(a=>a.id===rel?.artist_id);
    const tracks=(this.db.tracks||[]).filter(t=>t.release_id===relId);
    const inclISRC=document.getElementById('dxTrackISRC')?.checked;
    const inclCred=document.getElementById('dxCredits')?.checked;
    const inclSplt=document.getElementById('dxSplits')?.checked;
    const inclTerr=document.getElementById('dxTerritories')?.checked;

    let out='';
    if(dist==='dk'||dist==='generic') {
      const hdrs=['Release Title','Artist','Catalog#','Release Date','UPC','Type'];
      if(inclISRC) hdrs.push('ISRC');
      if(inclCred) hdrs.push('Composer','Publisher');
      if(inclTerr) hdrs.push('Territory');
      out=hdrs.join(',')+'\n';
      (tracks.length?tracks:[{title:rel.title,isrc:'',composer:'',publisher:'',territory:'WW'}]).forEach(t=>{
        const row=[`"${rel.title}"`,`"${art?.name||''}"`,(rel.cat||''),(rel.date||''),(rel.upc||''),rel.type||'EP'];
        if(inclISRC) row.push(t.isrc||'');
        if(inclCred) row.push(`"${t.composer||art?.name||''}"`,`"${t.publisher||'Self'}"`);
        if(inclTerr) row.push(t.territory||'WW');
        out+=row.join(',')+'\n';
      });
    } else if(dist==='fuga'||dist==='believe') {
      const contracts=inclSplt?(this.db.royalty_contracts||[]).filter(c=>c.release_id===relId||c.artist_id===rel?.artist_id):[];
      out=`<?xml version="1.0" encoding="UTF-8"?>
<Delivery xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Release>
    <ReleaseType>${rel.type||'EP'}</ReleaseType>
    <CatalogNumber>${rel.cat||''}</CatalogNumber>
    <Title><TitleText>${esc(rel.title)}</TitleText></Title>
    <DisplayArtist><PartyName><FullName>${esc(art?.name||'')}</FullName></PartyName></DisplayArtist>
    <ReleaseDate>${rel.date||''}</ReleaseDate>
    <PLine><Year>${new Date().getFullYear()}</Year><PLineText>${new Date().getFullYear()} ${esc(art?.name||'')}</PLineText></PLine>
    <TerritoryCode>${inclTerr?'Worldwide':'Worldwide'}</TerritoryCode>
    <TrackList>\n${tracks.map(t=>`      <SoundRecording>
        <Title><TitleText>${esc(t.title)}</TitleText></Title>
        ${inclISRC&&t.isrc?`<ISRC>${esc(t.isrc)}</ISRC>`:''}
        ${inclCred?`<Contributor><PartyName><FullName>${esc(t.composer||art?.name||'')}</FullName></PartyName></Contributor>`:''}
      </SoundRecording>`).join('\n')}
    </TrackList>
    ${contracts.length&&inclSplt?`<RoyaltySplits>\n${contracts.map(c=>`      <Split><Party>${esc(art?.name||'Artist')}</Party><Share>${c.artist_split||50}%</Share></Split>`).join('\n')}\n    </RoyaltySplits>`:''}
  </Release>
</Delivery>`;
    } else if(dist==='bandcamp') {
      out=JSON.stringify({
        release_title:rel.title, artist:art?.name||'', type:rel.type,
        release_date:rel.date||'', catalog:rel.cat||'',
        tracks:tracks.map(t=>({title:t.title,isrc:t.isrc||undefined,duration:t.duration,bpm:t.bpm,key:t.key})),
      },null,2);
    } else if(dist==='orchard') {
      out=['ReleaseTitle','Artist','UPC','Catalog','ReleaseDate','Type','TrackTitle','ISRC','Version','Duration','BPM','Key','Composer','Territory'].join('\t')+'\n';
      (tracks.length?tracks:[{title:rel.title}]).forEach(t=>{
        out+=[rel.title,art?.name||'',rel.upc||'',rel.cat||'',rel.date||'',rel.type||'EP',t.title,t.isrc||'',t.version||'',t.duration||'',t.bpm||'',t.key||'',t.composer||'',t.territory||'WW'].join('\t')+'\n';
      });
    }

    document.getElementById('distExportOutput').textContent=out;
    document.getElementById('dxDownloadBtn').style.display='inline-flex';
    this._distExportOut=out; this._distExportDist=dist; this._distExportTitle=rel.title;
    if(!this.db.integration_logs) this.db.integration_logs=[];
    this.db.integration_logs.push({id:uid(),type:'distributor_export',name:dist,event:`Export for "${rel.title}"`,status:'generated',ts:new Date().toLocaleString('de-DE')});
    this.save(); this.renderIntegLogs(); this.toast('Export generated');
  },

  downloadDistExport() {
    if(!this._distExportOut) return;
    const ext={'dk':'csv','generic':'csv','fuga':'xml','believe':'xml','orchard':'tsv','bandcamp':'json'}[this._distExportDist]||'txt';
    const blob=new Blob([this._distExportOut],{type:'text/plain'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`${(this._distExportTitle||'release').replace(/\s/g,'_')}_${this._distExportDist}.${ext}`;
    a.click();
    this.toast('Export downloaded');
  },

  renderBackupStats() {
    const d = this.db;
    const set = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = v; };
    set('bkArtists',  (d.artists||[]).length);
    set('bkReleases', (d.releases||[]).length);
    set('bkDemos',    (d.demos||[]).length);
    set('bkContacts', (d.contacts||[]).length);
    set('bkEvents',   (d.events||[]).length);
    set('bkMedia',    (d.media||[]).length);
  },

  renderIntegLogs() {
    const logs=[...(this.db.integration_logs||[])].reverse();
    const STATUS_ICONS={success:'check-circle',generated:'package',simulated:'zap',error:'alert-circle'};
    const STATUS_COLORS={success:'var(--ok)',generated:'var(--teal)',simulated:'var(--gold)',error:'var(--err)'};
    document.getElementById('integLogList').innerHTML=logs.length?logs.map(l=>`
      <div class="import-row">
        <i data-lucide="${STATUS_ICONS[l.status]||'activity'}" style="width:13px;color:${STATUS_COLORS[l.status]||'var(--muted)'};flex-shrink:0"></i>
        <span style="font-size:12px;flex:1">${esc(l.event)}</span>
        <span class="bd b-n" style="font-size:10.5px">${esc(l.name)}</span>
        <span style="font-size:11px;color:var(--muted);white-space:nowrap">${l.ts}</span>
      </div>`).join(''):'<div style="color:var(--muted);font-size:12px;padding:14px 0">No integration activity yet</div>';
    lucide.createIcons();
  },

  clearIntegLogs() {
    this.db.integration_logs=[];
    this.save(); this.renderIntegLogs(); this.toast('Logs cleared');
  },


  /**
   * Renders the logged-in user's avatar, name and role
   * in the sidebar footer (#sidebarUser).
   */
  // ── IMPORT / EXPORT ───────────────────────────────────────────────────

  exportDB() {
    const label=(typeof LABEL_CONFIG!=='undefined')?LABEL_CONFIG.name:'LabelManager';
    const snapshot={
      _meta:{version:'losv3',label,exported_at:new Date().toISOString(),schema:1},
      ...this.db
    };
    const blob=new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`${label.replace(/\s+/g,'-').toLowerCase()}_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    this.log('Full DB exported','System');
    this.toast('💾 Backup downloaded');
  },

  importDBFile(inp) {
    if(!inp.files?.[0]) return;
    const file=inp.files[0];
    const r=new FileReader();
    r.onload=ev=>{
      try {
        const raw=JSON.parse(ev.target.result);
        const data={...raw};
        const meta=data._meta||{};
        delete data._meta;
        if(!Array.isArray(data.artists)) return this.toast('Invalid backup — no artists array','err');
        const dbKeys=Object.keys(typeof SEED!=='undefined'?SEED:this.db);
        const confirmed=confirm(
          `Import backup?\n\nDate: ${meta.exported_at?.slice(0,10)||'unknown'}\nLabel: ${meta.label||'?'}\n`+
          `Artists: ${data.artists?.length||0}  ·  Demos: ${data.demos?.length||0}  ·  Releases: ${data.releases?.length||0}\n\n`+
          `⚠️  This will REPLACE your current data.`
        );
        if(!confirmed) return;
        dbKeys.forEach(k=>{ if(data[k]!==undefined) this.db[k]=data[k]; });
        this.save(); this.renderAll(); lucide.createIcons();
        this.log(`DB imported from ${file.name}`,'System');
        this.toast(`✓ Imported: ${data.artists?.length||0} artists, ${data.demos?.length||0} demos, ${data.releases?.length||0} releases`);
      } catch(e){ this.toast('Import failed: '+e.message,'err'); }
    };
    r.readAsText(file);
    inp.value='';
  },

  resetDB() {
    if(!confirm('⚠️ RESET ALL DATA?\n\nThis deletes everything and restores the demo dataset.\n\nAre you absolutely sure?')) return;
    if(!confirm('Last chance — this cannot be undone. Proceed?')) return;
    if(typeof SEED!=='undefined'){
      this.db=JSON.parse(JSON.stringify(SEED));
    } else {
      localStorage.removeItem('los_v3');
      this.db=typeof loadDB==='function'?loadDB():this.db;
    }
    this.save(); this.renderAll(); lucide.createIcons();
    this.log('DB reset to seed data','System');
    this.toast('🔄 Database reset to defaults');
  },

  renderSidebarUser() {
    const user = LMAuth._currentUser;
    if (!user) return;

    const roleColors = {
      admin: '#c9a84c', labelmanager: '#4a9fa8',
      ar: '#7c6fa8', artist: '#3d9970'
    };
    const col = roleColors[user.role] || '#5a5a72';
    const initial = (user.name || '?')[0].toUpperCase();

    const avatar = document.getElementById('sidebarAvatar');
    const name   = document.getElementById('sidebarName');
    const role   = document.getElementById('sidebarRole');

    if (avatar) { avatar.textContent = initial; avatar.style.background = col; }
    if (name)   name.textContent  = user.name || '–';
    if (role)   role.textContent  = (user.role || '–').replace('_', ' ');
  },


};



// ── AUTHENTICATED BOOT ─────────────────────────────────────────────────────
// Load order: lucide → wavesurfer (CDN) → auth.js → index_merged.js
// auth.js must define LMAuth and LMHelp before this runs.
document.addEventListener('DOMContentLoaded', () => {

  // 1. Load DB from localStorage (must happen before guard)
  LOS.db = (typeof loadDB === 'function') ? loadDB() : LOS.db;

  // 2. Wire auth form events (login button, Enter key, logout)
  if (typeof LMAuth !== 'undefined') LMAuth.init();

  // 3. Wire help modal events
  if (typeof LMHelp !== 'undefined') LMHelp.init();

  // 4. Init Lucide icons for login screen
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // 5. Auth guard — shows login screen if no valid session
  const authed = (typeof LMAuth !== 'undefined') ? LMAuth.guard() : true;

  if (authed) {
    // 6. Full app boot for authenticated users
    LOS.init();
    LOS.renderSidebarUser();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
});
