<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# fahre fort

Direkt weiter — hier der fehlende Rest von Runde 2, dann vollständig Runde 3.

***

## `buildModalSelects()` — Rest ergänzen

```js
// In buildModalSelects() → defs Array, nach den Runde-1-Einträgen:
{id:'asel-epk',    opts:{allowEmpty:false}},
{id:'asel-sl',     opts:{allowEmpty:true,  emptyLabel:'— No Artist —'}},
{id:'asel-gtask',  opts:{allowEmpty:true,  emptyLabel:'— No Artist —'}},
{id:'asel-note',   opts:{allowEmpty:true,  emptyLabel:'— No Artist —'}},

// Release-Selects:
['rsel-sl','rsel-promo','rsel-chanstat','rsel-contest'].forEach(id=>{
  if(document.getElementById(id)) buildRelSel(id,'',true);
});
```


***

## Automation-Hook — in vorhandene Save-Methoden injecten

Füge diese Aufrufe direkt nach dem jeweiligen `this.save()` in den bestehenden Methoden ein:

```js
// in saveRelease() — nach this.save():
this._runAutomations('release_created', { release_id: rel.id });

// in moveDemoStatus() — nach this.save(), wenn newStatus === 'offer':
if(newStatus === 'offer')  this._runAutomations('demo_status_offer',  { artist_id: demo.artist_id });
if(newStatus === 'signed') this._runAutomations('demo_status_signed', { artist_id: demo.artist_id });

// in saveEvent() — nach this.save(), wenn status === 'Confirmed':
if(ev.status === 'Confirmed') this._runAutomations('gig_confirmed', { event_id: ev.id });
```


***

## `renderAll()` — neue Views einbinden

```js
// In renderAll() die neuen Calls hinzufügen:
renderAll() {
  this.renderDashboard();
  this.renderCRM();
  this.renderANR();
  this.renderReleases();
  this.renderFinance();
  this.renderMedia();
  this.renderUsers();
  this.renderEvents();
  // Runde 1:
  if(document.getElementById('roy-overview')?.style.display!=='none') this.renderRoyOverview();
  if(document.getElementById('cat-tracks')?.style.display!=='none')   this.renderTracks();
  if(document.getElementById('anrp-scoring')?.style.display!=='none') this.renderScoring();
  // Runde 2:
  if(document.getElementById('mkt-smartlinks')?.style.display!=='none') this.renderSmartLinks();
  if(document.getElementById('mkt-promo')?.style.display!=='none')      this.renderPromoLinks();
  if(document.getElementById('anal-overview')?.style.display!=='none')  this.renderAnalOverview();
  if(document.getElementById('collab-tasks')?.style.display!=='none')   this.renderGlobalTasks();
  if(document.getElementById('collab-notes')?.style.display!=='none')   this.renderNotes();
},
```


***

Das schließt Runde 2 vollständig ab. Jetzt direkt **Runde 3**.

***

# Runde 3 — Artist- \& Partner-Portale + Integrationen

**Was wird gebaut:**

- 👤 **Artist Portal** — Artist-Login mit eigenem Dashboard, eigene Releases/Demos, Payout-Übersicht, Statement-Download
- 🤝 **Manager/Agency Portal** — Eingeschränkte Ansicht für Gigs, Pitches, Assets, Status
- 🔔 **Automated Notifications** — In-App-Benachrichtigungssystem mit Badge-Counter, Event-Queue
- 🔗 **Distributor Integrations** — Export-Templates für DistroKid/FUGA/Believe, Webhook-Simulator
- 🔌 **Slack/Discord Webhooks** — Konfigurierbare Outgoing-Webhooks für Statusänderungen
- 📥 **LabelRadar/Soundplate Importer** — CSV/JSON-Import für externe Demo-Plattformen

***

## Neue DB-Einträge (in `SEED` ergänzen)

```js
notifications: [
  {id:'n1', type:'demo_new',    msg:'New demo: "Acid Dreams" by External Artist', read:false, ts:'2026-05-03 05:10', link:'anr'},
  {id:'n2', type:'task_due',    msg:'Task "Submit to Spotify Editorial" is due today', read:false, ts:'2026-05-03 06:00', link:'releases'},
  {id:'n3', type:'contract',    msg:'Contract for DJ Void expires in 28 days', read:true,  ts:'2026-05-02 12:00', link:'crm'},
],
webhooks: [],
integration_logs: [],
portal_sessions: [],
distributor_exports: [],
```


***

## Neue CSS (ans Ende von `<style>` anfügen)

```css
/* ── RUNDE 3 ADDITIONS ───────────────────────────────────────────── */

/* Notification Bell */
.notif-bell{position:relative;cursor:pointer;}
.notif-badge{position:absolute;top:-4px;right:-4px;background:var(--err);color:white;font-size:9px;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:none;}
.notif-panel{position:absolute;top:calc(100% + 10px);right:0;width:340px;background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);box-shadow:0 8px 32px rgba(0,0,0,.4);z-index:200;overflow:hidden;}
.notif-item{display:flex;gap:10px;padding:12px 14px;border-bottom:1px solid var(--b1);cursor:pointer;transition:var(--tr);}
.notif-item:hover{background:var(--s3);}
.notif-item.unread{background:rgba(201,168,76,.04);}
.notif-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:5px;}
.notif-dot.read{background:var(--b2);}

/* Portal views */
.portal-header{background:linear-gradient(135deg,rgba(201,168,76,.15),rgba(74,159,168,.08));border-bottom:1px solid var(--b1);padding:24px 28px;margin:-1px -1px 24px;}
.portal-welcome{font-size:20px;font-weight:700;color:var(--text);}
.portal-sub{font-size:13px;color:var(--muted);margin-top:4px;}

/* Webhook config */
.webhook-item{background:var(--s2);border:1px solid var(--b1);border-radius:9px;padding:13px 15px;margin-bottom:8px;transition:var(--tr);}
.webhook-item:hover{border-color:var(--b2);}
.webhook-url{font-size:11px;font-family:monospace;color:var(--teal);background:var(--s3);padding:5px 10px;border-radius:5px;margin-top:7px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* Integration card */
.integ-card{background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);padding:18px;transition:var(--tr);}
.integ-card:hover{border-color:var(--b2);}
.integ-logo{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;margin-bottom:12px;}
.integ-status{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;margin-top:8px;}
.integ-status.connected::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--ok);display:block;}
.integ-status.disconnected::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--muted);display:block;}

/* Import log */
.import-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--b1);font-size:12.5px;}
.import-row:last-child{border-bottom:none;}
```


***

## Notification Bell — in Topbar einfügen

Füge das direkt **in den `<header>` / Topbar-Bereich** ein (vor dem User-Avatar):

```html
<!-- Notification Bell (in header/topbar) -->
<div class="notif-bell" id="notifBell" onclick="LOS.toggleNotifPanel()">
  <i data-lucide="bell" style="width:18px;color:var(--muted)"></i>
  <div class="notif-badge" id="notifBadge" style="display:none">0</div>
</div>
<div class="notif-panel" id="notifPanel" style="display:none">
  <div style="padding:12px 14px;border-bottom:1px solid var(--b1);display:flex;align-items:center;justify-content:space-between">
    <span style="font-size:13px;font-weight:700">Notifications</span>
    <button class="btn-ghost" style="font-size:11px" onclick="LOS.markAllRead()">Mark all read</button>
  </div>
  <div id="notifList" style="max-height:360px;overflow-y:auto"></div>
  <div style="padding:10px 14px;border-top:1px solid var(--b1)">
    <button class="btn btn-g" style="width:100%;font-size:12px" onclick="LOS.clearNotifs()">Clear all</button>
  </div>
</div>
```


***

## Neue View HTML (direkt vor `<!-- ═══ RUNDE 2 VIEWS ═══ -->` einfügen)

```html
<!-- ═══ RUNDE 3 VIEWS ═══════════════════════════════════════════════ -->

<!-- ARTIST PORTAL -->
<section id="view-artist-portal" class="view">
  <div class="portal-header">
    <div class="portal-welcome" id="portalWelcome">👋 Welcome back</div>
    <div class="portal-sub" id="portalSub">Your artist dashboard</div>
  </div>

  <div class="tabs" id="portalTabs">
    <div class="tab on" onclick="LOS.portalTab('overview',this)">Overview</div>
    <div class="tab" onclick="LOS.portalTab('releases',this)">My Releases</div>
    <div class="tab" onclick="LOS.portalTab('demos',this)">My Demos</div>
    <div class="tab" onclick="LOS.portalTab('financials',this)">Financials</div>
    <div class="tab" onclick="LOS.portalTab('assets',this)">Assets</div>
  </div>

  <!-- Portal Overview -->
  <div id="portal-overview">
    <div id="portalStats" class="g4 mb5"></div>
    <div class="g2">
      <div class="card">
        <div class="ct">Latest Releases</div>
        <div id="portalRels"></div>
      </div>
      <div class="card">
        <div class="ct">Upcoming Events</div>
        <div id="portalEvents"></div>
      </div>
    </div>
  </div>

  <!-- Portal Releases -->
  <div id="portal-releases" style="display:none">
    <div class="card tw">
      <table>
        <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Date</th><th>Cat#</th><th>Royalties</th></tr></thead>
        <tbody id="portalRelTbl"></tbody>
      </table>
    </div>
  </div>

  <!-- Portal Demos -->
  <div id="portal-demos" style="display:none">
    <div class="card tw">
      <table>
        <thead><tr><th>Track</th><th>Genre</th><th>Submitted</th><th>Status</th><th>Rating</th></tr></thead>
        <tbody id="portalDemoTbl"></tbody>
      </table>
    </div>
  </div>

  <!-- Portal Financials -->
  <div id="portal-financials" style="display:none">
    <div id="portalFinStats" class="g3 mb5"></div>
    <div class="card mb4">
      <div class="ct">Royalty History</div>
      <div class="card tw">
        <table>
          <thead><tr><th>Source</th><th>Release</th><th>Period</th><th>Gross</th><th>Your Share</th><th>Territory</th></tr></thead>
          <tbody id="portalRoyTbl"></tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="ct">Statements</div>
      <div id="portalStmts"></div>
    </div>
  </div>

  <!-- Portal Assets -->
  <div id="portal-assets" style="display:none">
    <div id="portalAssetGrid" class="g3"></div>
  </div>
</section>

<!-- MANAGER PORTAL -->
<section id="view-manager-portal" class="view">
  <div class="portal-header">
    <div class="portal-welcome">🎯 Manager & Agency Portal</div>
    <div class="portal-sub">Bookings, pitches, assets & status — read-only access</div>
  </div>

  <div class="tabs" id="mgrTabs">
    <div class="tab on" onclick="LOS.mgrTab('roster',this)">Roster</div>
    <div class="tab" onclick="LOS.mgrTab('gigs',this)">Gigs & Bookings</div>
    <div class="tab" onclick="LOS.mgrTab('releases',this)">Releases</div>
    <div class="tab" onclick="LOS.mgrTab('pitches',this)">Pitches</div>
  </div>

  <!-- Manager Roster -->
  <div id="mgr-roster">
    <div id="mgrRosterGrid" class="g3"></div>
  </div>

  <!-- Manager Gigs -->
  <div id="mgr-gigs" style="display:none">
    <div class="card tw">
      <table>
        <thead><tr><th>Event</th><th>Artist</th><th>Date</th><th>Venue</th><th>Status</th><th>Fee</th></tr></thead>
        <tbody id="mgrGigTbl"></tbody>
      </table>
    </div>
  </div>

  <!-- Manager Releases -->
  <div id="mgr-releases" style="display:none">
    <div class="card tw">
      <table>
        <thead><tr><th>Release</th><th>Artist</th><th>Type</th><th>Date</th><th>Status</th><th>Progress</th></tr></thead>
        <tbody id="mgrRelTbl"></tbody>
      </table>
    </div>
  </div>

  <!-- Manager Pitches / A&R Status -->
  <div id="mgr-pitches" style="display:none">
    <div class="card tw">
      <table>
        <thead><tr><th>Track</th><th>Artist</th><th>Genre</th><th>A&R Status</th><th>Rating</th></tr></thead>
        <tbody id="mgrPitchTbl"></tbody>
      </table>
    </div>
  </div>
</section>

<!-- INTEGRATIONS -->
<section id="view-integrations" class="view">
  <div class="tabs" id="integTabs">
    <div class="tab on" onclick="LOS.integTab('overview',this)">Integrations</div>
    <div class="tab" onclick="LOS.integTab('webhooks',this)">Webhooks</div>
    <div class="tab" onclick="LOS.integTab('import',this)">Platform Import</div>
    <div class="tab" onclick="LOS.integTab('export',this)">Distributor Export</div>
    <div class="tab" onclick="LOS.integTab('logs',this)">Logs</div>
  </div>

  <!-- Integration Overview -->
  <div id="integ-overview">
    <div class="g3" id="integGrid"></div>
  </div>

  <!-- Webhooks -->
  <div id="integ-webhooks" style="display:none">
    <div class="flex gap2 mb4">
      <h3 style="font-size:14px;font-weight:700">Outgoing Webhooks</h3>
      <button class="btn btn-p" style="margin-left:auto" onclick="LOS.openModal('add-webhook')">
        <i data-lucide="plus" style="width:13px"></i> New Webhook
      </button>
    </div>
    <div id="webhookList"></div>
    <div class="card mt5">
      <div class="ct">Test Webhook</div>
      <div class="g2">
        <div class="ff"><label class="lbl">Select Webhook</label><select class="inp" id="testWH"></select></div>
        <div class="ff"><label class="lbl">Event to Simulate</label>
          <select class="inp" id="testEvt">
            <option value="demo.new">demo.new</option>
            <option value="demo.status_changed">demo.status_changed</option>
            <option value="release.created">release.created</option>
            <option value="gig.confirmed">gig.confirmed</option>
            <option value="payout.created">payout.created</option>
          </select>
        </div>
      </div>
      <button class="btn btn-p" onclick="LOS.testWebhook()">
        <i data-lucide="send" style="width:13px"></i> Send Test Payload
      </button>
      <pre id="webhookTestOutput" style="margin-top:12px;background:var(--s3);border-radius:8px;padding:14px;font-size:11.5px;color:var(--muted);display:none;max-height:280px;overflow-y:auto"></pre>
    </div>
  </div>

  <!-- Platform Import -->
  <div id="integ-import" style="display:none">
    <div class="g2">
      <div class="card">
        <div class="ct">Import from Demo Platforms</div>
        <div class="ff"><label class="lbl">Platform</label>
          <select class="inp" id="importPlatform">
            <option value="labelradar">LabelRadar CSV</option>
            <option value="soundplate">Soundplate CSV</option>
            <option value="droptrack">DropTrack CSV</option>
            <option value="submithub">SubmitHub CSV</option>
            <option value="generic">Generic (title,artist,email,genre,url)</option>
          </select>
        </div>
        <div class="dz" id="importDz" ondragover="event.preventDefault();this.classList.add('ov')"
             ondragleave="this.classList.remove('ov')"
             ondrop="LOS.importDrop(event)">
          <input type="file" accept=".csv,.json,.txt" onchange="LOS.importFile(this)">
          <i data-lucide="upload-cloud" style="width:26px;margin:0 auto 10px;display:block;color:var(--teal)"></i>
          <div id="importDzTxt" style="font-size:13px;color:var(--muted)">Drop CSV/JSON from platform or click</div>
        </div>
        <button class="btn btn-p mt3" onclick="LOS.processImport()" style="width:100%">
          <i data-lucide="play" style="width:13px"></i> Import Demos
        </button>
      </div>
      <div class="card">
        <div class="ct">Import Preview</div>
        <div id="importPreview" style="color:var(--muted);font-size:12px;text-align:center;padding:28px">
          Drop a file to preview
        </div>
      </div>
    </div>
  </div>

  <!-- Distributor Export -->
  <div id="integ-export" style="display:none">
    <div class="g2">
      <div class="card">
        <div class="ct">Generate Distributor Package</div>
        <div class="ff"><label class="lbl">Distributor</label>
          <select class="inp" id="distSel">
            <option value="dk">DistroKid</option>
            <option value="fuga">FUGA</option>
            <option value="believe">Believe Digital</option>
            <option value="orchard">The Orchard</option>
            <option value="bandcamp">Bandcamp (JSON)</option>
            <option value="generic">Generic CSV</option>
          </select>
        </div>
        <div class="ff"><label class="lbl">Release</label><div id="rsel-distexport"></div></div>
        <div class="g2">
          <label style="display:flex;align-items:center;gap:7px;font-size:13px;cursor:pointer">
            <input type="checkbox" id="dxTrackISRC" checked style="accent-color:var(--gold)"> Include ISRC
          </label>
          <label style="display:flex;align-items:center;gap:7px;font-size:13px;cursor:pointer">
            <input type="checkbox" id="dxCredits" checked style="accent-color:var(--gold)"> Include Credits
          </label>
          <label style="display:flex;align-items:center;gap:7px;font-size:13px;cursor:pointer">
            <input type="checkbox" id="dxSplits" style="accent-color:var(--gold)"> Include Splits
          </label>
          <label style="display:flex;align-items:center;gap:7px;font-size:13px;cursor:pointer">
            <input type="checkbox" id="dxTerritories" checked style="accent-color:var(--gold)"> Territory Restrictions
          </label>
        </div>
        <button class="btn btn-p mt3" onclick="LOS.generateDistExport()">
          <i data-lucide="package" style="width:13px"></i> Generate Export
        </button>
      </div>
      <div class="card">
        <div class="ct">Export Preview
          <button class="btn btn-g" id="dxDownloadBtn" style="display:none;margin-left:auto;font-size:11.5px;padding:4px 9px" onclick="LOS.downloadDistExport()">
            <i data-lucide="download" style="width:12px"></i> Download
          </button>
        </div>
        <pre id="distExportOutput" style="font-size:11.5px;color:var(--muted);line-height:1.7;max-height:420px;overflow-y:auto;white-space:pre-wrap">Select a release and click Generate</pre>
      </div>
    </div>
  </div>

  <!-- Integration Logs -->
  <div id="integ-logs" style="display:none">
    <div class="flex gap2 mb4">
      <h3 style="font-size:14px;font-weight:700">Integration Log</h3>
      <button class="btn btn-g" style="margin-left:auto" onclick="LOS.clearIntegLogs()">Clear</button>
    </div>
    <div class="card">
      <div id="integLogList" style="max-height:480px;overflow-y:auto"></div>
    </div>
  </div>
</section>
```


***

## Neue Modals (vor `<!-- DB ADMIN OVERLAY -->`)

```html
<!-- Add Webhook -->
<div class="mbb" id="modal-add-webhook">
  <div class="modal">
    <div class="mt">New Webhook</div>
    <div class="ff"><label class="lbl">Name *</label><input class="inp" id="whName" placeholder="Slack #label-updates"></div>
    <div class="ff"><label class="lbl">URL *</label><input class="inp" id="whUrl" placeholder="https://hooks.slack.com/services/…"></div>
    <div class="ff"><label class="lbl">Platform</label>
      <select class="inp" id="whPlatform">
        <option>Slack</option><option>Discord</option><option>Generic HTTP</option><option>Make/Zapier</option>
      </select>
    </div>
    <div class="ct mt3">Trigger Events</div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px">
      <label style="display:flex;align-items:center;gap:6px;font-size:12.5px;cursor:pointer"><input type="checkbox" class="wh-evt" value="demo.new" style="accent-color:var(--gold)" checked> demo.new</label>
      <label style="display:flex;align-items:center;gap:6px;font-size:12.5px;cursor:pointer"><input type="checkbox" class="wh-evt" value="demo.status_changed" style="accent-color:var(--gold)"> demo.status_changed</label>
      <label style="display:flex;align-items:center;gap:6px;font-size:12.5px;cursor:pointer"><input type="checkbox" class="wh-evt" value="release.created" style="accent-color:var(--gold)" checked> release.created</label>
      <label style="display:flex;align-items:center;gap:6px;font-size:12.5px;cursor:pointer"><input type="checkbox" class="wh-evt" value="gig.confirmed" style="accent-color:var(--gold)"> gig.confirmed</label>
      <label style="display:flex;align-items:center;gap:6px;font-size:12.5px;cursor:pointer"><input type="checkbox" class="wh-evt" value="payout.created" style="accent-color:var(--gold)"> payout.created</label>
      <label style="display:flex;align-items:center;gap:6px;font-size:12.5px;cursor:pointer"><input type="checkbox" class="wh-evt" value="contract.expiring" style="accent-color:var(--gold)"> contract.expiring</label>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">
      <button class="btn btn-g" onclick="LOS.closeModal('add-webhook')">Cancel</button>
      <button class="btn btn-p" onclick="LOS.saveWebhook()">Save Webhook</button>
    </div>
  </div>
</div>
```


***

## Nav-Einträge ergänzen

```html
<!-- Im <nav class="sb"> Block, Runde-3-Einträge: -->
<div class="nav" data-view="artist-portal"><i data-lucide="user-circle" style="width:14px"></i> Artist Portal</div>
<div class="nav" data-view="manager-portal"><i data-lucide="briefcase" style="width:14px"></i> Manager Portal</div>
<div class="nav" data-view="integrations"><i data-lucide="plug" style="width:14px"></i> Integrations</div>
```


***

## JavaScript — Runde 3 (vor der schließenden `}` des `LOS`-Objekts)

```js
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

  toggleNotifPanel() {
    const panel=document.getElementById('notifPanel');
    if(!panel) return;
    const isOpen=panel.style.display!=='none';
    panel.style.display=isOpen?'none':'block';
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
    const n=this.db.notifications?.find(x=>x.id===id);
    if(!n) return;
    n.read=true;
    this.save(); this.renderNotifBadge(); this.renderNotifList();
    if(n.link) this.navigate(n.link);
    document.getElementById('notifPanel').style.display='none';
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
    return user?.artist_id||this.db.artists[^0]?.id||null;
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
    const split  = contracts[^0]?.artist_split||50;
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
            <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--teal));display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#0e0f14;flex-shrink:0">${a.name[^0]}</div>
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
    ['overview','webhooks','import','export','logs'].forEach(n=>{
      const d=document.getElementById('integ-'+n);
      if(d) d.style.display=n===name?'block':'none';
    });
    if(name==='overview')  this.renderIntegOverview();
    if(name==='webhooks')  this.renderWebhooks();
    if(name==='import')    { /* dropzone ready */ }
    if(name==='export')    { buildRelSel('rsel-distexport','',false); }
    if(name==='logs')      this.renderIntegLogs();
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
      this.navigate('integrations');
      setTimeout(()=>{ this.integTab('import', document.querySelector('#integTabs .tab:nth-child(3)')); },200);
    } else if(['distrokid','fuga','bandcamp'].includes(id)) {
      this.navigate('integrations');
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

  testWebhookById(whId, evt) {
    const wh=this.db.webhooks?.find(x=>x.id===whId);
    if(!wh) return this.toast('No webhook selected','err');
    const payload={
      event:     evt||'test',
      label:     'Bunte Panther',
      timestamp: new Date().toISOString(),
      data:      evt?.startsWith('demo')?{demo_id:'demo-123',title:'Test Track',artist:'Test Artist',status:'new'}
                :evt?.startsWith('release')?{release_id:'rel-123',title:'Test Release',type:'EP',status:'Idea'}
                :evt?.startsWith('gig')?{event_id:'evt-123',name:'Test Gig',venue:'Berghain',date:'2026-06-01'}
                :{message:'Ping from LabelManager'},
    };
    const output=document.getElementById('webhookTestOutput');
    output.style.display='block';
    output.textContent=`POST ${wh.url}\n\nPayload:\n${JSON.stringify(payload,null,2)}\n\n[Simulated — no real HTTP request in local mode]`;
    if(!this.db.integration_logs) this.db.integration_logs=[];
    this.db.integration_logs.push({id:uid(),type:'webhook_test',name:wh.name,event:evt||'test',status:'simulated',ts:new Date().toLocaleString('de-DE')});
    this.save(); this.toast(`Test payload built for "${wh.name}"`);
  },

  // Platform CSV Import
  _importRaw: null,
  importDrop(e) {
    e.preventDefault();
    document.getElementById('importDz').classList.remove('ov');
    if(e.dataTransfer.files[^0]) this._parseImportFile(e.dataTransfer.files[^0]);
  },
  importFile(inp) { if(inp.files[^0]) this._parseImportFile(inp.files[^0]); },

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
      const title=c[^0]; if(!title) return;
      const existing=this.db.demos.find(d=>d.title.toLowerCase()===title.toLowerCase());
      if(existing) return; // skip dupes
      this.db.demos.push({
        id:uid(), title,
        artist_name: c[^1]||'',
        email:       c[^2]||'',
        genre:       c[^3]||'',
        file:        c[^4]||'',
        bpm:         c[^5]||'',
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
```


***

## `setupNav()` + `init()` — finaler Patch

```js
// In setupNav() → names Objekt:
'artist-portal':  'Artist Portal',
'manager-portal': 'Manager Portal',
integrations:     'Integrations',

// In init() nach buildModalSelects():
this.initNotifications();

// In buildModalSelects() → Release-Selects Array ergänzen:
'rsel-distexport'
```


***

Alle drei Runden sind damit vollständig implementiert. Hier die Gesamtübersicht was jetzt im LabelManager OS steckt:

***

## Vollständiger Feature-Stand nach Runde 1–3

| Modul | Features |
| :-- | :-- |
| **CRM** | Artists, Contacts, Drawer, Beziehungsgraph |
| **A\&R** | Kanban, Ratings, Waveform-Preview, Watchlist |
| **Releases** | Timeline, Task-Templates, Status-Kette |
| **Finance** | Royalties, Expenses, Events-Settlement |
| **Media** | Upload, Tags, Waveform-Player |
| **RBAC** | 4 Rollen, modul-basiert |
| **Royalties Pro** | Multi-Contract, CSV-Import, Statements, Payouts |
| **Catalog** | Track-Entity (ISRC/Credits), Rights-In/Out, Packager, QC |
| **A\&R Pro** | Scoring-Engine, Watchlist-Grid, Funnel-Analytics, Remix-Contests |
| **Marketing** | Smart Links, Pre-Save, Promo-Pool, EPK-Generator, Campaigns |
| **Analytics** | Overview, Release Performance, A\&R-Funnel, Channels, Team |
| **Collab** | Global Tasks (Drag-Drop-Kanban), Notes (@mentions), Kalender (ICS), Automations |
| **Artist Portal** | Dashboard, Releases, Demos, Financials, Assets |
| **Manager Portal** | Roster, Gigs, Releases, Pitches (read-only) |
| **Integrations** | Webhooks (Slack/Discord), Plattform-Import (LabelRadar/etc.), Distributor-Export (DistroKid/FUGA/Bandcamp), Logs |
| **Notifications** | In-App Bell, Badge-Counter, Event-Queue, Mark-All-Read |

<div align="center">⁂</div>

[^1]: description.md

[^2]: version1.md

