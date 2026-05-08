<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# ja bitte mit Runde 2 weitermachen

Gut — ich habe die Architektur-Dokumente vollständig gelesen. [^1][^2] Ich kenne jetzt den kompletten Stack, das bestehende Datenmodell und die Patterns aus Runde 1. Direkt weiter mit **Runde 2**.

***

## Runde 2 — Was wird gebaut

**Neue Module:**

- 📣 **Marketing, Promo \& Smart Links** — Smart-Link-Generator mit Geo-Routing, Pre-Save-Pages, Promo-Pool mit zeitlimitierten Links, EPK/Presskit-Generator
- 📊 **Analytics \& Reporting Layer** — Release-Performance-Dashboards, A\&R-Funnel-Analytics, Promo-Channel-Tracking, Team-Productivity-Reports
- 🤝 **Collaboration, Notizen \& Workflows** — Threaded Comments mit @mentions, Global Task Board, Kalender-Sync (ICS-Export), Automations-Engine

***

## Neue DB-Einträge (in `SEED` ergänzen)

```js
smart_links: [
  {
    id:'sl1', title:'Void EP — Smart Link', release_id:'r1', artist_id:'a1',
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
    meta_title:'Void EP by Bunte Panther', meta_img:''
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
```


***

## Neue CSS (ans Ende von `<style>` anfügen)

```css
/* ── RUNDE 2 ADDITIONS ───────────────────────────────────────────── */

/* Smart Link card */
.sl-card{background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);overflow:hidden;transition:var(--tr);}
.sl-card:hover{border-color:var(--b2);}
.sl-head{padding:16px;position:relative;min-height:80px;display:flex;align-items:flex-end;}
.sl-head-bg{position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(74,159,168,.15));border-bottom:1px solid var(--b1);}
.sl-body{padding:14px 16px;}
.sl-dest{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--b1);font-size:13px;}
.sl-dest:last-child{border-bottom:none;}
.sl-toggle{width:32px;height:18px;background:var(--s3);border-radius:9px;cursor:pointer;position:relative;transition:var(--tr);}
.sl-toggle.on{background:var(--ok);}
.sl-toggle::after{content:'';width:12px;height:12px;background:white;border-radius:50%;position:absolute;top:3px;left:3px;transition:var(--tr);}
.sl-toggle.on::after{left:17px;}

/* EPK */
.epk-preview{background:var(--s3);border-radius:var(--r);padding:20px;font-size:13px;line-height:1.9;}
.epk-preview h2{font-size:18px;font-weight:700;margin-bottom:4px;color:var(--gold);}
.epk-preview .epk-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}
.epk-preview .epk-link{padding:4px 10px;background:var(--s2);border:1px solid var(--b1);border-radius:20px;font-size:11.5px;color:var(--teal);}

/* Promo link */
.promo-item{background:var(--s2);border:1px solid var(--b1);border-radius:9px;padding:12px 14px;display:flex;align-items:center;gap:12px;transition:var(--tr);}
.promo-item:hover{border-color:var(--b2);}
.promo-exp{font-size:11px;font-weight:600;padding:2px 7px;border-radius:20px;}
.promo-exp.ok{background:rgba(61,153,112,.12);color:#5dba90;}
.promo-exp.warn{background:rgba(201,168,76,.1);color:#d4b060;}
.promo-exp.exp{background:rgba(192,82,78,.1);color:#e07773;}

/* Analytics */
.metric-card{background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);padding:16px 18px;}
.metric-val{font-size:28px;font-weight:800;line-height:1.1;margin:6px 0 2px;}
.metric-delta{font-size:12px;font-weight:600;}
.metric-delta.up{color:var(--ok);}
.metric-delta.dn{color:var(--err);}
.metric-delta.nt{color:var(--muted);}

/* Task board */
.task-board{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.task-col-hd{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;display:flex;align-items:center;gap:6px;}
.task-item{background:var(--s2);border:1px solid var(--b1);border-radius:8px;padding:10px 12px;margin-bottom:6px;cursor:grab;transition:var(--tr);}
.task-item:hover{border-color:var(--b2);}
.task-item.done{opacity:.45;}
.task-check{width:15px;height:15px;border-radius:4px;border:1.5px solid var(--b2);flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--tr);}
.task-check.done{background:var(--ok);border-color:var(--ok);}
.task-pri{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.task-pri.high{background:var(--err);}
.task-pri.mid{background:var(--warn);}
.task-pri.low{background:var(--muted);}

/* Collaboration / Notes */
.note-card{background:var(--s2);border:1px solid var(--b1);border-radius:9px;padding:14px 16px;transition:var(--tr);}
.note-card:hover{border-color:var(--b2);}
.comment-thread{background:var(--s3);border-radius:8px;padding:12px;margin-top:10px;}
.comment-item{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--b1);}
.comment-item:last-child{border-bottom:none;}
.avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--teal));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.mention{color:var(--teal);font-weight:600;}

/* Automation rules */
.auto-rule{background:var(--s2);border:1px solid var(--b1);border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:12px;margin-bottom:8px;transition:var(--tr);}
.auto-rule:hover{border-color:var(--b2);}
.auto-toggle{width:38px;height:21px;background:var(--s3);border-radius:11px;cursor:pointer;position:relative;transition:var(--tr);flex-shrink:0;}
.auto-toggle.on{background:var(--ok);}
.auto-toggle::after{content:'';width:15px;height:15px;background:white;border-radius:50%;position:absolute;top:3px;left:3px;transition:var(--tr);}
.auto-toggle.on::after{left:20px;}

/* Calendar */
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}
.cal-hd{text-align:center;font-size:11px;font-weight:600;color:var(--muted);padding:6px 0;}
.cal-day{background:var(--s2);border:1px solid var(--b1);border-radius:6px;padding:6px;min-height:70px;font-size:12px;}
.cal-day.today{border-color:var(--gold);background:rgba(201,168,76,.06);}
.cal-day.other-month{opacity:.35;}
.cal-event{font-size:10px;padding:2px 5px;border-radius:3px;margin-top:2px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cal-event.release{background:rgba(74,159,168,.25);color:var(--teal);}
.cal-event.gig{background:rgba(201,168,76,.2);color:var(--gold);}
.cal-event.task{background:rgba(124,111,168,.25);color:#9b7fc8;}
.cal-event.promo{background:rgba(236,72,153,.2);color:#ec4899;}

/* Channel analytics */
.chan-row{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--b1);}
.chan-row:last-child{border-bottom:none;}
.chan-bar{flex:1;height:8px;background:var(--s3);border-radius:4px;overflow:hidden;}
.chan-fill{height:100%;border-radius:4px;}
```


***

## Neue View HTML (direkt vor `<!-- ═══ RUNDE 1 VIEWS ═══ -->` einfügen)

```html
<!-- ═══ RUNDE 2 VIEWS ═══════════════════════════════════════════════ -->

<!-- MARKETING, PROMO & SMART LINKS -->
<section id="view-marketing" class="view">
  <div class="tabs" id="mktTabs">
    <div class="tab on" onclick="LOS.mktTab('smartlinks',this)">Smart Links</div>
    <div class="tab" onclick="LOS.mktTab('promo',this)">Promo Pool</div>
    <div class="tab" onclick="LOS.mktTab('epk',this)">EPK Generator</div>
    <div class="tab" onclick="LOS.mktTab('campaigns',this)">Campaigns</div>
  </div>

  <!-- Smart Links -->
  <div id="mkt-smartlinks">
    <div class="flex gap2 mb4" style="flex-wrap:wrap">
      <input class="inp flex-1" style="min-width:160px" id="slQ" placeholder="Search smart links…" oninput="LOS.renderSmartLinks()">
      <button class="btn btn-p" onclick="LOS.openModal('add-smartlink')">
        <i data-lucide="link" style="width:13px"></i> New Smart Link
      </button>
    </div>
    <div id="slGrid" class="g3"></div>
  </div>

  <!-- Promo Pool -->
  <div id="mkt-promo" style="display:none">
    <div class="flex gap2 mb4">
      <h3 style="font-size:14px;font-weight:700">Promo Links</h3>
      <button class="btn btn-p" style="margin-left:auto" onclick="LOS.openModal('add-promo')">
        <i data-lucide="plus" style="width:13px"></i> Create Promo Link
      </button>
    </div>
    <div id="promoList" class="mb4"></div>
    <div class="card">
      <div class="ct">Promo Stats Overview</div>
      <div id="promoStats" class="g4"></div>
    </div>
  </div>

  <!-- EPK Generator -->
  <div id="mkt-epk" style="display:none">
    <div class="g2">
      <div class="card">
        <div class="ct">Generate Press Kit</div>
        <div class="ff"><label class="lbl">Artist *</label><div class="art-sel" id="asel-epk"></div></div>
        <div class="g2">
          <div class="ff"><label class="lbl">Bio Length</label>
            <select class="inp" id="epkBio">
              <option>Short (100 words)</option><option>Medium (250 words)</option><option>Full</option>
            </select>
          </div>
          <div class="ff"><label class="lbl">Include</label>
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px">
              <label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
                <input type="checkbox" id="epkRels" checked style="accent-color:var(--gold)"> Releases
              </label>
              <label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
                <input type="checkbox" id="epkEvents" checked style="accent-color:var(--gold)"> Events
              </label>
              <label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
                <input type="checkbox" id="epkMedia" style="accent-color:var(--gold)"> Press Photos
              </label>
              <label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
                <input type="checkbox" id="epkStats" checked style="accent-color:var(--gold)"> Stats
              </label>
            </div>
          </div>
        </div>
        <button class="btn btn-p" onclick="LOS.generateEPK()">
          <i data-lucide="file-text" style="width:13px"></i> Generate EPK
        </button>
      </div>
      <div class="card">
        <div class="ct flex gap2">EPK Preview
          <button class="btn btn-g" style="margin-left:auto;font-size:11.5px;padding:4px 9px" onclick="LOS.downloadEPK()">
            <i data-lucide="download" style="width:12px"></i> Download HTML
          </button>
        </div>
        <div id="epkPreview" style="color:var(--muted);font-size:12px;text-align:center;padding:28px">
          Select an artist and click Generate
        </div>
      </div>
    </div>
    <div class="card mt4">
      <div class="ct">Saved Press Kits</div>
      <div id="epkSaved" class="g3"></div>
    </div>
  </div>

  <!-- Campaigns Overview -->
  <div id="mkt-campaigns" style="display:none">
    <div class="flex gap2 mb4">
      <h3 style="font-size:14px;font-weight:700">Active Campaigns</h3>
      <span style="font-size:12px;color:var(--muted);margin-left:4px">Linked to Releases</span>
    </div>
    <div id="campBoard" class="g2"></div>
  </div>
</section>

<!-- ANALYTICS & REPORTING -->
<section id="view-analytics" class="view">
  <div class="tabs" id="analTabs">
    <div class="tab on" onclick="LOS.analTab('overview',this)">Overview</div>
    <div class="tab" onclick="LOS.analTab('releases',this)">Release Performance</div>
    <div class="tab" onclick="LOS.analTab('anr',this)">A&R Analytics</div>
    <div class="tab" onclick="LOS.analTab('channels',this)">Channels</div>
    <div class="tab" onclick="LOS.analTab('team',this)">Team</div>
  </div>

  <!-- Overview -->
  <div id="anal-overview">
    <div id="analMetrics" class="g4 mb5"></div>
    <div class="g2 mb5">
      <div class="card"><div class="ct">Revenue vs Expenses (Monthly)</div><canvas id="revExpChart" width="380" height="200"></canvas></div>
      <div class="card"><div class="ct">Demo Pipeline Flow</div><canvas id="pipelineChart" width="380" height="200"></canvas></div>
    </div>
    <div class="g3">
      <div class="card"><div class="ct">Release Activity Timeline</div><canvas id="relTimeChart" width="260" height="160"></canvas></div>
      <div class="card"><div class="ct">Artist Status Distribution</div><canvas id="artStatusChart" width="260" height="160"></canvas></div>
      <div class="card"><div class="ct">Top Artists by Royalties</div><div id="topArtists"></div></div>
    </div>
  </div>

  <!-- Release Performance -->
  <div id="anal-releases" style="display:none">
    <div class="flex gap2 mb4" style="flex-wrap:wrap">
      <select class="inp" style="width:200px" id="analRelSel" onchange="LOS.renderRelAnalytics()">
        <option value="">All Releases</option>
      </select>
      <select class="inp" style="width:130px" id="analPeriod" onchange="LOS.renderRelAnalytics()">
        <option>Last 3 months</option><option>Last 6 months</option><option>Full Year 2026</option><option>All Time</option>
      </select>
    </div>
    <div class="g4 mb5" id="relPerfStats"></div>
    <div class="g2">
      <div class="card"><div class="ct">Royalties by Platform</div><canvas id="platChart" width="350" height="200"></canvas></div>
      <div class="card"><div class="ct">Territory Breakdown</div><canvas id="terrAnalChart" width="350" height="200"></canvas></div>
    </div>
  </div>

  <!-- A&R Analytics -->
  <div id="anal-anr" style="display:none">
    <div class="g4 mb5" id="anrAnalStats"></div>
    <div class="g2 mb5">
      <div class="card"><div class="ct">Submission Volume (Weekly)</div><canvas id="subVolChart" width="350" height="200"></canvas></div>
      <div class="card"><div class="ct">Stage Conversion Funnel</div><canvas id="convChart" width="350" height="200"></canvas></div>
    </div>
    <div class="card">
      <div class="ct">Top Scoring Demos</div>
      <div id="topDemosTable"></div>
    </div>
  </div>

  <!-- Channels -->
  <div id="anal-channels" style="display:none">
    <div class="flex gap2 mb4">
      <h3 style="font-size:14px;font-weight:700">Promo Channel Performance</h3>
      <button class="btn btn-g" style="margin-left:auto" onclick="LOS.openModal('add-channel-stat')">
        <i data-lucide="plus" style="width:13px"></i> Log Result
      </button>
    </div>
    <div class="g2">
      <div class="card">
        <div class="ct">Channels by Impact Score</div>
        <div id="chanList"></div>
      </div>
      <div class="card">
        <div class="ct">ROI by Channel Type</div>
        <canvas id="chanRoiChart" width="360" height="240"></canvas>
      </div>
    </div>
  </div>

  <!-- Team -->
  <div id="anal-team" style="display:none">
    <div class="g4 mb5" id="teamStats"></div>
    <div class="g2">
      <div class="card"><div class="ct">Tasks by Assignee</div><div id="taskAssignee"></div></div>
      <div class="card"><div class="ct">Activity Log (Recent)</div><div id="activityFeed" style="max-height:320px;overflow-y:auto"></div></div>
    </div>
  </div>
</section>

<!-- COLLABORATION, NOTES & WORKFLOWS -->
<section id="view-collab" class="view">
  <div class="tabs" id="collabTabs">
    <div class="tab on" onclick="LOS.collabTab('tasks',this)">Global Tasks</div>
    <div class="tab" onclick="LOS.collabTab('notes',this)">Notes</div>
    <div class="tab" onclick="LOS.collabTab('calendar',this)">Calendar</div>
    <div class="tab" onclick="LOS.collabTab('automations',this)">Automations</div>
  </div>

  <!-- Global Tasks -->
  <div id="collab-tasks">
    <div class="flex gap2 mb4" style="flex-wrap:wrap">
      <input class="inp flex-1" style="min-width:160px" id="taskQ" placeholder="Search tasks…" oninput="LOS.renderGlobalTasks()">
      <select class="inp" style="width:130px" id="taskPriF" onchange="LOS.renderGlobalTasks()">
        <option value="">All Priority</option><option>high</option><option>mid</option><option>low</option>
      </select>
      <button class="btn btn-p" onclick="LOS.openModal('add-gtask')">
        <i data-lucide="plus" style="width:13px"></i> New Task
      </button>
    </div>
    <div class="task-board" id="taskBoard"></div>
  </div>

  <!-- Notes -->
  <div id="collab-notes" style="display:none">
    <div class="flex gap2 mb4">
      <input class="inp flex-1" id="noteQ" placeholder="Search notes…" oninput="LOS.renderNotes()">
      <select class="inp" style="width:150px" id="noteTag" onchange="LOS.renderNotes()">
        <option value="">All Tags</option>
        <option>A&R</option><option>Finance</option><option>Marketing</option><option>Legal</option><option>General</option>
      </select>
      <button class="btn btn-p" onclick="LOS.openModal('add-note')">
        <i data-lucide="plus" style="width:13px"></i> New Note
      </button>
    </div>
    <div id="notesGrid" class="g3"></div>
  </div>

  <!-- Calendar -->
  <div id="collab-calendar" style="display:none">
    <div class="flex gap2 mb4">
      <button class="btn btn-g" onclick="LOS.calPrev()"><i data-lucide="chevron-left" style="width:14px"></i></button>
      <span id="calTitle" style="font-size:14px;font-weight:700;flex:1;text-align:center;line-height:34px"></span>
      <button class="btn btn-g" onclick="LOS.calNext()"><i data-lucide="chevron-right" style="width:14px"></i></button>
      <button class="btn btn-g" onclick="LOS.calToday()">Today</button>
      <button class="btn btn-p" onclick="LOS.exportICS()">
        <i data-lucide="download" style="width:13px"></i> Export ICS
      </button>
    </div>
    <div class="card">
      <div class="cal-grid" id="calDayHeaders"></div>
      <div class="cal-grid mt2" id="calGrid"></div>
    </div>
    <div class="flex gap3 mt4" style="flex-wrap:wrap;font-size:12px">
      <span><span class="cal-event release" style="display:inline-block">●</span> Releases</span>
      <span><span class="cal-event gig" style="display:inline-block">●</span> Gigs</span>
      <span><span class="cal-event task" style="display:inline-block">●</span> Tasks</span>
      <span><span class="cal-event promo" style="display:inline-block">●</span> Promo</span>
    </div>
  </div>

  <!-- Automations -->
  <div id="collab-automations" style="display:none">
    <div class="flex gap2 mb4">
      <h3 style="font-size:14px;font-weight:700">Automation Rules</h3>
      <button class="btn btn-p" style="margin-left:auto" onclick="LOS.openModal('add-automation')">
        <i data-lucide="plus" style="width:13px"></i> New Rule
      </button>
    </div>
    <div id="autoRules"></div>
    <div class="card mt5">
      <div class="ct">Automation Log</div>
      <div id="autoLog" style="max-height:280px;overflow-y:auto"></div>
    </div>
  </div>
</section>
```


***

## Neue Modals (vor `<!-- DB ADMIN OVERLAY -->`)

```html
<!-- Add Smart Link -->
<div class="mbb" id="modal-add-smartlink">
  <div class="modal modal-lg">
    <div class="mt">New Smart Link</div>
    <div class="g2">
      <div class="ff"><label class="lbl">Title *</label><input class="inp" id="slT" placeholder="Void EP — Smart Link"></div>
      <div class="ff"><label class="lbl">Slug (URL)</label><input class="inp" id="slSlug" placeholder="void-ep"></div>
      <div class="ff"><label class="lbl">Artist</label><div class="art-sel" id="asel-sl"></div></div>
      <div class="ff"><label class="lbl">Release</label><div id="rsel-sl"></div></div>
      <div class="ff"><label class="lbl">Type</label>
        <select class="inp" id="slType">
          <option>release</option><option>artist</option><option>presave</option><option>event</option>
        </select>
      </div>
      <div class="ff"><label class="lbl">Accent Color</label><input class="inp" type="color" id="slAccent" value="#c9a84c" style="height:38px;padding:2px 6px;cursor:pointer;"></div>
    </div>
    <div class="ct mt3">Platform Destinations</div>
    <div id="slDestList">
      <div class="map-row"><input class="inp" placeholder="Platform (e.g. Spotify)"><input class="inp" placeholder="URL"><button class="btn-ic" onclick="this.closest('.map-row').remove()"><i data-lucide="x" style="width:13px"></i></button></div>
    </div>
    <button class="btn btn-g mt2" onclick="LOS.addSlDest()"><i data-lucide="plus" style="width:13px"></i> Add Platform</button>
    <div class="g2 mt3">
      <label style="display:flex;align-items:center;gap:7px;font-size:13px;cursor:pointer">
        <input type="checkbox" id="slPresave" style="accent-color:var(--gold)"> Enable Pre-Save
      </label>
      <label style="display:flex;align-items:center;gap:7px;font-size:13px;cursor:pointer">
        <input type="checkbox" id="slEmail" checked style="accent-color:var(--gold)"> Email Capture
      </label>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">
      <button class="btn btn-g" onclick="LOS.closeModal('add-smartlink')">Cancel</button>
      <button class="btn btn-p" onclick="LOS.saveSmartLink()">Create Smart Link</button>
    </div>
  </div>
</div>

<!-- Add Promo Link -->
<div class="mbb" id="modal-add-promo">
  <div class="modal">
    <div class="mt">Create Promo Link</div>
    <div class="ff"><label class="lbl">Label *</label><input class="inp" id="plLabel" placeholder="DJ Promo — Void EP"></div>
    <div class="g2">
      <div class="ff"><label class="lbl">Release</label><div id="rsel-promo"></div></div>
      <div class="ff"><label class="lbl">Recipients (comma-sep.)</label><input class="inp" id="plRcpts" placeholder="DJ Name, Blog Name…"></div>
      <div class="ff"><label class="lbl">Expires</label><input class="inp" id="plExp" type="date"></div>
      <div class="ff"><label class="lbl">Max Downloads</label><input class="inp" id="plMaxDl" type="number" value="10"></div>
    </div>
    <div class="g2">
      <label style="display:flex;align-items:center;gap:7px;font-size:13px;cursor:pointer">
        <input type="checkbox" id="plProtect" checked style="accent-color:var(--gold)"> Password Protected
      </label>
      <div class="ff"><label class="lbl">Password</label><input class="inp" id="plPwd" placeholder="promo2026" type="password"></div>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
      <button class="btn btn-g" onclick="LOS.closeModal('add-promo')">Cancel</button>
      <button class="btn btn-p" onclick="LOS.savePromoLink()">Create Link</button>
    </div>
  </div>
</div>

<!-- Add Global Task -->
<div class="mbb" id="modal-add-gtask">
  <div class="modal">
    <div class="mt">New Task</div>
    <div class="ff"><label class="lbl">Task *</label><input class="inp" id="gtT" placeholder="What needs to be done?"></div>
    <div class="g2">
      <div class="ff"><label class="lbl">Priority</label>
        <select class="inp" id="gtPri"><option value="mid">Medium</option><option value="high">High</option><option value="low">Low</option></select>
      </div>
      <div class="ff"><label class="lbl">Due Date</label><input class="inp" id="gtDue" type="date"></div>
      <div class="ff"><label class="lbl">Module / Context</label>
        <select class="inp" id="gtCtx">
          <option>General</option><option>A&R</option><option>Release</option><option>Finance</option><option>Marketing</option><option>Booking</option><option>Legal</option>
        </select>
      </div>
      <div class="ff"><label class="lbl">Link to Artist</label><div class="art-sel" id="asel-gtask"></div></div>
    </div>
    <div class="ff"><label class="lbl">Notes</label>
      <textarea class="inp" id="gtNotes" rows="2" placeholder="Additional context…"></textarea>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
      <button class="btn btn-g" onclick="LOS.closeModal('add-gtask')">Cancel</button>
      <button class="btn btn-p" onclick="LOS.saveGTask()">Add Task</button>
    </div>
  </div>
</div>

<!-- Add Note -->
<div class="mbb" id="modal-add-note">
  <div class="modal">
    <div class="mt">New Note</div>
    <div class="ff"><label class="lbl">Title *</label><input class="inp" id="ntT"></div>
    <div class="ff"><label class="lbl">Content</label>
      <textarea class="inp" id="ntContent" rows="5" placeholder="Use @name to mention a team member…"></textarea>
    </div>
    <div class="g2">
      <div class="ff"><label class="lbl">Tag</label>
        <select class="inp" id="ntTag">
          <option>General</option><option>A&R</option><option>Finance</option><option>Marketing</option><option>Legal</option>
        </select>
      </div>
      <div class="ff"><label class="lbl">Linked Artist</label><div class="art-sel" id="asel-note"></div></div>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
      <button class="btn btn-g" onclick="LOS.closeModal('add-note')">Cancel</button>
      <button class="btn btn-p" onclick="LOS.saveNote()">Save Note</button>
    </div>
  </div>
</div>

<!-- Add Automation Rule -->
<div class="mbb" id="modal-add-automation">
  <div class="modal">
    <div class="mt">New Automation Rule</div>
    <div class="ff"><label class="lbl">Label *</label><input class="inp" id="auLabel" placeholder="Demo Offer → Create Contract Draft"></div>
    <div class="g2">
      <div class="ff"><label class="lbl">Trigger</label>
        <select class="inp" id="auTrigger">
          <option value="demo_status_offer">Demo moves to Offer</option>
          <option value="demo_status_signed">Demo moves to Signed</option>
          <option value="release_created">New Release created</option>
          <option value="release_status_mastered">Release → Mastered</option>
          <option value="gig_confirmed">Gig confirmed</option>
          <option value="contract_expiring">Contract expiring (30d)</option>
          <option value="payout_due">Payout balance threshold</option>
        </select>
      </div>
      <div class="ff"><label class="lbl">Action</label>
        <select class="inp" id="auAction">
          <option value="create_contract_draft">Create Contract Draft</option>
          <option value="create_release_tasks">Generate Release Checklist</option>
          <option value="create_gig_tasks">Create Gig Itinerary Tasks</option>
          <option value="log_notification">Log Internal Notification</option>
          <option value="create_task">Create Custom Task</option>
        </select>
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
      <button class="btn btn-g" onclick="LOS.closeModal('add-automation')">Cancel</button>
      <button class="btn btn-p" onclick="LOS.saveAutomation()">Save Rule</button>
    </div>
  </div>
</div>

<!-- Add Channel Stat -->
<div class="mbb" id="modal-add-channel-stat">
  <div class="modal">
    <div class="mt">Log Channel Result</div>
    <div class="g2">
      <div class="ff"><label class="lbl">Channel *</label><input class="inp" id="csChannel" placeholder="RA, Mixmag, Spotify Playlist…"></div>
      <div class="ff"><label class="lbl">Type</label>
        <select class="inp" id="csType">
          <option>Playlist</option><option>Blog</option><option>Radio</option><option>Social</option><option>PR</option><option>DJ Promo</option>
        </select>
      </div>
      <div class="ff"><label class="lbl">Release</label><div id="rsel-chanstat"></div></div>
      <div class="ff"><label class="lbl">Impact Score (1-10)</label><input class="inp" id="csImpact" type="number" min="1" max="10" value="5"></div>
      <div class="ff"><label class="lbl">Streams/Clicks Result</label><input class="inp" id="csResult" type="number" value="0" placeholder="0"></div>
      <div class="ff"><label class="lbl">Notes</label><input class="inp" id="csNotes"></div>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
      <button class="btn btn-g" onclick="LOS.closeModal('add-channel-stat')">Cancel</button>
      <button class="btn btn-p" onclick="LOS.saveChannelStat()">Log Result</button>
    </div>
  </div>
</div>
```


***

## Nav-Einträge ergänzen

```html
<!-- Im <nav class="sb"> Block, nach den Runde-1-Einträgen: -->
<div class="nav" data-view="marketing"><i data-lucide="megaphone" style="width:14px"></i> Marketing</div>
<div class="nav" data-view="analytics"><i data-lucide="bar-chart-2" style="width:14px"></i> Analytics</div>
<div class="nav" data-view="collab"><i data-lucide="layers" style="width:14px"></i> Collab & Tasks</div>
```


***

## JavaScript — Runde 2 (vor der schließenden `}` des `LOS`-Objekts einfügen)

```js
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
      if(ins[^0]?.value && ins[^1]?.value) dests.push({platform:ins[^0].value, url:ins[^1].value, active:true});
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
        ${art.links?art.links.split(',').map(l=>`<a class="epk-link" href="${esc(l.trim())}" target="_blank">${esc(l.trim().replace(/https?:\/\//,'').split('/')[^0])}</a>`).join(''):''}
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
    const sorted=Object.entries(artRoy).sort((a,b)=>b[^1]-a[^1]).slice(0,5);
    document.getElementById('topArtists').innerHTML=sorted.length?sorted.map(([id,v],i)=>{
      const art=this.db.artists.find(a=>a.id===id);
      const max=sorted[^0][^1]||1;
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
    const maxImpact=sorted[^0]?.impact||10;
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
        <div class="avatar" style="width:24px;height:24px;font-size:9px;flex-shrink:0">${(art?.name||'?')[^0].toUpperCase()}</div>
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
              <div class="avatar">${c.author?.[^0]?.toUpperCase()||'?'}</div>
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
```


***

## `setupNav()` Namen-Map ergänzen

```js
// in setupNav() → names Objekt:
marketing:  'Marketing',
analytics:  'Analytics',
collab:     'Collab & Tasks',
```


***

## `buildModalSelects()` ergänzen

```js
// In buildModalSelects() → defs Array:
{id:'asel-epk',    opts:{allowEmpty:false}},
{id:'asel-sl',     opts:{allowEmpty:true, emptyLabel:'— No Artist —'}},
{id:'asel-gtask',  opts:{allowEmpty:true, emptyLabel:'— No Artist


<div align="center">⁂</div>

[^1]: description.md
[^2]: version1.md```

